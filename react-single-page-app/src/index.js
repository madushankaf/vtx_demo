import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "@asgardeo/auth-react";
import { render } from "react-dom";

const Index = () => (
  <AuthProvider
      config={ {
          signInRedirectURL: "https://bff55def-1355-41b6-b64c-fa71a000635f.e1-us-east-azure.choreoapps.dev/",
          signOutRedirectURL: "https://bff55def-1355-41b6-b64c-fa71a000635f.e1-us-east-azure.choreoapps.dev/",
          clientID: "Ukf2294_D_KHGLFXGvtu8xoOyCEa",
          baseUrl: "https://api.asgardeo.io/t/vtxdemo",
          scope: [ "openid","profile", "urn:vtxdemo:booksapibooksrestendpoint:add_book", "urn:vtxdemo:booksapibooksrestendpoint:delete_book", "urn:vtxdemo:booksapibooksrestendpoint:get_book", "urn:vtxdemo:booksapibooksrestendpoint:modify_book" ]
      } }
  >
        <React.StrictMode>
    <App />
  </React.StrictMode>
  </AuthProvider>
);

render((<Index />), document.getElementById("root"));
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
