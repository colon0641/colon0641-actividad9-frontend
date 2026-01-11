import { useEffect, useState } from "react"

function Categorias({ token, role }) {
  const [categorias, setCategorias] = useState([])
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [editandoId, setEditandoId] = useState(null)

  useEffect(() => {
    fetch("http://localhost:3000/categorias", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCategorias(data))
  }, [token])

  const guardarCategoria = e => {
    e.preventDefault()

    const url = editandoId
      ? `http://localhost:3000/categorias/${editandoId}`
      : "http://localhost:3000/categorias"

    const method = editandoId ? "PUT" : "POST"

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ nombre, descripcion })
    })
      .then(res => res.json())
      .then(data => {
        if (editandoId) {
          setCategorias(categorias.map(c => (c._id === data._id ? data : c)))
        } else {
          setCategorias([...categorias, data])
        }

        setNombre("")
        setDescripcion("")
        setEditandoId(null)
      })
  }

  const eliminarCategoria = id => {
    fetch(`http://localhost:3000/categorias/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setCategorias(categorias.filter(c => c._id !== id)))
  }

  const editarCategoria = categoria => {
    setNombre(categoria.nombre)
    setDescripcion(categoria.descripcion)
    setEditandoId(categoria._id)
  }

  return (
    <div>
      <h2>Categorías</h2>

      {role === "admin" && (
        <form onSubmit={guardarCategoria}>
          <input
            id="nombre"
            name="nombre"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
          <input
            id="descripcion"
            name="descripcion"
            placeholder="Descripción"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
          />
          <button type="submit">
            {editandoId ? "Actualizar" : "Agregar"}
          </button>
        </form>
      )}

      <ul>
        {categorias.map(c => (
          <li key={c._id}>
            {c.nombre} — {c.descripcion}
            {role === "admin" && (
              <>
                <button onClick={() => editarCategoria(c)}>✏️</button>
                <button onClick={() => eliminarCategoria(c._id)}>❌</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Categorias
