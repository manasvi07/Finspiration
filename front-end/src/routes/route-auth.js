import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Auth } from "aws-amplify";

//  Ref: https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/
const PrivateRoute = () => {
  // TODO : Create hook
  const [isAuthenticated, setLoggedIn] = React.useState(true);

  useEffect(() => {
    (async () => {
      let user = null;

      try {
        user = await Auth.currentAuthenticatedUser();

        if (user) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (e) {
        setLoggedIn(false);
      }
    })();
  })

  return (
    isAuthenticated ? <Outlet /> : <Navigate to="/login" />
  );
};

const PublicRoute = ({ restrictedToPublicOnly }) => {
  const [isAuthenticated, setLoggedIn] = React.useState(false);

  useEffect(() => {
    (async () => {
      let user = null;

      try {
        user = await Auth.currentAuthenticatedUser();

        if (user) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (e) {
        setLoggedIn(false);
      }
    })();
  })

  return (
    isAuthenticated ? <Navigate to="/home" /> : <Outlet />
  );
};


export { PrivateRoute, PublicRoute };
