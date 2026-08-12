import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
export default function SchoolTable({
  schools,
  setSchools,
  subjects,
  subjectGroups,
  mediums,
  years,
  selectedSchool,

  deletedMediums,
  deletedSubSubjects,

  handleInputChange,
  handleDeleteSchool,
  handleDeleteSubject,
  handleDeleteMedium,
  handleDeleteSubSubject,
}) {
  const [editingSub, setEditingSub] = useState(null);
const [editValue, setEditValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
const [qtyRange, setQtyRange] = useState("");
const [selectedSubject, setSelectedSubject] = useState("All");
const [selectedYears, setSelectedYears] = useState(
  years.length > 0 ? [years[0]] : []
);

useEffect(() => {
  if (years.length > 0) {
    setSelectedYears([years[0]]);
  } else {
    setSelectedYears([]);
  }
}, [years]);

const handleYearChange = (year) => {
  setSelectedYears((prev) => {
    // Agar already selected hai → remove
    if (prev.includes(year)) {
      // At least 1 year selected rahe
      if (prev.length === 1) {
        return prev;
      }

      return prev.filter((y) => y !== year);
    }

    // Agar selected nahi hai → add
    return [...prev, year].sort(
      (a, b) => Number(a) - Number(b)
    );
  });

  setCurrentPage(1);
};

const visibleYears = years.filter((year) =>
  selectedYears.includes(year)
);
const getVisibleMediums = (subject) => {
  const deleted = deletedMediums?.[subject] || [];

  return mediums.filter(
    (medium) => !deleted.includes(medium)
  );
};

const getVisibleSubSubjects = (subject, medium) => {
  const key = `${subject}__${medium}`;

  const deleted = deletedSubSubjects?.[key] || [];

  return (subjectGroups[subject] || []).filter(
    (sub) => !deleted.includes(sub)
  );
};


// ================= EDIT SUBJECT =================
const handleEditSubject = (oldSubject, newSubject) => {
  if (!newSubject.trim() || oldSubject === newSubject) return;

  const value = newSubject.trim();

  setSchools((prev) =>
    prev.map((school) => {
      const newSchool = structuredClone(school);

      ["Class 11", "Class 12"].forEach((className) => {
        Object.keys(newSchool.classes?.[className] || {}).forEach((year) => {
          const subjectsData =
            newSchool.classes?.[className]?.[year]?.subjects;

          if (!subjectsData || !subjectsData[oldSubject]) return;

          subjectsData[value] = subjectsData[oldSubject];
          delete subjectsData[oldSubject];
        });
      });

      return newSchool;
    })
  );
};


// ================= EDIT MEDIUM =================
const handleEditMedium = (subject, oldMedium, newMedium) => {
  if (!newMedium.trim() || oldMedium === newMedium) return;

  const value = newMedium.trim();

  setSchools((prev) =>
    prev.map((school) => {
      const newSchool = structuredClone(school);

      ["Class 11", "Class 12"].forEach((className) => {
        Object.keys(newSchool.classes?.[className] || {}).forEach((year) => {
          const subjectData =
            newSchool.classes?.[className]?.[year]?.subjects?.[subject];

          if (!subjectData || !subjectData[oldMedium]) return;

          subjectData[value] = subjectData[oldMedium];
          delete subjectData[oldMedium];
        });
      });

      return newSchool;
    })
  );
};


// ================= EDIT SUB SUBJECT =================
const handleEditSubSubject = (
  subject,
  medium,
  oldSub,
  newSub
) => {
  if (!newSub.trim() || oldSub === newSub) return;

  const value = newSub.trim();

  setSchools((prev) =>
    prev.map((school) => {
      const newSchool = structuredClone(school);

      ["Class 11", "Class 12"].forEach((className) => {
        Object.keys(newSchool.classes?.[className] || {}).forEach((year) => {
          const mediumData =
            newSchool.classes?.[className]?.[year]
              ?.subjects?.[subject]?.[medium];

          if (!mediumData || !mediumData[oldSub]) return;

          mediumData[value] = mediumData[oldSub];
          delete mediumData[oldSub];
        });
      });

      return newSchool;
    })
  );
};


  const rowsPerPage = 5;


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


  const qtyMatch = ["Class 11", "Class 12"].some((className) =>
  visibleYears.some((year) =>


    subjects.some((subject) => {

      // Science / Commerce / Arts / Agriculture
      if (subjectGroups[subject]) {

        return mediums.some((medium) =>
          subjectGroups[subject].some((subSubject) => {

            const teachers =
              school.classes?.[className]?.[year]?.subjects?.[subject]?.[medium]?.[subSubject] || [];

            return teachers.some((teacher) => {
              const qty = Number(teacher.qty || 0);
              return qty >= min && qty <= max;
            });

          })
        );

      }

 

      // Normal Subject
      const teachers =
        school.classes?.[className]?.[year]?.subjects?.[subject] || [];

      return teachers.some((teacher) => {
        const qty = Number(teacher.qty || 0);
        return qty >= min && qty <= max;
      });

    })

  )
);

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
  onChange={(e)=>{
    setSearch(e.target.value);
    setCurrentPage(1);
  }}
  className="w-96 rounded-lg border border-gray-300 px-4 py-2"
/>
    

   
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
<div className="relative">
  <details className="relative">

    {/* ================= SELECTED YEARS ================= */}
    <summary
      className="
        list-none
        cursor-pointer
        rounded-lg
        border border-gray-300
        bg-white
        px-4 py-2
        min-w-[180px]
        max-w-[250px]
        flex
        items-center
        justify-between
        gap-3
        select-none
      "
    >
      <span className="truncate">

        {selectedYears.length === 0
          ? "Select Year"
          : selectedYears.length === years.length
          ? "All Years"
          : selectedYears.join(" + ")}

      </span>

      <span className="text-gray-500 shrink-0">
        ▼
      </span>
    </summary>


    {/* ================= DROPDOWN ================= */}
    <div
      className="
        absolute
        z-50
        mt-1
        w-full
        min-w-[180px]
        rounded-lg
        border border-gray-300
        bg-white
        shadow-lg
        p-2
      "
    >

      {/* ================= ALL ================= */}
      <label
        className="
          flex
          items-center
          gap-2
          px-3
          py-2
          rounded
          cursor-pointer
          hover:bg-gray-100
          font-medium
        "
      >

        <input
          type="checkbox"
          checked={
            years.length > 0 &&
            selectedYears.length === years.length
          }
          onChange={() => {

            if (selectedYears.length === years.length) {

              // All ko uncheck karne par first year selected rahe
              setSelectedYears(
                years.length > 0 ? [years[0]] : []
              );

            } else {

              // All years select
              setSelectedYears([...years]);

            }

            setCurrentPage(1);
          }}
          className="h-4 w-4"
        />

        <span>All</span>

      </label>


      {/* ================= DIVIDER ================= */}
      <div className="border-t border-gray-200 my-1" />


      {/* ================= YEARS ================= */}
      {years.map((year) => (

        <label
          key={year}
          className="
            flex
            items-center
            gap-2
            px-3
            py-2
            rounded
            cursor-pointer
            hover:bg-blue-50
          "
        >

          <input
            type="checkbox"
            checked={selectedYears.includes(year)}
            onChange={() => handleYearChange(year)}
            className="h-4 w-4"
          />

          <span
            className={
              selectedYears.includes(year)
                ? "text-blue-700 font-semibold"
                : "text-gray-700"
            }
          >
            {year}
          </span>

        </label>

      ))}

    </div>

  </details>
</div>
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
<th 
rowSpan={4}
className="min-w-[250px]"
>
School Name
</th>

<th 
rowSpan={4}
className="min-w-[130px]"
>
Class
</th>

<th 
rowSpan={4}
className="min-w-[120px]"
>
Year
</th>


    {(selectedSubject === "All"
  ? subjects
  : [selectedSubject]
).map((subject) => {

 const visibleMediums = getVisibleMediums(subject);

const totalColumns = subjectGroups[subject]
  ? visibleMediums.reduce(
      (total, medium) =>
        total +
        getVisibleSubSubjects(subject, medium).length * 2,
      0
    ) + 1
  : 3;
  return (
  <th
  key={subject}
  colSpan={totalColumns}
  className="border border-gray-400 min-w-[500px]"
>
  <div className="flex items-center justify-center gap-2">
    <input
  type="text"
  defaultValue={subject}
  onBlur={(e) =>
    handleEditSubject(subject, e.target.value)
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  }}
  className="
    bg-transparent
    border-0
    outline-none
    text-center
    font-bold
    w-[150px]
    cursor-text
   
  "
/>

    <button
      onClick={() => handleDeleteSubject(subject)}
      className="text-red-600 hover:text-red-800"
    >
      <FiTrash2 size={16} />
    </button>
  </div>
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
      return (
        <React.Fragment key={subject}>

         {getVisibleMediums(subject).map((medium) => (
            <th
              key={medium}
              colSpan={
  getVisibleSubSubjects(subject, medium).length * 2
}
              className="border border-gray-400 text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <span>{medium}</span>

                <button
                  onClick={() =>
                    handleDeleteMedium(subject, medium)
                  }
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            </th>
          ))}

        </React.Fragment>
      );
    }

    return null;
  })}

  {/* ================= REMARK ================= */}

  <th
    rowSpan={3}
    className="border border-gray-400 min-w-[180px]"
  >
    Remark
  </th>

</tr>


<tr className="bg-[#f7f3eb]">

{(selectedSubject === "All"
  ? subjects
  : [selectedSubject]
).map(subject=>{

  if (!subjectGroups[subject]) return null;

return getVisibleMediums(subject).flatMap((medium) =>
  getVisibleSubSubjects(subject, medium).map((sub) => (
   <th
  key={medium + sub}
  colSpan={2}
  className="border border-gray-400 min-w-[350px]"
>
  <div className="flex items-center justify-center gap-2">
    <input
  type="text"
  defaultValue={sub}
  onBlur={(e) =>
    handleEditSubSubject(
      subject,
      medium,
      sub,
      e.target.value
    )
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  }}
  className="
    bg-transparent
    border-0
    outline-none
    text-center
    font-bold
    w-[150px]
    cursor-text
  "
/>

    <button
      onClick={() =>
        handleDeleteSubSubject(
          subject,
          medium,
          sub
        )
      }
      className="text-red-600 hover:text-red-800"
    >
      <FiTrash2 size={14} />
    </button>
  </div>
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

return getVisibleMediums(subject).flatMap((medium) => {
  const headers = getVisibleSubSubjects(
    subject,
    medium
  ).flatMap((sub) => [
    <th key={medium + sub + "1"}>Name</th>,
    <th key={medium + sub + "2"}>Number</th>,
   
  ]);
  return headers;
});

}

return null;

})}

</tr>

</thead>
{/* ================= BODY ================= */}

{/* ================= BODY ================= */}

{/* ================= BODY ================= */}

<tbody>

  {filteredSchools.length > 0 ? (

    currentSchools.map((school, schoolIndex) => {

      const originalIndex = schools.indexOf(school);

  

     const schoolRowCounts = [];

["Class 11", "Class 12"].forEach((className) => {

  visibleYears.forEach((year) => {

          const maxRowsForYear = Math.max(
            1,

            ...subjects.map((subject) => {

              // ================= GROUP SUBJECT =================

              if (subjectGroups[subject]) {

                let max = 1;

                mediums.forEach((medium) => {

                  subjectGroups[subject].forEach((sub) => {

                    const len =
                      school.classes?.[className]?.[year]
                        ?.subjects?.[subject]
                        ?. [medium]
                        ?. [sub]
                        ?.length || 0;

                    if (len > max) {
                      max = len;
                    }

                  });

                });

                return max;
              }

              // ================= NORMAL SUBJECT =================

              return (
                school.classes?.[className]?.[year]
                  ?.subjects?.[subject]
                  ?.length || 1
              );

            })
          );

          schoolRowCounts.push(maxRowsForYear);

        });

      });


      const totalSchoolRows =
        schoolRowCounts.reduce(
          (total, rows) => total + rows,
          0
        );


      // =====================================================
      // SCHOOL
      // =====================================================

      return (

        <React.Fragment key={originalIndex}>

       {["Class 11", "Class 12"].map((className) => (

  visibleYears.map((year) => {

              // =================================================
              // MAX ROWS FOR CURRENT YEAR
              // =================================================

              const maxRows = Math.max(
                1,

                ...subjects.map((subject) => {

                  // ================= GROUP =================

                  if (subjectGroups[subject]) {

                    let max = 1;

                    mediums.forEach((medium) => {

                      subjectGroups[subject].forEach((sub) => {

                        const len =
                          school.classes?.[className]?.[year]
                            ?.subjects?.[subject]
                            ?. [medium]
                            ?. [sub]
                            ?.length || 0;

                        if (len > max) {
                          max = len;
                        }

                      });

                    });

                    return max;
                  }

                  // ================= NORMAL =================

                  return (
                    school.classes?.[className]?.[year]
                      ?.subjects?.[subject]
                      ?.length || 1
                  );

                })
              );


              // =================================================
              // CREATE TABLE ROWS
              // =================================================

              return Array.from(
                { length: maxRows }
              ).map((_, teacherRow) => {

                // =================================================
                // LAST ROW OF COMPLETE SCHOOL
                // =================================================

  const lastYear = visibleYears[visibleYears.length - 1];

const isLastSchoolRow =
  className === "Class 12" &&
  year === lastYear &&
  teacherRow === maxRows - 1;


                return (

                  <tr
                    key={`${originalIndex}-${className}-${year}-${teacherRow}`}
                    className={`
                      hover:bg-slate-50
                      ${
                        isLastSchoolRow
                          ? "border-b-4 border-gray-700"
                          : ""
                      }
                    `}
                  >

                    {/* =================================================
                        S.NO + CODE + SCHOOL NAME
                    ================================================= */}

     {teacherRow === 0 &&
  className === "Class 11" &&
  year === visibleYears[0] && (

                      <>

                        {/* S.NO */}

                        <td
                          rowSpan={totalSchoolRows}
                          className="
                            sticky left-0 z-40
                            bg-white
                            border border-gray-300
                            p-3
                            text-center
                            align-top
                            min-w-[70px]
                          "
                        >
                          {startIndex + schoolIndex + 1}
                        </td>


                        {/* CODE */}

                        <td
                          rowSpan={totalSchoolRows}
                          className="
                            sticky left-0 z-40
                            bg-white
                            border border-gray-300
                            p-3
                            text-center
                            align-top
                            min-w-[70px]
                          "
                        >
                          {school.code}
                        </td>


                        {/* SCHOOL NAME */}

                        <td
                          rowSpan={totalSchoolRows}
                          className="
                            border border-gray-300
                            px-6 py-5
                            min-w-[250px]
                            align-top
                          "
                        >

                          <div className="flex justify-between items-start gap-3">

                            <span>
                              {school.schoolName}
                            </span>

                            <button
                              onClick={() =>
                                handleDeleteSchool(originalIndex)
                              }
                              className="
                                text-red-600
                                hover:text-red-800
                              "
                            >
                              <FiTrash2 />
                            </button>

                          </div>

                        </td>

                      </>
                    )}


                    {/* =================================================
                        CLASS
                    ================================================= */}

                    {teacherRow === 0 && (

                      <td
                        rowSpan={maxRows}
                        className="
                          border border-gray-300
                          px-8 py-5
                          text-center
                          min-w-[130px]
                        "
                      >
                        {className}
                      </td>

                    )}


                    {/* =================================================
                        YEAR
                    ================================================= */}

                    {teacherRow === 0 && (

                      <td
                        rowSpan={maxRows}
                        className="
                          border border-gray-300
                          px-8 py-5
                          text-center
                          min-w-[120px]
                        "
                      >
                        {year}
                      </td>

                    )}


                    {/* =================================================
                        SUBJECT DATA
                    ================================================= */}

                    {(selectedSubject === "All"
                      ? subjects
                      : [selectedSubject]
                    ).map((subject) => {

                      // =================================================
                      // GROUP SUBJECT
                      // =================================================

                      if (subjectGroups[subject]) {

                        return mediums.flatMap((medium) =>

                          subjectGroups[subject].map((sub) => {

                            const teachers =
                              school.classes?.[className]?.[year]
                                ?.subjects?.[subject]
                                ?. [medium]
                                ?. [sub] || [];


                            const teacher =
                              teachers[teacherRow] || {};


                            return (

                              <React.Fragment
                                key={`${subject}-${medium}-${sub}`}
                              >

                                {/* NAME */}

                               <td className="border p-1 text-center min-w-[220px]">
  <input
    type="text"
    value={teacher.teacherName || ""}
    onChange={(e) =>
      handleInputChange(
        originalIndex, className, year, subject,
        medium, sub, teacherRow, "teacherName", e.target.value
      )
    }
    className="
      w-full
      px-4 py-1
      bg-transparent
      border-0
      outline-none
      text-center
      text-lg
      font-bold
    "
  />
</td>

<td className="border p-1 text-center min-w-[180px]">
  <input
    type="text"
    value={teacher.number || ""}
    onChange={(e) =>
      handleInputChange(
        originalIndex, className, year, subject,
        medium, sub, teacherRow, "number", e.target.value
      )
    }
    className="
      w-full
      px-4 py-1
      bg-transparent
      border-0
      outline-none
      text-center
      text-lg
      font-bold
    "
  />
</td>


                              </React.Fragment>

                            );

                          })

                        );

                      }


                      // =================================================
                      // NORMAL SUBJECT
                      // =================================================

                      const teachers =
                        school.classes?.[className]?.[year]
                          ?.subjects?.[subject] || [];


                      const teacher =
                        teachers[teacherRow] || {};


                      return (

                        <React.Fragment key={subject}>

                          {/* NAME */}

                          <td className="border p-1 text-center">

                            <input
                              type="text"
                              value={
                                teacher.teacherName || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  originalIndex,
                                  className,
                                  year,
                                  subject,
                                  null,
                                  null,
                                  teacherRow,
                                  "teacherName",
                                  e.target.value
                                )
                              }
                              className="
                                w-full
                                px-2 py-1
                                text-center
                                outline-none
                              "
                            />

                          </td>


                          {/* NUMBER */}

                          <td className="border p-1 text-center">

                            <input
                              type="text"
                              value={
                                teacher.number || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  originalIndex,
                                  className,
                                  year,
                                  subject,
                                  null,
                                  null,
                                  teacherRow,
                                  "number",
                                  e.target.value
                                )
                              }
                              className="
                                w-full
                                px-2 py-1
                                text-center
                                outline-none
                              "
                            />

                          </td>


                          {/* QTY */}

                       
                        </React.Fragment>

                      );

                    })}



             {teacherRow === 0 &&
  className === "Class 11" &&
  year === visibleYears[0] && (

                      <td
                        rowSpan={totalSchoolRows}
                        className="
                          border-l border-r border-gray-300
                          px-3
                          align-top
                          bg-white
                        "
                      >

                        <input
                          type="text"
                          value={school.remark || ""}
                          onChange={(e) => {

                            setSchools((prev) =>
                              prev.map((s, i) =>
                                i === originalIndex
                                  ? {
                                      ...s,
                                      remark: e.target.value,
                                    }
                                  : s
                              )
                            );

                          }}
                          placeholder="Type remark..."
                          className="
                            w-full
                            bg-transparent
                            border-0
                            outline-none
                            text-sm
                            py-2
                          "
                        />

                      </td>

                    )}

                  </tr>

                );

              });

            })

          ))}

        </React.Fragment>

      );

    })

  ) : (

    <tr>

      <td
        colSpan={20}
        className="
          p-10
          text-center
          text-gray-500
        "
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