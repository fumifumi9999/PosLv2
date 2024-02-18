'use client'
import React from 'react';
import { useState,useEffect } from 'react';
import BarcodeReader from './components/BarcodeReader';
import ProductDisplay from './components/ProductDisplay';
import PurchaseList from './components/PurchaseList';
import TitleBar from './components/TitleBar';
import Quagga from "quagga";

// import styles from '../styles/Home.module.css'; // Next.js推奨のCSSモジュールを使用する

type Product = {
  PRD_ID: number;
  PRD_CD: string;
  PRD_NAME: string;
  PRD_PRICE: number;
};


export default function Home() {
  const [product, setProduct] = useState<Product | null>(null);
  const [items, setItems] = useState<Product[]>([]);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [animateTriangle, setAnimateTriangle] = useState<boolean>(false);
  const [searchCode, setSearchCode] = useState<string>("");

  
  const handleScan = async (code) => {
    console.log("handleScan Start")
    // console.log(code)

    setShowScanner(false); // スキャンが完了したらバーコードリーダーを非表示にする
    const res = await fetch(
      "http://127.0.0.1:8000/search_product/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code }),
    });

    const data = await res.json();
    console.log(data)
    // ここは暫定      
    if (data.status === "success") {
        setProduct(data.message);
        console.log(data.message)
      } else {
        setProduct(null);
      }
  };

  const handleSearch = () => {
    //入ってなかった場合
    if (!searchCode) {
      alert("コードが入力されていません");
      return;
    }

    handleScan(searchCode);
  };

  const handleAdd = () => {
    //入ってなかった場合
    if (!product || !product.PRD_NAME) {
      alert("スキャン商品が不正です");
      return;
    }

    setAnimateTriangle(true); // アニメーションを開始

    setTimeout(() => {
      setAnimateTriangle(false); // アニメーションをリセット
    }, 200); // CSSアニメーションの持続時間
    // itemsに入れる

    setItems([...items, product]);
    setProduct(null);
  };

  const handlePurchase = async () => {
    if (items.length === 0) {
      alert("商品が追加されていません");
      return; // ここで関数を終了し、APIコールをスキップ
    }

    const purchaseData = {
      EMP_CD: "9999999999",
      STORE_CD: "00030",
      POS_NO: "090",
      items: items,
    };

    try {
      const response = await fetch(
          "http://127.0.0.1:8000/purchase/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(purchaseData),
        }
      );

      const responseData = await response.json();

      // APIから帰ってきたメッセージをポップアップで表示
      if (responseData.message) {
        alert(JSON.stringify(responseData.message, null, 2));
      }

      setItems([]); // itemsを空にします
    } catch (error) {
      console.error("Error making a purchase:", error);
    }
  };
  

  return (
    <div>
      <TitleBar />
      <div className="flex flex-col items-center justify-start min-h-screen bg-white">
        {/* showScannerがtrueならReaderを表示する */}
        {showScanner ? (
            <BarcodeReader onScan={handleScan} />
        ) : (
        <div className="w-full max-w-md p-4">
              {/* スキャンボタン */}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full mb-4"
                onClick={() => setShowScanner(true)}
              >
                スキャン
              </button>
              
              {/* ORテキスト */}
              <p className="text-center my-2">OR</p>

              {/* コード入力エリア */}
              <div className="flex items-center border-b border-blue-500 py-2">
                <input
                  type="text"
                  value={searchCode}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="コードを入力"
                />
              </div>

              {/* 検索ボタン */}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full mt-4"
                onClick={handleSearch}
              >
                検索
              </button>
            

              {/* プロダクトの名前表示エリア */}
              <ProductDisplay product={product} />

              {/* 検索ボタン */}
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full w-full mb-4"
               onClick={handleAdd}>
                追加
              </button>

              <div
                className={`triangle-down ${animateTriangle ? "animate" : ""}`}
              ></div>
              <div className="text-purchase">購入リスト</div>
              <PurchaseList items={items} />
              <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full w-full mb-4" onClick={handlePurchase}>
                購入
              </button>
        </div>
          
        )}
      </div>
    </div>
  );
};


