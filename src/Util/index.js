import { setGlobal } from "reactn";
import addReactNDevTools from "reactn-devtools";
import Cookies from "js-cookie";

export const reactData = () => {
  const userInfoFromStorage = Cookies.get("userInfo")
    ? JSON.parse(Cookies.get("userInfo"))
    : null;
  setGlobal({
    userInfo: userInfoFromStorage,
    loading: false,
    error: null,
    quote: "The way is not in the sky. The way is in the heart.",
  });
  addReactNDevTools();
};
