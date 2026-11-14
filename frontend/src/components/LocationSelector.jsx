import React, { useState } from "react";
import locationData from "../data/Data";

export default function LocationSelector({ onContinue }) {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");

  // ==============================
  // STATES
  // ==============================

  const states = Object.keys(locationData);

  // ==============================
  // DIVISIONS
  // ==============================

  const divisions = selectedState
    ? Object.keys(locationData[selectedState] || {})
    : [];

  // ==============================
  // AREAS
  // ==============================

  const areas =
    selectedState && selectedDivision
      ? locationData[selectedState]?.[selectedDivision]?.areas || []
      : [];

  // ==============================
  // AGENTS
  // ==============================

  const agents =
    selectedState && selectedDivision
      ? locationData[selectedState]?.[selectedDivision]?.agents || []
      : [];

  // ==============================
  // STATE CHANGE
  // ==============================

  const handleStateChange = (e) => {
    const value = e.target.value;

    setSelectedState(value);
    setSelectedDivision("");
    setSelectedArea("");
    setSelectedAgent("");
  };

  // ==============================
  // DIVISION CHANGE
  // ==============================

  const handleDivisionChange = (e) => {
    const value = e.target.value;

    setSelectedDivision(value);
    setSelectedArea("");
    setSelectedAgent("");
  };

  // ==============================
  // AREA CHANGE
  // ==============================

  const handleAreaChange = (e) => {
    const value = e.target.value;

    setSelectedArea(value);
    setSelectedAgent("");
  };

  // ==============================
  // AGENT CHANGE
  // ==============================

  const handleAgentChange = (e) => {
    const value = e.target.value;

    setSelectedAgent(value);
  };

  // ==============================
  // CONTINUE
  // ==============================

  const handleContinue = () => {
    if (
      !selectedState ||
      !selectedDivision ||
      !selectedArea ||
      !selectedAgent
    ) {
      alert("Please select State, Division, Area and Agent.");
      return;
    }

    onContinue({
      state: selectedState,
      division: selectedDivision,
      area: selectedArea,
      agent: selectedAgent,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* ================= HEADER ================= */}

        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 px-10 py-8 text-white">

          <h1 className="text-2xl font-bold">
            School Book Distribution CRM
          </h1>
  
          <p className="mt-2 text-xl font-bold text-white text-center"> 
            Select State, Division, Area and Agent
          </p>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="p-6">

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* ================= STATE ================= */}

            <div>
              <label className="mb-2 block  font-bold text-xl text-black">
                State :
              </label>

              <select
                value={selectedState}
                onChange={handleStateChange}
                className="w-full rounded-xl border border-slate-300  px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2  text-xl font-bold"
              >
                <option value="">
                  Select State :
                </option>

                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* ================= DIVISION ================= */}

            <div>
              <label className="mb-2 block font-bold text-xl text-black">
                Division :
              </label>

              <select
                value={selectedDivision}
                onChange={handleDivisionChange}
                disabled={!selectedState}
                className="w-full rounded-xl border border-slate-300  px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2  text-xl font-bold"
              >
                <option value="">
                  Select Division
                </option>

                {divisions.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
            </div>

            {/* ================= AREA ================= */}

            <div>
              <label className="mb-2 block  font-bold text-xl text-black">
                Area :
              </label>

              <select
                value={selectedArea}
                onChange={handleAreaChange}
                disabled={!selectedDivision}
                className="w-full rounded-xl border border-slate-300  px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2  text-xl font-bold"
                
              >
                <option value="">
                  Select Area
                </option>

                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* ================= AGENT ================= */}

            <div>
              <label className="mb-2 block  font-bold text-xl text-black">
                Agent
              </label>

              <select
                value={selectedAgent}
                onChange={handleAgentChange}
                disabled={!selectedArea}
                className="w-full rounded-xl border border-slate-300  px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2  text-xl font-bold"
              >
                <option value="">
                  Select Agent
                </option>

                {agents.map((agent) => (
                  <option key={agent} value={agent}>
                    {agent}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* ================= SELECTED PATH ================= */}

          {selectedState &&
            selectedDivision &&
            selectedArea &&
            selectedAgent && (
              <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">

                <p className=" font-bold text-xl text-black">
                  Selected Location
                </p>

                <p className="mt-2 text-lg font-bold text-slate-800">
                  {selectedState} / {selectedDivision} / {selectedArea}
                </p>

                <p className="mt-1 font-semibold text-indigo-600">
                  Agent: {selectedAgent}
                </p>

              </div>
            )}

          {/* ================= CONTINUE ================= */}
<div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">

  <button
    onClick={() =>
      onContinue({
        state: selectedState,
        division: selectedDivision,
        area: selectedArea,
        agent: selectedAgent,
        schoolType: "Secondary"
      })
    }
    disabled={!selectedAgent}
    className="rounded-xl bg-blue-600 p-6 font-bold text-white disabled:opacity-40"
  >
    Secondary (Class 9 & 10)
  </button>

  <button
    onClick={() =>
      onContinue({
        state: selectedState,
        division: selectedDivision,
        area: selectedArea,
        agent: selectedAgent,
        schoolType: "Higher Secondary"
      })
    }
    disabled={!selectedAgent}
    className="rounded-xl bg-green-600 p-6 font-bold text-white disabled:opacity-40"
  >
    Higher Secondary (Class 11 & 12)
  </button>

</div> 

        </div>
      </div>
    </div>
  );
}