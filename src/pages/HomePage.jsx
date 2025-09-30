import React, { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import SearchBar from "../components/SearchBar";

// Autor: Juan Rodriguez
function HomePage() {
  const { user, logout } = React.useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Cargar tareas desde JSON Server
  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:4000/tasks")
      .then((res) => {
        setTasks(res.data);
        setError(null);
      })
      .catch((err) => {
        setError("Error al cargar tareas");
        toast.error("Error al cargar tareas");
      })
      .finally(() => setLoading(false));
  }, []);

  // Agregar tarea
  const handleAddTask = useCallback(async ({ text, author }) => {
    try {
      const newTask = {
        text,
        author,
        completed: false,
        createdAt: new Date().toISOString(),
        userId: user?.id ?? null,
        selected: false,
      };
      const res = await axios.post("http://localhost:4000/tasks", newTask);
      setTasks((prev) => [res.data, ...prev]);
      toast.success("Tarea agregada");
    } catch {
      toast.error("Error al agregar tarea");
    }
  }, [user]);

  // Selección individual
  const handleToggleSelect = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, selected: !t.selected } : t
      )
    );
  }, []);

  // Selección global
  const handleToggleAll = useCallback((checked) => {
    setTasks((prev) =>
      prev.map((t) => ({ ...t, selected: checked }))
    );
  }, []);

  // Edición inline
  const handleEdit = useCallback(async (id, newText) => {
    try {
      const res = await axios.patch(`http://localhost:4000/tasks/${id}`, {
        text: newText,
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: res.data.text } : t))
      );
      toast.success("Tarea editada");
    } catch {
      toast.error("Error al editar tarea");
    }
  }, []);

  // Eliminar individual
  const handleDelete = useCallback(async (id) => {
    try {
      await axios.delete(`http://localhost:4000/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.info("Tarea eliminada");
    } catch {
      toast.error("Error al eliminar tarea");
    }
  }, []);

  // Eliminar seleccionadas
  const handleDeleteSelected = useCallback(async () => {
    const selectedIds = tasks.filter(t => t.selected).map(t => t.id);
    try {
      await Promise.all(selectedIds.map(id => axios.delete(`http://localhost:4000/tasks/${id}`)));
      setTasks((prev) => prev.filter((t) => !t.selected));
      toast.info("Tareas seleccionadas eliminadas");
    } catch {
      toast.error("Error al eliminar seleccionadas");
    }
  }, [tasks]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(
      (t) =>
        t.text.toLowerCase().includes(q) ||
        (t.author ?? "").toLowerCase().includes(q)
    );
  }, [tasks, search]);

  if (!user) return null;

  return (
    <div className="min-h-full max-w-3xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Team To-Do</h1>
          <p className="text-sm text-gray-600">Hola, {user.username} 👋</p>
        </div>
        <button
          onClick={logout}
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
        {loading ? (
          <div className="text-gray-500">Cargando tareas...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            {filtered.length > 0 && (
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="checkbox"
                  checked={filtered.every(t => t.selected)}
                  onChange={e => handleToggleAll(e.target.checked)}
                  className="size-5 accent-blue-600"
                />
                <span className="text-sm">Seleccionar todas</span>
                {filtered.some(t => t.selected) && (
                  <button
                    className="px-3 py-1 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition"
                    onClick={handleDeleteSelected}
                  >Eliminar seleccionadas</button>
                )}
              </div>
            )}
            <TaskList
              tasks={Array.isArray(filtered) ? filtered : []}
              onToggle={handleToggleSelect}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </section>

      <footer className="mt-8 text-center text-xs text-gray-500">
        Guardado en JSON Server • Vite + React + Tailwind
      </footer>
    </div>
  );
}

export default HomePage;