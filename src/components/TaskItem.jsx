import { useState } from 'react';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);

  const handleCheckbox = () => {
    onToggle(task.id);
  };

  const handleEdit = () => {
    setEditing(true);
    setDraft(task.text);
  };
  const handleSave = () => {
    if (draft.trim()) {
      onEdit(task.id, draft.trim());
      setEditing(false);
      // Desmarcar casilla al guardar
      if (task.selected) {
        onToggle(task.id);
      }
    }
  };
  const handleCancel = () => {
    setEditing(false);
    setDraft(task.text);
    // Desmarcar casilla al cancelar
    if (task.selected) {
      onToggle(task.id);
    }
  };

  return (
    <li
      className={
        `flex items-center justify-between gap-4 p-3 rounded-lg border transition ` +
        (task.selected ? 'bg-[#daa520] border-yellow-700' : 'bg-white')
      }
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!task.selected}
          onChange={handleCheckbox}
          className="size-5 accent-blue-600"
        />
        <div>
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                className="px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 text-sm"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition"
                title="Guardar cambios"
              >Guardar</button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 rounded bg-gray-100 border text-xs text-gray-700 hover:bg-gray-200 transition"
                title="Cancelar edición"
              >Cancelar</button>
            </div>
          ) : (
            <>
              <p className="font-medium text-gray-900">{task.text}</p>
              <p className="text-xs text-gray-500">Autor: {task.name}</p>
            </>
          )}
        </div>
      </div>
      {!editing && task.selected && (
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="px-2 py-1 rounded bg-gray-100 border text-xs text-gray-700 hover:bg-gray-200 transition"
            title="Editar tarea"
          >Editar</button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-2 py-1 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition"
            title="Eliminar tarea"
          >Eliminar</button>
        </div>
      )}
    </li>
  );
}
