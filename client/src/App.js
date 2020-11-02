import React, { Component, Fragment } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Cart from "./components/Cart";
import ProtectedRoute from "./components/protectedroute";
import LoginComp from "./components/logincomp";
import RegisterComp from "./components/register";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/login" component={LoginComp} />
            <Route exact path="/register" component={RegisterComp} />

            <div>
              <ProtectedRoute path="/" component={Navbar} />
              <ProtectedRoute path="/cart" component={Cart} exact={true} />
              <ProtectedRoute path="/" component={Home} exact={true} />
            </div>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
