// import React from "react";
// // import "./ProductDisplay.css";

// const ProductDisplay = ({ product }) => {
//   return (
//     <div className="ProductDisplayArea">
//       <div>コード: {product.PRD_CD || "該当なし"}</div>
//       <div>名称: {product.PRD_NAME || "該当なし"}</div>
//       <div>単価: {product.PRD_PRICE || "該当なし"}</div>
//     </div>
//   );
// };

// export default ProductDisplay;
import React from "react";

const ProductDisplay = ({ product }) => {
  return (
    <div className="w-full max-w-md p-4 border-2 border-blue-500 rounded my-4">
      <div className="flex justify-between">
        <span className="font-bold">コード:</span>
        <span>{product?.PRD_CD || "該当なし"}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">名称:</span>
        <span>{product?.PRD_NAME || "該当なし"}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">単価:</span>
        <span>{product?.PRD_PRICE || "該当なし"}</span>
      </div>
    </div>
  );
};

export default ProductDisplay;
