import React from "react";
import ReactDOM from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import "./index.css";

// Replace these values with your Auth0 credentials
const domain = "dev-a5qmltfhuzu3ydb2.us.auth0.com";
const clientId = "inVcWxUIgjIc4gz7RbMaOkPBhpedZBrV";

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{ redirect_uri: window.location.origin }}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);
