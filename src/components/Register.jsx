import { useState } from "react"

function Register({ onRegistro }) {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [tipoMensaje, setTipoMensaje] = useState("") // "success" o "error"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje("")
    setTipoMensaje("")

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre, email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setMensaje(data.error || "Error en el registro")
        setTipoMensaje("error")
        return
      }

      setMensaje("La cuenta ha sido registrada con éxito")
      setTipoMensaje("success")
      setTimeout(() => {
        onRegistro()
      }, 2000) // Redirigir después de 2 segundos
    } catch (error) {
      setMensaje("No se pudo conectar al servidor")
      setTipoMensaje("error")
    }
  }

  const volverLogin = () => {
    onRegistro()
  }

  return (
    <div className="auth-container">
      <h2>Registro</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo:</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Correo"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Registrar</button>
      </form>

      {mensaje && <div className={`alert alert-${tipoMensaje}`}>{mensaje}</div>}

      <button type="button" className="secondary-button" onClick={volverLogin}>
        Volver al login
      </button>
    </div>
  )
}

export default Register
