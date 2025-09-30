import { useRef } from "react";

// Autor: Jhon Paez
// SearchBar con debounce
export default function SearchBar({ value, onChange }) {
  const timer = useRef();
  const handleChange = (e) => {
    const val = e.target.value;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onChange(val);
    }, 400); // 400ms debounce
  };
  return (
    <input
      type="text"
      defaultValue={value}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Buscar por autor o texto…"
    />
  );
}
