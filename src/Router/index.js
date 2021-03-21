import React from "react";
import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "../components/Menu";
import Home from "../pages/Core";

import AdminRoute from "./AdminRoute";

import AdminDashboard from "../pages/Admin";
import EmpDashboard from "../pages/Emp";

import AllOrders from "../pages/Admin/Orders";
import AllCustomers from "../pages/Admin/Customers";
import OrderById from "../pages/Admin/Orders/OrderById";
import Coupons from "../pages/Admin/Coupons";

function Index() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <AdminRoute
              path="/admin/dashboard"
              exact={true}
              component={AdminDashboard}
            />
            <AdminRoute
              path="/admin/orders"
              exact={true}
              component={AllOrders}
            />
            <AdminRoute
              path="/admin/customers"
              exact={true}
              component={AllCustomers}
            />
            <AdminRoute
              path="/admin/order/:orderId"
              exact={true}
              component={OrderById}
            />
            <AdminRoute
              path="/admin/coupons"
              exact={true}
              component={Coupons}
            />
            <Route
              path="/emp/dashboard"
              exact={true}
              component={EmpDashboard}
            />
            <Route path="/" exact={true} component={Home} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
}

export default Index;
