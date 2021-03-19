import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { withRouter } from "react-router";

function Header({ title, backButton }) {
  return (
    <IonHeader>
      <IonToolbar>
        {backButton ? (
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
        ) : (
          ""
        )}

        <IonTitle
          style={{
            fontSize: "15px",
            fontWeight: "600",
            textTransform: "uppercase",
            color: "#646464",
          }}
          size="small"
        >
          {title}
        </IonTitle>

        <IonButtons className="menu-btn" slot="end">
          <IonMenuButton>
            <img
              src="https://res.cloudinary.com/djnv06fje/image/upload/v1611385435/menu_trdtjy.svg"
              alt=""
            />
          </IonMenuButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}

export default withRouter(Header);
