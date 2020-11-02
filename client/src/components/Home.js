import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAlert } from "react-alert";

import axios from "./axios";
import "./Home.css";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  let [categoryProducts, setCategoryProducts] = useState([]);
  let [categories, setCategories] = useState([]);
  let [products, setProducts] = useState([]);
  let [selectedCategories, setSelectedCategories] = useState([]);

  function selectCategory(category) {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
    } else {
      setSelectedCategories((oldCategories) => [...oldCategories, category]);
    }
  }

  let getProducts = async () => {
    try {
      axios({
        method: "get",
        url: "products",
        withCredentials: true,
      }).then((response) => {
        if (response.data.status === 200) {
          let items = response.data.data;
          let itemTypes = items
            .map((item) => item.category)
            .filter((value, index, self) => self.indexOf(value) === index);

          setCategories(itemTypes);
          setProducts(items);
          setSelectedCategories(itemTypes);
        } else {
          console.log(response.data.message);
        }
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  useEffect(
    () => {
      setCategoryProducts(
        products.filter((item) => selectedCategories.includes(item.category))
      );
    },
    [selectedCategories]
  );

  return (
    <div className="home__main ">
      <div className="home__container">
        <div className="home__categories">
          <div className="home__categories_title">
            <h4>Categories</h4>
          </div>
          <div className="home__categories_items">
            {categories.map((category) => (
              <div key={category}>
                <button
                  className={`btn btn-block mt-4 ${
                    selectedCategories.includes(category) ? "teal" : "white"
                  }`}
                  onClick={() => selectCategory(category)}
                >
                  {category}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="box home__products">
          {categoryProducts.map((item) => (
            <div className="card" key={item.id}>
              <div className="card-image">
                <img
                  className="home__image"
                  src={"http://localhost:5000/" + item.img}
                  alt={item.title}
                />
                <span
                  to="/"
                  className="btn-floating halfway-fab waves-effect waves-light red"
                  onClick={() => {
                    alert.success("added to cart");
                    dispatch({
                      type: "ADD_TO_CART",
                      item: item,
                    });
                  }}
                >
                  <i className="material-icons">add</i>
                </span>
              </div>

              <div className="card-content">
                <span className="card-title">{item.title}</span>

                <p>{item.desc}</p>
                <p>
                  <b>Price: {item.price}$</b>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Home;
