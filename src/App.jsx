import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login.jsx"
import Register from "./components/Register.jsx"
import Sidebar from "./components/Sidebar.jsx"
import Dashboard from "./components/Dashboard.jsx"
import Inventario from "./components/Inventario.jsx"
import Historial from "./components/Historial.jsx"

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [user, setUser] = useState(null)
  const [mostrarRegistro, setMostrarRegistro] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [role, setRole] = useState(localStorage.getItem("role") || "user")

  // Al recargar la página: recuperar token (ya está en estado inicial)

  // 🔐 Obtener perfil del usuario (rol actualizado)
  useEffect(() => {
    if (!token) return

    fetch("http://localhost:3000/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data)
        if (data.role) {
          localStorage.setItem("role", data.role)
          setRole(data.role)
        }
      })
      .catch(err => console.error("Error al obtener perfil:", err))
  }, [token])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    setToken(null)
    setUser(null)
    setRole("user")
    setIsSidebarOpen(false)
  }

  // 🔐 SI NO HAY TOKEN → LOGIN
  if (!token) {
    return mostrarRegistro 
      ? <Register onRegistro={() => setMostrarRegistro(false)} /> 
      : <Login onLogin={(newToken) => {
          setToken(newToken)
          localStorage.setItem("token", newToken)
        }} 
        onIrRegistro={() => setMostrarRegistro(true)} />
  }

  // ✅ SI HAY TOKEN → APP completa con Router
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar 
          user={user} 
          onLogout={logout} 
          isOpen={isSidebarOpen} 
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <div style={{ flex: 1, padding: window.innerWidth < 768 ? '20px 10px' : '20px' }}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard token={token} />} />
            <Route path="/inventario" element={<Inventario token={token} role={role} />} />
            <Route path="/historial" element={<Historial token={token} role={role} />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
