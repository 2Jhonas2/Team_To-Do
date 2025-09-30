export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Buscar por autor o texto…"
    />
  )
}
