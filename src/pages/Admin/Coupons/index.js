import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
} from "@ionic/react";
import React from "react";
import Header from "../../../components/Header";

import { useState, useGlobal, useEffect } from "reactn";
import { createCoupon, listCoupons, removeCoupon } from "../ApisAdmin";
import { dangerToast, successToast } from "../../../components/Toast";

function Index() {
  const [loading, setLoading] = useGlobal("loading");
  const [userData, setuserData] = useGlobal("userInfo");
  const [allCoupons, setAllCoupons] = useState();
  const [values, setValues] = useState({
    code: "",
    discount: 0,
    validity: "",
    isFlat: true,
    isActive: true,
  });

  const { code, discount, validity, isActive, isFlat } = values;
  const inputChangeHandle = (name) => (event) => {
    const value = event.target.value;
    if (name === "isFlat") {
      setValues({ ...values, [name]: !isFlat });
    } else if (name === "isActive") {
      setValues({ ...values, [name]: !isActive });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    const userId = userData.user._id;
    const token = userData.token;
    setLoading(true);
    createCoupon(values, userId, token)
      .then((data) => {
        if (data.error) {
          dangerToast(data.error);
          console.log(data.error);
          setLoading(false);
        } else {
          successToast("coupon has been created");
          console.log(data);
          setLoading(false);
          setValues({
            code: "",
            discount: 0,
            validity: "",
            isFlat: true,
            isActive: true,
          });
          initCoupons();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const initCoupons = () => {
    const userId = userData.user._id;
    const token = userData.token;
    setLoading(true);
    listCoupons(userId, token).then((data) => {
      if (data.error) {
        dangerToast(data.error);
        console.log(data.error);
        setLoading(false);
      } else {
        successToast("Coupons Loaded Success");
        console.log(data);
        setAllCoupons(data.coupons);
        setLoading(false);
      }
    });
  };
  const checkValidityCoupon = (couponDate) => {
    const todayDate = new Date();
    const couponValid = new Date(couponDate);
    if (couponValid > todayDate) {
      return true;
    } else if (couponValid < todayDate) {
      return false;
    }
  };

  const removeCouponById = (couponId) => {
    const userId = userData.user._id;
    const token = userData.token;
    removeCoupon(userId, token, couponId)
      .then((data) => {
        if (data.error) {
          dangerToast(data.error);
          console.log(data.error);
          setLoading(false);
        } else {
          console.log(data);
          successToast(data.success);
          setLoading(false);
          initCoupons();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    initCoupons();
  }, []);
  return (
    <IonPage>
      <Header title="Coupons" backButton={true} />
      <IonContent>
        <div className="default-page">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Create Coupons</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <form onSubmit={onSubmitForm}>
                <IonItem style={{ marginBottom: "5px" }}>
                  <IonInput
                    type="text"
                    onIonChange={inputChangeHandle("code")}
                    value={code}
                    placeholder="Enter Coupon Code"
                  />
                </IonItem>
                <IonItem style={{ marginBottom: "5px" }}>
                  <IonInput
                    type="number"
                    onIonChange={inputChangeHandle("discount")}
                    value={discount}
                    placeholder="Discount Amount flatValue/PercentageValue"
                  />
                </IonItem>

                <IonItem style={{ marginBottom: "5px" }}>
                  <IonLabel>Exp Date:</IonLabel>
                  <IonInput
                    type="date"
                    onIonChange={inputChangeHandle("validity")}
                    // value={validity}
                    placeholder="Discount Amount flatValue/PercentageValue"
                  />
                </IonItem>
                <IonItem style={{ marginBottom: "5px" }}>
                  <IonLabel>Is FlatValue</IonLabel>
                  <IonCheckbox
                    onIonChange={inputChangeHandle("isFlat")}
                    checked={isFlat}
                    slot="end"
                    color="primary"
                  />
                </IonItem>
                <IonItem style={{ marginBottom: "5px" }}>
                  <IonLabel>Active</IonLabel>
                  <IonCheckbox
                    onIonChange={inputChangeHandle("isActive")}
                    checked={isActive}
                    slot="end"
                    color="primary"
                  />
                </IonItem>
                <IonButton size="small" color="tertiary" type="submit">
                  Create
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>

          <IonCard style={{ marginTop: "15px" }}>
            <IonCardContent>
              {allCoupons && (
                <>
                  {allCoupons.length >= 1 ? (
                    <>
                      {allCoupons.map((c, i) => (
                        <div
                          className="default-flex-box"
                          style={{
                            background: "#efefef",
                            marginBottom: "8px",
                            borderRadius: "5px",
                          }}
                        >
                          <p>{c.code}</p>
                          <div>
                            {checkValidityCoupon(c.validity) ? (
                              <IonBadge color="success">ACTIVE</IonBadge>
                            ) : (
                              <IonBadge color="warning">INACTIVE</IonBadge>
                            )}
                          </div>
                          <p>
                            {c.isFlat ? <>₹{c.discount}</> : <>{c.discount}%</>}
                          </p>

                          <IonBadge
                            onClick={() => removeCouponById(c._id)}
                            style={{ fontSize: "10px" }}
                            color="danger"
                          >
                            REMOVE
                          </IonBadge>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p>No Active Coupon</p>
                  )}
                </>
              )}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Index;
