import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import store, { persistor } from "./store";
import GlobalStyles from "./styles/GlobalStyles";

import RoutesIndex from "./routes";
import { ToastContainer } from "react-toastify";

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
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </Router>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
