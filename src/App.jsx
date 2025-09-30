import { useEffect, useMemo, useState } from 'react'
import Login from './components/Login'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import SearchBar from './components/SearchBar'
import { loadTasks, saveTasks, loadUser, clearUser } from './utils/storage'

export default function App() {
  const [user, setUser] = useState(() => loadUser())
  const [tasks, setTasks] = useState(null) // null -> "cargando"
  const [search, setSearch] = useState('')

  // Cargar tareas al inicio
  useEffect(() => {
    const loaded = loadTasks()
    setTasks(loaded)
  }, [])

  // Guardar tareas al cambiar
  useEffect(() => {
    if (Array.isArray(tasks)) {
      saveTasks(tasks)
    }
  }, [tasks])

  const handleAddTask = ({ text, author }) => {
    const newTask = {
      id: crypto.randomUUID(),
      text,
      author,
      completed: false,
      createdAt: new Date().toISOString(),
      userId: user?.id ?? null,
    };
    setTasks((prev) => [newTask, ...(prev ?? [])]);
  };

  // Toggle selección individual
  const handleToggle = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, selected: !t.selected } : t
      )
    );
  };

  const handleEdit = (id, newText) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filtered = useMemo(() => {
    if (!Array.isArray(tasks)) return []
    const q = search.trim().toLowerCase()
    if (!q) return tasks
    return tasks.filter(
      (t) =>
        t.text.toLowerCase().includes(q) ||
        (t.author ?? '').toLowerCase().includes(q)
    )
  }, [tasks, search])

  // Logout
  const handleLogout = () => {
    clearUser()
    setUser(null)
  }

  if (!user) {
    return <Login onLogin={setUser} />
  }

  return (
    <div className="min-h-full max-w-3xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Team To-Do</h1>
          <p className="text-sm text-gray-600">Hola, {user.name} 👋</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-2 rounded-lg bg-gray-100 border hover:bg-gray-200 transition text-gray-800"
        >
          Cerrar sesión
        </button>
      </header>

      <section className="bg-white rounded-xl border p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">Nueva tarea</h2>
        <TaskForm currentUser={user} onAdd={handleAddTask} />
      </section>

      <section className="bg-white rounded-xl border p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">Buscar</h2>
        <SearchBar value={search} onChange={setSearch} />
      </section>

      <section className="bg-white rounded-xl border p-4">
        <h2 className="text-lg font-semibold mb-3">Tareas</h2>
        {/* Selector global y botón eliminar */}
        {filtered.length > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <input
              type="checkbox"
              checked={filtered.every(t => t.selected)}
              onChange={e => {
                const checked = e.target.checked;
                setTasks(prev =>
                  prev.map(t =>
                    filtered.some(f => f.id === t.id)
                      ? { ...t, selected: checked }
                      : t
                  )
                );
              }}
              className="size-5 accent-blue-600"
            />
            <span className="text-sm">Seleccionar todas</span>
            {filtered.some(t => t.selected) && (
              <button
                className="px-3 py-1 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition"
                onClick={() => {
                  setTasks(prev => prev.filter(t => !t.selected));
                }}
              >Eliminar seleccionadas</button>
            )}
          </div>
        )}
        <TaskList
          tasks={filtered}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>

      <footer className="mt-8 text-center text-xs text-gray-500">
        Guardado local mediante localStorage • Vite + React + Tailwind
      </footer>
    </div>
  )
}
