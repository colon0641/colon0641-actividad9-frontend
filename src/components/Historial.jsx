import { useState, useEffect } from "react"

function Historial({ token, role }) {
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const obtenerHistorial = async () => {
    try {
      const res = await fetch("http://localhost:3000/historial", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) {
        throw new Error("Error al obtener historial")
      }

      const data = await res.json()
      setMovimientos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      obtenerHistorial()
    }
  }, [token])

  const borrarTodoElHistorial = async () => {
    if (!window.confirm("¿Estás seguro de que quieres borrar todo el historial? Esta acción no se puede deshacer.")) return

    try {
      const res = await fetch("http://localhost:3000/historial", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) {
        throw new Error("Error al borrar historial")
      }

      // Refrescar la lista (debería estar vacía)
      await obtenerHistorial()
    } catch (err) {
      alert("Error: " + err.message)
    }
  }

  if (loading) {
    return <div>Cargando historial...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h1>Historial de Movimientos</h1>
      {role === "admin" && movimientos.length > 0 && (
        <button onClick={borrarTodoElHistorial} style={{ backgroundColor: "#e74c3c", color: "white", border: "none", padding: "10px 20px", cursor: "pointer", marginBottom: "20px" }}>
          Borrar todo el historial
        </button>
      )}
      {movimientos.length === 0 ? (
        <p>No hay movimientos registrados.</p>
      ) : (
        <div className="table-container">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Acción</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Producto</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Usuario</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((mov) => (
                <tr key={mov._id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{mov.accion}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {mov.producto ? mov.producto.nombre : (mov.detalles || "Producto eliminado")}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {mov.usuario ? `${mov.usuario.nombre} (${mov.usuario.email})` : "Usuario desconocido"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {new Date(mov.fecha).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Historial