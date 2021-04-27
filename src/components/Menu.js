import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";
import Cookies from "js-cookie";

import { Link, useLocation, withRouter } from "react-router-dom";
import {
  archiveOutline,
  warningSharp,
  warningOutline,
  cubeOutline,
  pricetagOutline,
  peopleCircleOutline,
} from "ionicons/icons";
import "./Menu.css";
import { useGlobal } from "reactn";

const adminPages = [
  {
    title: "Orders",
    url: "/admin/orders",
    iosIcon: cubeOutline,
    mdIcon: cubeOutline,
  },
  {
    title: "Customers",
    url: "/admin/customers",
    iosIcon: peopleCircleOutline,
    mdIcon: peopleCircleOutline,
  },
  {
    title: "Coupons",
    url: "/admin/coupons",
    iosIcon: pricetagOutline,
    mdIcon: pricetagOutline,
  },
];

const empPages = [
  {
    title: "Works",
    url: "/emp/works",
    iosIcon: cubeOutline,
    mdIcon: cubeOutline,
  },
  {
    title: "Calls",
    url: "/emp/calls",
    iosIcon: pricetagOutline,
    mdIcon: pricetagOutline,
  },
];

const Menu = () => {
  const location = useLocation();
  const [userData, setUserData] = useGlobal("userInfo");
  const [quote, setQuotes] = useGlobal("quote");
  const user = userData && userData.user;
  const admin =
    userData && userData.user.role.roleName === "Admin" ? true : false;
  const logoutHandler = () => {
    console.log("log out");
    Cookies.remove("userInfo");
    setUserData(null);
    window.location.reload();
  };
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonMenuToggle>
          <IonItem lines="none" routerLink="/">
            <IonImg
              style={{ width: "200px", margin: "0 auto" }}
              src="https://res.cloudinary.com/djnv06fje/image/upload/v1612876948/rsz_fpb_-_logo_-_hd_mogljv.png"
            />
          </IonItem>
        </IonMenuToggle>

        {userData && (
          <>
            <IonList lines="none" id="inbox-list">
              {userData.user.profilePic.url && (
                <div
                  style={{
                    border: "2px solid #50b6cf",
                    borderRadius: "5px",
                    padding: "5px",
                    marginBottom: "5px",
                  }}
                  className="ion-text-center"
                >
                  <p
                    style={{
                      margin: "2px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#4b4b4b",
                    }}
                  >
                    Hello !!{" "}
                    <span
                      style={{
                        color: "#50b6cf",
                      }}
                    >
                      {user.fullName}
                    </span>
                  </p>
                  <img
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "150px",
                      objectFit: "cover",
                    }}
                    src={userData.user.profilePic.url}
                    alt=""
                  />
                </div>
              )}

              {userData && admin && (
                <>
                  {adminPages.map((appPage, index) => {
                    return (
                      <IonMenuToggle key={index} autoHide={false}>
                        <IonItem
                          className={
                            location.pathname === appPage.url ? "selected" : ""
                          }
                          routerLink={appPage.url}
                          routerDirection="none"
                          lines="none"
                          detail={false}
                        >
                          <IonIcon
                            slot="start"
                            ios={appPage.iosIcon}
                            md={appPage.mdIcon}
                          />
                          <IonLabel>{appPage.title}</IonLabel>
                        </IonItem>
                      </IonMenuToggle>
                    );
                  })}
                </>
              )}
            </IonList>
          </>
        )}

        <div className="">
          <IonMenuToggle autoHide={false}>
            <IonButton size="small" color="light" onClick={logoutHandler}>
              LOGOUT
            </IonButton>
          </IonMenuToggle>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default withRouter(Menu);
