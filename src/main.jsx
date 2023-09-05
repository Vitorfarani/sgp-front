import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './scss/index.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import '@/constants/ENV.js'
import { MODE } from '@/constants/ENV.js';

const render =  MODE === 'DEV' ? (
  // <React.StrictMode>
    <App />
  // {/* </React.StrictMode> */}
) : (
  <App />
)

ReactDOM.createRoot(document.getElementById('root')).render(render)