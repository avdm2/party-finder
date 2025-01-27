import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { sendToServer, sendMessageToUser, requestPublicKey } from './E2EE';
import { generateKeyPair, exportPublicKey, initializeEncryption, importPublicKey, encryptMessage, decryptMessage } from './E2EEGenerateUtil';
import { displayMessage } from './displayFunctions';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
//после запуска приложения генерируеются ключи и публчиный отправляется на сервер
initializeEncryption().then(r => r);
