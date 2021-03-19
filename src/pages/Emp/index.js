import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import Header from "../../components/Header";

function index() {
  return (
    <IonPage>
      <Header title={`Dashboard <sup>Emp</sup>`} />
      <IonContent>
        <h5>EMP Dashboard</h5>
      </IonContent>
    </IonPage>
  );
}

export default index;
