"use client";
import { circularityPredict, costPredict, profitabilityPredict } from "@/services/predictionService";
import axios from "axios";
import { BatteryCharging, RotateCw, BarChart3, BadgeDollarSign, Battery, Recycle, Leaf, Zap, Factory, Repeat, Wind } from "lucide-react";
import { useState, createContext, useContext } from "react";

// Card Components
export function Card({ children, className }) {
  return <div className={`bg-gray-800 p-4 rounded-lg shadow-lg ${className}`}>{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="pb-2 border-b border-gray-700">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-lg font-bold text-green-400 flex items-center">{children}</h2>;
}

export function CardContent({ children }) {
  return <div className="pt-2 text-center">{children}</div>;
}

// Tabs Context to manage active tab state
const TabsContext = createContext();

export function Tabs({ children, defaultValue, className }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }) {
  return <div className={`flex space-x-2 p-2 ${className}`}>{children}</div>;
}

export function TabsTrigger({ children, value, className }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-1 text-xs md:text-lg px-md-4 py-2 rounded-lg ${activeTab === value ? "bg-gray-600 text-white" : "bg-gray-700 text-gray-300"
        } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === value ? <div>{children}</div> : null;
}

// Input & Button Components
export function Input({ type, name, placeholder, onChange, className, min }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      step="any"
      min={min}
      className={`w-full p-2 rounded bg-gray-700 text-white ${className}`}
    />
  );
}

export function Button({ children, className }) {
  return <button className={`px-4 py-2 rounded ${className}`}>{children}</button>;
}

// Main Component
export default function Home() {
  const [formData, setFormData] = useState({ cost: "", circularity: "", profitability: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [responseData, setResponseData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCostFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Array.from(formData.values()).map(Number); // Convert FormData to JSON object
    const costPrediction = await costPredict({ "features": values });
    if (costPrediction) {
      setResponseData(costPrediction);
    } else {
      setResponseData(null);
    }
  };

  const handleCircularityFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Array.from(formData.values()).map(Number); // Convert FormData to JSON object

    const circularityPrediction = await circularityPredict({ "features": values });
    if (circularityPrediction) {
      setResponseData(circularityPrediction);
    } else {
      setResponseData(null);
    }

  };

  const handleProfitabilityFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Array.from(formData.values()).map(Number); // Convert FormData to JSON object
    const profitabilityPrediction = await profitabilityPredict({ "features": values });
    if (profitabilityPrediction) {
      setResponseData(profitabilityPrediction);
    } else {
      setResponseData(null);
    }

  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-green-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" />
        <div className="absolute w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl top-1/2 -right-32 animate-pulse" />
        <div className="absolute w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -bottom-32 left-1/4 animate-pulse" />
      </div>

      {/* Decorative battery icons */}
      <div className="absolute top-8 left-8 animate-bounce">
        <Battery className="w-6 h-6 text-green-400/40" />
      </div>
      <div className="absolute top-16 left-1/4 animate-pulse">
        <Zap className="w-8 h-8 text-yellow-400/40" />
      </div>
      <div className="absolute top-12 right-1/4 animate-bounce">
        <Recycle className="w-7 h-7 text-blue-400/40" />
      </div>
      <div className="absolute top-10 right-10 animate-pulse">
        <Leaf className="w-6 h-6 text-green-400/40" />
      </div>
      {/* Middle row icons */}
      <div className="absolute left-6 top-1/2 animate-pulse">
        <Factory className="w-8 h-8 text-purple-400/40" />
      </div>
      <div className="absolute right-8 top-1/2 animate-bounce">
        <BatteryCharging className="w-7 h-7 text-sky-400/40" />
      </div>

      {/* Bottom row icons */}
      <div className="absolute bottom-12 left-12 animate-bounce">
        <Repeat className="w-6 h-6 text-blue-400/40" />
      </div>
      <div className="absolute bottom-20 left-1/3 animate-pulse">
        <Wind className="w-8 h-8 text-green-400/40" />
      </div>
      <div className="absolute bottom-16 right-1/3 animate-bounce">
        <Battery className="w-7 h-7 text-yellow-400/40" />
      </div>
      <div className="absolute bottom-10 right-10 animate-pulse">
        <Recycle className="w-6 h-6 text-blue-400/40" />
      </div>

      {/* Floating icons with custom animations */}
      <div className="absolute left-1/4 top-1/3 animate-[float_6s_ease-in-out_infinite]">
        <Leaf className="w-8 h-8 text-green-400/40" />
      </div>
      <div className="absolute right-1/4 top-2/3 animate-[float_8s_ease-in-out_infinite]">
        <Zap className="w-7 h-7 text-yellow-400/40" />
      </div>

      {/* Additional subtle gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tl from-gray-900/10 to-transparent" />

      <div className="relative flex flex-col items-center p-6">
        {/* Info Cards */}
        <div className="w-full max-w-2xl grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-gray-800/50 border-green-500/20">
            <div className="p-4 flex flex-col items-center ">
              <Leaf className="w-8 h-8 text-green-400 mb-2" />
              <p className="text-sm text-center">Sustainable Battery Recycling Solutions</p>
            </div>
          </Card>
          <Card className="bg-gray-800/50 border-blue-500/20">
            <div className="p-4 flex flex-col items-center">
              <Recycle className="w-8 h-8 text-blue-400 mb-2" />
              <p className="text-sm text-center">Circular Economy Impact</p>
            </div>
          </Card>
          <Card className="bg-gray-800/50 border-yellow-500/20">
            <div className="p-4 flex flex-col items-center">
              <Battery className="w-8 h-8 text-yellow-400 mb-2" />
              <p className="text-sm text-center">Resource Recovery Analytics</p>
            </div>
          </Card>
        </div>
      </div>
      <Card className="w-full max-w-2xl z-10">
        <CardHeader>
          <CardTitle><BatteryCharging className="w-10 h-5 text-sky-200 pr-3" />Lithium Ion Battery Recycling Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cost" className="w-full">
            <TabsList className="grid grid-cols-3 gap-2 bg-gray-700 p-2 rounded-lg">
              <TabsTrigger value="cost" className="flex items-center gap-2">
                <BadgeDollarSign className="w-5 h-5 text-green-400" /> Cost
              </TabsTrigger>
              <TabsTrigger value="circularity" className="flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-blue-400" /> Circularity
              </TabsTrigger>
              <TabsTrigger value="profitability" className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" /> Profitability
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cost">
              <form className="mt-4 space-y-4 text-start" onSubmit={handleCostFormSubmit}>
                <div className="space-y-2">
                  <label className="block">Category</label>
                  <Input type="number" name="cost1" placeholder="Enter Category" />
                </div>
                <div className="space-y-2">
                  <label className="">Material</label>
                  <Input type="number" name="cost2" placeholder="Enter Material" />
                </div>
                <div className="space-y-2">
                  <label className="block">Year</label>
                  <Input type="number" name="cost3" placeholder="Enter Year" min={0} />
                </div>
                <div className="space-y-2">
                  <label className="block">Recycling Throughput</label>
                  <Input type="number" name="cost4" placeholder="Enter Recycling Throughput" />
                </div>
                <div className="space-y-2">
                  <label className="block">Cathode Scenario</label>
                  <Input type="number" name="cost5" placeholder="Enter Cathode Scenario" />
                </div>
                <div className="space-y-2">
                  <label className="block">Location scenario</label>
                  <Input type="number" name="cost6" placeholder="Enter Location Scenario" />
                </div>
                <div className="space-y-2">
                  <label className="block">Type All</label>
                  <Input type="number" name="cost7" placeholder="Enter Type All" />
                </div>
                <div className="space-y-2">
                  <label className="block">Type Direct</label>
                  <Input type="number" name="cost8" placeholder="Enter Type Direct" />
                </div>
                <div className="space-y-2">
                  <label className="block">Type Hydro</label>
                  <Input type="number" name="cost9" placeholder="Enter Type Hydro" />
                </div>
                <div className="space-y-2">
                  <label className="block">Type Pyro</label>
                  <Input type="number" name="cost10" placeholder="Enter Type Pyro" />
                </div>
                <div className="space-y-2">
                  <label className="block">Location of Recycling China</label>
                  <Input type="number" name="cost11" placeholder="Enter Location of Recycling China" />
                </div>
                <div className="space-y-2">
                  <label className="block">Location of Recycling U.S.</label>
                  <Input type="number" name="cost12" placeholder="Enter Location of Recycling U.S." />
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600">Calculate Cost</Button>
              </form>
            </TabsContent>

            <TabsContent value="circularity">
              <form className="mt-4 space-y-4 text-start" onSubmit={handleCircularityFormSubmit}>
                <div className="space-y-2">
                  <label className="block">Year</label>
                  <Input type="number" name="circularity1" placeholder="Enter Year" min={0} />
                </div>
                <div className="space-y-2">
                  <label className="block">Scenario Percent Repurposed</label>
                  <Input type="number" name="circularity2" placeholder="Enter Scenario Percent Repurposed" />
                </div>
                <div className="space-y-2">
                  <label className="block">Scenario Reuse Lifespan</label>
                  <Input type="number" name="circularity3" placeholder="Enter Scenario Reuse Lifespan" />
                </div>
                <div className="space-y-2">
                  <label className="block">Material</label>
                  <Input type="number" name="circularity4" placeholder="Enter Material" />
                </div>
                <div className="space-y-2">
                  <label className="block">KWh Retired</label>
                  <Input type="number" name="circularity5" placeholder="Enter KWh Retired" />
                </div>
                <div className="space-y-2">
                  <label className="block">KG Retired</label>
                  <Input type="number" name="circularity6" placeholder="Enter KG Retired" />
                </div>
                <div className="space-y-2">
                  <label className="block">KG Recycled Weight</label>
                  <Input type="number" name="circularity7" placeholder="Enter KG Recycled Weight" />
                </div>
                <div className="space-y-2">
                  <label className="block">KWh</label>
                  <Input type="number" name="circularity8" placeholder="Enter KWh" />
                </div>
                <div className="space-y-2">
                  <label className="block">KG Demand</label>
                  <Input type="number" name="circularity9" placeholder="Enter KG Demand" />
                </div>
                <div className="space-y-2">
                  <label className="block">Collection Rate</label>
                  <Input type="number" name="circularity10" placeholder="Enter Collection Rate" />
                </div>
                <div className="space-y-2">
                  <label className="block">Recycling Process Direct</label>
                  <Input type="number" name="circularity11" placeholder="Enter Recycling Process Direct" />
                </div>
                <div className="space-y-2">
                  <label className="block">Recycling Process Hydro</label>
                  <Input type="number" name="circularity12" placeholder="Enter Recycling Process Hydro" />
                </div>
                <div className="space-y-2">
                  <label className="block">Recycling Process Pyro</label>
                  <Input type="number" name="circularity13" placeholder="Enter Recycling Process Pyro" />
                </div>
                <div className="space-y-2">
                  <label className="block">Sales Scenario SDS</label>
                  <Input type="number" name="circularity14" placeholder="Enter Sales Scenario SDS" />
                </div>
                <div className="space-y-2">
                  <label className="block">Sales Scenario STEPS</label>
                  <Input type="number" name="circularity15" placeholder="Enter Sales Scenario STEPS" />
                </div>
                <div className="space-y-2">
                  <label className="block">Cathode Scenario LFP</label>
                  <Input type="number" name="circularity16" placeholder="Enter Cathode Scenario LFP" />
                </div>
                <div className="space-y-2">
                  <label className="block">Cathode Scenario NCX</label>
                  <Input type="number" name="circularity17" placeholder="Enter Cathode Scenario NCX" />
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600">Calculate Circularity</Button>
              </form>
            </TabsContent>

            <TabsContent value="profitability">
              <form className="mt-4 space-y-4 text-start" onSubmit={handleProfitabilityFormSubmit}>
                <div className="space-y-2">
                  <label className="block">Year</label>
                  <Input type="number" name="profitability1" placeholder="Enter Year" min={0} />
                </div>
                <div className="space-y-2">
                  <label className="block">Virgin material value ($)</label>
                  <Input type="number" name="profitability2" placeholder="Enter Virgin material value ($)" />
                </div>
                <div className="space-y-2">
                  <label className="block">Cost to recycle ($)</label>
                  <Input type="number" name="profitability3" placeholder="Enter Cost to recycle ($)" />
                </div>
                <div className="space-y-2">
                  <label className="block">Type Direct</label>
                  <Input type="number" name="profitability4" placeholder="Enter Type Direct" />
                </div>
                <div className="space-y-2">
                  <label className="block">Type Hydro</label>
                  <Input type="number" name="profitability5" placeholder="Enter Type Hydro" />
                </div>
                <div className="space-y-2">
                  <label className="block">Type Pyro</label>
                  <Input type="number" name="profitability6" placeholder="Enter Type Pyro" />
                </div>
                <div className="space-y-2">
                  <label className="block">Cathode Scenario LFP</label>
                  <Input type="number" name="profitability7" placeholder="Enter Cathode Scenario LFP" />
                </div>
                <div className="space-y-2">
                  <label className="block">Cathode Scenario NCX</label>
                  <Input type="number" name="profitability8" placeholder="Enter Cathode Scenario NCX" />
                </div>
                <div className="space-y-2">
                  <label className="block">Location scenario China-truck & tanker</label>
                  <Input type="number" name="profitability9" placeholder="Enter Location scenario China-truck & tanker" />
                </div>
                <div className="space-y-2">
                  <label className="block">Location scenario US-train</label>
                  <Input type="number" name="profitability10" placeholder="Enter Location scenario US-train" />
                </div>
                <div className="space-y-2">
                  <label className="block">Location scenario US-truck</label>
                  <Input type="number" name="profitability11" placeholder="Enter Location scenario US-truck" />
                </div>
                <div className="space-y-2">
                  <label className="block">Location of recycling China</label>
                  <Input type="number" name="profitability12" placeholder="Enter Location of recycling China" />
                </div>
                <div className="space-y-2">
                  <label className="block">Location of recycling U.S.</label>
                  <Input type="number" name="profitability13" placeholder="Enter Location of recycling U.S." />
                </div>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600">Calculate Profitability</Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="mt-4">
            {responseData ? <p className="text-red-500">Prediction Result is: <span className="text-yellow-500">{responseData}</span></p> : <></>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}