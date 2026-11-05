import React from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter} from 'react-router-dom';
import App from './App.jsx';import {StoreProvider} from './store.jsx';import './styles.css';import './v2.css';import './v3.css';import './v4.css';import './v5.css';
createRoot(document.getElementById('root')).render(<BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/,'')}><StoreProvider><App/></StoreProvider></BrowserRouter>);
