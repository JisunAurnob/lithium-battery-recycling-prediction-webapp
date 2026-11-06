export function Input({ type, name, placeholder, onChange, className }) {
    return (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full p-2 rounded bg-gray-700 text-white ${className}`}
      />
    );
  }