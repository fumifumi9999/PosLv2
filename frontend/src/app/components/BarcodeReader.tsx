'use client'
import React, { useState, useEffect, useRef } from "react";
import { useZxing } from "react-zxing";

// react-zxing docs
// https://www.npmjs.com/package/react-zxing
// https://qiita.com/kurab/items/405da90f56cef8bf0c64

export default function BarcodeReader ({ onScan }) {
  const [barcodeError, setBarcodeError] = useState<string | null>(null);
  const [lastScans, setLastScans] = useState<string[]>([]); // スキャン結果を文字列の配列として保持
  const [count, setCount] = useState(0);

  const { ref } = useZxing({
    // エラー情報取得
    onError(error){
      setBarcodeError(error.toString())
      console.log(barcodeError)
    },
    // スキャン結果取得
    onDecodeResult(result) { 
      const newDecodedText = result.getText(); 
      // console.log(newDecodedText) //バーコード読み取った値
      const updatedScans = [...lastScans, newDecodedText].slice(-3);
      setLastScans(updatedScans);

      // わかりやすいようにScan回数をカウント
      setCount(currentCount => currentCount + 1)
      console.log(count)

      // 3回同じバーコードがスキャンされた場合のみonScan関数を呼び出す
      if (
        updatedScans.length === 3 &&
        updatedScans.every(code => code === newDecodedText)
      ){
        onScan(newDecodedText)
        setCount(0)
      }
      // 4901696541616
      // 4902220772414
      
    }})


  return (
    <div className="flex flex-col items-center justify-start pt-10">
      {barcodeError && <p  className="text-red-500">{barcodeError}</p>}
      {/* スキャンする画面を表示する */}
      <div className="flex flex-col items-center">
        <p className="text-lg text-gray-600 font-semibold mt-2">
          カメラをバーコードに向けてください(3回読み込みます)
        </p>
        <video ref={ref} className="border-4 border-gray-400 mt-4" />
        <p>
          <span>読み取り成功回数:{count}</span>
        </p>
      </div>
    </div>
  );
};