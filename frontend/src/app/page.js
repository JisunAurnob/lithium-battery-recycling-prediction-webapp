"use client";

import {
  AlertCircle,
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  BatteryCharging,
  CheckCircle2,
  Info,
  Leaf,
  Loader2,
  Recycle,
  RotateCw,
  X,
} from "lucide-react";
import { cloneElement, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  circularityPredict,
  costPredict,
  profitabilityPredict,
} from "@/services/predictionService";

const MATERIALS = [
  ["All recycled chemistry", 0],
  ["Aluminum", 1],
  ["BC", 2],
  ["CH4", 3],
  ["CO", 4],
  ["CO2", 5],
  ["CO2 (with C in VOC and CO)", 6],
  ["Co2+ in product", 7],
  ["Coal", 8],
  ["Cobalt Sulfate", 9],
  ["Copper", 10],
  ["Fossil fuels", 11],
  ["GHGs", 12],
  ["Graphite", 13],
  ["LCO", 14],
  ["LFP", 15],
  ["Lithium Carbonate", 16],
  ["Manganese Sulfate", 17],
  ["Mn2+ in product", 18],
  ["N2O", 19],
  ["NCA", 20],
  ["NMC(111)", 21],
  ["NMC(622)", 22],
  ["NMC(811)", 23],
  ["NOx", 24],
  ["Natural gas", 25],
  ["Ni2+ in product", 26],
  ["Nickel Sulfate", 27],
  ["OC", 28],
  ["PM10", 29],
  ["PM2.5", 30],
  ["Petroleum", 31],
  ["Plastics", 32],
  ["SOx", 33],
  ["Total Energy", 34],
  ["VOC", 35],
  ["Water consumption (gal/kg)", 36],
];

const TAB_CONFIG = {
  cost: {
    label: "Cost",
    icon: BadgeDollarSign,
    description: "Estimate the selected recycling cost or impact output.",
    rows: "294,252 training records",
    range: "Observed output range: 0 to 2,078.0643",
  },
  circularity: {
    label: "Circularity",
    icon: RotateCw,
    description: "Estimate material circularity for a retirement scenario.",
    rows: "175,770 training records",
    range: "Observed Circularity (%) range: 0 to 1.0440",
  },
  profit: {
    label: "Profit",
    icon: BarChart3,
    description: "Estimate profit for a recycling and market scenario.",
    rows: "8,586 training records",
    range: "Observed profit range: −$2.46 to $7.92",
  },
};

const INITIAL_COST = {
  material: "0",
  year: "2030",
  cathode: "1",
  transport: "1",
  category: "recycling",
  process: "hydro",
  recyclingLocation: "us",
};

const INITIAL_CIRCULARITY = {
  year: "2030",
  kwhRetired: "10000000",
  kgRetired: "20000000",
  kwh: "50000000",
  collectionRate: "0.8",
  repurposing: "med",
  material: "aluminum",
  process: "non-pyro",
  sales: "sds",
};

const INITIAL_PROFIT = {
  year: "2030",
  process: "hydro",
  cathode: "ncx",
  transport: "us-truck",
  commodity: "base",
};

function Field({ label, help, sentAs, children }) {
  const inputId = useId();
  const tooltipId = useId();

  return (
    <div className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
        <label htmlFor={inputId}>{label}</label>
        <span className="group relative inline-flex">
          <button
            type="button"
            className="inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full text-slate-400 outline-none transition hover:bg-emerald-50 hover:text-emerald-700 focus:bg-emerald-50 focus:text-emerald-700 focus:ring-2 focus:ring-emerald-200"
            aria-label={`Information about ${label}`}
            aria-describedby={tooltipId}
          >
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <span
            id={tooltipId}
            role="tooltip"
            className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-72 rounded-xl bg-slate-900 p-3 text-left text-xs font-normal leading-5 text-white opacity-0 shadow-xl transition group-hover:opacity-100 group-focus-within:opacity-100 sm:left-1/2 sm:-translate-x-1/2"
          >
            <span className="block text-slate-200">{help}</span>
            <span className="mt-2 block border-t border-slate-700 pt-2">
              <strong className="text-emerald-300">Sent to model:</strong>{" "}
              {sentAs}
            </span>
          </span>
        </span>
      </span>
      {cloneElement(children, { id: inputId })}
      <span className="mt-1.5 block text-xs leading-5 text-slate-500">
        {help}
      </span>
    </div>
  );
}

function SelectField({ label, help, sentAs, value, onChange, children }) {
  return (
    <Field label={label} help={help} sentAs={sentAs}>
      <select className="form-control" value={value} onChange={onChange}>
        {children}
      </select>
    </Field>
  );
}

function NumberField({ label, help, sentAs, value, onChange, min, max, step = "1" }) {
  return (
    <Field label={label} help={help} sentAs={sentAs}>
      <input
        className="form-control"
        type="number"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        required
      />
    </Field>
  );
}

function Section({ title, description, children }) {
  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <legend className="px-2 text-base font-bold text-slate-900">{title}</legend>
      <p className="mb-5 text-sm leading-6 text-slate-500">{description}</p>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function SubmitButton({ loading, label }) {
  return (
    <button
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
      type="submit"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ArrowRight className="h-4 w-4" />
      )}
      {loading ? "Calculating…" : label}
    </button>
  );
}

function buildCostFeatures(data) {
  const categories = {
    reference: [0, 0, 0],
    recycling: [1, 0, 0],
    transport: [0, 1, 0],
    recovered: [0, 0, 1],
  };
  const processes = {
    all: [1, 0, 0, 0],
    direct: [0, 1, 0, 0],
    hydro: [0, 0, 1, 0],
    pyro: [0, 0, 0, 1],
  };
  const locations = data.recyclingLocation === "china" ? [1, 0] : [0, 1];

  return [
    Number(data.material),
    Number(data.year),
    Number(data.cathode),
    Number(data.transport),
    ...categories[data.category],
    ...processes[data.process],
    ...locations,
  ];
}

function buildCircularityFeatures(data) {
  const repurposing = {
    high: [1, 0, 0],
    low: [0, 1, 0],
    med: [0, 0, 1],
  };
  const materials = {
    reference: [0, 0, 0],
    aluminum: [1, 0, 0],
    cobalt: [0, 1, 0],
    copper: [0, 0, 1],
  };
  const sales = data.sales === "sds" ? [1, 0] : [0, 1];

  return [
    Number(data.year),
    Number(data.kwhRetired),
    Number(data.kgRetired),
    Number(data.kwh),
    Number(data.collectionRate),
    ...repurposing[data.repurposing],
    ...materials[data.material],
    data.process === "pyro" ? 1 : 0,
    ...sales,
  ];
}

function buildProfitFeatures(data) {
  const processes = {
    hydro: [0, 0],
    direct: [1, 0],
    pyro: [0, 1],
  };
  const cathodes = data.cathode === "lfp" ? [1, 0] : [0, 1];
  const transports = {
    "china-truck": [1, 0, 0],
    "us-train": [0, 1, 0],
    "us-truck": [0, 0, 1],
  };
  const commodities = {
    base: [0, 0, 0, 0],
    "cobalt-high": [1, 0, 0, 0],
    "cobalt-low": [0, 1, 0, 0],
    "nickel-high": [0, 0, 1, 0],
    "nickel-low": [0, 0, 0, 1],
  };

  return [
    Number(data.year),
    ...processes[data.process],
    ...cathodes,
    ...transports[data.transport],
    ...commodities[data.commodity],
  ];
}

function getCostSummary(data) {
  const material = MATERIALS.find(([, value]) => String(value) === data.material);
  const cathodes = { "1": "LFP", "2": "NCX" };
  const transports = {
    "1": "China — truck and tanker",
    "2": "United States — train",
    "3": "United States — truck",
  };
  const categories = {
    reference: "Reference / uncategorized output",
    recycling: "Environmental impact — recycling",
    transport: "Environmental impact — collection and transport",
    recovered: "Recovered materials",
  };
  const processes = {
    all: "All processes",
    direct: "Direct",
    hydro: "Hydrometallurgical",
    pyro: "Pyrometallurgical",
  };

  return [
    ["Material", material?.[0] ?? data.material],
    ["Year", data.year],
    ["Cathode", cathodes[data.cathode]],
    ["Transport", transports[data.transport]],
    ["Category", categories[data.category]],
    ["Process", processes[data.process]],
    ["Recycling location", data.recyclingLocation === "china" ? "China" : "United States"],
  ];
}

function getCircularitySummary(data) {
  const repurposing = { low: "Low", med: "Medium", high: "High" };
  const materials = {
    reference: "Other / reference material",
    aluminum: "Aluminum",
    cobalt: "Cobalt",
    copper: "Copper",
  };

  return [
    ["Year", data.year],
    ["Retired energy capacity", `${Number(data.kwhRetired).toLocaleString()} kWh`],
    ["Retired battery mass", `${Number(data.kgRetired).toLocaleString()} kg`],
    ["Battery energy", `${Number(data.kwh).toLocaleString()} kWh`],
    ["Collection rate", `${Number(data.collectionRate) * 100}%`],
    ["Repurposing", repurposing[data.repurposing]],
    ["Material", materials[data.material]],
    ["Process", data.process === "pyro" ? "Pyrometallurgical" : "Direct or hydrometallurgical"],
    ["Sales scenario", data.sales === "sds" ? "SDS" : "STEPS"],
  ];
}

function getProfitSummary(data) {
  const processes = {
    hydro: "Hydrometallurgical",
    direct: "Direct",
    pyro: "Pyrometallurgical",
  };
  const transports = {
    "china-truck": "China — truck and tanker",
    "us-train": "United States — train",
    "us-truck": "United States — truck",
  };
  const commodities = {
    base: "Reference / base",
    "cobalt-high": "Cobalt — high",
    "cobalt-low": "Cobalt — low",
    "nickel-high": "Nickel — high",
    "nickel-low": "Nickel — low",
  };

  return [
    ["Year", data.year],
    ["Process", processes[data.process]],
    ["Cathode", data.cathode === "lfp" ? "LFP" : "NCX"],
    ["Transport", transports[data.transport]],
    ["Metal price scenario", commodities[data.commodity]],
  ];
}

function OutputInputDetails({ record }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeButtonRef = useRef(null);
  const triggerButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const triggerButton = triggerButtonRef.current;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerButton?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerButtonRef}
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-emerald-700 outline-none transition hover:bg-emerald-50 focus:ring-2 focus:ring-emerald-200"
        aria-label="Show the selections and values sent to the model"
      >
        <Info className="h-4 w-4" aria-hidden="true" />
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm sm:p-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            >
              <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-7">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                    Prediction inputs
                  </p>
                  <h2 id={titleId} className="mt-1 text-xl font-extrabold text-slate-950">
                    Values used for this result
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    These values were captured when the prediction was submitted.
                  </p>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  aria-label="Close input details"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </header>

              <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-7">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Selections used</h3>
                  <dl className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
                    {record.summary.map(([label, value]) => (
                      <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
                        <dt className="text-sm font-semibold text-slate-600">{label}</dt>
                        <dd className="text-sm text-slate-900 sm:text-right">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Numeric values sent to the model
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Values appear in the exact feature order expected by the selected model.
                  </p>
                  <div className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 p-4">
                    <code className="whitespace-nowrap font-mono text-sm leading-6 text-emerald-300">
                      [{record.features.join(", ")}]
                    </code>
                  </div>
                </div>
              </div>

              <footer className="flex justify-end border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-7">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                >
                  Done
                </button>
              </footer>
            </section>
          </div>,
          document.body
        )}
    </>
  );
}

function ResultPanel({ activeTab, record, error, loading }) {
  const config = TAB_CONFIG[activeTab];
  const result = record?.value;
  let formattedResult = null;

  if (typeof result === "number") {
    if (activeTab === "profit") {
      formattedResult = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(result);
    } else if (activeTab === "circularity") {
      formattedResult = `${result.toFixed(4)}%`;
    } else {
      formattedResult = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 4,
      }).format(result);
    }
  }

  return (
    <aside className="space-y-5 lg:sticky lg:top-6">
      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
            Prediction result
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">{config.label}</h2>
        </div>
        <div className="min-h-52 p-6" aria-live="polite">
          {loading ? (
            <div className="flex h-36 flex-col items-center justify-center text-slate-500">
              <Loader2 className="mb-3 h-7 w-7 animate-spin text-emerald-700" />
              Running the model…
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
              <div className="mb-1 flex items-center gap-2 font-bold">
                <AlertCircle className="h-4 w-4" /> Prediction failed
              </div>
              {error}
            </div>
          ) : formattedResult !== null ? (
            <div>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1">
                <p className="text-sm text-slate-500">Estimated value</p>
                <OutputInputDetails record={record} />
              </div>
              <p className="mt-1 break-words text-4xl font-extrabold tracking-tight text-slate-900">
                {formattedResult}
              </p>
            </div>
          ) : (
            <div className="flex h-36 flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <BarChart3 className="h-5 w-5" />
              </div>
              <p className="font-semibold text-slate-700">Your result will appear here</p>
              <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
                Complete the fields and run the prediction.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
          <Info className="h-4 w-4 text-emerald-700" /> Model coverage
        </div>
        <ul className="space-y-2 text-sm leading-6 text-slate-600">
          <li>{config.rows}</li>
          <li>Training years: 2020–2050</li>
          <li>{config.range}</li>
        </ul>
        <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
          Predictions are most reliable for inputs within the ranges represented in the training data.
        </p>
      </div>
    </aside>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("cost");
  const [cost, setCost] = useState(INITIAL_COST);
  const [circularity, setCircularity] = useState(INITIAL_CIRCULARITY);
  const [profit, setProfit] = useState(INITIAL_PROFIT);
  const [results, setResults] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (setter, key) => (event) =>
    setter((current) => ({ ...current, [key]: event.target.value }));

  const runPrediction = async (event, type, features, summary, predict) => {
    event.preventDefault();
    setLoading(true);
    setErrors((current) => ({ ...current, [type]: null }));

    try {
      const value = await predict(features);
      setResults((current) => ({
        ...current,
        [type]: { value, features: [...features], summary },
      }));
    } catch (requestError) {
      setResults((current) => ({ ...current, [type]: null }));
      setErrors((current) => ({
        ...current,
        [type]: requestError.message || "Unable to calculate a prediction.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <BatteryCharging className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold tracking-tight text-slate-900">BatteryCycle</p>
              <p className="text-xs text-slate-500">Recycling prediction models</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 sm:flex">
            <Leaf className="h-3.5 w-3.5" /> Research decision support
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <section className="mb-8 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="grid gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
                <Recycle className="h-3.5 w-3.5" /> Lithium-ion battery analytics
              </div>
              <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Explore recycling cost, circularity, and profit scenarios
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Choose values using the same categories and ranges represented in the research datasets. Each form converts your selections into the exact feature order required by its model.
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-700 p-6 text-white">
              <p className="text-sm font-semibold text-emerald-100">Dataset coverage</p>
              <p className="mt-2 text-3xl font-extrabold">478,608</p>
              <p className="mt-1 text-sm text-emerald-100">combined training records across three models</p>
            </div>
          </div>
        </section>

        <nav className="mb-7 grid gap-3 sm:grid-cols-3" aria-label="Prediction model">
          {Object.entries(TAB_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            const active = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                  active
                    ? "border-emerald-600 bg-emerald-700 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${active ? "text-emerald-100" : "text-emerald-700"}`} />
                  <span className="font-bold">{config.label}</span>
                </div>
                <p className={`mt-2 text-xs leading-5 ${active ? "text-emerald-100" : "text-slate-500"}`}>
                  {config.description}
                </p>
              </button>
            );
          })}
        </nav>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            {activeTab === "cost" && (
              <form
                className="space-y-5"
                onSubmit={(event) =>
                  runPrediction(
                    event,
                    "cost",
                    buildCostFeatures(cost),
                    getCostSummary(cost),
                    costPredict
                  )
                }
              >
                <Section title="Material and year" description="Select the output material and prediction year used by the cost model.">
                  <SelectField label="Material or impact indicator" help="The selected label is looked up in the 37-row material mapping." sentAs="One integer named Material, from 0 through 36. For example, Aluminum sends 1 and Copper sends 10." value={cost.material} onChange={update(setCost, "material")}>
                    {MATERIALS.map(([label, value]) => <option key={value} value={value}>{label}</option>)}
                  </SelectField>
                  <NumberField label="Year" help="The cost training data covers 2020 through 2050." sentAs="The entered whole number as Year, for example 2030." value={cost.year} onChange={update(setCost, "year")} min="2020" max="2050" />
                </Section>

                <Section title="Scenario" description="Choose one cathode chemistry and one collection or transportation route.">
                  <SelectField label="Cathode scenario" help="Select the battery cathode chemistry used in the scenario." sentAs="One integer named Cathode scenario: LFP sends 1; NCX sends 2." value={cost.cathode} onChange={update(setCost, "cathode")}>
                    <option value="1">LFP — lithium iron phosphate</option>
                    <option value="2">NCX — nickel-cobalt chemistry</option>
                  </SelectField>
                  <SelectField label="Location and transport scenario" help="Select where collection occurs and the transport mode used." sentAs="One integer named Location scenario: China truck and tanker = 1, US train = 2, US truck = 3." value={cost.transport} onChange={update(setCost, "transport")}>
                    <option value="1">China — truck and tanker</option>
                    <option value="2">United States — train</option>
                    <option value="3">United States — truck</option>
                  </SelectField>
                </Section>

                <Section title="Output configuration" description="These choices replace the raw 0/1 indicator fields from the training CSV.">
                  <SelectField label="Output category" help="Choose which cost or environmental-output category to estimate." sentAs="Three values in this order: recycling, collection and transportation, recovered materials. The selected category sends 1 and the others send 0; reference sends [0, 0, 0]." value={cost.category} onChange={update(setCost, "category")}>
                    <option value="reference">Reference / uncategorized output</option>
                    <option value="recycling">Environmental impact — recycling</option>
                    <option value="transport">Environmental impact — collection and transport</option>
                    <option value="recovered">Recovered materials</option>
                  </SelectField>
                  <SelectField label="Recycling process" help="Choose the process represented by the prediction row." sentAs="Four values in this order: All, Direct, Hydro, Pyro. The selected process sends 1 and the other three send 0." value={cost.process} onChange={update(setCost, "process")}>
                    <option value="all">All processes</option>
                    <option value="direct">Direct recycling</option>
                    <option value="hydro">Hydrometallurgical recycling</option>
                    <option value="pyro">Pyrometallurgical recycling</option>
                  </SelectField>
                  <SelectField label="Recycling location" help="Location of the recycling facility, separate from collection and transport." sentAs="Two values in this order: China, United States. China sends [1, 0]; United States sends [0, 1]." value={cost.recyclingLocation} onChange={update(setCost, "recyclingLocation")}>
                    <option value="china">China</option>
                    <option value="us">United States</option>
                  </SelectField>
                </Section>
                <SubmitButton loading={loading} label="Calculate cost output" />
              </form>
            )}

            {activeTab === "circularity" && (
              <form
                className="space-y-5"
                onSubmit={(event) =>
                  runPrediction(
                    event,
                    "circularity",
                    buildCircularityFeatures(circularity),
                    getCircularitySummary(circularity),
                    circularityPredict
                  )
                }
              >
                <Section title="Retired battery volume" description="Enter energy and mass values within the observed training ranges.">
                  <NumberField label="Year" help="The circularity training data covers 2020 through 2050." sentAs="The entered whole number as Year, for example 2030." value={circularity.year} onChange={update(setCircularity, "year")} min="2020" max="2050" />
                  <NumberField label="Retired energy capacity (kWh)" help="Total energy capacity of batteries reaching retirement. Observed range: 2,317,374.548 to 1,067,348,183 kWh." sentAs="The entered decimal number directly as kWh retired; no unit conversion is applied." value={circularity.kwhRetired} onChange={update(setCircularity, "kwhRetired")} min="2317374.548" max="1067348183" step="any" />
                  <NumberField label="Retired battery mass (kg)" help="Total mass of batteries reaching retirement. Observed range: 192,985.1338 to 3,419,526,039 kg." sentAs="The entered decimal number directly as kg retired; no unit conversion is applied." value={circularity.kgRetired} onChange={update(setCircularity, "kgRetired")} min="192985.1338" max="3419526039" step="any" />
                  <NumberField label="Battery energy (kWh)" help="The source column is named kWh. Observed range: 19,444,307.12 to 1,548,418,148." sentAs="The entered decimal number directly as kWh; no unit conversion is applied." value={circularity.kwh} onChange={update(setCircularity, "kwh")} min="19444307.12" max="1548418148" step="any" />
                </Section>

                <Section title="Collection and repurposing" description="Set the collection rate and select one repurposing scenario.">
                  <SelectField label="Collection rate" help="Share of retired batteries collected. The dataset uses 60% to 95% in 5-point increments." sentAs="One decimal named Collection rate. The displayed percentage is divided by 100; for example, 80% sends 0.8." value={circularity.collectionRate} onChange={update(setCircularity, "collectionRate")}>
                    {[60, 65, 70, 75, 80, 85, 90, 95].map((rate) => <option key={rate} value={rate / 100}>{rate}%</option>)}
                  </SelectField>
                  <SelectField label="Repurposing scenario" help="Qualitative low, medium, or high share of batteries repurposed before recycling." sentAs="Three values in this order: high, low, medium. High sends [1, 0, 0], low sends [0, 1, 0], and medium sends [0, 0, 1]." value={circularity.repurposing} onChange={update(setCircularity, "repurposing")}>
                    <option value="low">Low</option>
                    <option value="med">Medium</option>
                    <option value="high">High</option>
                  </SelectField>
                </Section>

                <Section title="Material and policy scenario" description="Choose the material indicator, process group, and global sales scenario.">
                  <SelectField label="Material indicator" help="Aluminum, cobalt, and copper have dedicated model indicators; all others use the reference group." sentAs="Three values in this order: Aluminum, Cobalt, Copper. The selected material sends 1; Other/reference sends [0, 0, 0]." value={circularity.material} onChange={update(setCircularity, "material")}>
                    <option value="reference">Other / reference material</option>
                    <option value="aluminum">Aluminum</option>
                    <option value="cobalt">Cobalt</option>
                    <option value="copper">Copper</option>
                  </SelectField>
                  <SelectField label="Recycling process group" help="The model has a dedicated indicator for pyrometallurgy; other processes form the reference group." sentAs="One value named Recycling process pyro. Pyrometallurgical sends 1; direct or hydrometallurgical sends 0." value={circularity.process} onChange={update(setCircularity, "process")}>
                    <option value="non-pyro">Direct or hydrometallurgical (reference)</option>
                    <option value="pyro">Pyrometallurgical</option>
                  </SelectField>
                  <SelectField label="Sales scenario" help="SDS is the Sustainable Development Scenario; STEPS is the Stated Policies Scenario." sentAs="Two values in this order: SDS, STEPS. SDS sends [1, 0]; STEPS sends [0, 1]." value={circularity.sales} onChange={update(setCircularity, "sales")}>
                    <option value="sds">SDS — Sustainable Development Scenario</option>
                    <option value="steps">STEPS — Stated Policies Scenario</option>
                  </SelectField>
                </Section>
                <SubmitButton loading={loading} label="Calculate circularity" />
              </form>
            )}

            {activeTab === "profit" && (
              <form
                className="space-y-5"
                onSubmit={(event) =>
                  runPrediction(
                    event,
                    "profit",
                    buildProfitFeatures(profit),
                    getProfitSummary(profit),
                    profitabilityPredict
                  )
                }
              >
                <Section title="Prediction year" description="Choose a year represented in the profit training dataset.">
                  <NumberField label="Year" help="The profit training data covers 2020 through 2050." sentAs="The entered whole number as Year, for example 2030." value={profit.year} onChange={update(setProfit, "year")} min="2020" max="2050" />
                </Section>

                <Section title="Recycling scenario" description="Select the recycling technology, cathode chemistry, and transport route.">
                  <SelectField label="Recycling process" help="Hydrometallurgy is represented by the model’s all-zero reference indicators." sentAs="Two values in this order: Direct, Pyro. Direct sends [1, 0], Pyro sends [0, 1], and Hydro sends [0, 0]." value={profit.process} onChange={update(setProfit, "process")}>
                    <option value="hydro">Hydrometallurgical recycling</option>
                    <option value="direct">Direct recycling</option>
                    <option value="pyro">Pyrometallurgical recycling</option>
                  </SelectField>
                  <SelectField label="Cathode scenario" help="Choose LFP or NCX cathode chemistry." sentAs="Two values in this order: LFP, NCX. LFP sends [1, 0]; NCX sends [0, 1]." value={profit.cathode} onChange={update(setProfit, "cathode")}>
                    <option value="lfp">LFP — lithium iron phosphate</option>
                    <option value="ncx">NCX — nickel-cobalt chemistry</option>
                  </SelectField>
                  <SelectField label="Location and transport scenario" help="Collection location and route used in the profitability scenario." sentAs="Three values in this order: China truck and tanker, US train, US truck. The selected route sends 1 and the others send 0." value={profit.transport} onChange={update(setProfit, "transport")}>
                    <option value="china-truck">China — truck and tanker</option>
                    <option value="us-train">United States — train</option>
                    <option value="us-truck">United States — truck</option>
                  </SelectField>
                </Section>

                <Section title="Commodity-price scenario" description="Choose a cobalt or nickel price case, or use the reference case.">
                  <SelectField label="Metal price scenario" help="Only one high or low commodity indicator can be active at a time." sentAs="Four values in this order: cobalt high, cobalt low, nickel high, nickel low. The selected case sends 1; the base case sends [0, 0, 0, 0]." value={profit.commodity} onChange={update(setProfit, "commodity")}>
                    <option value="base">Reference / base scenario</option>
                    <option value="cobalt-high">Cobalt — high</option>
                    <option value="cobalt-low">Cobalt — low</option>
                    <option value="nickel-high">Nickel — high</option>
                    <option value="nickel-low">Nickel — low</option>
                  </SelectField>
                </Section>
                <SubmitButton loading={loading} label="Calculate profit" />
              </form>
            )}
          </div>

          <ResultPanel activeTab={activeTab} record={results[activeTab]} error={errors[activeTab]} loading={loading} />
        </div>
      </div>

      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs leading-5 text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>Machine-learning estimates for lithium-ion battery recycling research.</p>
          <p>Use predictions within the documented training ranges.</p>
        </div>
      </footer>
    </main>
  );
}
