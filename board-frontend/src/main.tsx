import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not fount')
}

ReactDOM.createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
