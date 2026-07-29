import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
export default function SchoolTable({
  schools = [],
  subjects = [],
  selectedSchool,
  handleInputChange,
  handleDeleteSchool = () => {},
  handleDeleteSubject = () => {},
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
const [qtyRange, setQtyRange] = useState("");
const [selectedSubject, setSelectedSubject] = useState("All");
  const rowsPerPage = 10;
  const subjectGroups = {
  Science: [
    "Chemistry",
    "Physics",
    "Botany",
    "Mathematics",
  ],

  Commerce: [
    "Accounts",
    "Business Studies",
    "Economics",
    "Bookkeeping"
  ],

  Arts: [
    "Political Science",
    "Geography",
    "History",
    "Economics",
    "Sociology"
  ],

  Agriculture: [
    "Horticulture",
    "Animal Husbandry",
    "Crop Production",
    
  ],

  Bharti: [
    "Hindi",
    "English",
    "Sanskrit", 
  ],
};
const mediums = [
  "English Medium",
  "Hindi Medium",
];
  // Search
 // Search + Quantity Filter
const filteredSchools = schools.filter((school) => {
  const searchText = search.trim().toLowerCase();

  const nameMatch = (school.schoolName || "")
    .toLowerCase()
    .includes(searchText);

  const codeMatch = String(school.code || "")
    .toLowerCase()
    .includes(searchText);

  if (!qtyRange) return nameMatch || codeMatch;

  let min = 1;
  let max = Infinity;

  switch (qtyRange) {
    case "1-10":
      min = 1;
      max = 10;
      break;
    case "11-20":
      min = 11;
      max = 20;
      break;
    case "21-30":
      min = 21;
      max = 30;
      break;
    case "31-40":
      min = 31;
      max = 40;
      break;
    case "41-50":
      min = 41;
      max = 50;
      break;
    case "51-60":
      min = 51;
      max = 60;
      break;
    case "61-70":
      min = 61;
      max = 70;
      break;
    case "71-80":
      min = 71;
      max = 80;
      break;
    case "81-90":
      min = 81;
      max = 90;
      break;
    case "91-100":
      min = 91;
      max = 100;
      break;
    case "101+":
      min = 101;
      max = Infinity;
      break;
  }

 const qtyMatch = subjects.some((subject) => {

  // ======================
  // Science
  // ======================
 if (subjectGroups[subject]) {

  return mediums.some((medium) =>
    subjectGroups[subject].some((subSubject) => {

      const teachers =
        school.subjects?.[subject]?.[medium]?.[subSubject] || [];

      return teachers.some((teacher) => {
        const qty = Number(teacher.qty || 0);

        return qty >= min && qty <= max;
      });

    })
  );

}
  // ======================
  // Other Subjects
  // ======================

  const teachers = school.subjects?.[subject] || [];

  return teachers.some((teacher) => {
    const qty = Number(teacher.qty || 0);

    return qty >= min && qty <= max;
  });

});

  return (nameMatch || codeMatch) && qtyMatch;
});
  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSchools.length / rowsPerPage)
  );

  useEffect(() => {
    setCurrentPage((prevPage) =>
      Math.min(Math.max(prevPage, 1), totalPages)
    );
  }, [totalPages]);

  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    totalPages
  );

  const startIndex = (safeCurrentPage - 1) * rowsPerPage;

  const currentSchools = filteredSchools.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const onDeleteSchool = (schoolIndex) => {
    if (typeof handleDeleteSchool !== "function") return;

    handleDeleteSchool(schoolIndex);
  };

  return (
    <div className="mt-8 w-full overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-xl">

      {/* ================= SEARCH ================= */}

     <div className="p-5 border-b bg-gray-50 flex justify-between items-center">

  <div className="flex gap-3">

    <input
      type="text"
      placeholder="Search School Name/Code"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      className="w-96 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-[#32308D] focus:ring-2 focus:ring-[#32308D]/20"
    />
    

    <select
      value={qtyRange}
      onChange={(e) => {
        setQtyRange(e.target.value);
        setCurrentPage(1);
      }}
      className="rounded-lg border border-gray-300 px-4 py-2"
    >
      <option value="">All Qty</option>
      <option value="1-10">1 - 10</option>
      <option value="11-20">11 - 20</option>
      <option value="21-30">21 - 30</option>
      <option value="31-40">31 - 40</option>
      <option value="41-50">41 - 50</option>
      <option value="51-60">51 - 60</option>
      <option value="61-70">61 - 70</option>
      <option value="71-80">71 - 80</option>
      <option value="81-90">81 - 90</option>
      <option value="91-100">91 - 100</option>
      <option value="101+">101+</option>
    </select>
     <select
  value={selectedSubject}
  onChange={(e) => {
    setSelectedSubject(e.target.value);
    setCurrentPage(1);
  }}
  className="rounded-lg border border-gray-300 px-4 py-2"
>
  <option value="All">All Subjects</option>

  {subjects.map((subject) => (
    <option key={subject} value={subject}>
      {subject}
    </option>
  ))}
</select>
  </div>

  <span className="text-gray-600 font-medium">
    Total: {filteredSchools.length} School(s)
  </span>

</div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1800px] border-collapse">

          {/* ================= HEADER ================= */}

         <thead className="sticky top-0 z-10">

  {/* Row 1 */}
  <tr className="bg-[#ece5d8]">

   <th rowSpan={4}>S.No.</th>
<th rowSpan={4}>Code</th>
<th rowSpan={4}>School Name</th>
<th rowSpan={4}>Grade</th>

    {(selectedSubject === "All"
  ? subjects
  : [selectedSubject]
).map((subject) => {

 const totalColumns = subjectGroups[subject]
? subjectGroups[subject].length * mediums.length * 3
: 3;
  return (
    <th
  key={subject}
  colSpan={totalColumns}
  className="border border-gray-400 min-w-[500px]"
>
      {subject}
    </th>
  );

  return (
    <th
      key={subject}
      colSpan={3}
      rowSpan={4}
      className="border border-gray-400"
    >
      {subject}
    </th>
  );
})}

  </tr>

  {/* Row 2 */}
  <tr className="bg-[#f7f3eb]">
{(selectedSubject === "All"
  ? subjects
  : [selectedSubject]
).map((subject) => {

  if (subjectGroups[subject]) {
    return mediums.map((medium) => (
      <th
        key={medium}
        colSpan={subjectGroups[subject].length * 3}
        className="border border-gray-400 text-center"
      >
        {medium}
      </th>
    ));
  }

  return (
    <th
      key={subject + "-dummy"}
      colSpan={3}
      rowSpan={3}
      className="hidden"
    ></th>
  );
})}

</tr>
<tr className="bg-[#f7f3eb]">

{(selectedSubject === "All"
  ? subjects
  : [selectedSubject]
).map(subject=>{

  if (!subjectGroups[subject]) return null;

return mediums.flatMap((medium) =>
  subjectGroups[subject].map((sub) => (
    <th
      key={medium + sub}
      colSpan={3}
      className="border border-gray-400 min-w-[350px]"
    >
      {sub}
    </th>
  ))
);

})}

</tr>
  {/* Row 3 */}
  <tr>

{(selectedSubject === "All"
  ? subjects
  : [selectedSubject]
).map(subject=>{

if(subjectGroups[subject]){

return mediums.flatMap((medium)=>

subjectGroups[subject].flatMap((sub)=>[

<th key={medium+sub+"1"}>Name</th>,

<th key={medium+sub+"2"}>Number</th>,

<th key={medium+sub+"3"}>Qty</th>,

])

)

}

return null;

})}

</tr>

</thead>
{/* ================= BODY ================= */}

<tbody>
  {filteredSchools.length > 0 ? (
    currentSchools.map((school, schoolIndex) => {
      const originalIndex = schools.indexOf(school);

      // Maximum rows among all subjects
   const maxRows = Math.max(
  1,
  ...subjects.map((subject) => {
    // Grouped Subjects
    if (subjectGroups[subject]) {
      let max = 1;

      mediums.forEach((medium) => {
        subjectGroups[subject].forEach((subSubject) => {
          const len =
            school.subjects?.[subject]?.[medium]?.[subSubject]?.length || 0;

          if (len > max) max = len;
        });
      });

      return max;
    }

    // Normal Subjects
    return school.subjects?.[subject]?.length || 0;
  })
);

      return (
        <React.Fragment key={originalIndex}>
          {Array.from({ length: maxRows }).map((_, teacherRow) => (
            <tr key={teacherRow} className="hover:bg-slate-50">

              {/* Show only once */}
              {teacherRow === 0 && (
                <>
                  <td
                    rowSpan={maxRows}
                    className="border border-gray-300 p-3 text-center align-top"
                  >
                    {startIndex + schoolIndex + 1}
                  </td>

                  <td
                    rowSpan={maxRows}
                    className="border border-gray-300 p-3 text-center align-top"
                  >
                    {school.code}
                  </td>
<td
  rowSpan={maxRows}
  className="border border-gray-300 p-3 align-top"
>
  <div className="flex items-center justify-between gap-2">
    <span>{school.schoolName}</span>

    <button
      onClick={() => handleDeleteSchool(originalIndex)}
      className="text-red-600 hover:bg-red-100 p-1 rounded"
      title="Delete School"
    >
      <FiTrash2 size={16} />
    </button>
  </div>
</td>

                <td
  rowSpan={maxRows}
  className="border min-w-[180px] w-[180px] border-gray-300 p-2 align-top"
>
  <select
    value={school.grade}
    onChange={(e) =>
      handleInputChange(
        originalIndex,
        null,
        null,
        "grade",
        e.target.value
      )
    }
    className="w-full bg-transparent text-center outline-none border rounded px-2 py-1"
  >
    <option value="">Select Class</option>
    <option value="Class 11">Class 11</option>
    <option value="Class 12">Class 12</option>
  </select>
</td>
                </>
              )}

              {/* Subject Columns */}
              {(selectedSubject === "All"
  ? subjects
  : [selectedSubject]
).map((subject) => {
                if (subjectGroups[subject]) {
  return (
    <React.Fragment key={subject}>
      {mediums.flatMap((medium) =>
       subjectGroups[subject].flatMap((subSubject) => {
          const teachers =
            school.subjects?.[subject]?.[medium]?.[subSubject] || [];

          const teacher = teachers[teacherRow];

          const hasRow = teacher !== undefined;

          return [
            // Name
            <td
              key={`${medium}-${subSubject}-name`}
              className="border border-gray-300 p-2"
            >
              {hasRow && (
                <input
                  type="text"
                  value={teacher.teacherName}
                  onChange={(e) =>
                    handleInputChange(
                      originalIndex,
                        subject,
                      teacherRow,
                      "teacherName",
                      e.target.value,
                      medium, 
                      subSubject
                    )
                  }
                  className="w-full bg-transparent text-center outline-none"
                />
              )}
            </td>,

            // Number
            <td
              key={`${medium}-${subSubject}-number`}
              className="border border-gray-300 p-2"
            >
              {hasRow && (
                <input
                  type="text"
                  value={teacher.number}
                  onChange={(e) =>
                    handleInputChange(
                      originalIndex,
                      subject,
                      teacherRow,
                      "number",
                      e.target.value,
                      medium,
                      subSubject
                    )
                  }
                  className="w-full bg-transparent text-center outline-none"
                />
              )}
            </td>,

            // Qty
            <td
              key={`${medium}-${subSubject}-qty`}
              className="border border-gray-300 p-2"
            >
              {hasRow && (
                <input
                  type="number"
                  value={teacher.qty}
                  onChange={(e) =>
                    handleInputChange(
                      originalIndex,
                        subject,
                      teacherRow,
                      "qty",
                      e.target.value,
                      medium,
                      subSubject
                    )
                  }
                  className="w-full bg-transparent text-center outline-none"
                />
              )}
            </td>,
          ];
        })
      )}
    </React.Fragment>
  );
}
                const teachers = Array.isArray(
                  school.subjects?.[subject]
                )
                  ? school.subjects[subject]
                  : [];

               const teacher = teachers[teacherRow];

const hasRow = teacher !== undefined;

                return (
                  <React.Fragment key={subject}>
                    {/* Teacher Name */}
                    <td className="border border-gray-300 p-2">
  {hasRow && (
    <input
      type="text"
      value={teacher.teacherName}
      onChange={(e) =>
        handleInputChange(
          originalIndex,
          subject,
          teacherRow,
          "teacherName",
          e.target.value
        )
      }
      className="w-full bg-transparent text-center outline-none"
    />
  )}
</td>

                    {/* Number */}
                  <td className="border border-gray-300 p-2">
  {hasRow && (
    <input
      type="text"
      value={teacher.number}
      onChange={(e) =>
        handleInputChange(
          originalIndex,
          subject,
          teacherRow,
          "number",
          e.target.value
        )
      }
      className="w-full bg-transparent text-center outline-none"
    />
  )}
</td>

                    {/* Qty */}
                   <td className="border border-gray-300 p-2">
  {hasRow && (
    <input
      type="number"
      value={teacher.qty}
      onChange={(e) =>
        handleInputChange(
          originalIndex,
          subject,
          teacherRow,
          "qty",
          e.target.value
        )
      }
      className="w-full bg-transparent text-center outline-none"
    />
  )}
</td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </React.Fragment>
      );
    })
  ) : (
    <tr>
      <td
       colSpan={
  4 +
  subjects.reduce((total, subject) => {

    if (subjectGroups[subject]) {
      return total + subjectGroups[subject].length * mediums.length * 3;
    }

    return total + 3;

  }, 0)
}
        className="p-10 text-center text-gray-500"
      >
        No School Found
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}

      <div className="flex justify-center items-center gap-3 p-5 bg-gray-50">
        <button
          disabled={safeCurrentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>

        <span className="font-semibold">
          Page {safeCurrentPage} of {totalPages}
        </span>

        <button
          disabled={safeCurrentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 rounded-lg bg-[#32308D] text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  );
}