import { useState } from 'react'

export default function TaskForm({ currentUser, onAdd }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    onAdd({
      text: value,
      author: currentUser?.name ?? 'Anónimo',
    })
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Escribe una nueva tarea…"
      />
      <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
        Agregar
      </button>
    </form>
  )
}
