import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  FiBookOpen,
  FiPlus,
  FiDownload,
  FiUsers,
} from "react-icons/fi";

import SchoolTable from "../components/SchoolTable";
import ImportExcel from "../components/ImportExcel";


export default function SchoolRecords() {
const [selectedSchool, setSelectedSchool] = useState(null);
const [selectedSubject, setSelectedSubject] = useState("");

  const [schools, setSchools] = useState([]);

const [subjects, setSubjects] = useState([
  "Science",
  "Commerce",
  "Arts",
  "Agriculture",
  "Bharti"
]);
const createSubjectData = () => {
  const data = {};

  subjects.forEach((subject) => {
    data[subject] = [
      {
        teacherName: "",
        number: "",
        qty: "",
      },
    ];
  });

  return data;
};
const handleInputChange = (
  schoolIndex,
  subject,
  rowIndex,
  field,
  value
) => {
  setSchools((prev) => {
    const updated = [...prev];

    if (field === "grade") {
      updated[schoolIndex].grade = value;
    } else {
      if (!updated[schoolIndex].subjects[subject][rowIndex]) {
        updated[schoolIndex].subjects[subject][rowIndex] = {
          teacherName: "",
          number: "",
          qty: "",
        };
      }

      updated[schoolIndex].subjects[subject][rowIndex][field] = value;
    }

    return updated;
  });
};
console.log("SchoolRecords Data:", schools);

const handleExport = () => {

  // STEP 1
  const data = [];

  const header1 = [
    "Code",
    "School Name",
    "Grade",
  ];

  subjects.forEach((subject) => {
    header1.push(subject);
    header1.push("");
    header1.push("");
  });

  data.push(header1);

  const header2 = [
    "",
    "",
    "",
  ];

  subjects.forEach(() => {
    header2.push("Name");
    header2.push("Number");
    header2.push("Qty");
  });

  data.push(header2);

  // ==========================
  // STEP 2
  // ==========================
schools.forEach((school) => {

  const maxRows = Math.max(
    1,
    ...subjects.map(subject =>
      school.subjects?.[subject]?.length || 0
    )
  );

  for (let i = 0; i < maxRows; i++) {

    const row = [];

    if (i === 0) {
      row.push(
        school.code,
        school.schoolName,
        school.grade
      );
    } else {
      row.push("", "", "");
    }

    subjects.forEach(subject => {

      const teacher =
        school.subjects?.[subject]?.[i];

      row.push(teacher?.teacherName || "");
      row.push(teacher?.number || "");
      row.push(teacher?.qty || "");

    });

    data.push(row);

  }

});
const worksheet2 = XLSX.utils.aoa_to_sheet(data);
  // ==========================
  // STEP 3
  // (YAHAN ADD KARNA HAI)
  // ==========================

  worksheet2["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 1, c: 0 },
    },
    {
      s: { r: 0, c: 1 },
      e: { r: 1, c: 1 },
    },
    {
      s: { r: 0, c: 2 },
      e: { r: 1, c: 2 },
    },
  ];

  let col = 3;

  subjects.forEach(() => {
    worksheet2["!merges"].push({
      s: { r: 0, c: col },
      e: { r: 0, c: col + 2 },
    });

    col += 3;
  });

  // ==========================
  // STEP 4
  // (STEP 3 KE JUST NICHE)
  // ==========================

  worksheet2["!cols"] = [
    { wch: 15 },
    { wch: 40 },
    { wch: 12 },

    ...subjects.flatMap(() => [
      { wch: 25 },
      { wch: 18 },
      { wch: 10 },
    ]),
  ];

  // ==========================
  // STEP 5
  // ==========================

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet2,
    "School Records"
  );
XLSX.writeFile(
  workbook,
  "School_Records.xlsx"
);
  // Part 2 me yahan data rows aur writeFile aayega.
};
const handleDeleteSchool = (schoolIndex) => {
  if (schoolIndex < 0) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this school?"
  );

  if (!confirmDelete) return;

  setSchools((prev) =>
    prev.filter((_, index) => index !== schoolIndex)
  );
};
const handleDeleteSubject = (subject) => {
  const confirmDelete = window.confirm(
    `Delete "${subject}" from ALL schools?`
  );

  if (!confirmDelete) return;

  // Subject list se remove
  setSubjects((prev) => prev.filter((s) => s !== subject));

  // Har school ke subjects object se remove
  setSchools((prev) =>
    prev.map((school) => {
      const updatedSubjects = { ...school.subjects };
      delete updatedSubjects[subject];

      return {
        ...school,
        subjects: updatedSubjects,
      };
    })
  );
};
const addTeacherRow = () => {
  if (selectedSchool === null) {
    alert("Please select a school");
    return;
  }

  if (!selectedSubject) {
    alert("Please select a subject");
    return;
  }

  setSchools((prev) =>
    prev.map((school, index) => {
      if (index !== selectedSchool) return school;

      return {
        ...school,
        subjects: {
          ...school.subjects,
          [selectedSubject]: [
            ...(school.subjects[selectedSubject] || []),
            {
              teacherName: "",
              number: "",
              qty: "",
            },
          ],
        },
      };
    })
  );
};
  return (

    <div className="min-h-screen bg-slate-100 p-8 space-y-8">


      {/* ================= HEADER ================= */}


      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-10 shadow-2xl">



        {/* Background Effects */}

        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"></div>

        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>

        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl"></div>



        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">



          {/* LEFT CONTENT */}


          <div>


            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-slate-100 backdrop-blur-xl">


              <FiBookOpen className="text-cyan-300" />

              School Book Distribution CRM


            </div>




            <h1 className="mt-6 text-4xl font-black tracking-tight text-white">

              School Records

            </h1>




            <p className="mt-4 max-w-xl text-lg text-slate-300">

              Manage schools, teachers, subjects, phone numbers and book
              quantities from one smart dashboard.

            </p>



          </div>





          {/* RIGHT BUTTONS */}


          <div className="flex flex-wrap gap-4">



            {/* IMPORT EXCEL BUTTON */}

            <ImportExcel
  setSchools={setSchools}
  subjects={subjects}
/>





        
<button
  className="
    group
    flex
    items-center
    gap-2
    rounded-2xl
    bg-white
    px-6
    py-3
    font-semibold
    text-slate-900
    shadow-lg
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-2xl
  "
  onClick={() => {
    const newSubject = prompt("Enter Subject Name");

    if (!newSubject) return;

    const subject = newSubject.trim();

    if (subject === "") return;

    if (subjects.includes(subject)) {
      alert("Subject already exists");
      return;
    }

setSubjects((prev) => [...prev, subject]);

setSchools((prevSchools) =>
  prevSchools.map((school) => ({
    ...school,
    subjects: {
      ...school.subjects,
      [subject]: [
  {
    teacherName: "",
    number: "",
    qty: "",
  },
]
    },
  }))
);  }}
>
  <FiPlus className="transition group-hover:rotate-90" />
  Add Subject
</button>






            <button 
            onClick={handleExport}
            className="
            group 
            flex 
            items-center 
            gap-2 
            rounded-2xl 
            bg-cyan-500 
            px-6 
            py-3 
            font-semibold 
            text-white 
            shadow-lg 
            transition-all 
            duration-300 
            hover:-translate-y-1 
            hover:bg-cyan-600
            "
            >


              <FiDownload />

              Export Excel


            </button>








   <button
  className="
    group
    flex
    items-center
    gap-2
    rounded-2xl
    border
    border-white/20
    bg-white/10
    px-6
    py-3
    font-semibold
    text-white
    backdrop-blur-xl
    transition-all
    duration-300
    hover:-translate-y-1
    hover:bg-white/20
  "
  onClick={() => {
    const code = prompt("Enter School Code");
    if (code === null) return;

    const schoolName = prompt("Enter School Name");
    if (schoolName === null) return;

    if (code.trim() === "" || schoolName.trim() === "") {
      alert("School Code and School Name are required.");
      return;
    }

   setSchools((prev) => [
  ...prev,
  {
    code: code.trim(),
    schoolName: schoolName.trim(),
    grade: "",
    subjects: createSubjectData(),
  },
]);
  }}
>
  <FiUsers />
  Add School
</button>

          </div>



        </div>





        {/* Bottom Line */}

        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"></div>


      </div>





<div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow">
  <select
  value={selectedSchool ?? ""}
  onChange={(e) => {
    const value = e.target.value;
    setSelectedSchool(value === "" ? null : Number(value));
  }}
>
    <option value="">Select School</option>
    {schools.map((school, index) => (
      <option key={index} value={index}>
        {school.schoolName}
      </option>
    ))}
  </select>

  <select
    value={selectedSubject}
    onChange={(e) => setSelectedSubject(e.target.value)}
    className="border rounded-lg px-3 py-2"
  >
    <option value="">Select Subject</option>
    {subjects.map((subject) => (
      <option key={subject} value={subject}>
        {subject}
      </option>
    ))}
  </select>

  <button
    onClick={addTeacherRow}
    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
  >
    + Add Teacher Row
  </button>
</div>

      {/* ================= TABLE ================= */}



<SchoolTable
  schools={schools}
  subjects={subjects}
  selectedSchool={selectedSchool}
  handleInputChange={handleInputChange}
  handleDeleteSchool={handleDeleteSchool}
  handleDeleteSubject={handleDeleteSubject}
/>




    </div>

  );

}