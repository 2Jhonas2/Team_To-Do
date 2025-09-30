export default function TaskItem({ task, onToggle }) {
  return (
    <li className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg border">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="size-5 accent-blue-600"
        />
        <div>
          <p className={"font-medium " + (task.completed ? "line-through text-gray-500" : "")}>
            {task.text}
          </p>
          <p className="text-xs text-gray-500">Autor: {task.author}</p>
        </div>
      </div>
    </li>
  )
}
