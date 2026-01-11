import { useEffect, useState } from "react"

function Dashboard({ token }) {
  const [stats, setStats] = useState({ productos: 0, movimientos: 0 })

  useEffect(() => {
    // Obtener estadísticas básicas
    fetch("http://localhost:3000/productos", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(prev => ({ ...prev, productos: data.length })))
      .catch(err => console.error("Error al obtener productos:", err))

    fetch("http://localhost:3000/historial", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(prev => ({ ...prev, movimientos: data.length })))
      .catch(err => console.error("Error al obtener historial:", err))
  }, [token])

  return (
    <div>
      <h1>Panel Principal (Dashboard)</h1>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Productos Totales</h3>
          <p>{stats.productos}</p>
        </div>
        <div className="card">
          <h3>Movimientos Registrados</h3>
          <p>{stats.movimientos}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard