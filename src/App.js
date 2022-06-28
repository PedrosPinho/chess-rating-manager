import React, { useContext }  from 'react';
import { Switch, Route } from "react-router-dom";
import AppBar from "./components/AppBar"
import { routes } from "./routes/routes";
import { Context } from "./context/Authenticator";


export default function App() {
  const { currentVersion } = useContext(Context);

  return (
    <>
      <AppBar currentVersion={currentVersion}/>
      <Switch>
        {routes.map((route) => (
          <Route
            key={Math.random()}
            exact={route.exact}
            path={route.path}
            render={(props) => {
              return <route.component {...props} routes={route.routes} />;
            }}
          />
        ))}
      </Switch>
    </>
  );
}