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

  const subjectGroups = {
    Science: ["Chemistry", "Physics", "Botany", "Biology"],
    Commerce: ["Commerce", "Accounts", "BSt", "Economics"],
    Arts: ["Arts", "Geography", "History", "Civis"],
    Agriculture: [
      "Agriculture1",
      "Agriculture2",
      "Agriculture3",
      "Agriculture4",
    ],
    Bharti: [
      "Bharti1",
      "Bharti2",
      "Bharti3",
      "Bharti4",
    ],
  };

  const mediums = ["English Medium", "Hindi Medium"];

  subjects.forEach((subject) => {
    if (subjectGroups[subject]) {
      data[subject] = {};

      mediums.forEach((medium) => {
        data[subject][medium] = {};

        subjectGroups[subject].forEach((sub) => {
          data[subject][medium][sub] = [];
        });
      });
    } else {
      data[subject] = [];
    }
  });

  return data;
};
const handleInputChange = (
  schoolIndex,
  subject,
  rowIndex,
  field,
  value,
  medium,
  subSubject
) => {
  setSchools((prev) => {
    const updated = [...prev];

    // Grade
    if (field === "grade") {
      updated[schoolIndex].grade = value;
      return updated;
    }
    if (field === "remark") {
  if (!updated[schoolIndex].subjects[subject]) {
    updated[schoolIndex].subjects[subject] = {};
  }

  updated[schoolIndex].subjects[subject].remark = value;
  return updated;
}
    // Grouped Subjects
    if (medium && subSubject) {
      if (!updated[schoolIndex].subjects[subject]) {
        updated[schoolIndex].subjects[subject] = {};
      }

      if (!updated[schoolIndex].subjects[subject][medium]) {
        updated[schoolIndex].subjects[subject][medium] = {};
      }

      if (!updated[schoolIndex].subjects[subject][medium][subSubject]) {
        updated[schoolIndex].subjects[subject][medium][subSubject] = [];
      }

      if (
        !updated[schoolIndex].subjects[subject][medium][subSubject][rowIndex]
      ) {
        updated[schoolIndex].subjects[subject][medium][subSubject][rowIndex] = {
          teacherName: "",
          number: "",
          qty: "",
        };
      }

      updated[schoolIndex].subjects[subject][medium][subSubject][rowIndex][field] =
        value;

      return [...updated];
    }

    // Normal Subjects
    if (!updated[schoolIndex].subjects[subject]) {
      updated[schoolIndex].subjects[subject] = [];
    }

    if (!updated[schoolIndex].subjects[subject][rowIndex]) {
      updated[schoolIndex].subjects[subject][rowIndex] = {
        teacherName: "",
        number: "",
        qty: "",
      };
    }

    updated[schoolIndex].subjects[subject][rowIndex][field] = value;

    return [...updated];
  });
};
console.log("SchoolRecords Data:", schools);
const handleExport = (type = "all") => {
  const data = [];

  const subjectGroups = {
    Science: ["Chemistry", "Physics", "Botany", "Biology"],
    Commerce: ["Commerce", "Accounts", "BSt", "Economics"],
    Arts: ["Arts", "Geography", "History", "Civis"],
    Agriculture: [
      "Agriculture1",
      "Agriculture2",
      "Agriculture3",
      "Agriculture4",
    ],
    Bharti: [
      "Bharti1",
      "Bharti2",
      "Bharti3",
      "Bharti4",
    ],
  };

  const mediums = ["English Medium", "Hindi Medium"];

  // ---------------- HEADER ----------------

  const header1 = ["Code", "School Name", "Grade"];
  const header2 = ["", "", ""];
  const header3 = ["", "", ""];
  const header4 = ["", "", ""];

  subjects.forEach((subject) => {
    if (subjectGroups[subject]) {
      header1.push(subject);
      for (let i = 1; i < subjectGroups[subject].length * mediums.length * 3 +1; i++) {
        header1.push("");
      }

      mediums.forEach((medium) => {
        header2.push(medium);
        for (let i = 1; i < subjectGroups[subject].length * 3; i++) {
          header2.push("");
        }

        subjectGroups[subject].forEach((sub) => {
          header3.push(sub, "", "");
          header4.push("Teacher", "Number", "Qty");
        });
      });
      // Remark Column
header2.push("Remark");
header3.push("");
header4.push("");
    } else {
      header1.push(subject, "", "");
      header2.push("", "", "");
      header3.push("", "", "");
      header4.push("Teacher", "Number", "Qty");
    }
  });

  data.push(header1);
  data.push(header2);
  data.push(header3);
  data.push(header4);
 const hasData = (school) => {
  return subjects.some((subject) => {
    const subjectData = school.subjects?.[subject];

    if (!subjectData) return false;

    // Normal Subject
    if (Array.isArray(subjectData)) {
      return subjectData.some(
        (row) =>
          row.teacherName?.trim() ||
          row.number?.trim() ||
          row.qty
      );
    }

    // Group Subject
    return Object.keys(subjectData).some((medium) => {
      const mediumData = subjectData[medium];

      return Object.keys(mediumData).some((subSubject) => {
        const rows = mediumData[subSubject];

        if (!Array.isArray(rows)) return false;

        return rows.some(
          (row) =>
            row.teacherName?.trim() ||
            row.number?.trim() ||
            row.qty
        );
      });
    });
  });
};
  // ---------------- DATA ----------------

  schools.forEach((school) => {
    const filled = hasData(school);

if (type === "filled" && !filled) return;

if (type === "empty" && filled) return;
    let maxRows = 1;

    subjects.forEach((subject) => {
      if (subjectGroups[subject]) {
        mediums.forEach((medium) => {
          subjectGroups[subject].forEach((sub) => {
            const len =
              school.subjects?.[subject]?.[medium]?.[sub]?.length || 0;

            if (len > maxRows) maxRows = len;
          });
        });
      } else {
        const len = school.subjects?.[subject]?.length || 0;
        if (len > maxRows) maxRows = len;
      }
    });

    for (let r = 0; r < maxRows; r++) {
      const row = [];

      if (r === 0) {
        row.push(school.code, school.schoolName, school.grade);
      } else {
        row.push("", "", "");
      }

      subjects.forEach((subject) => {
        if (subjectGroups[subject]) {
          mediums.forEach((medium) => {
            subjectGroups[subject].forEach((sub) => {
              const teacher =
                school.subjects?.[subject]?.[medium]?.[sub]?.[r];

              row.push(
                teacher?.teacherName || "",
                teacher?.number || "",
                teacher?.qty || ""
              );
            });
          });
          // Remark
if (r === 0) {
  row.push(
    school.subjects?.[subject]?.remark || ""
  );
} else {
  row.push("");
}
        } else {
          const teacher = school.subjects?.[subject]?.[r];

          row.push(
            teacher?.teacherName || "",
            teacher?.number || "",
            teacher?.qty || ""
          );
        }
      });

      data.push(row);
    }
  });

  // ---------------- SHEET ----------------

  const ws = XLSX.utils.aoa_to_sheet(data);

  ws["!cols"] = data[0].map(() => ({
    wch: 18,
  }));

  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 3, c: 0 } },
    { s: { r: 0, c: 1 }, e: { r: 3, c: 1 } },
    { s: { r: 0, c: 2 }, e: { r: 3, c: 2 } },
  ];

  let col = 3;

  subjects.forEach((subject) => {
    if (subjectGroups[subject]) {
      const subjectCols =
  subjectGroups[subject].length *
  mediums.length *
  3 +
  1; // +1 for Remark

      ws["!merges"].push({
        s: { r: 0, c: col },
        e: { r: 0, c: col + subjectCols - 1 },
      });

      mediums.forEach((medium) => {
        const mediumStart = col;

        ws["!merges"].push({
          s: { r: 1, c: mediumStart },
          e: {
            r: 1,
            c: mediumStart + subjectGroups[subject].length * 3 - 1,
          },
        });

        let c = mediumStart;

        subjectGroups[subject].forEach(() => {
          ws["!merges"].push({
            s: { r: 2, c },
            e: { r: 2, c: c + 2 },
          });

          c += 3;
        });

        col += subjectGroups[subject].length * 3;
      });
      // Merge Remark
ws["!merges"].push({
  s: { r: 1, c: col },
  e: { r: 3, c: col },
});

col += 1;
    } else {
      ws["!merges"].push({
        s: { r: 0, c: col },
        e: { r: 2, c: col + 2 },
      });

      col += 3;
    }
  });

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    "School Records"
  );

  XLSX.writeFile(wb, "School_Records.xlsx");
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

  const subjectGroups = {
    Science: ["Chemistry", "Physics", "Botany", "Biology"],
    Commerce: ["Commerce", "Accounts", "BSt", "Economics"],
    Arts: ["Arts", "Geography", "History", "Civis"],
    Agriculture: [
      "Agriculture1",
      "Agriculture2",
      "Agriculture3",
      "Agriculture4",
    ],
    Bharti: [
      "Bharti1",
      "Bharti2",
      "Bharti3",
      "Bharti4",
    ],
  };

  const mediums = ["English Medium", "Hindi Medium"];

  setSchools((prev) =>
    prev.map((school, index) => {
      if (index !== selectedSchool) return school;

      const updatedSubjects = { ...school.subjects };

      // Group Subject
      if (subjectGroups[selectedSubject]) {
        if (!updatedSubjects[selectedSubject]) {
          updatedSubjects[selectedSubject] = {};
        }

        mediums.forEach((medium) => {
          if (!updatedSubjects[selectedSubject][medium]) {
            updatedSubjects[selectedSubject][medium] = {};
          }

          subjectGroups[selectedSubject].forEach((subSubject) => {
            if (
              !updatedSubjects[selectedSubject][medium][subSubject]
            ) {
              updatedSubjects[selectedSubject][medium][subSubject] = [];
            }

            updatedSubjects[selectedSubject][medium][subSubject].push({
              teacherName: "",
              number: "",
              qty: "",
            });
          });
        });
      } else {
        // Normal Subject
        if (!updatedSubjects[selectedSubject]) {
          updatedSubjects[selectedSubject] = [];
        }

        updatedSubjects[selectedSubject].push({
          teacherName: "",
          number: "",
          qty: "",
        });
      }

      return {
        ...school,
        subjects: updatedSubjects,
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
    Name: "",
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
onClick={() => handleExport("filled")}
className="bg-green-600 text-white px-5 py-3 rounded-xl"
>
Export Filled
</button>
<button
onClick={() => handleExport("empty")}
className="bg-yellow-500 text-white px-5 py-3 rounded-xl"
>
Export Empty
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