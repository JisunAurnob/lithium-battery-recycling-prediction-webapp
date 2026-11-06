export function Card({ children, className }) {
    return <div className={`bg-gray-800 p-4 rounded-lg shadow-lg ${className}`}>{children}</div>;
  }
  
  export function CardHeader({ children }) {
    return <div className="pb-2 border-b border-gray-700">{children}</div>;
  }
  
  export function CardTitle({ children }) {
    return <h2 className="text-lg font-bold text-green-400">{children}</h2>;
  }
  
  export function CardContent({ children }) {
    return <div className="pt-2">{children}</div>;
  }