import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import cartReducer from "./components/reducers/cartReducer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: 1000,
  //   offset: "30px",
  // you can also just use 'scale'
  transition: transitions.FADE,
};
const Root = () => (
  <AlertProvider template={AlertTemplate} {...options}>
    <Provider store={store}>
      <App />
    </Provider>
  </AlertProvider>
);

const store = createStore(cartReducer, composeWithDevTools());

ReactDOM.render(<Root />, document.getElementById("root"));
