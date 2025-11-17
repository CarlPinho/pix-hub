// Em: src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'
import { BrowserRouter } from 'react-router-dom' // O Roteador "pai"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* O único Roteador */}
      <AuthProvider> {/* O AuthProvider DENTRO dele */}
        <App /> {/* O App DENTRO de tudo */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)