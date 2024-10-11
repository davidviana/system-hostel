import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import CadasterPage from './page/CadasterPage/cadaster';
import Login from './page/LoginPage/login';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CadasterPage />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
