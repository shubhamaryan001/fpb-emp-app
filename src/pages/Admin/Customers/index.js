import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonText,
} from "@ionic/react";
import React from "react";
import Header from "../../../components/Header";
import { useState, useEffect, useGlobal } from "reactn";
import { getAllCustomers, logoutHandler } from "../ApisAdmin";
import { dangerToast, successToast } from "../../../components/Toast";

function Index() {
  const [userInfo, setUserInfo] = useGlobal("userInfo");
  const [userList, setUserList] = useState([]);
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

  useEffect(() => {
    initUsersList();
  }, []);

  function doRefresh(event) {
    console.log("Begin async operation");
    initUsersList();
    event.detail.complete();
  }
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
                        <p>{u.mobileNumber}</p>{" "}
                      </div>

                      <div className="default-flex-box-sm">
                        <p>Secondary No:</p>
                        <p>{u.secondaryNumber}</p>{" "}
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
