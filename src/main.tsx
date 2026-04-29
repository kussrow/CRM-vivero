import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const savedTheme = JSON.parse(localStorage.getItem('crm-theme') || '{}')?.state?.theme;
document.documentElement.classList.toggle('dark', savedTheme !== 'light');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
