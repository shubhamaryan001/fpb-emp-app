import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import { eyedrop, eyeOffOutline, eyeOutline } from "ionicons/icons";
import React, { useState, useEffect, useGlobal } from "reactn";
import Header from "../../../components/Header";
import { dangerToast, successToast } from "../../../components/Toast";
import { hiddenOrderById, listAllOrders, logoutHandler } from "../ApisAdmin";

function Index() {
  const [userInfo, setUserInfo] = useGlobal("userInfo");
  const [orderList, setOrderList] = useState([]);
  const [orderFiltered, setOrderFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  const initAllOrders = () => {
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
          setOrderList(data.orders);
          let result = data.orders.filter(
            (o) =>
              o.hidden === false && o.orderStatus.projectCompleted === false
          );
          setOrderFiltered(result);
          successToast("Orders loaded.");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        dangerToast("Please try Again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    initAllOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOrderFilter = (event) => {
    const value = event.target.value;
    console.log(value);
    if (value === "ALL") {
      let result = orderList.filter((o) => o.hidden === false);
      setOrderFiltered(result);
    } else if (value === "Hidden") {
      let result = orderList.filter((o) => o.hidden === true);
      setOrderFiltered(result);
    } else if (value === "Cancelled") {
      let result = orderList.filter((o) => o.orderStatus.cancelled === true);
      setOrderFiltered(result);
    } else if (value === "Completed") {
      let result = orderList.filter(
        (o) => o.orderStatus.projectCompleted === true
      );
      setOrderFiltered(result);
    } else {
      let result = orderList.filter(
        (o) => o.purchasedPackage.packageName === value
      );
      setOrderFiltered(result);
    }
  };

  const hiddenOrder = (orderId) => (event) => {
    const userId = userInfo.user._id;
    const token = userInfo.token;
    setLoading(true);
    hiddenOrderById(userId, token, orderId)
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
          initAllOrders();
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        dangerToast("Please try Again.");
        setLoading(false);
      });
  };

  function doRefresh(event) {
    console.log("Begin async operation");
    initAllOrders();
    event.detail.complete();

    // setTimeout(() => {
    //   console.log("Async operation has ended");
    // }, 2000);
  }
  return (
    <IonPage>
      <Header title="All Orders" backButton={true} />
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

        {orderFiltered && (
          <div className="default-page order-list-page">
            <div style={{ marginBottom: "8px" }}>
              <IonItem lines="none">
                <IonLabel>Filter Orders</IonLabel>
                <IonSelect
                  okText="Okay"
                  cancelText="Dismiss"
                  interface="action-sheet"
                  onIonChange={handleOrderFilter}
                >
                  <IonSelectOption value="ALL">ACTIVE</IonSelectOption>
                  <IonSelectOption value="LUXURY HOUSE DESIGN PACKAGE">
                    LUXURY
                  </IonSelectOption>
                  <IonSelectOption value="MODERN HOUSE DESIGN PACKAGE">
                    MODERN
                  </IonSelectOption>
                  <IonSelectOption value="FLOOR PLAN PACKAGE">
                    FLOOR PLAN
                  </IonSelectOption>
                  <IonSelectOption value="Hidden">Hidden</IonSelectOption>
                  <IonSelectOption value="Cancelled">Cancelled</IonSelectOption>
                  <IonSelectOption value="Completed">Completed</IonSelectOption>
                </IonSelect>
              </IonItem>
            </div>
            <IonGrid>
              <IonRow>
                {orderFiltered && orderFiltered.length < 1 ? (
                  <p className="ion-text-center">NO ORDERS</p>
                ) : (
                  ""
                )}

                {orderFiltered.map((o, i) => (
                  <>
                    <IonCol size={12} key={o._id}>
                      <IonCard className="orders-cards">
                        <div className="ribbon">
                          <span>{o.projectCode}</span>
                        </div>
                        <IonCardContent>
                          <div className="default-flex-box">
                            <p>Order Id:</p>
                            <p>{o._id}</p>
                          </div>
                          <div className="default-flex-box">
                            <p>Customer Name:</p>
                            <p>{o.orderedBy.fullName}</p>
                          </div>
                          <div className="default-flex-box">
                            <p>Customer Mobile No:</p>
                            <p>{o.orderedBy.mobileNumber}</p>
                          </div>
                          <div className="default-flex-box">
                            <p>Order Status:</p>
                            <IonBadge
                              style={{ fontSize: "12px", fontWeight: "600" }}
                              color={
                                o.status === "Payment Pending" ||
                                o.status === "Cancelled" ||
                                o.status === "No Status"
                                  ? "danger"
                                  : "tertiary"
                              }
                            >
                              {o.status}
                            </IonBadge>
                          </div>
                        </IonCardContent>

                        <div
                          onClick={hiddenOrder(o._id)}
                          className="hidden-handle-box"
                        >
                          <IonIcon
                            className="hidden-icon"
                            icon={o.hidden ? eyeOffOutline : eyeOutline}
                            color={o.hidden ? "warning" : "success"}
                          />
                        </div>

                        {o.purchasedPackage.packageName.substring(0, 1) ===
                        "L" ? (
                          <div
                            style={{ background: "#42d77d" }}
                            className="package-name"
                          >
                            <span>
                              {o.purchasedPackage.packageName.substring(0, 1)}
                            </span>
                          </div>
                        ) : (
                          ""
                        )}

                        {o.purchasedPackage.packageName.substring(0, 1) ===
                        "M" ? (
                          <div
                            style={{ background: "#ffca22" }}
                            className="package-name"
                          >
                            <span>
                              {o.purchasedPackage.packageName.substring(0, 1)}
                            </span>
                          </div>
                        ) : (
                          ""
                        )}

                        {o.purchasedPackage.packageName.substring(0, 1) ===
                        "F" ? (
                          <div
                            style={{ background: "#50c8ff" }}
                            className="package-name"
                          >
                            <span>
                              {o.purchasedPackage.packageName.substring(0, 1)}
                            </span>
                          </div>
                        ) : (
                          ""
                        )}

                        <div>
                          <IonButton
                            style={{ fontWeight: "600", fontSize: "10px" }}
                            size="small"
                            color="secondary"
                            routerLink={`/admin/order/${o._id}`}
                          >
                            {" "}
                            Update
                          </IonButton>
                        </div>
                      </IonCard>
                    </IonCol>
                  </>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default Index;
