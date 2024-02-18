from fastapi import FastAPI, HTTPException, Body, Depends
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pymysql
import os
from dotenv import load_dotenv
from typing import List

app = FastAPI()


# すべてのオリジンを許可する場合
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのオリジンを許可
    allow_credentials=True,
    allow_methods=["*"],  # すべてのメソッドを許可
    allow_headers=["*"],  # すべてのヘッダーを許可
)

# .envファイルを読み込む
load_dotenv()

# 環境変数からデータベース情報を取得
MYSQL_SERVER = os.getenv("MYSQL_SERVER")
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DB = os.getenv("MYSQL_DB")


class ProductQuery(BaseModel):
    code: str


class Item(BaseModel):
    PRD_ID: int
    PRD_CD: str
    PRD_NAME: str
    PRD_PRICE: int


class Purchase(BaseModel):
    EMP_CD: str = "9999999999"
    STORE_CD: str
    POS_NO: str
    items: List[Item]


def get_db_connection():
    return pymysql.connect(
        host=MYSQL_SERVER, user=MYSQL_USER, password=MYSQL_PASSWORD, db=MYSQL_DB
    )


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/search_product/")
def search_product(
    product_query: ProductQuery = Body(...),
    connection: pymysql.connections.Connection = Depends(get_db_connection),
):
    code = product_query.code
    try:
        with connection.cursor() as cursor:
            sql = "SELECT PRD_ID, PRD_CD, PRD_NAME, PRD_PRICE FROM m_product WHERE PRD_CD = %s"
            cursor.execute(sql, (code,))
            result = cursor.fetchone()
            if result:
                return {
                    "status": "success",
                    "message": {
                        "PRD_ID": result[0],
                        "PRD_CD": result[1],
                        "PRD_NAME": result[2],
                        "PRD_PRICE": result[3],
                    },
                }
            else:
                raise HTTPException(status_code=404, detail="Product not found")
    finally:
        connection.close()


@app.post("/purchase/")
def purchase(
    data: Purchase,
    connection: pymysql.connections.Connection = Depends(get_db_connection),
):
    try:
        with connection.cursor() as cursor:
            # t_txn への登録
            sql_txn = """
            INSERT INTO t_txn (DATETIME, EMP_CD, STORE_CD, POS_NO, TOTAL_AMT, TTL_AMT_EX_TAX)
            VALUES (NOW(), %s, %s, %s, %s, %s);
            """
            total_amt = sum(item.PRD_PRICE for item in data.items)  # 合計金額
            ttl_amt_ex_tax = total_amt  # 税抜合計金額（仮に税込と同額として計算）
            cursor.execute(
                sql_txn,
                (data.EMP_CD, data.STORE_CD, data.POS_NO, total_amt, ttl_amt_ex_tax),
            )
            txn_id = cursor.lastrowid

            # t_txn_dtl への登録
            for index, item in enumerate(data.items, start=1):
                sql_dtl = """
                INSERT INTO t_txn_dtl (TXN_ID, TXN_DTL_ID, PRD_ID, PRD_CD, PRD_NAME, PRD_PRICE, TAX_ID)
                VALUES (%s, %s, %s, %s, %s, %s, '10');
                """
                cursor.execute(
                    sql_dtl,
                    (
                        txn_id,
                        index,
                        item.PRD_ID,
                        item.PRD_CD,
                        item.PRD_NAME,
                        item.PRD_PRICE,
                    ),
                )

            connection.commit()
            return {
                "status": "success",
                "message": {"合計金額": total_amt, "合計金額（税抜）": ttl_amt_ex_tax},
            }
    except Exception as e:
        connection.rollback()
        return {"status": "failed", "detail": f"An error occurred: {str(e)}"}
    finally:
        connection.close()
