import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import Header from "../../components/Header";
import { AiFillDropboxCircle } from "react-icons/ai";
import { useEffect, useState, useGlobal } from "reactn";
import {
  listAllOrders,
  logoutHandler,
  getAllCustomers,
  listCoupons,
} from "./ApisAdmin";
import { dangerToast, successToast } from "../../components/Toast";
import { cardSharp, peopleCircleOutline, peopleOutline } from "ionicons/icons";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Index() {
  const [userInfo, setUserInfo] = useGlobal("userInfo");
  const [totalOrders, setTotalOrders] = useState("");
  const [totalCustomers, setTotalCustomers] = useState("");
  const [totalCoupons, setTotalCoupons] = useState("");

  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const initFunctions = () => {
    const userId = userInfo.user._id;
    const token = userInfo.token;
    setLoading(true);
    listAllOrders(userId, token)
      .then((data) => {
        if (data.error) {
          console.log(data.error);

          if (data.error === "Please login again.") {
            logoutHandler();
          }

          dangerToast(data.error);
          setLoading(false);
        } else {
          console.log(data);
          setTotalOrders(data.orders.length);
          successToast("page loaded.");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        dangerToast("Please try Again.");
        setLoading(false);
      });

    getAllCustomers(userId, token)
      .then((data) => {
        if (data.error) {
          console.log(data.error);

          if (data.error === "Please login again.") {
            logoutHandler();
          }

          dangerToast(data.error);
          setLoading(false);
        } else {
          console.log(data);
          setTotalCustomers(data.customers.length);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        dangerToast("Please try Again.");
        setLoading(false);
      });

    listCoupons(userId, token).then((data) => {
      if (data.error) {
        dangerToast(data.error);
        console.log(data.error);
        setLoading(false);
      } else {
        successToast("Coupons Loaded Success");
        console.log(data);
        setTotalCoupons(data.coupons.length);
        setLoading(false);
      }
    });
  };

  function doRefresh(event) {
    console.log("Begin async operation");
    initFunctions();
    setTimeout(() => {
      console.log("Async operation has ended");
      event.detail.complete();
    }, 2000);
  }
  useEffect(() => {
    initFunctions();
  }, []);
  return (
    <IonPage>
      <Header title={`Dashboard`} />
      <IonContent>
        <IonLoading
          cssClass="my-custom-class"
          isOpen={loading}
          onDidDismiss={() => setLoading(false)}
          message={"Please wait..."}
        />
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <div className="default-page">
          <div className="total-orders-box">
            <Link to="/admin/orders">
              <IonCard className="ion-text-center">
                <IonCardHeader>
                  <IonCardTitle>TOTAL CONFIRMED ORDERS</IonCardTitle>
                </IonCardHeader>
                <div>
                  <AiFillDropboxCircle className="t-order-icon" />

                  <p className="">{totalOrders}</p>
                </div>
              </IonCard>
            </Link>
          </div>

          <div className="section-2">
            <IonGrid>
              <IonRow>
                <IonCol size={6}>
                  <Link to="/admin/customers">
                    <IonCard className="ion-text-center">
                      <IonCardHeader>
                        <IonCardTitle>CUSTOMERS</IonCardTitle>
                      </IonCardHeader>

                      <div>
                        <IonIcon
                          icon={peopleCircleOutline}
                          className="t-order-icon-success"
                        />
                        <p className="">{totalCustomers}</p>
                      </div>
                    </IonCard>
                  </Link>
                </IonCol>

                <IonCol size={6}>
                  <Link to="/admin/coupons">
                    <IonCard className="ion-text-center">
                      <IonCardHeader>
                        <IonCardTitle>COUPONS</IonCardTitle>
                      </IonCardHeader>

                      <div>
                        <IonIcon
                          icon={cardSharp}
                          className="t-order-icon-success"
                        />
                        <p className="">{totalCoupons}</p>
                      </div>
                    </IonCard>
                  </Link>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Index;
