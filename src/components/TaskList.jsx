import TaskItem from './TaskItem'

export default function TaskList({ tasks, onToggle }) {
  if (!tasks) {
    return (
      <div className="text-gray-600 text-sm p-4 bg-white rounded-lg border">
        Cargando tareas…
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-gray-600 text-sm p-4 bg-white rounded-lg border">
        No hay tareas aún. ¡Crea la primera! 🚀
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onToggle={onToggle} />
      ))}
    </ul>
  )
}
