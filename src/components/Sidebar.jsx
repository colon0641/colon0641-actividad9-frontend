import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

function Sidebar({ user, onLogout, isOpen, onToggle }) {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Overlay para móviles */}
      {isMobile && isOpen && (
        <div 
          onClick={onToggle} 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}

      {/* Botón hamburguesa para móviles */}
      <button 
        onClick={onToggle} 
        style={{
          display: isMobile ? 'block' : 'none',
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 1001,
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '10px',
          cursor: 'pointer'
        }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div style={{
        width: isMobile ? (isOpen ? '250px' : '0') : '250px',
        height: '100vh',
        backgroundColor: "#2c3e50",
        color: "white",
        padding: isMobile && !isOpen ? '0' : '20px',
        overflow: 'hidden',
        transition: 'width 0.3s',
        position: isMobile ? 'fixed' : 'relative',
        left: 0,
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: isOpen || !isMobile ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div>
            <h2>Perfil</h2>
            <p><strong>Nombre:</strong> {user?.nombre || "N/A"}</p>
            <p><strong>Email:</strong> {user?.email || "N/A"}</p>
            
            <hr style={{ margin: "20px 0", borderColor: "#34495e" }} />
            
            <button onClick={() => { navigate("/dashboard"); if (isMobile) onToggle(); }} style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}>
              🏠 Dashboard
            </button>
            
            <button onClick={() => { navigate("/inventario"); if (isMobile) onToggle(); }} style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}>
              📦 Inventario
            </button>
            
            <button onClick={() => { navigate("/historial"); if (isMobile) onToggle(); }} style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}>
              📊 Historial de Movimientos
            </button>
          </div>
          
          <button onClick={onLogout} style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar