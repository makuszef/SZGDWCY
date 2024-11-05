import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';  // Import Provider from react-redux
import App from './App.jsx';
import './index.css';
import store from './store';  // Import the Redux store

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>  {/* Wrap App with the Provider and pass the store */}
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
