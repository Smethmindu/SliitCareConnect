/**
 * FRONTEND ENTRY POINT
 * This is the first file executed in the browser. It initializes the React root
 * and renders the top-level App component.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Import global styles
import { App } from './App.jsx' // Import the main App router component

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
