import {
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { lockClosedOutline, phonePortraitOutline } from "ionicons/icons";
import { Redirect } from "react-router";
import React, { useState, useGlobal } from "reactn";
import { dangerToast, successToast } from "../../components/Toast";
import { empLogin, authenticate } from "./ApisCore";

function Index() {
  const [values, setValues] = useState({
    mobileNumber: "",
    password: "",
    loading: false,
    redirectPage: false,
  });
  const [userInfo, setUserInfo] = useGlobal("userInfo");
  const { mobileNumber, password, loading, redirectPage } = values;

  const inputChange = (name) => (event) => {
    const value = event.target.value;
    setValues({ ...values, [name]: value });
  };

  const submitForm = (event) => {
    event.preventDefault();
    setValues({ ...values, loading: true });
    console.log({ values });
    empLogin({ mobileNumber, password })
      .then((data) => {
        if (data.error) {
          dangerToast(data.error);
          setValues({ ...values, loading: false });
        } else {
          console.log(data);
          authenticate(data, () => {
            setUserInfo(data);
            successToast(`${data.user.fullName} has been logged in.`);
            setValues({ ...values, loading: false, redirectPage: true });
          });
          console.log(data);
        }
      })
      .catch((err) => {
        console.log(err);
        setValues({ ...values, loading: false });
      });
  };

  const RedirectPageFunction = () => {
    if (redirectPage) {
      if (userInfo && userInfo.user.role.adminAccess) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/emp/dashboard" />;
      }
    }
    if (userInfo) {
      if (userInfo && userInfo.user.role.adminAccess) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/emp/dashboard" />;
      }
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="login-page">
          {RedirectPageFunction()}
          <IonLoading
            cssClass="my-custom-class"
            isOpen={loading}
            onDidDismiss={() => setValues({ ...values, loading: false })}
            message={"Please wait..."}
          />
          <IonCard style={{ marginTop: "150px" }}>
            <div className="login-heading" style={{ width: "100%" }}>
              <div>
                <IonImg
                  style={{ width: "250px", margin: "0 auto" }}
                  src="https://res.cloudinary.com/djnv06fje/image/upload/v1612876948/rsz_fpb_-_logo_-_hd_mogljv.png"
                />{" "}
              </div>
            </div>
            <form className="login-form" onSubmit={submitForm}>
              <IonItem style={{ marginBottom: "5px" }}>
                <IonIcon icon={phonePortraitOutline} />
                <IonInput
                  type="tel"
                  onIonChange={inputChange("mobileNumber")}
                  value={mobileNumber}
                  placeholder="Enter registered mobile number"
                />
              </IonItem>

              <IonItem>
                <IonIcon icon={lockClosedOutline} />
                <IonInput
                  type="password"
                  onIonChange={inputChange("password")}
                  value={password}
                  placeholder="Enter password"
                />
              </IonItem>

              <IonItem lines="none">
                <IonButton
                  slot="end"
                  color="primary"
                  size="small"
                  type="submit"
                >
                  {" "}
                  LOGIN
                </IonButton>
              </IonItem>
            </form>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Index;
