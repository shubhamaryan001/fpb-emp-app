/* eslint-disable jsx-a11y/anchor-has-content */
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonLoading,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonText,
} from "@ionic/react";
import React from "react";
import Header from "../../../components/Header";
import { useState, useEffect, useGlobal } from "reactn";
import { getAllCustomers, listAllOrders, logoutHandler } from "../ApisAdmin";
import { dangerToast, successToast } from "../../../components/Toast";
import _ from "lodash";
import {
  arrowDownCircleOutline,
  arrowDownOutline,
  arrowUpOutline,
  star,
} from "ionicons/icons";

import moment from "moment";

function Index() {
  const [userInfo, setUserInfo] = useGlobal("userInfo");
  const [userList, setUserList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);

  const [loading, setLoading] = useState(false);
  const initUsersList = () => {
    const userId = userInfo.user._id;
    const token = userInfo.token;
    setLoading(true);

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
          setUserList(data.customers);
          successToast("Users loaded.");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        dangerToast("Please try Again.");
        setLoading(false);
      });
  };

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
          let allOrderCustomer = [];
          data.orders.map((o, i) => {
            let customer = o.orderedBy._id;
            allOrderCustomer.push(customer);
            return customer;
          });
          setOrderList(allOrderCustomer);
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
    initUsersList();
    initAllOrders();
  }, []);

  function doRefresh(event) {
    console.log("Begin async operation");
    initUsersList();
    event.detail.complete();
  }

  const checkAllinOne = (userId) => {
    const result = _.indexOf(orderList, userId);
    if (result > -1) {
      return true;
    } else {
      return false;
    }
  };

  const openModalWithData = (u) => (event) => {
    console.log(u.userPageTrack);
    setModalData(u.userPageTrack);
    setShowModal(true);
  };

  const modalContent = (u) => {
    return (
      <IonModal
        isOpen={showModal}
        cssClass="tracking-page-modal"
        onDidDismiss={() => setShowModal(false)}
      >
        <div className="track-pages-box">
          {modalData.length > 0 ? (
            <>
              {modalData &&
                modalData.map((p, i) => (
                  <>
                    <div className="ion-text-center" key={i}>
                      {i === 0 ? (
                        ""
                      ) : (
                        <IonIcon icon={arrowUpOutline} color="success" />
                      )}
                      <IonCard>
                        <p style={{ margin: "0" }}>{p}</p>
                      </IonCard>
                    </div>
                  </>
                ))}
            </>
          ) : (
            <>
              <div className="ion-text-center">
                <IonCard>
                  <p>No activity Happen yet</p>
                </IonCard>
              </div>
            </>
          )}
        </div>
        <IonButton
          color="tertiary"
          size="small"
          onClick={() => setShowModal(false)}
        >
          Close Modal
        </IonButton>
      </IonModal>
    );
  };
  return (
    <IonPage>
      <Header title="CUSTOMERS" backButton={true} />

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
          <IonGrid>
            <IonRow>
              {userList.map((u, i) => (
                <IonCol size={6} key={u._id}>
                  <IonCard>
                    <IonCardContent>
                      <div
                        className="customer-img-box"
                        style={{ margin: "0 auto", textAlign: "center" }}
                      >
                        {u.userPhoto && u.userPhoto.url ? (
                          <img
                            width="70"
                            height="70"
                            style={{
                              margin: "0 auto",
                              borderRadius: "80px",
                              objectFit: "cover",
                            }}
                            className="p-image"
                            src={u.userPhoto.url}
                            alt=""
                          />
                        ) : (
                          <img
                            className="p-image"
                            src={`https://ui-avatars.com/api/?name=${u.fullName}&background=50b6cf&color=fff&bold=true&rounded=true&size=70`}
                            alt=""
                          />
                        )}
                      </div>
                      {checkAllinOne(u._id) ? (
                        <>
                          <div className="ion-text-center">
                            <IonIcon
                              icon={star}
                              style={{ fontSize: "25px" }}
                              color="warning"
                            />
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      <div
                        style={{ justifyContent: "center" }}
                        className="default-flex-box-sm"
                      >
                        <p style={{ color: "#a5a5a5" }}>{u.email}</p>{" "}
                      </div>
                      <div className="default-flex-box-sm">
                        <p>Name:</p>
                        <p>{u.fullName}</p>{" "}
                      </div>
                      <div className="default-flex-box-sm">
                        <p>Mobile No:</p>
                        <p>
                          <a href={`tel:+91${u.mobileNumber}`}>
                            {u.mobileNumber}
                          </a>
                        </p>{" "}
                      </div>
                      <div className="default-flex-box-sm">
                        <p>Secondary No:</p>
                        <p>{u.secondaryNumber}</p>{" "}
                      </div>
                      <div className="default-flex-box-sm">
                        <p>Register At:</p>
                        <p>
                          {moment(u.createdAt).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </p>{" "}
                      </div>

                      <div className="default-flex-box-sm">
                        <IonButton
                          color="primary"
                          size="small"
                          onClick={openModalWithData(u)}
                        >
                          Track Activity
                        </IonButton>

                        {modalContent()}
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Index;
