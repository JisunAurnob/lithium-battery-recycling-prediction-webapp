import { useState } from "react";
import { BatteryCharging, RotateCw, BarChart3 } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";

export function Tabs({ children, defaultValue, className }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <div className={`w-full ${className}`}>
      {children.map((child) =>
        child.type === TabsContent ? (activeTab === child.props.value ? child : null) : child
      )}
    </div>
  );
}

export function TabsList({ children, className }) {
  return <div className={`flex space-x-2 p-2 ${className}`}>{children}</div>;
}

export function TabsTrigger({ children, value, className, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 rounded-lg ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value }) {
  return <div>{children}</div>;
}

export default function BatteryRecyclingPrediction() {
  const [formData, setFormData] = useState({ efficiency: "", circularity: "", profitability: "" });
  const [activeTab, setActiveTab] = useState("efficiency");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    
    <Tabs defaultValue="efficiency" className="w-full">
            <TabsList className="grid grid-cols-3 gap-2 bg-gray-700 p-2 rounded-lg">
              <TabsTrigger value="efficiency" className="text-green-400">Efficiency</TabsTrigger>
              <TabsTrigger value="circularity" className="text-blue-400">Circularity</TabsTrigger>
              <TabsTrigger value="profitability" className="text-yellow-400">Profitability</TabsTrigger>
            </TabsList>
            <TabsContent value="efficiency">
              <form className="mt-4 space-y-4">
                <Input type="number" name="efficiency" placeholder="Enter efficiency input" onChange={handleChange} />
                <Button className="w-full bg-green-500 hover:bg-green-600">Calculate Efficiency</Button>
              </form>
            </TabsContent>
            <TabsContent value="circularity">
              <form className="mt-4 space-y-4">
                <Input type="number" name="circularity" placeholder="Enter circularity input" onChange={handleChange} />
                <Button className="w-full bg-blue-500 hover:bg-blue-600">Calculate Circularity</Button>
              </form>
            </TabsContent>
            <TabsContent value="profitability">
              <form className="mt-4 space-y-4">
                <Input type="number" name="profitability" placeholder="Enter profitability input" onChange={handleChange} />
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600">Calculate Profitability</Button>
              </form>
            </TabsContent>
          </Tabs>
  );
}
