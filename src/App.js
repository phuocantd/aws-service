import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import Layout from "./components/Layout";
import TranslatePage from "./pages/translate";
import HomePage from "./pages/home";
import VoicePage from "./pages/voice";

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route exact path="/translate">
              <TranslatePage />
            </Route>
            <Route exact path="/voice">
              <VoicePage />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </>
  );
}

export default App;
