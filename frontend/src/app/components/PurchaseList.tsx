import React from "react";

const PurchaseList = ({ items }) => {
  return (
    <div className="w-full max-w-md p-4 border-2 border-blue-500 rounded my-4" style={{ minHeight: '15rem' }}>
      <ul className="list-none m-0 p-0">
        {items.map((item, index) => (
            <li key={index} className="flex justify-between my-2">
              <span>{item?.PRD_NAME} ×1</span>
              <span>{item?.PRD_PRICE}</span>
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default PurchaseList;
