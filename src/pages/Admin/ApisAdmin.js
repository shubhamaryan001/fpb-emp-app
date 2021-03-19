import { API } from "../../Config";
import Cookies from "js-cookie";

export const listAllOrders = (userId, token) => {
  return fetch(`${API}/all-orders/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getAllCustomers = (userId, token) => {
  return fetch(`${API}/all-customers/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const logoutHandler = () => {
  console.log("log out");
  Cookies.remove("userInfo");
  window.location.reload();
};
