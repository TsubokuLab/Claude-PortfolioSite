import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { ThemeProvider } from './context/ThemeContext'
import { CursorProvider } from './context/CursorContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <CursorProvider>
        <App />
      </CursorProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
