import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Recipe from "./Recipe";

function Cart() {
  const counter = useSelector((state) => state);
  const dispatch = useDispatch();
  let addedItems = counter.addedItems.length ? (
    counter.addedItems.map((item) => {
      return (
        <li className="collection-item avatar" key={item.id}>
          <div className="item-img">
            <img
              src={"http://localhost:5000/" + item.img}
              alt={item.title}
              className=""
            />
          </div>

          <div className="item-desc">
            <span className="title">{item.title}</span>
            <p>{item.desc}</p>
            <p>
              <b>Price: {item.price}$</b>
            </p>
            <p>
              <b>Quantity: {item.quantity}</b>
            </p>
            <div className="add-remove">
              <span to="/cart">
                <i
                  className="material-icons"
                  onClick={() =>
                    dispatch({
                      type: "ADD_QUANTITY",
                      item: item,
                    })
                  }
                >
                  arrow_drop_up
                </i>
              </span>
              <span to="/cart">
                <i
                  className="material-icons"
                  onClick={() =>
                    dispatch({
                      type: "SUB_QUANTITY",
                      item: item,
                    })
                  }
                >
                  arrow_drop_down
                </i>
              </span>
            </div>
            <button
              className="waves-effect waves-light btn red remove"
              onClick={() =>
                dispatch({
                  type: "REMOVE_ITEM",
                  item: item,
                })
              }
            >
              Remove
            </button>
          </div>
        </li>
      );
    })
  ) : (
    <p>Nothing.</p>
  );
  return (
    <div className="container">
      <div className="cart">
        <h5>You have ordered:</h5>
        <ul className="collection">{addedItems}</ul>
      </div>
      <Recipe />
    </div>
  );
}

export default Cart;

// // import React, { Component } from 'react';
// // import { connect } from 'react-redux'
// // import { Link } from 'react-router-dom'
// // import { removeItem,addQuantity,subtractQuantity} from './actions/cartActions'
// // import Recipe from './Recipe'
// class Cart extends Component {
//   //to remove the item completely
//   handleRemove = (id) => {
//     this.props.removeItem(id);
//   };
//   //to add the quantity
//   handleAddQuantity = (id) => {
//     this.props.addQuantity(id);
//   };
//   //to substruct from the quantity
//   handleSubtractQuantity = (id) => {
//     this.props.subtractQuantity(id);
//   };
//   render() {
//     let addedItems = this.props.items.length ? (
//       this.props.items.map((item) => {
//         return (
//           <li className="collection-item avatar" key={item.id}>
//             <div className="item-img">
//               <img src={item.img} alt={item.img} className="" />
//             </div>

//             <div className="item-desc">
//               <span className="title">{item.title}</span>
//               <p>{item.desc}</p>
//               <p>
//                 <b>Price: {item.price}$</b>
//               </p>
//               <p>
//                 <b>Quantity: {item.quantity}</b>
//               </p>
//               <div className="add-remove">
//                 <Link to="/cart">
//                   <i
//                     className="material-icons"
//                     onClick={() => {
//                       this.handleAddQuantity(item.id);
//                     }}
//                   >
//                     arrow_drop_up
//                   </i>
//                 </Link>
//                 <Link to="/cart">
//                   <i
//                     className="material-icons"
//                     onClick={() => {
//                       this.handleSubtractQuantity(item.id);
//                     }}
//                   >
//                     arrow_drop_down
//                   </i>
//                 </Link>
//               </div>
//               <button
//                 className="waves-effect waves-light btn pink remove"
//                 onClick={() => {
//                   this.handleRemove(item.id);
//                 }}
//               >
//                 Remove
//               </button>
//             </div>
//           </li>
//         );
//       })
//     ) : (
//       <p>Nothing.</p>
//     );
//     return (
//       <div className="container">
//         <div className="cart">
//           <h5>You have ordered:</h5>
//           <ul className="collection">{addedItems}</ul>
//         </div>
//         <Recipe />
//       </div>
//     );
//   }
// }

// const mapStateToProps = (state)=>{
//     return{
//         items: state.addedItems,
//         //addedItems: state.addedItems
//     }
// }
// const mapDispatchToProps = (dispatch)=>{
//     return{
//         removeItem: (id)=>{dispatch(removeItem(id))},
//         addQuantity: (id)=>{dispatch(addQuantity(id))},
//         subtractQuantity: (id)=>{dispatch(subtractQuantity(id))}
//     }
// }
// export default connect(mapStateToProps,mapDispatchToProps)(Cart)
