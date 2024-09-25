import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client' in React 18
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
 
      <App />

    </Provider>
  </React.StrictMode>
);