// Simple wrapper for localStorage keys used by the app
const KEYS = {
  TASKS: 'team_todo_tasks',
  USER: 'team_todo_user',
};

export function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.TASKS)) ?? [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
}

export function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.USER)) ?? null;
  } catch {
    return null;
  }
}

export function saveUser(user) {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(KEYS.USER);
}

export const USERS = [
  { id: 1, name: 'Jhon', username: 'Jhon', password: 'Jhon123' },
  { id: 2, name: 'Juan', username: 'Juan', password: 'Juan123' },
];
