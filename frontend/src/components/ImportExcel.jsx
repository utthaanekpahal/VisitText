import React from "react";
import * as XLSX from "xlsx";
import { FiUpload } from "react-icons/fi";


export default function ImportExcel({
  setSchools,
  subjects,
}) {
const scienceSubjects = [
  "Chemistry",
  "Physics",
  "Botany",
  "Biology",
];

const mediums = [
  "English Medium",
  "Hindi Medium",
];

const createSubjectData = () => {
  const data = {};

  subjects.forEach((subject) => {
    if (subject === "Science") {
      data[subject] = {};

      mediums.forEach((medium) => {
        data[subject][medium] = {};

        scienceSubjects.forEach((scienceSubject) => {
          data[subject][medium][scienceSubject] = [
            {
              teacherName: "",
              number: "",
              qty: "",
            },
          ];
        });
      });
    } else {
      data[subject] = [
        {
          teacherName: "",
          number: "",
          qty: "",
        },
      ];
    }
  });

  return data;
};
  const handleFileUpload = (e) => {

const file = e.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = (event) => {
const data = new Uint8Array(event.target.result);

const workbook = XLSX.read(data, {
        type: "array",
      });

const sheetName = workbook.SheetNames[0];

const worksheet = workbook.Sheets[sheetName];

const rows = XLSX.utils.sheet_to_json(
        worksheet,
        {
          header: 1,
          defval: "",
        }
      );



      console.log("ALL EXCEL ROWS:", rows);

const dataRows = rows.slice(2);

 const formattedData = dataRows
  .filter((row) => row[1] || row[2])
  .map((row) => ({
    code: row[1] || "",
    schoolName: row[2] || "",
    grade: "",
    subjects: createSubjectData(),
  }));
 console.log(
        "FINAL IMPORT DATA:",
        formattedData
      );

setSchools(formattedData);

 };

reader.readAsArrayBuffer(file);
};

return (

    <label
      className="
      flex
      cursor-pointer
      items-center
      gap-2
      rounded-xl
      bg-emerald-600
      px-6
      py-3
      font-semibold
      text-white
      shadow-lg
      hover:bg-emerald-700
      "
    >

<FiUpload size={20}/>
Import Excel
<input
 type="file"
accept=".xlsx,.xls"
className="hidden"
onChange={handleFileUpload}
/>
 </label>
);
}