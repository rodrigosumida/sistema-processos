import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import store, { persistor } from "./store";
import GlobalStyles from "./styles/GlobalStyles";

import RoutesIndex from "./routes";

function App() {
  return (
    <div
      className="content"
      style={{
        display: "flex",
      }}
    >
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router>
            <RoutesIndex />
            <GlobalStyles />
          </Router>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
