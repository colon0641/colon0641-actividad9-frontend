import { useState, useEffect } from "react"

function Inventario({ token, role }) {
  const [loadingProductos, setLoadingProductos] = useState(false)
  const [loadingForm, setLoadingForm] = useState(false)
  const [error, setError] = useState("")
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState({
    nombre: "",
    cantidad: "",
    precio: "",
    categoria: ""
  })
  const [editandoId, setEditandoId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [filteredProductos, setFilteredProductos] = useState([])
  const [verModalOpen, setVerModalOpen] = useState(false)
  const [productoVer, setProductoVer] = useState(null)
  const [ultimoMovimiento, setUltimoMovimiento] = useState(null)

  // Obtener productos
  useEffect(() => {
    if (!token) return

    setLoadingProductos(true)
    setError("")

    fetch("http://localhost:3000/productos", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("No autorizado")
        return res.json()
      })
      .then(data => {
        const productosData = Array.isArray(data) ? data : []
        setProductos(productosData)
      })
      .catch(() => {
        setError("No se pudieron cargar los productos")
        setProductos([])
        setCategorias([])
      })
      .finally(() => {
        setLoadingProductos(false)
      })
  }, [token])

  // Generar categorías dinámicas
  useEffect(() => {
    const categoriasUnicas = [...new Set(productos.map(p => p.categoria).filter(c => c && c.trim() !== ""))]
    setCategorias(categoriasUnicas)
  }, [productos])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const eliminarProducto = (id) => {
    fetch(`http://localhost:3000/productos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => {
      setProductos(productos.filter(p => p._id !== id))
    })
  }

  const agregarProducto = async (e) => {
    e.preventDefault()
    setLoadingForm(true)
    setError("")

    try {
      const url = editandoId
        ? `http://localhost:3000/productos/${editandoId}`
        : "http://localhost:3000/productos"

      const method = editandoId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: form.nombre,
          cantidad: Number(form.cantidad),
          precio: Number(form.precio),
          categoria: form.categoria
        })
      })

      if (!res.ok) throw new Error("Error al guardar")

      const producto = await res.json()

      if (editandoId) {
        setProductos(prev =>
          prev.map(p => (p._id === producto._id ? producto : p))
        )
      } else {
        setProductos(prev => [...prev, producto])
      }

      setForm({ nombre: "", cantidad: "", precio: "", categoria: "" })
      setEditandoId(null)

    } catch {
      setError("No se pudo guardar el producto")
    } finally {
      setLoadingForm(false)
    }
  }

  const editarProducto = (producto) => {
    setForm({
      nombre: producto.nombre,
      cantidad: String(producto.cantidad),
      precio: String(producto.precio),
      categoria: producto.categoria
    })
    setEditandoId(producto._id)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCategory("")
    setFilteredProductos([])
  }

  const verProducto = async (producto) => {
    setProductoVer(producto)
    // Obtener el último movimiento del producto
    try {
      const res = await fetch(`http://localhost:3000/historial?producto=${producto._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const movimientos = await res.json()
      if (movimientos.length > 0) {
        setUltimoMovimiento(movimientos[0]) // El más reciente
      } else {
        setUltimoMovimiento(null)
      }
    } catch (error) {
      console.error("Error al obtener movimiento:", error)
      setUltimoMovimiento(null)
    }
    setVerModalOpen(true)
  }

  const buscarPorCategoria = () => {
    if (!selectedCategory) return
    const filtered = productos.filter(p => p.categoria === selectedCategory)
    setFilteredProductos(filtered)
  }

  return (
    <div>
      <h1>Inventario de la Empresa</h1>
      {loadingProductos && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Productos</h2>
        <button onClick={openModal} style={{
          padding: "10px 20px",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}>
          🔍 Buscar por Categoría
        </button>
      </div>

      {role === "admin" && (
        <form onSubmit={agregarProducto} style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            id="nombre"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            minLength="3"
            maxLength="50"
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
          <input
            id="cantidad"
            name="cantidad"
            type="number"
            placeholder="Cantidad"
            value={form.cantidad}
            onChange={handleChange}
            required
            min="0"
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
          <input
            id="precio"
            name="precio"
            type="number"
            placeholder="Precio"
            value={form.precio}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
          <input
            id="categoria"
            name="categoria"
            placeholder="Categoría"
            value={form.categoria}
            onChange={handleChange}
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
          <button type="submit" disabled={loadingForm} style={{
            padding: "10px 20px",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}>
            {loadingForm ? "Guardando..." : editandoId ? "Actualizar" : "Agregar"}
          </button>
        </form>
      )}

      <div className="table-container">
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Nombre</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Cantidad</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Precio</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Categoría</th>
              {role === "admin" && <th style={{ padding: "10px", border: "1px solid #ddd" }}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto._id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{producto.nombre}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{producto.cantidad}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>${producto.precio}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{producto.categoria}</td>
                {role === "admin" && (
                  <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
                    <button onClick={() => verProducto(producto)} style={{
                      marginRight: "5px",
                      padding: "5px 10px",
                      backgroundColor: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer"
                    }}>
                      👁️
                    </button>
                    <button onClick={() => editarProducto(producto)} style={{
                      marginRight: "5px",
                      padding: "5px 10px",
                      backgroundColor: "#f39c12",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer"
                    }}>
                      ✏️
                    </button>
                    <button onClick={() => eliminarProducto(producto._id)} style={{
                      padding: "5px 10px",
                      backgroundColor: "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer"
                    }}>
                      ❌
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para búsqueda */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "400px",
            maxHeight: "80%",
            overflowY: "auto"
          }}>
            <h2>Buscar por Categoría</h2>
            <select
              id="categoria-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button onClick={buscarPorCategoria} style={{ marginRight: "10px", padding: "10px" }}>Buscar</button>
            <button onClick={closeModal} style={{ padding: "10px" }}>Cerrar</button>
            <hr />
            <h3>Productos en "{selectedCategory}":</h3>
            <ul>
              {filteredProductos.length > 0 ? (
                filteredProductos.map(producto => (
                  <li key={producto._id}>{producto.nombre} — {producto.cantidad} — ${producto.precio}</li>
                ))
              ) : (
                <li>No hay productos.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Modal para ver detalles del producto */}
      {verModalOpen && productoVer && (
        <div className="modal-overlay" onClick={() => setVerModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Detalles del Producto</h2>
            <table className="detalles-table">
              <tbody>
                <tr>
                  <td><strong>Nombre:</strong></td>
                  <td>{productoVer.nombre}</td>
                </tr>
                <tr>
                  <td><strong>Precio:</strong></td>
                  <td>${productoVer.precio}</td>
                </tr>
                <tr>
                  <td><strong>Cantidad:</strong></td>
                  <td>{productoVer.cantidad}</td>
                </tr>
                <tr>
                  <td><strong>Categoría:</strong></td>
                  <td>{productoVer.categoria}</td>
                </tr>
                {ultimoMovimiento && (
                  <>
                    <tr>
                      <td><strong>Fecha del último movimiento:</strong></td>
                      <td>{new Date(ultimoMovimiento.fecha).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td><strong>Usuario del último movimiento:</strong></td>
                      <td>{ultimoMovimiento.usuario.nombre} ({ultimoMovimiento.usuario.email})</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            <button onClick={() => setVerModalOpen(false)} className="close-button">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventario