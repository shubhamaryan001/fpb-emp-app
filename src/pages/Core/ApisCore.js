import { API } from "../../Config";
import Cookies from "js-cookie";

export const empLogin = (userData) => {
  return fetch(`${API}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    Cookies.set("userInfo", JSON.stringify(data), { expires: 10 });
    next();
  }
};
