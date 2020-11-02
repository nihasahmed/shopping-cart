import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import auth from "./auth";
import { useAlert } from "react-alert";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const alert = useAlert();
  const history = useHistory();
  const counter = useSelector((state) => state);
  const dispatch = useDispatch();

  const logout = async (e) => {
    e.preventDefault();
    auth.logout().then((returnValue) => {
      if (returnValue) {
        dispatch({
          type: "RESET",
        });
        alert.success("Successfully logged out!");
        history.push({
          pathname: "/login",
        });
      }
    });
  };

  return (
    <nav className="nav-wrapper fixed-top">
      <div className="container">
        <Link to="/" className="brand-logo">
          Shopping
        </Link>

        <ul className="right">
          <li>
            <Link to="/cart">
              My cart(
              {counter.addedItems.length})
            </Link>
          </li>
          <li className="navbar__link" onClick={(e) => logout(e)}>
            Logout
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
