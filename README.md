# Team To‑Do — Proyecto Final (Vite + React + Tailwind)

Aplicación web sencilla para gestionar tareas en equipo entre **dos usuarios**. Permite **iniciar sesión**, **crear tareas**, **marcarlas como completadas**, **buscarlas por autor o texto**, **editar**, **eliminar**, y **persistir** todo en `localStorage`. Construida con **Vite + React 18 + TailwindCSS**, usando estado con `useState`, efectos con `useEffect`, y memoización con `useMemo`.

> **Credenciales de demo**
>
> - Usuario 1: `Jhon / Jhon123`  
> - Usuario 2: `Juan / Juan123`

---

## 🎯 Objetivo & Alcance

Este proyecto consolida las bases de los primeros módulos de React:

- Entorno moderno: **Vite + Tailwind + ESLint + Prettier**.
- **JSX** y componentes funcionales reutilizables.
- **Comunicación** entre componentes por **props**.
- **Manejo de estado** (`useState`), **efectos** (`useEffect`) y **lógica derivada** (`useMemo`).

### Requerimientos del taller y cómo los cumplimos

| # | Requerimiento | ¿Dónde se cumple? |
|---|---|---|---|
| 1 | Crear tareas con **autor** y **descripción** | `TaskForm` dispara `handleAddTask` en `App` para crear `{ id, text, author, completed, createdAt, userId }` |
| 2 | Mostrar lista en **tiempo real** | Estado `tasks` en `App` + render en `TaskList` (se re-renderiza al cambiar `tasks`) |
| 3 | **Marcar** tareas como completadas | `handleToggle` en `App` (toggle de `completed`) + `TaskItem` con checkbox |
| 4 | **Buscar** por autor o texto | `SearchBar` controla `search`; `filtered` (con `useMemo`) filtra por `text` o `author` |
| 5 | **Persistir** con `localStorage` | `loadTasks/saveTasks` en `src/utils/storage.js` + `useEffect` para guardar |
| 6 | Interfaz **responsive** con Tailwind | Clases Tailwind en todos los componentes |
| 7 | **Renderizado condicional** (vacío/cargando) | `TaskList` muestra “Cargando…” o “No hay tareas…” |
| 8 | **Login** para dos usuarios | `Login` + `USERS` (mock) + helpers `loadUser/saveUser/clearUser` |

> **Plus (mejora opcional):** añadimos **Editar** y **Eliminar** por tarea para una experiencia más completa (no era obligatorio en el PDF del taller).

---

## 🏗️ Estructura del Proyecto

```
team-todo/
├─ index.html
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ .eslintrc.json
├─ .prettierrc
├─ package.json
└─ src/
   ├─ main.jsx
   ├─ index.css
   ├─ App.jsx
   ├─ utils/
   │  └─ storage.js
   └─ components/
      ├─ Login.jsx
      ├─ TaskForm.jsx
      ├─ SearchBar.jsx
      ├─ TaskList.jsx
      └─ TaskItem.jsx
```

---

## ⚙️ Instalación y ejecución

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Ambiente recomendado**
   - Node.js **>= 18** (Vite 5 lo requiere).  
   - Si usas Windows y tienes problemas de permisos, ejecuta la terminal como administrador.

3. **Modo desarrollo**
   ```bash
   npm run dev
   ```
   Abre la URL que muestre Vite (p. ej. `http://localhost:5173`).

4. **Build de producción**
   ```bash
   npm run build
   npm run preview
   ```

> Si aparece un error como “Cannot find package `@vitejs/plugin-react`”, instala:
> ```bash
> npm i -D @vitejs/plugin-react
> ```

---

## 🧠 Lógica y explicación del código

### `src/App.jsx` — Componente raíz
Responsable de **estado global**, **persistencia**, **filtros** y **flujo de login**.

- **Estado principal**
  - `user`: usuario autenticado. Se carga con `loadUser()` al iniciar (permite sesión persistente).
  - `tasks`: lista de tareas; inicia en `null` para mostrar “Cargando...”. Luego se llena con `loadTasks()`.
  - `search`: término de búsqueda.

- **Efectos**
  - `useEffect(() => setTasks(loadTasks()), [])`: carga inicial de tareas.
  - `useEffect(() => saveTasks(tasks), [tasks])`: persiste cada cambio en `tasks`.

- **Handlers clave**
  - `handleAddTask({ text, author })`: crea una nueva tarea con `id` (`crypto.randomUUID()`), `text`, `author`, `completed=false`, `createdAt`, `userId` del usuario activo; antepone en el array.
  - `handleToggle(id)`: invierte `completed` para la tarea con ese `id`.
  - `handleEdit(id, newText)`: actualiza `text` para el `id` dado.
  - `handleDelete(id)`: elimina la tarea con ese `id`.
  - `handleLogout()`: limpia usuario (`clearUser`) y vuelve a la pantalla de `Login`.

- **Búsqueda**
  - `filtered` con `useMemo`: si `search` está vacío devuelve `tasks`; si no, filtra por coincidencia en `text` o `author` (case-insensitive).

- **Render**
  - Si no hay `user`, muestra `<Login onLogin={setUser} />`.
  - Si hay `user`, muestra:
    - `<TaskForm currentUser={user} onAdd={handleAddTask} />`
    - `<SearchBar value={search} onChange={setSearch} />`
    - `<TaskList tasks={filtered} onToggle={handleToggle} onEdit={handleEdit} onDelete={handleDelete} />`

### `src/components/Login.jsx`
Formulario controlado con estado local. Valida contra `USERS` (mock) definido en `storage.js` y, si coincide `username/password`, guarda al usuario con `saveUser` y notifica a `App` via `onLogin`.

### `src/components/TaskForm.jsx`
Input controlado para el **texto** de la tarea. Al enviar:
- Trim del texto.
- Llama `onAdd({ text, author: currentUser.name })`.
- Limpia el input.

### `src/components/SearchBar.jsx`
Input controlado para actualizar `search`. No filtra por sí mismo: solo actualiza el estado en `App`, que genera `filtered` con `useMemo`.

### `src/components/TaskList.jsx`
- Si `tasks` es `null`: muestra **“Cargando tareas…”**.
- Si `tasks` está vacío: muestra **“No hay tareas aún…”**.
- En caso contrario, mapea y renderiza `TaskItem`.

Recibe `onToggle`, `onEdit`, `onDelete` y los pasa a cada item.

### `src/components/TaskItem.jsx`
- Checkbox para marcar como completada (llama `onToggle(id)`).
- **Editar inline**: al pulsar *Editar*, aparece un input + botones **Guardar/Cancelar**. Guardar ejecuta `onEdit(id, draft)`.
- **Eliminar**: botón “Eliminar” llama `onDelete(id)`.

### `src/utils/storage.js`
Encapsula `localStorage` para la app:
- **Claves**:
  - `team_todo_tasks`
  - `team_todo_user`
- **Funciones**:
  - `loadTasks` / `saveTasks`
  - `loadUser` / `saveUser` / `clearUser`
- **Usuarios de demo** (`USERS`): `ana` y `luis`.

---

## 🎨 Estilos & UX (Tailwind)
- Diseño responsive **mobile-first**.
- Contenedores con `rounded`, `border`, `shadow` suaves.
- Estados de foco accesibles con `focus:ring`.
- Botones con `hover` y jerarquía cromática:
  - **Primarios** (`bg-blue-600`) para acciones positivas (Agregar / Guardar).
  - **Neutros** (`bg-gray-100`) para secundarios (Editar, Cancelar).
  - **Peligro** (`bg-red-600`) para Eliminar.

> Puedes ajustar la paleta cambiando la variable `--brand` en `src/index.css` o usando clases Tailwind según tu guía visual.

---

## ✅ Checklist de sustentación (qué explicar)

1. **Arquitectura**: separación en componentes y utilidades; por qué `App` es el orquestador.
2. **Estado & efectos**: qué vive en `App` vs. en componentes; por qué `useEffect` para persistencia.
3. **Flujo de datos**: unidireccional (padre → hijo por props, hijo → padre por callbacks).
4. **Persistencia**: por qué `localStorage` (requisito del taller) y cómo se serializa.
5. **Búsqueda**: optimización con `useMemo` (evita recomputar innecesariamente).
6. **Condicionales de UI**: estados “cargando” y “vacío” (requisito).
7. **Accesibilidad básica**: focus rings, etiquetas, contraste suficiente.
8. **Build tooling**: Vite por rapidez, Tailwind por productividad, ESLint/Prettier por consistencia.
9. **Mejoras añadidas**: Editar y Eliminar (no obligatorias, pero aportan UX).

---

## 🔧 Troubleshooting

- **`@vitejs/plugin-react` no encontrado**  
  ```bash
  npm i -D @vitejs/plugin-react
  ```
- **Node antiguo**: actualiza a **>= 18**.  
- **Reinstalar dependencias**:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

---

## 🚀 Posibles mejoras (si quieres ir más allá)
- Filtros rápidos: **Solo mis tareas / Completadas / Todas**.
- Botón “Eliminar tareas completadas”.
- Validaciones avanzadas (longitud mínima del texto, límite de caracteres, etc.).
- Tests de componentes (Vitest + React Testing Library).
- Backend real (Nest/Express) + autenticación JWT y base de datos.
- Paginación / sección por autor / fechas con ordenamiento.

---

## 📜 Licencia
MIT — úsalo libremente para tu aprendizaje y portafolio.

---

## 👥Autores
```
Jhon Paez
Juan Rodriguez
```

---