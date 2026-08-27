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
 
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

const [selectedSubject, setSelectedSubject] = useState("All");
const [selectedYears, setSelectedYears] = useState(
  years.length > 0 ? [years[0]] : []
);
const [selectedMedium, setSelectedMedium] = useState("All");
const [selectedClass, setSelectedClass] = useState("All");

useEffect(() => {
  if (years.length > 0) {
    setSelectedYears([years[0]]);
  } else {
    setSelectedYears([]);
  }
}, [years]);
const allClasses = ["Class 11", "Class 12"];

const visibleClasses =
  selectedClass === "All"
    ? allClasses
    : [selectedClass];

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

  let visible = mediums.filter(
    (medium) => !deleted.includes(medium)
  );

  // Medium filter
  if (selectedMedium !== "All") {
    visible = visible.filter(
      (medium) => medium === selectedMedium
    );
  }

  return visible;
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

// ================= SEARCH FILTER =================
const filteredSchools = schools.filter((school) => {
  const searchText = search.trim().toLowerCase();

  const nameMatch = (school.schoolName || "")
    .toLowerCase()
    .includes(searchText);

  const codeMatch = String(school.code || "")
    .toLowerCase()
    .includes(searchText);

  return nameMatch || codeMatch;
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
<select
  value={selectedMedium}
  onChange={(e) => {
    setSelectedMedium(e.target.value);
    setCurrentPage(1);
  }}
  className="rounded-lg border border-gray-300 px-4 py-2"
>
  <option value="All">All Mediums</option>

  {mediums.map((medium) => (
    <option key={medium} value={medium}>
      {medium}
    </option>
  ))}
</select>
<select
  value={selectedClass}
  onChange={(e) => {
    setSelectedClass(e.target.value);
    setCurrentPage(1);
  }}
  className="rounded-lg border border-gray-300 px-4 py-2"
>
  <option value="All">All Classes</option>
  <option value="Class 11">Class 11</option>
  <option value="Class 12">Class 12</option>
</select>
<div className="relative">
  <details className="relative z-[100]">
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
        relative
        z-[101]
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

    <div
      className="
        absolute
        right-0
        top-full
        z-[9999]
        mt-2
        w-48
        rounded-lg
        border
        border-gray-200
        bg-white
        p-3
        shadow-2xl
      "
    >
      {years.map((year) => (
        <label
          key={year}
          className="
            flex
            cursor-pointer
            items-center
            gap-2
            rounded
            px-2
            py-2
            hover:bg-slate-100
          "
        >
          <input
            type="checkbox"
            checked={selectedYears.includes(year)}
            onChange={() => handleYearChange(year)}
            className="h-4 w-4 cursor-pointer"
          />

          <span>{year}</span>
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

  <div className="w-full overflow-auto max-h-[70vh]">
  <table className="relative w-full min-w-[1800px] border-collapse">

          {/* ================= HEADER ================= */}

         <thead className="sticky top-0 z-50">

  {/* Row 1 */}
 <tr className="bg-[#ece5d8]">

  <th
    rowSpan={4}
    className="
      sticky left-0 top-0 z-[100]
      min-w-[30px]
      border border-black 
      bg-white
      text-center
      text-xl
    "
  >
    S.No.
  </th>


  {/* ================= CODE ================= */}
  <th
    rowSpan={4}
    className="
      sticky left-[70px] top-0 z-[100]
      min-w-[140px]
      border border-black
      bg-white
      text-center
      text-xl
    "
  >
    Code
  </th>


  {/* ================= SCHOOL NAME ================= */}
  <th
    rowSpan={4}
    className="
      sticky left-[140px] top-0 z-[100]
      min-w-[250px]
      border border-black
      bg-white
      text-center
      text-xl
    "
  >
    School Name
  </th>

<th 
rowSpan={4}
className="min-w-[140px]
 border border-black
      bg-white
      text-center
      text-xl
"
>
Class
</th>

<th 
rowSpan={4}
className="min-w-[120px]  border border-black
      bg-white
      text-center
      text-xl"
>
Year
</th>

<th
  rowSpan={4}
  className="min-w-[180px] border border-black bg-white text-center text-xl"
>
  Principal
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
    )
  : 2;
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
}className={`
  border border-gray-400 text-center font-bold
  ${
    medium === "English Medium"
      ? "bg-blue-500 text-white font-bold text-xl"
      : medium === "Hindi Medium"
      ? "bg-green-500 text-white font-bold text-xl"
      : "bg-gray-100"
  }
`}
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

 

<th
  rowSpan={4}
  className="border border-black min-w-[220px] "
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
  className="border border-black min-w-[350px] "
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

if (subjectGroups[subject]) {

  return getVisibleMediums(subject).flatMap((medium) => {

    return getVisibleSubSubjects(subject, medium).flatMap((sub) => [

     

      <th
        key={`${subject}-${medium}-${sub}-name`}
        className="border border-black text-center"
      >
        Name
      </th>,

      <th
        key={`${subject}-${medium}-${sub}-number`}
        className="border border-black  text-center"
      >
        Number
      </th>

    ]);

  });

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

  
const schoolRowCounts = [];   

visibleClasses.forEach((className) => {
  

  visibleYears.forEach((year) => {

    const maxRowsForYear = Math.max(
            1,

            ...subjects.map((subject) => {

              // ================= GROUP SUBJECT =================

              if (subjectGroups[subject]) {

                let max = 1;

                getVisibleMediums(subject).forEach((medium) => {

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

     {visibleClasses.map((className) => (

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

  getVisibleMediums(subject).forEach((medium) => {

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
const lastClass = visibleClasses[visibleClasses.length - 1];

const isLastSchoolRow =
  className === lastClass &&
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

                   

     {teacherRow === 0 &&
  className === visibleClasses[0] &&
  year === visibleYears[0] && (

                      <>

                  

{teacherRow === 0 &&
  className === visibleClasses[0] &&
  year === visibleYears[0] && (
    <>
   

<td
  rowSpan={totalSchoolRows}
  className="
    sticky left-0 z-[40]
    bg-white
    border border-bl
    p-3
    text-center
    align-top
    min-w-[140px]
    w-[140px]
  "
>
  {startIndex + schoolIndex + 1}
</td>




<td
  rowSpan={totalSchoolRows}
  className="
    sticky left-[70px] z-[40]
    bg-white
    border border-black
    p-3
    text-center
    align-top
    min-w-[70px]
    w-[70px]
  "
>
  {school.code}
</td>


{/* ================= SCHOOL NAME ================= */}

<td
  rowSpan={totalSchoolRows}
  className="
    sticky left-[140px] z-[40]
    bg-white
    border border-black
    px-6 py-5
    min-w-[250px]
    w-[250px]
    align-top
  "
>
  <div className="flex justify-between items-start gap-3">

    <span className="break-words">
      {school.schoolName}
    </span>

    <button
      onClick={() =>
        handleDeleteSchool(originalIndex)
      }
      className="
        shrink-0
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
                      </>
                    )}


                    {/* =================================================
                        CLASS
                    ================================================= */}

                    {teacherRow === 0 && (

                      <td
                        rowSpan={maxRows}
                        className="
                          border border-black
                          px-8 py-5
                          text-center
                          min-w-[130px]
                        "
                      >
                        {className}
                      </td>

                    )}


                    {teacherRow === 0 && (

                      <td
                        rowSpan={maxRows}
                        className="
                          border border-black
                          px-8 py-5
                          text-center
                          min-w-[120px]
                        "
                      >
                        {year}
                      </td>

                    )}
                    {teacherRow === 0 && (
  <td className="border p-1 text-center min-w-[180px]">
    <textarea
      value={school.principal?.[className] || ""}
      onChange={(e) => {
        setSchools((prev) =>
          prev.map((s, i) =>
            i === originalIndex
              ? {
                  ...s,
                  principal: {
                    ...(s.principal || {}),
                    [className]: e.target.value,
                  },
                }
              : s
          )
        );
      }}
      rows={1}
      className="
        w-full
        min-h-[35px]
        h-auto
        px-2 py-1
        bg-transparent
        border-0
        outline-none
        text-center
        text-base
        font-bold
        resize-none
        overflow-hidden
        whitespace-pre-wrap
        break-words
      "
      onInput={(e) => {
        e.currentTarget.style.height = "auto";
        e.currentTarget.style.height =
          `${e.currentTarget.scrollHeight}px`;
      }}
    />
  </td>
)}


                    {/* =================================================
                        SUBJECT DATA
                    ================================================= */}

                    {(selectedSubject === "All"
                      ? subjects
                      : [selectedSubject]
                    ).map((subject) => {

                     
if (subjectGroups[subject]) {

  return getVisibleMediums(subject).flatMap((medium) =>

    getVisibleSubSubjects(subject, medium).map((sub) => {

      const teachers =
        school.classes?.[className]?.[year]
          ?.subjects?.[subject]
          ?.[medium]
          ?. [sub] || [];

      const teacher =
        teachers[teacherRow] || {};

      return (
        <React.Fragment
          key={`${subject}-${medium}-${sub}`}
        >

          {/* ================= PRINCIPAL ================= */}

        



          <td className="border p-1 text-center min-w-[220px]">

            <textarea
              value={teacher.teacherName || ""}
              onChange={(e) =>
                handleInputChange(
                  originalIndex,
                  className,
                  year,
                  subject,
                  medium,
                  sub,
                  teacherRow,
                  "teacherName",
                  e.target.value
                )
              }
              rows={1}
              className="
                w-full
                min-h-[35px]
                px-4 py-1
                bg-transparent
                border-0
                outline-none
                text-center
                text-lg
                font-bold
                resize-none
                overflow-hidden
              "
              onInput={(e) => {
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height =
                  `${e.currentTarget.scrollHeight}px`;
              }}
            />

          </td>


          {/* ================= NUMBER ================= */}

          <td className="border p-1 text-center min-w-[180px]">

            <textarea
              value={teacher.number || ""}
              onChange={(e) =>
                handleInputChange(
                  originalIndex,
                  className,
                  year,
                  subject,
                  medium,
                  sub,
                  teacherRow,
                  "number",
                  e.target.value
                )
              }
              rows={1}
              className="
                w-full
                min-h-[35px]
                px-4 py-1
                bg-transparent
                border-0
                outline-none
                text-center
                text-lg
                font-bold
                resize-none
                overflow-hidden
              "
              onInput={(e) => {
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height =
                  `${e.currentTarget.scrollHeight}px`;
              }}
            />

          </td>

        </React.Fragment>
      );

    })

  );

}


                      const teachers =
                        school.classes?.[className]?.[year]
                          ?.subjects?.[subject] || [];


                      const teacher =
                        teachers[teacherRow] || {};


                      return (

                        <React.Fragment key={subject}>



{/* ================= PRINCIPAL ================= */}



{/* ================= NAME ================= */}
<td className="border p-1 text-center min-w-[180px]">
  <textarea
    value={teacher.teacherName || ""}
    onChange={(e) =>
      handleInputChange(
        originalIndex,
        className,
        year,
        subject,
        medium,
        sub,
        teacherRow,
        "teacherName",
        e.target.value
      )
    }
    rows={1}
    className="
      w-full
      min-h-[35px]
      h-auto
      px-2 py-1
      bg-transparent
      border-0
      outline-none
      text-center
      text-base
      font-bold
      resize-none
      overflow-hidden
      whitespace-pre-wrap
      break-words
    "
    onInput={(e) => {
      e.currentTarget.style.height = "auto";
      e.currentTarget.style.height =
        `${e.currentTarget.scrollHeight}px`;
    }}
  />
</td>


{/* ================= NUMBER ================= */}
<td className="border p-1 text-center min-w-[150px]">
  <textarea
    value={teacher.number || ""}
    onChange={(e) =>
      handleInputChange(
        originalIndex,
        className,
        year,
        subject,
        medium,
        sub,
        teacherRow,
        "number",
        e.target.value
      )
    }
    rows={1}
    className="
      w-full
      min-h-[35px]
      h-auto
      px-2 py-1
      bg-transparent
      border-0
      outline-none
      text-center
      text-base
      font-bold
      resize-none
      overflow-hidden
      whitespace-pre-wrap
      break-words
    "
    onInput={(e) => {
      e.currentTarget.style.height = "auto";
      e.currentTarget.style.height =
        `${e.currentTarget.scrollHeight}px`;
    }}
  />
</td>

                       
                        </React.Fragment>

                      );

                    })}



           {/* ================= REMARK ================= */}

{teacherRow === 0 && (

  <td
    className="
      border
      border-gray-300
      px-3
      align-top
      bg-white
      min-w-[220px]
    "
  >
    <input
      type="text"
      value={school.remark?.[className] || ""}
      onChange={(e) => {
        setSchools((prev) =>
          prev.map((s, i) =>
            i === originalIndex
              ? {
                  ...s,
                  remark: {
                    ...(s.remark || {}),
                    [className]: e.target.value,
                  },
                }
              : s
          )
        );
      }}
      placeholder={`${className} Remark...`}
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