
import React, { useEffect, useState } from "react";
import SecondaryExcel from "./SecondaryExcel";
import { FiTrash2 } from "react-icons/fi";

const SUBJECTS = {
  English: [
    "Hindi",
    "English",
    "Sanskrit",
    "Mathematics",
    "Science",
    "Social Studies",
  ],
  Hindi: [
    "हिंदी",
    "अंग्रेज़ी",
    "संस्कृत",
    "गणित",
    "विज्ञान",
    "सामाजिक विज्ञान",
  ],
};

// Create empty subject data
const createEmptyClassData = () => {
  const data = {};

  Object.keys(SUBJECTS).forEach((medium) => {
    SUBJECTS[medium].forEach((subject) => {
      data[subject] = {
        name: "",
        number: "",
      };
    });
  });

  return data;
};

// Create new school
const createSchool = (code, name, medium) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  schoolCode: code,
  schoolName: name,
  medium,
  classes: {
    "Class 9": createEmptyClassData(),
    "Class 10": createEmptyClassData(),
  },
});

export default function SecondryRecord({ selectedLocation }) {

  // =====================================
  // STORAGE KEYS
  // =====================================

  const storageKey = `secondaryRecords_${encodeURIComponent(
    [
      selectedLocation?.state || "",
      selectedLocation?.division || "",
      selectedLocation?.area || "",
      selectedLocation?.agent || "",
      selectedLocation?.schoolType || "Secondary",
    ].join("__")
  )}`;

  const mediumStorageKey = `${storageKey}_medium`;

  // =====================================
  // STATES
  // =====================================

  const [schools, setSchools] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Search state - INSIDE COMPONENT
  const [searchSchool, setSearchSchool] = useState("");

  const [selectedMedium, setSelectedMedium] = useState(() => {
    return localStorage.getItem(mediumStorageKey) || "English";
  });

  const [loadedStorageKey, setLoadedStorageKey] = useState(storageKey);

  const [showForm, setShowForm] = useState(false);
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolName, setSchoolName] = useState("");

  // =====================================
  // LOAD RECORDS WHEN LOCATION CHANGES
  // =====================================

  useEffect(() => {
    setLoadedStorageKey(null);

    try {
      const saved = localStorage.getItem(storageKey);
      const parsed = saved ? JSON.parse(saved) : [];

      setSchools(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSchools([]);
    }

    const savedMedium = localStorage.getItem(mediumStorageKey);

    setSelectedMedium(
      savedMedium === "Hindi" ? "Hindi" : "English"
    );

    setLoadedStorageKey(storageKey);
  }, [storageKey, mediumStorageKey]);

  // =====================================
  // SAVE SCHOOL RECORDS
  // =====================================

  useEffect(() => {
    if (loadedStorageKey !== storageKey) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(schools));
    } catch (error) {
      console.error("Unable to save Secondary records:", error);
      alert("Storage is full. Please delete some records.");
    }
  }, [schools, storageKey, loadedStorageKey]);

  // =====================================
  // SAVE SELECTED MEDIUM
  // =====================================

  useEffect(() => {
    if (loadedStorageKey !== storageKey) return;

    localStorage.setItem(mediumStorageKey, selectedMedium);
  }, [selectedMedium, mediumStorageKey, loadedStorageKey, storageKey]);

  // =====================================
  // ADD SCHOOL
  // =====================================

  const handleAddSchool = (e) => {
    e.preventDefault();

    // School Name compulsory, School Code optional
    if (!schoolName.trim()) {
      alert("Please enter School Name.");
      return;
    }

    const newSchool = createSchool(
      schoolCode.trim(),
      schoolName.trim(),
      selectedMedium
    );

    setSchools((prev) => [...prev, newSchool]);

    setSchoolCode("");
    setSchoolName("");
    setShowForm(false);
  };

  // =====================================
  // UPDATE SUBJECT NAME OR NUMBER
  // =====================================

  const handleInputChange = (
    schoolId,
    className,
    subject,
    field,
    value
  ) => {
    setSchools((prev) =>
      prev.map((school) => {
        if (school.id !== schoolId) return school;

        return {
          ...school,
          classes: {
            ...school.classes,
            [className]: {
              ...school.classes[className],
              [subject]: {
                ...(school.classes[className]?.[subject] || {}),
                [field]: value,
              },
            },
          },
        };
      })
    );
  };

  // =====================================
  // DELETE SCHOOL
  // =====================================

  const handleDeleteSchool = (schoolId) => {
    if (!window.confirm("Are you sure you want to delete this school?")) {
      return;
    }

    setSchools((prev) =>
      prev.filter((school) => school.id !== schoolId)
    );
  };

  // =====================================
  // SELECTED SUBJECTS
  // =====================================

  const visibleSubjects = SUBJECTS[selectedMedium];

  // =====================================
  // SEARCH SCHOOL
  // =====================================

  const filteredSchools = schools.filter((school) => {
    const search = searchSchool
      .trim()
      .toLocaleLowerCase("hi-IN");

    const schoolName = (school.schoolName || "")
      .trim()
      .toLocaleLowerCase("hi-IN");

    const schoolCode = (school.schoolCode || "")
      .trim()
      .toLocaleLowerCase("hi-IN");

    return (
      schoolName.includes(search) ||
      schoolCode.includes(search)
    );
  });

  // =====================================
  // STICKY COLUMN STYLE
  // =====================================

  const stickyStyle = (column, isHeader = false) => {
    const positions = {
      action: { left: 0, width: 110 },
      serial: { left: 110, width: 80 },
      code: { left: 190, width: 150 },
      name: { left: 340, width: 220 },
      class: { left: 560, width: 130 },
    };

    const position = positions[column];

    return {
      position: "sticky",
      left: position.left,
      width: position.width,
      minWidth: position.width,
      maxWidth: position.width,
      backgroundColor: isHeader ? "#DBEAFE" : "#FFFFFF",
      zIndex: isHeader ? 50 : 20,
      backgroundClip: "padding-box",
    };
  };

  

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* LOCATION DETAILS */}

      <div className="mt-2 flex flex-wrap items-center gap-6 text-lg">

        <span className="font-bold text-black">
          State:
          <b className="ml-1">
            {selectedLocation?.state || "Not Selected"}
          </b>
        </span>

        <span className="font-bold text-black">
          Division:
          <b className="ml-1">
            {selectedLocation?.division || "Not Selected"}
          </b>
        </span>

        <span className="font-bold text-black">
          Area:
          <b className="ml-1">
            {selectedLocation?.area || "Not Selected"}
          </b>
        </span>

        <span className="font-bold text-black">
          Agent:
          <b className="ml-1">
            {selectedLocation?.agent || "Not Selected"}
          </b>
        </span>

      </div>

      {/* HEADER AND MEDIUM SELECTION */}

      <div className="mb-6 mt-8 flex flex-wrap items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <label className="font-semibold text-gray-800">
            Select Medium:
          </label>

          <select
            value={selectedMedium}
            onChange={(e) => setSelectedMedium(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium outline-none focus:border-blue-500"
          >
            <option value="English">English Medium</option>
            <option value="Hindi">Hindi Medium</option>
          </select>

        </div>

        {/* EXCEL IMPORT / EXPORT */}

        <SecondaryExcel
          schools={schools}
          setSchools={setSchools}
          selectedLocation={selectedLocation}
        />

        {/* SEARCH SCHOOL */}

        <div className="mb-4">

          <input
            type="text"
            value={searchSchool}
            onChange={(e) => setSearchSchool(e.target.value)}
            placeholder="Search by School Code or School Name..."
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 md:w-96"
          />

        </div>

        {/* ADD SCHOOL BUTTON */}

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-xl font-semibold text-white hover:bg-blue-700"
        >
          {showForm ? "Close Form" : "+ Add School"}
        </button>

      </div>

      {/* ADD SCHOOL FORM */}

      {showForm && (

        <form
          onSubmit={handleAddSchool}
          className="mb-4 rounded-xl border bg-white p-5 shadow-sm"
        >

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* SCHOOL CODE OPTIONAL */}

            <div>

              <label className="mb-1 block text-sm font-medium">
                School Code
                <span className="text-gray-400"> (Optional)</span>
              </label>

              <input
                type="text"
                value={schoolCode}
                onChange={(e) => setSchoolCode(e.target.value)}
                placeholder="Enter School Code"
                className="w-full rounded-lg border p-2.5 outline-none focus:border-blue-500"
              />

            </div>

            {/* SCHOOL NAME REQUIRED */}

            <div>

              <label className="mb-1 block text-sm font-medium">
                School Name
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Enter School Name"
                className="w-full rounded-lg border p-2.5 outline-none focus:border-blue-500"
                required
              />

            </div>

          </div>

          <button
            type="submit"
            className="mt-5 rounded-lg bg-green-600 px-6 py-2.5 font-semibold text-white hover:bg-green-700"
          >
            Save School
          </button>

        </form>

      )}

      {/* RECORDS TABLE */}

      <div className="max-h-[75vh] overflow-auto rounded-xl border border-gray-500">

        <table className="w-max min-w-full border-separate border-spacing-0 text-xl">

          <thead>

            {/* MAIN HEADER */}

            <tr>

              <th
                rowSpan={2}
                style={{
                  ...stickyStyle("action", true),
                  top: 0,
                  zIndex: 100,
                }}
                className="border border-gray-500 bg-blue-100 p-3 text-center"
              >
                Action
              </th>

              <th
                rowSpan={2}
                style={{
                  ...stickyStyle("serial", true),
                  top: 0,
                  zIndex: 100,
                }}
                className="border border-gray-500 bg-blue-100 p-3 text-center"
              >
                S.No.
              </th>

              <th
                rowSpan={2}
                style={{
                  ...stickyStyle("code", true),
                  top: 0,
                  zIndex: 100,
                }}
                className="border border-gray-500 bg-blue-100 p-3 text-center"
              >
                School Code
              </th>

              <th
                rowSpan={2}
                style={{
                  ...stickyStyle("name", true),
                  top: 0,
                  zIndex: 100,
                }}
                className="border border-gray-500 bg-blue-100 p-3 text-center"
              >
                School Name
              </th>

              <th
                rowSpan={2}
                style={{
                  ...stickyStyle("class", true),
                  top: 0,
                  zIndex: 100,
                }}
                className="border border-gray-500 bg-blue-100 p-3 text-center"
              >
                Class
              </th>

              {visibleSubjects.map((subject) => (

                <th
                  key={subject}
                  colSpan={2}
                  className="sticky top-0 z-50 min-w-[220px] border border-gray-500 bg-blue-100 p-3 text-center"
                >
                  {subject}
                </th>

              ))}

            </tr>

            {/* SECOND HEADER */}

            <tr>

              {visibleSubjects.map((subject) => (

                <React.Fragment key={subject}>

                  <th className="sticky top-[58px] z-50 min-w-[110px] border border-gray-500 bg-blue-100 p-2 text-center">
                    Name
                  </th>

                  <th className="sticky top-[58px] z-50 min-w-[110px] border border-gray-500 bg-blue-100 p-2 text-center">
                    Number
                  </th>

                </React.Fragment>

              ))}

            </tr>

          </thead>

          <tbody>

            {filteredSchools.map((school, schoolIndex) => (

              <React.Fragment key={school.id}>

                {["Class 9", "Class 10"].map(
                  (className, classIndex) => (

                    <tr
                      key={className}
                      className="hover:bg-blue-50"
                    >

                      {/* ACTION */}

                      {classIndex === 0 && (

                        <td
                          rowSpan={2}
                          style={{
                            ...stickyStyle("action"),
                            zIndex: 30,
                          }}
                          className="border border-gray-500 bg-white p-2 text-center"
                        >

                          <button
                            onClick={() => handleDeleteSchool(school.id)}
                            title="Delete School"
                            className="rounded p-2 text-red-500 transition hover:bg-red-100 hover:text-red-700"
                          >
                            <FiTrash2 size={20} />
                          </button>

                        </td>

                      )}

                      {/* SERIAL NUMBER */}

                      {classIndex === 0 && (

                        <td
                          rowSpan={2}
                          style={{
                            ...stickyStyle("serial"),
                            zIndex: 30,
                          }}
                          className="border border-gray-500 bg-white p-2 text-center"
                        >
                          {schoolIndex + 1}
                        </td>

                      )}

                      {/* SCHOOL CODE */}

                      {classIndex === 0 && (

                        <td
                          rowSpan={2}
                          style={{
                            ...stickyStyle("code"),
                            zIndex: 30,
                          }}
                          className="border border-gray-500 bg-white p-2 text-center font-medium"
                        >
                          {school.schoolCode}
                        </td>

                      )}

                      {/* SCHOOL NAME */}

                      {classIndex === 0 && (

                        <td
                          rowSpan={2}
                          style={{
                            ...stickyStyle("name"),
                            zIndex: 30,
                          }}
                          className="border border-gray-500 bg-white p-2 font-medium"
                        >
                          {school.schoolName}
                        </td>

                      )}

                      {/* CLASS */}

                      <td
                        style={{
                          ...stickyStyle("class"),
                          zIndex: 30,
                        }}
                        className="border border-gray-500 bg-gray-50 p-3 text-center font-bold"
                      >
                        {className}
                      </td>

                      {/* SUBJECT DATA */}

                      {visibleSubjects.map((subject) => {

                        const subjectData =
                          school.classes?.[className]?.[subject] || {
                            name: "",
                            number: "",
                          };

                        return (

                          <React.Fragment key={subject}>

                            {/* NAME */}

                            <td className="min-w-[110px] border border-gray-500 bg-white p-1">

                              <input
                                type="text"
                                value={subjectData.name || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    school.id,
                                    className,
                                    subject,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="w-full min-w-[100px] rounded border border-gray-300 p-2 outline-none focus:border-blue-500"
                              />

                            </td>

                            {/* NUMBER */}

                            <td className="min-w-[110px] border border-gray-500 bg-white p-1">

                              <input
                                type="text"
                                value={subjectData.number || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    school.id,
                                    className,
                                    subject,
                                    "number",
                                    e.target.value
                                  )
                                }
                                className="w-full min-w-[100px] rounded border border-gray-300 p-2 outline-none focus:border-blue-500"
                              />

                            </td>

                          </React.Fragment>

                        );

                      })}

                    </tr>

                  )
                )}

              </React.Fragment>

            ))}

            {/* EMPTY DATA */}

            {filteredSchools.length === 0 && (

              <tr>

                <td
                  colSpan={5 + visibleSubjects.length * 2}
                  className="border border-gray-500 bg-white p-10 text-center text-gray-500"
                >
                  {searchSchool.trim()
                    ? "No matching school found."
                    : "No school records found. Click Add School to begin."}
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
