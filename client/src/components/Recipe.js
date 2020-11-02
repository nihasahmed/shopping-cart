import React from "react";
import { useSelector } from "react-redux";

function Recipe() {
  const counter = useSelector((state) => state);

  return (
    <div className="container">
      <div className="collection">
        <li className="collection-item">
          <b>Total: {counter.total} $</b>
        </li>
      </div>
      <div className="checkout">
        <button className="waves-effect waves-light btn">Checkout</button>
      </div>
    </div>
  );
}

export default Recipe;
