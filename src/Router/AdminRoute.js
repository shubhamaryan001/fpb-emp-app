import React, { getGlobal, Component } from "reactn";
import { Route, Redirect } from "react-router-dom";
const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      getGlobal().userInfo ? (
        getGlobal().userInfo.user.role.roleName === "Admin" ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        )
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default AdminRoute;
