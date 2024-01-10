import React, { useEffect, useState } from "react";
import { config, passport as impassport } from "@imtbl/sdk";
import "./App.css";

const passportInstance = new impassport.Passport({
  baseConfig: {
    environment: config.Environment.SANDBOX,
    publishableKey: "pk_imapik-test-xw7CFx0M-_EEOjFbShLx",
  },
  clientId: "ielnO0GhBZbjkO6wmT9if4Srd1CkcwMZ",
  redirectUri: "http://localhost:3000/",
  logoutRedirectUri: "http://localhost:3000/",
  audience: "platform_api",
  scope: "openid offline_access email transact",
});

const passportProvider = passportInstance.connectEvm();
const initPassport = async () => {
  try {
    await passportProvider.request({
      method: "eth_requestAccounts",
    });
  } catch (err) {
    console.warn(err);
  }
};

const login = () => {
  initPassport();
};

const logout = () => {
  passportInstance.logout();
};

function App() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let userProfile: any;
      try {
        userProfile = await passportInstance.getUserInfo();
      } catch (err) {
        // if error, user is not logged in - we show "log in with passport" button
        console.warn(err);
        userProfile = null;
      }
      if (userProfile) {
        setProfile(userProfile);
      }
    })();
  }, []);

  // if query parameters contain ?code= - call passport's callback and return
  if (window.location.search.includes("?code=")) {
    passportInstance.loginCallback();
  }
  if (profile !== null) {
    return (
      <div className="App">
        <h1>SO LOGGED IN! {profile.email}</h1>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
  return (
    <div className="App">
      <button onClick={login}>Connect passport</button>
    </div>
  );
}

export default App;
