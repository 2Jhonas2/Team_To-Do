import { useState } from 'react'
import { USERS, saveUser } from '../utils/storage'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = USERS.find(u => u.username === username && u.password === password)
    if (found) {
      saveUser({ id: found.id, name: found.name, username: found.username })
      onLogin({ id: found.id, name: found.name, username: found.username })
    } else {
      setError('Credenciales inválidas. Usa Jhon/Jhon123 o Juan/Juan123')
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow"
      >
        <h1 className="text-2xl font-bold mb-1 text-gray-900">Team To-Do</h1>
        <p className="text-sm text-gray-600 mb-4">Inicia sesión con uno de los dos usuarios</p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Jhon o Juan"
          autoComplete="username"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Jhon123 o Juan123"
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
