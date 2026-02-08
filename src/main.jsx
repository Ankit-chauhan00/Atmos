import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PlayProvider } from './context/Play.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlayProvider>
    <App />
    </PlayProvider>
  </StrictMode>,
)
