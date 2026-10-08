import React, { useEffect, useState } from "react";
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

const [selectedType, setSelectedType] = useState("Textbook");
const [selectedClass, setSelectedClass] = useState("Class 11");
const [selectedYear, setSelectedYear] = useState("2026");
const [selectedExportYears, setSelectedExportYears] = useState([]);


// ======================================================
// DELETED MEDIUMS
// ======================================================

const [deletedMediums, setDeletedMediums] = useState(() => {
  try {
    const saved = localStorage.getItem("deletedMediums");

    return saved
      ? JSON.parse(saved)
      : {};
  } catch {
    return {};
  }
});

useEffect(() => {
  localStorage.setItem(
    "deletedMediums",
    JSON.stringify(deletedMediums)
  );
}, [deletedMediums]);


// ======================================================
// DELETED SUB SUBJECTS
// ======================================================

const [deletedSubSubjects, setDeletedSubSubjects] = useState(() => {
  try {
    const saved = localStorage.getItem("deletedSubSubjects");

    return saved
      ? JSON.parse(saved)
      : {};
  } catch {
    return {};
  }
});

useEffect(() => {
  localStorage.setItem(
    "deletedSubSubjects",
    JSON.stringify(deletedSubSubjects)
  );
}, [deletedSubSubjects]);


// ======================================================
// YEARS
// ======================================================

const [years, setYears] = useState(() => {
  try {
    const saved = localStorage.getItem("schoolYears");

    return saved
      ? JSON.parse(saved)
      : ["2026", "2027", "2028"];
  } catch {
    return ["2026", "2027", "2028"];
  }
});

useEffect(() => {
  localStorage.setItem(
    "schoolYears",
    JSON.stringify(years)
  );
}, [years]);


// ======================================================
// SCHOOLS
// ======================================================

const [schools, setSchools] = useState(() => {
  try {
    const savedSchools =
      localStorage.getItem("schoolRecords");

    return savedSchools
      ? JSON.parse(savedSchools)
      : [];
  } catch (error) {
    console.error(
      "Failed to load schools:",
      error
    );

    return [];
  }
});

useEffect(() => {
  localStorage.setItem(
    "schoolRecords",
    JSON.stringify(schools)
  );
}, [schools]);


// ======================================================
// SUBJECTS
// ======================================================

const [subjects, setSubjects] = useState(() => {
  try {
    const saved =
      localStorage.getItem("schoolSubjects");

    return saved
      ? JSON.parse(saved)
      : [
          "Science",
          "Commerce",
          "Arts",
          "Agriculture",
          "Bharti",
        ];
  } catch {
    return [
      "Science",
      "Commerce",
      "Arts",
      "Agriculture",
      "Bharti",
    ];
  }
});


// SAVE SUBJECTS
useEffect(() => {
  localStorage.setItem(
    "schoolSubjects",
    JSON.stringify(subjects)
  );
}, [subjects]);


// ======================================================
// SUBJECT GROUPS
// ======================================================

const [subjectGroups, setSubjectGroups] = useState(() => {
  try {
    const saved =
      localStorage.getItem("schoolSubjectGroups");

    return saved
      ? JSON.parse(saved)
      : {
          Science: {
            "English Medium": [
              "Chemistry",
              "Physics",
              "Biology",
              "Mathematics",
            ],

            "Hindi Medium": [
              "Rasayan",
              "Bhautik",
              "Jeev Vigyan",
              "Ganit",
            ],
          },

          Commerce: {
            "English Medium": [
              "Accounts",
              "Business Studies",
              "Economics",
              
            ],

            "Hindi Medium": [
              "Lekhashastra",
              "Vyavsay Adhyayan",
              "Arthashastra",
              
            ],
          },

          Arts: {
            "English Medium": [
              "Political Science",
              "Geography",
              "History",
              "Economics",
              "Sociology",
            ],

            "Hindi Medium": [
              "Rajneeti Vigyan",
              "Bhugol",
              "Itihas",
              "Arthashastra",
              "Samajshastra",
            ],
          },

          Agriculture: {
            "English Medium": [
              "Horticulture",
              "Animal Husbandry",
              "Crop Production",
            ],

            "Hindi Medium": [
              "Krishi vigyan",
              "Pashupalan",
              "Fasal Utpadan",
            ],
          },

          Bharti: {
            "English Medium": [
              "Hindi",
              "English",
              "Sanskrit",
            ],

            "Hindi Medium": [
              "Hindi",
              "Angrezi",
              "Sanskrit",
            ],
          },
        };
  } catch {
    return {};
  }
});


// SAVE SUBJECT GROUPS
useEffect(() => {
  console.log(
    "SAVING SUBJECT GROUPS:",
    subjectGroups
  );

  localStorage.setItem(
    "schoolSubjectGroups",
    JSON.stringify(subjectGroups)
  );
}, [subjectGroups]);


// ======================================================
// MEDIUMS
// ======================================================

const [mediums, setMediums] = useState(() => {
  try {
    const saved =
      localStorage.getItem("schoolMediums");

    return saved
      ? JSON.parse(saved)
      : [
          "English Medium",
          "Hindi Medium",
        ];
  } catch {
    return [
      "English Medium",
      "Hindi Medium",
    ];
  }
});


// SAVE MEDIUMS
useEffect(() => {
  localStorage.setItem(
    "schoolMediums",
    JSON.stringify(mediums)
  );
}, [mediums]);


// ======================================================
// BOOK TYPES
// ======================================================

const BOOK_TYPES = [
  "Textbook",
  "Parikshabodh",
  "Practical",
  "Project",
  "Guide"
];


// ======================================================
// CREATE SUBJECT DATA
// ======================================================

const createSubjectData = () => {
  const data = {};

  subjects.forEach((subject) => {

    // ==============================================
    // GROUP SUBJECT
    // ==============================================

    if (subjectGroups[subject]) {

      data[subject] = {};

      Object.keys(
        subjectGroups[subject]
      ).forEach((medium) => {

        data[subject][medium] = {};

        subjectGroups[subject][medium].forEach(
          (subSubject) => {

            data[subject][medium][subSubject] = [];
          }
        );
      });

    }

    // ==============================================
    // NORMAL SUBJECT
    // ==============================================

    else {

      data[subject] = [];
    }
  });

  return data;
};

const createYearData = () => {
  return {
    Textbook: {
      subjects: createSubjectData(),
    },

    Parikshabodh: {
      subjects: createSubjectData(),
    },

    Practical: {
      subjects: createSubjectData(),
    },

    Project: {
      subjects: createSubjectData(),
    },

    Guide: {
      subjects: createSubjectData(),
    }
  };
};

const handleInputChange = (
  schoolIndex,
  className,
  year,
  type,
  subject,
  medium,
  subSubject,
  rowIndex,
  field,
  value
) => {
  setSchools((prev) =>
    prev.map((school, index) => {
      if (index !== schoolIndex) {
        return school;
      }

      const updated = structuredClone(school);

      if (!updated.classes) {
        updated.classes = {};
      }

      if (!updated.classes[className]) {
        updated.classes[className] = {};
      }

      if (!updated.classes[className][year]) {
        updated.classes[className][year] = createYearData();
      }

      const yearData =
        updated.classes[className][year];

      // Selected type create karo
      if (!yearData[type]) {
        yearData[type] = {
          subjects: {},
        };
      }

      if (!yearData[type].subjects) {
        yearData[type].subjects = {};
      }

      const subjectsData =
        yearData[type].subjects;

      // ==============================
      // GROUP SUBJECT
      // ==============================
      if (subjectGroups[subject]) {
        if (!subjectsData[subject]) {
          subjectsData[subject] = {};
        }

        if (!subjectsData[subject][medium]) {
          subjectsData[subject][medium] = {};
        }

        if (!subjectsData[subject][medium][subSubject]) {
          subjectsData[subject][medium][subSubject] = [];
        }

        if (
          !subjectsData[subject][medium][subSubject][rowIndex]
        ) {
          subjectsData[subject][medium][subSubject][rowIndex] = {
            teacherName: "",
            number: "",
            qty: "",
          };
        }

        subjectsData[subject][medium][subSubject][rowIndex][
          field
        ] = value;
      }

      // ==============================
      // NORMAL SUBJECT
      // ==============================
      else {
        if (!Array.isArray(subjectsData[subject])) {
          subjectsData[subject] = [];
        }

        if (!subjectsData[subject][rowIndex]) {
          subjectsData[subject][rowIndex] = {
            teacherName: "",
            number: "",
            qty: "",
          };
        }

        subjectsData[subject][rowIndex][field] = value;
      }

      return updated;
    })
  );
};

const toggleExportYear = (year) => {
  setSelectedExportYears((prev) => {
    if (prev.includes(year)) {
      return prev.filter((y) => y !== year);
    }

    return [...prev, year].sort(
      (a, b) => Number(a) - Number(b)
    );
  });
};

const handleExport = (type) => {
  try {
    // =====================================================
    // VALIDATE SELECTED YEARS
    // =====================================================

    if (!selectedExportYears || selectedExportYears.length === 0) {
      alert("Please select at least one year for export.");
      return;
    }

    // =====================================================
    // GET LOCAL STORAGE DATA
    // =====================================================

    const savedSchools = localStorage.getItem("schoolRecords");
    const savedSubjects = localStorage.getItem("schoolSubjects");
    const savedGroups = localStorage.getItem("schoolSubjectGroups");
    const savedYears = localStorage.getItem("schoolYears");

    const exportSchools = savedSchools
      ? JSON.parse(savedSchools)
      : schools;

    const exportSubjects = savedSubjects
      ? JSON.parse(savedSubjects)
      : subjects;

    const exportSubjectGroups = savedGroups
      ? JSON.parse(savedGroups)
      : subjectGroups;

    const exportYears = savedYears
      ? JSON.parse(savedYears)
      : years;

    // =====================================================
    // VALID YEARS
    // =====================================================

    const validExportYears = selectedExportYears.filter((year) =>
      exportYears.some(
        (existingYear) =>
          String(existingYear) === String(year)
      )
    );

    if (validExportYears.length === 0) {
      alert("Selected export years are not available.");
      return;
    }

    // =====================================================
    // ROWS + MERGES
    // =====================================================

    const rows = [];
    const merges = [];

    // =====================================================
    // HEADER ROW 1
    // =====================================================

    rows.push([
      "S.No",
      "Code",
      "School Name",
      "Class",
      "Year",
      "Principal",
      "Remarks",
    ]);

    // =====================================================
    // HEADER ROW 2
    // =====================================================

    rows.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    // =====================================================
    // HEADER ROW 3
    // =====================================================

    rows.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    // =====================================================
    // HEADER ROW 4
    // =====================================================

    rows.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    // =====================================================
    // COMMON HEADER MERGES
    // =====================================================

    // S.No
    merges.push({
      s: { r: 0, c: 0 },
      e: { r: 3, c: 0 },
    });

    // Code
    merges.push({
      s: { r: 0, c: 1 },
      e: { r: 3, c: 1 },
    });

    // School Name
    merges.push({
      s: { r: 0, c: 2 },
      e: { r: 3, c: 2 },
    });

    // Class
    merges.push({
      s: { r: 0, c: 3 },
      e: { r: 3, c: 3 },
    });

    // Year
    merges.push({
      s: { r: 0, c: 4 },
      e: { r: 3, c: 4 },
    });

    // Principal
    merges.push({
      s: { r: 0, c: 5 },
      e: { r: 3, c: 5 },
    });

    // Remarks
    merges.push({
      s: { r: 0, c: 6 },
      e: { r: 3, c: 6 },
    });

    // =====================================================
    // SUBJECT START COLUMN
    // =====================================================

    let colIndex = 7;

    // =====================================================
    // SUBJECT HEADERS
    // =====================================================

    exportSubjects.forEach((subject) => {
      const startCol = colIndex;

      // ===================================================
      // GROUP SUBJECT
      // Subject -> Medium -> SubSubject
      // ===================================================

      if (exportSubjectGroups[subject]) {
        const mediumNames = [
          "English Medium",
          "Hindi Medium",
        ];

        // ===============================================
        // TOTAL COLUMNS
        // ===============================================

        const totalCols = mediumNames.reduce(
          (total, medium) => {
            const subSubjects =
              exportSubjectGroups[subject]?.[medium] || [];

            return total + subSubjects.length * 2;
          },
          0
        );

        // Agar subject me koi sub-subject nahi hai
        if (totalCols === 0) {
          return;
        }

        // ===============================================
        // SUBJECT MERGE
        // ===============================================

        merges.push({
          s: {
            r: 0,
            c: startCol,
          },
          e: {
            r: 0,
            c: startCol + totalCols - 1,
          },
        });

        rows[0][startCol] = subject;

        let mediumStart = startCol;

        // ===============================================
        // MEDIUMS
        // ===============================================

        mediumNames.forEach((medium) => {
          const subSubjects =
            exportSubjectGroups[subject]?.[medium] || [];

          const mediumCols =
            subSubjects.length * 2;

          if (mediumCols === 0) {
            return;
          }

          // =============================================
          // MEDIUM MERGE
          // =============================================

          merges.push({
            s: {
              r: 1,
              c: mediumStart,
            },
            e: {
              r: 1,
              c: mediumStart + mediumCols - 1,
            },
          });

          rows[1][mediumStart] = medium;

          // =============================================
          // SUB SUBJECTS
          // =============================================

          subSubjects.forEach((sub) => {
            // ===========================================
            // SUB SUBJECT MERGE
            // ===========================================

            merges.push({
              s: {
                r: 2,
                c: mediumStart,
              },
              e: {
                r: 2,
                c: mediumStart + 1,
              },
            });

            rows[2][mediumStart] = sub;

            // ===========================================
            // NAME
            // ===========================================

            rows[3][mediumStart] = "Name";

            // ===========================================
            // NUMBER
            // ===========================================

            rows[3][mediumStart + 1] = "Number";

            mediumStart += 2;
          });
        });

        colIndex += totalCols;
      }

      // ===================================================
      // NORMAL SUBJECT
      // ===================================================

      else {
        rows[0][startCol] = subject;

        // ===============================================
        // NORMAL SUBJECT MERGE
        // ===============================================

        merges.push({
          s: {
            r: 0,
            c: startCol,
          },
          e: {
            r: 2,
            c: startCol + 1,
          },
        });

        // ===============================================
        // NAME
        // ===============================================

        rows[3][startCol] = "Name";

        // ===============================================
        // NUMBER
        // ===============================================

        rows[3][startCol + 1] = "Number";

        colIndex += 2;
      }
    });

    // =====================================================
    // GET VERTICAL VALUES
    // =====================================================

    const getVerticalValues = (teachers, field) => {
      if (!Array.isArray(teachers)) {
        return "";
      }

      return teachers
        .map((teacher) =>
          String(
            teacher?.[field] ?? ""
          ).trim()
        )
        .filter((value) => value !== "")
        .join("\n");
    };

    // =====================================================
    // GET CLASS-WISE PRINCIPAL
    // =====================================================

    const getClassPrincipal = (
      school,
      className
    ) => {
      return String(
        school?.principal?.[className] ?? ""
      ).trim();
    };

    // =====================================================
    // GET CLASS-WISE REMARK
    // =====================================================

    const getClassRemark = (
      school,
      className
    ) => {
      return String(
        school?.remark?.[className] ?? ""
      ).trim();
    };

    // =====================================================
    // CHECK SCHOOL HAS DATA
    // =====================================================

    const checkSchoolHasData = (school) => {
      let filled = false;

      // ===================================================
      // CLASS 11 + CLASS 12
      // ===================================================

      [
        "Class 11",
        "Class 12",
      ].forEach((className) => {

        // ===============================================
        // CHECK PRINCIPAL
        // ===============================================

        const principal =
          getClassPrincipal(
            school,
            className
          );

        if (principal !== "") {
          filled = true;
        }

        // ===============================================
        // CHECK REMARK
        // ===============================================

        const classRemark =
          getClassRemark(
            school,
            className
          );

        if (classRemark !== "") {
          filled = true;
        }

        // ===============================================
        // CHECK YEARS
        // ===============================================

        validExportYears.forEach((year) => {
          const classData =
            school.classes?.[
              className
            ]?.[year];

          if (!classData) {
            return;
          }

          // =============================================
          // SUBJECTS
          // =============================================

          exportSubjects.forEach((subject) => {

            const data =
              classData?.[
                selectedType
              ]?.subjects?.[
                subject
              ];

            if (!data) {
              return;
            }

            // =========================================
            // GROUP SUBJECT
            // Subject -> Medium -> SubSubject -> Array
            // =========================================

            if (!Array.isArray(data)) {

              Object.values(data).forEach(
                (mediumData) => {

                  Object.values(
                    mediumData || {}
                  ).forEach(
                    (subArray) => {

                      if (!Array.isArray(subArray)) {
                        return;
                      }

                      subArray.forEach((item) => {

                        if (
                          String(
                            item?.teacherName ?? ""
                          ).trim() !== "" ||

                          String(
                            item?.number ?? ""
                          ).trim() !== "" ||

                          Number(
                            item?.qty || 0
                          ) > 0
                        ) {
                          filled = true;
                        }

                      });

                    }
                  );

                }
              );
            }

            // =========================================
            // NORMAL SUBJECT
            // =========================================

            else {

              data.forEach((item) => {

                if (
                  String(
                    item?.teacherName ?? ""
                  ).trim() !== "" ||

                  String(
                    item?.number ?? ""
                  ).trim() !== "" ||

                  Number(
                    item?.qty || 0
                  ) > 0
                ) {
                  filled = true;
                }

              });

            }

          });

        });

      });

      return filled;
    };

    // =====================================================
    // EXPORT SCHOOLS
    // =====================================================

    exportSchools.forEach(
      (school, index) => {

        const schoolHasFilledData =
          checkSchoolHasData(school);

        // ===============================================
        // FILLED EXPORT
        // ===============================================

        if (
          type === "filled" &&
          !schoolHasFilledData
        ) {
          return;
        }

        // ===============================================
        // EMPTY EXPORT
        // ===============================================

        if (
          type === "empty" &&
          schoolHasFilledData
        ) {
          return;
        }

        // ===============================================
        // CLASS 11 + CLASS 12
        // ===============================================

        [
          "Class 11",
          "Class 12",
        ].forEach((className) => {

          validExportYears.forEach((year) => {

            const classData =
              school.classes?.[
                className
              ]?.[year];

            // =========================================
            // PRINCIPAL
            // =========================================

            const principal =
              getClassPrincipal(
                school,
                className
              );

            // =========================================
            // REMARK
            // =========================================

            const classRemark =
              getClassRemark(
                school,
                className
              );

            // =========================================
            // BASE ROW
            // =========================================

            const row = [
              index + 1,
              school.code || "",
              school.schoolName || "",
              className,
              year,
              principal,
              classRemark,
            ];

            // =========================================
            // SUBJECT DATA
            // =========================================

            exportSubjects.forEach(
              (subject) => {

                const data =
                  classData?.[
                    selectedType
                  ]?.subjects?.[
                    subject
                  ];

                // =======================================
                // GROUP SUBJECT
                // =======================================

                if (
                  data &&
                  !Array.isArray(data)
                ) {

                  const mediumNames = [
                    "English Medium",
                    "Hindi Medium",
                  ];

                  mediumNames.forEach((medium) => {

                    const subSubjects =
                      exportSubjectGroups[
                        subject
                      ]?.[medium] || [];

                    subSubjects.forEach((sub) => {

                      const teachers =
                        data?.[
                          medium
                        ]?.[
                          sub
                        ] || [];

                      // =================================
                      // NAME
                      // =================================

                      const names =
                        getVerticalValues(
                          teachers,
                          "teacherName"
                        );

                      // =================================
                      // NUMBER
                      // =================================

                      const numbers =
                        getVerticalValues(
                          teachers,
                          "number"
                        );

                      // =================================
                      // ADD DATA
                      // =================================

                      row.push(
                        names,
                        numbers
                      );

                    });

                  });

                }

                // =======================================
                // NORMAL SUBJECT
                // =======================================

                else {

                  const teachers =
                    Array.isArray(data)
                      ? data
                      : [];

                  const names =
                    getVerticalValues(
                      teachers,
                      "teacherName"
                    );

                  const numbers =
                    getVerticalValues(
                      teachers,
                      "number"
                    );

                  row.push(
                    names,
                    numbers
                  );

                }

              }
            );

            // =========================================
            // EMPTY EXPORT
            // =========================================

            if (
              type === "empty" &&
              !schoolHasFilledData
            ) {

              if (
                !String(
                  classRemark || ""
                ).trim()
              ) {
                row[6] =
                  "Pending Book Entry";
              }

            }

            // =========================================
            // ADD ROW
            // =========================================

            rows.push(row);

          });

        });

      }
    );

    // =====================================================
    // NO DATA
    // =====================================================

    if (rows.length <= 4) {

      alert(
        type === "filled"
          ? `No filled school data found for ${validExportYears.join(
              ", "
            )}.`
          : `No empty school data found for ${validExportYears.join(
              ", "
            )}.`
      );

      return;
    }

    // =====================================================
    // CREATE SHEET
    // =====================================================

    const sheet =
      XLSX.utils.aoa_to_sheet(rows);

    // =====================================================
    // APPLY MERGES
    // =====================================================

    sheet["!merges"] = merges;

    // =====================================================
    // COLUMN WIDTHS
    // =====================================================

    const totalColumns =
      colIndex;

    sheet["!cols"] =
      Array.from(
        {
          length: totalColumns,
        },
        (_, index) => {

          // S.No
          if (index === 0) {
            return {
              wch: 8,
            };
          }

          // Code
          if (index === 1) {
            return {
              wch: 15,
            };
          }

          // School Name
          if (index === 2) {
            return {
              wch: 35,
            };
          }

          // Class
          if (index === 3) {
            return {
              wch: 12,
            };
          }

          // Year
          if (index === 4) {
            return {
              wch: 10,
            };
          }

          // Principal
          if (index === 5) {
            return {
              wch: 25,
            };
          }

          // Remarks
          if (index === 6) {
            return {
              wch: 30,
            };
          }

          // Name / Number
          return {
            wch: 22,
          };

        }
      );

    // =====================================================
    // CELL ALIGNMENT
    // =====================================================

    Object.keys(sheet).forEach(
      (cellAddress) => {

        if (
          cellAddress.startsWith("!")
        ) {
          return;
        }

        const cell =
          sheet[cellAddress];

        if (!cell) {
          return;
        }

        cell.s = {
          alignment: {
            wrapText: true,
            vertical: "center",
            horizontal: "center",
          },
        };

      }
    );

    // =====================================================
    // ROW HEIGHT
    // =====================================================

    sheet["!rows"] =
      rows.map(
        (row, rowIndex) => {

          // Header rows
          if (rowIndex < 4) {
            return {
              hpt: 25,
            };
          }

          let maxLines = 1;

          row.forEach(
            (value) => {

              if (
                typeof value === "string"
              ) {

                const lineCount =
                  value.split("\n").length;

                if (
                  lineCount > maxLines
                ) {
                  maxLines =
                    lineCount;
                }

              }

            }
          );

          return {
            hpt: Math.max(
              20,
              maxLines * 18
            ),
          };

        }
      );

    // =====================================================
    // CREATE WORKBOOK
    // =====================================================

    const wb =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      sheet,
      "School Records"
    );

    // =====================================================
    // FILE NAME
    // =====================================================

    const yearText =
      validExportYears.join("_");

    const fileName =
      type === "filled"
        ? `School_Filled_Records_${yearText}.xlsx`
        : `School_Empty_Records_${yearText}.xlsx`;

    // =====================================================
    // EXPORT FILE
    // =====================================================

    XLSX.writeFile(
      wb,
      fileName
    );

    // =====================================================
    // SUCCESS
    // =====================================================

    alert(
      `${
        type === "filled"
          ? "Filled"
          : "Empty"
      } records exported for: ${validExportYears.join(
        ", "
      )}`
    );

  } catch (error) {

    console.error(
      "Export failed:",
      error
    );

    alert(
      "Export failed. Please check your data."
    );
  }
};


const handleDeleteSchool = (schoolIndex) => {
  // ==========================================
  // INVALID INDEX CHECK
  // ==========================================

  if (
    schoolIndex === null ||
    schoolIndex === undefined ||
    schoolIndex < 0
  ) {
    return;
  }

  // ==========================================
  // CHECK SCHOOL EXISTS
  // ==========================================

  if (!schools[schoolIndex]) {
    alert("School not found.");
    return;
  }

  // ==========================================
  // CONFIRM DELETE
  // ==========================================

  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${schools[schoolIndex].schoolName}"?`
  );

  if (!confirmDelete) {
    return;
  }

  // ==========================================
  // DELETE SCHOOL
  // ==========================================

  setSchools((prev) =>
    prev.filter((_, index) => index !== schoolIndex)
  );

  // ==========================================
  // RESET SELECTED SCHOOL
  // ==========================================

  if (selectedSchool === schoolIndex) {
    setSelectedSchool(null);
  } else if (
    selectedSchool !== null &&
    selectedSchool > schoolIndex
  ) {
    // Delete hone ke baad indexes shift ho jayenge
    setSelectedSchool((prev) => prev - 1);
  }
};



const handleDeleteSubject = (subject) => {
  if (!subject || !subject.trim()) return;

  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${subject}" from all schools?`
  );

  if (!confirmDelete) return;

  // Remove main subject from header
  setSubjects((prev) =>
    prev.filter((item) => item !== subject)
  );

  // Remove subject group
  setSubjectGroups((prev) => {
    const updated = structuredClone(prev);

    delete updated[subject];

    return updated;
  });

  // Reset selected subject
  if (selectedSubject === subject) {
    setSelectedSubject("");
  }

  // Remove complete subject from ALL schools
  setSchools((prev) =>
    prev.map((school) => {
      const updated = structuredClone(school);

      ["Class 11", "Class 12"].forEach((className) => {
        const classData = updated.classes?.[className];

        if (!classData) return;

        Object.keys(classData).forEach((year) => {
          BOOK_TYPES.forEach((type) => {
  const subjectsData =
    classData[year]?.[type]?.subjects;

  if (!subjectsData) return;

  delete subjectsData[subject];
});
        });
      });

      return updated;
    })
  );
};




const handleDeleteMedium = (subject, medium) => {
  if (!subject || !medium) return;

  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${medium}" from "${subject}"?`
  );

  if (!confirmDelete) return;

  // ==========================================
  // HEADER SE MEDIUM HIDE
  // ==========================================

  setDeletedMediums((prev) => ({
    ...prev,
    [subject]: [
      ...(prev[subject] || []),
      medium,
    ],
  }));

  // ==========================================
  // ALL SCHOOLS SE MEDIUM DATA DELETE
  // ==========================================

  setSchools((prev) =>
    prev.map((school) => {
      const updated = structuredClone(school);

      ["Class 11", "Class 12"].forEach((className) => {
        const classData =
          updated.classes?.[className];

        if (!classData) return;

        Object.keys(classData).forEach((year) => {
        BOOK_TYPES.forEach((type) => {
  const subjectsData =
    classData[year]?.[type]?.subjects;

  if (!subjectsData) return;

  const subjectData =
    subjectsData[subject];

  if (!subjectData) return;

  delete subjectData[medium];
});
        });
      });

      return updated;
    })
  );
};



const handleDeleteSubSubject = (
  subject,
  medium,
  subSubject
) => {
  if (!subject || !medium || !subSubject) return;

  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${subSubject}" from "${subject}" (${medium})?`
  );

  if (!confirmDelete) return;

  // ==========================================
  // UNIQUE KEY
  // Science__Hindi Medium
  // ==========================================

  const key = `${subject}__${medium}`;

  // ==========================================
  // HEADER SE SUB-SUBJECT HIDE
  // ONLY THIS MEDIUM
  // ==========================================

  setDeletedSubSubjects((prev) => ({
    ...prev,
    [key]: [
      ...(prev[key] || []),
      subSubject,
    ],
  }));

  // ==========================================
  // ALL SCHOOLS SE DATA DELETE
  // ONLY THIS MEDIUM + SUB SUBJECT
  // ==========================================

  setSchools((prev) =>
    prev.map((school) => {
      const updated = structuredClone(school);

      ["Class 11", "Class 12"].forEach((className) => {
        const classData =
          updated.classes?.[className];

        if (!classData) return;

        Object.keys(classData).forEach((year) => {
       BOOK_TYPES.forEach((type) => {
  const subjectsData =
    classData[year]?.[type]?.subjects;

  if (!subjectsData) return;

  const subjectData =
    subjectsData[subject];

  if (!subjectData) return;

  const mediumData =
    subjectData[medium];

  if (!mediumData) return;

  delete mediumData[subSubject];
});
        });
      });

      return updated;
    })
  );
};



const handleAddYear = () => {
  // ==========================================
  // ENTER YEAR
  // ==========================================

  const year = prompt("Enter Year");

  if (year === null) {
    return;
  }

  const newYear = year.trim();

  // ==========================================
  // VALIDATE YEAR
  // ==========================================

  if (!/^\d{4}$/.test(newYear)) {
    alert("Please enter a valid 4 digit year.");
    return;
  }

  // ==========================================
  // CHECK DUPLICATE YEAR
  // ==========================================

  if (years.includes(newYear)) {
    alert(`Year ${newYear} already exists.`);
    return;
  }

  // ==========================================
  // ADD + SORT YEARS
  // ==========================================

  const updatedYears = [...years, newYear].sort(
    (a, b) => Number(a) - Number(b)
  );

  setYears(updatedYears);

  // ==========================================
  // ADD YEAR TO EVERY SCHOOL
  // ==========================================

  setSchools((prev) =>
    prev.map((school) => {
      const updated = structuredClone(school);

      // ========================================
      // MAKE SURE CLASSES EXIST
      // ========================================

      if (!updated.classes) {
        updated.classes = {};
      }

      // ========================================
      // CLASS 11 + CLASS 12
      // ========================================

      ["Class 11", "Class 12"].forEach((className) => {

        // --------------------------------------
        // CREATE CLASS IF MISSING
        // --------------------------------------

        if (!updated.classes[className]) {
          updated.classes[className] = {};
        }

        // --------------------------------------
        // CREATE NEW YEAR
        // --------------------------------------

        if (!updated.classes[className][newYear]) {

          updated.classes[className][newYear] =
            createYearData();

        }

        // --------------------------------------
        // SORT YEARS
        // --------------------------------------

        const sortedYears = Object.keys(
          updated.classes[className]
        )
          .sort((a, b) => Number(a) - Number(b))
          .reduce((result, yearKey) => {
            result[yearKey] =
              updated.classes[className][yearKey];

            return result;
          }, {});

        updated.classes[className] = sortedYears;
      });

      return updated;
    })
  );

  // ==========================================
  // SELECT NEW YEAR
  // ==========================================

  setSelectedYear(newYear);
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

  const groupSubjects = subjectGroups[selectedSubject];

  setSchools((prev) =>
    prev.map((school, index) => {
      if (index !== selectedSchool) return school;

      const updated = structuredClone(school);

      // ==========================================
      // MAKE SURE CLASS EXISTS
      // ==========================================

      if (!updated.classes) {
        updated.classes = {};
      }

      if (!updated.classes[selectedClass]) {
        updated.classes[selectedClass] = {};
      }

      // ==========================================
      // MAKE SURE YEAR EXISTS
      // ==========================================

     if (!updated.classes[selectedClass][selectedYear]) {
  updated.classes[selectedClass][selectedYear] =
    createYearData();
}

const yearData =
  updated.classes[selectedClass][selectedYear];

if (!yearData[selectedType]) {
  yearData[selectedType] = {
    subjects: {},
  };
}

if (!yearData[selectedType].subjects) {
  yearData[selectedType].subjects = {};
}

const subjectsData =
  yearData[selectedType].subjects;

      // ==========================================
      // GROUP SUBJECT
      // ==========================================

     if (groupSubjects) {
  if (!subjectsData[selectedSubject]) {
    subjectsData[selectedSubject] = {};
  }

  mediums.forEach((medium) => {
    if (!subjectsData[selectedSubject][medium]) {
      subjectsData[selectedSubject][medium] = {};
    }

    const mediumSubjects = groupSubjects[medium] || [];

    mediumSubjects.forEach((subSubject) => {
      if (
        !subjectsData[selectedSubject][medium][subSubject]
      ) {
        subjectsData[selectedSubject][medium][subSubject] = [];
      }

      subjectsData[selectedSubject][medium][subSubject].push({
        teacherName: "",
        number: "",
        qty: "",
      });
    });
  });
}

      // ==========================================
      // NORMAL SUBJECT
      // ==========================================

      else {
        if (!subjectsData[selectedSubject]) {
          subjectsData[selectedSubject] = [];
        }

        subjectsData[selectedSubject].push({
          teacherName: "",
          number: "",
          qty: "",
        });
      }

      return updated;
    })
  );
};



const addSubSubject = () => {
  // ==========================================
  // STEP 1: MAIN SUBJECT
  // ==========================================

  const mainSubject = prompt("Enter Main Subject");

  if (mainSubject === null) return;

  const main = mainSubject.trim();

  if (!main) return;


  // ==========================================
  // STEP 2: ENGLISH MEDIUM
  // ==========================================

  const englishInput = prompt(
    "Enter English Medium Sub Subjects\n" +
    "Example: Biology, Physics\n\n" +
    "If you don't want English Medium, click Cancel"
  );

  let englishList = [];

  if (englishInput !== null) {
    englishList = englishInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }


  // ==========================================
  // STEP 3: HINDI MEDIUM
  // ==========================================

  const hindiInput = prompt(
    "Enter Hindi Medium Sub Subjects\n" +
    "Example: Jeev Vigyan, Bhautik\n\n" +
    "If you don't want Hindi Medium, click Cancel"
  );

  let hindiList = [];

  if (hindiInput !== null) {
    hindiList = hindiInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }


  // ==========================================
  // IF BOTH ARE EMPTY
  // ==========================================

  if (
    englishList.length === 0 &&
    hindiList.length === 0
  ) {
    alert("Please enter at least one sub subject.");
    return;
  }


  // ==========================================
  // CHECK NEW MAIN SUBJECT
  // ==========================================

  const isNewMainSubject = !subjectGroups[main];


  // ==========================================
  // UPDATE SUBJECT GROUPS
  // ==========================================

  setSubjectGroups((prev) => {
    const updated = structuredClone(prev);

    // Create main subject if missing
    if (!updated[main]) {
      updated[main] = {
        "English Medium": [],
        "Hindi Medium": [],
      };
    }

    // Make sure mediums exist
    if (!updated[main]["English Medium"]) {
      updated[main]["English Medium"] = [];
    }

    if (!updated[main]["Hindi Medium"]) {
      updated[main]["Hindi Medium"] = [];
    }


    // ==========================================
    // ADD ENGLISH SUB SUBJECTS
    // ==========================================

    englishList.forEach((sub) => {
      if (
        !updated[main]["English Medium"].includes(sub)
      ) {
        updated[main]["English Medium"].push(sub);
      }
    });


    // ==========================================
    // ADD HINDI SUB SUBJECTS
    // ==========================================

    hindiList.forEach((sub) => {
      if (
        !updated[main]["Hindi Medium"].includes(sub)
      ) {
        updated[main]["Hindi Medium"].push(sub);
      }
    });


    return updated;
  });


  // ==========================================
  // ADD MAIN SUBJECT TO HEADER
  // ==========================================

  if (isNewMainSubject) {
    setSubjects((prev) => {
      if (prev.includes(main)) {
        return prev;
      }

      return [...prev, main];
    });
  }


  // ==========================================
  // UPDATE ALL SCHOOL DATA
  // ==========================================

  setSchools((prev) =>
    prev.map((school) => {
      const updated = structuredClone(school);

      Object.keys(updated.classes || {}).forEach(
        (className) => {

          Object.keys(
            updated.classes[className] || {}
          ).forEach((year) => {

            const yearData =
              updated.classes[className][year];

            if (!yearData) return;


            BOOK_TYPES.forEach((type) => {

              // Create book type
              if (!yearData[type]) {
                yearData[type] = {
                  subjects: {},
                };
              }


              // Create subjects
              if (!yearData[type].subjects) {
                yearData[type].subjects = {};
              }


              const subjectsData =
                yearData[type].subjects;


              // Create main subject
              if (!subjectsData[main]) {
                subjectsData[main] = {};
              }


              // ==================================
              // ENGLISH MEDIUM
              // ==================================

              if (
                englishList.length > 0
              ) {

                if (
                  !subjectsData[main]["English Medium"]
                ) {
                  subjectsData[main]["English Medium"] =
                    {};
                }

                englishList.forEach((sub) => {

                  if (
                    !subjectsData[main]["English Medium"][sub]
                  ) {
                    subjectsData[main]["English Medium"][sub] =
                      [];
                  }

                });
              }


              // ==================================
              // HINDI MEDIUM
              // ==================================

              if (
                hindiList.length > 0
              ) {

                if (
                  !subjectsData[main]["Hindi Medium"]
                ) {
                  subjectsData[main]["Hindi Medium"] =
                    {};
                }

                hindiList.forEach((sub) => {

                  if (
                    !subjectsData[main]["Hindi Medium"][sub]
                  ) {
                    subjectsData[main]["Hindi Medium"][sub] =
                      [];
                  }

                });
              }

            });

          });

        });

      return updated;
    })
  );
};


  return (

    <div className="min-h-screen bg-slate-100 p-8 space-y-8">


      {/* ================= HEADER ================= */}


      {/* BLUE HEADER */}
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

<div className="flex flex-wrap gap-4">



            {/* IMPORT EXCEL BUTTON */}

   <ImportExcel
  setSchools={setSchools}
  subjects={subjects}
  subjectGroups={subjectGroups}
  selectedType={selectedType}
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
  onClick={addSubSubject}
>
  Add Subject
</button>

            <button
onClick={() => handleExport("filled")}
className="bg-green-600 text-white px-5 py-3 rounded-xl"
>
Export Filled
</button>
<button
  disabled
  className="
    bg-gray-400
    text-gray-200
    px-5
    py-3
    rounded-xl
    cursor-not-allowed
    opacity-60
  "
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
  // ==========================================
  // SCHOOL NAME - REQUIRED
  // ==========================================

  const schoolName = prompt("Enter School Name");

  if (schoolName === null) {
    return;
  }

  const trimmedSchoolName = schoolName.trim();

  if (!trimmedSchoolName) {
    alert("School Name is required.");
    return;
  }


  const code = prompt("Enter School Code (Optional)");

  const trimmedCode = code?.trim() || "";

  const newSchool = {
    id: Date.now(),

    code: trimmedCode,

    
    schoolName: trimmedSchoolName,

    remark: "",

    classes: {
      "Class 11": Object.fromEntries(
        years.map((year) => [
          year,
          createYearData(),
        ])
      ),

      "Class 12": Object.fromEntries(
        years.map((year) => [
          year,
          createYearData(),
        ])
      ),
    },
  };

  

  setSchools((prev) => [
    ...prev,
    newSchool,
  ]);
}}
>
  <FiUsers />
  Add School
</button>

          </div>


</div>

<div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"></div>


      </div>

<div className="flex items-center gap-3">

  {/* ADD YEAR */}
  <button
    onClick={handleAddYear}
    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
  >
    + Add Year
  </button>

  {/* EXPORT YEAR */}
  {/* ================= EXPORT YEAR ================= */}
<div className="relative z-[9999]">
  <details className="relative z-[9999]">

    <summary
      className="
        list-none
        cursor-pointer
        rounded-lg
        bg-blue-600
        px-5
        py-2
        text-white
        hover:bg-blue-700
        select-none
        flex
        items-center
        gap-2
      "
    >
      Export Year
      <span>▼</span>
    </summary>

    {/* DROPDOWN */}
    <div
      className="
        absolute
        left-0
        top-full
        mt-2
        z-[99999]
        w-48
        rounded-xl
        border
        border-slate-200
        bg-white
        p-3
        shadow-2xl
      "
    >

      {/* YEARS */}
      {years.map((year) => (
        <label
          key={year}
          className="
            flex
            cursor-pointer
            items-center
            gap-3
            rounded-lg
            px-3
            py-2
            text-slate-800
            hover:bg-slate-100
          "
        >
          <input
            type="checkbox"
            checked={selectedExportYears.includes(year)}
            onChange={() => toggleExportYear(year)}
            className="h-4 w-4 cursor-pointer"
          />

          <span className="font-medium">
            {year}
          </span>
        </label>
      ))}

    </div>

  </details>
</div>

</div>
      {/* ================= TABLE ================= */}

<SchoolTable
  schools={schools}
  setSchools={setSchools}
  subjects={subjects}
  subjectGroups={subjectGroups}
  setSubjectGroups={setSubjectGroups}
  mediums={mediums}
  years={years}
  selectedSchool={selectedSchool}

  selectedType={selectedType}
  setSelectedType={setSelectedType}
  BOOK_TYPES={BOOK_TYPES}

  deletedMediums={deletedMediums}
  deletedSubSubjects={deletedSubSubjects}
  setDeletedSubSubjects={setDeletedSubSubjects}

  handleInputChange={handleInputChange}
  handleDeleteSchool={handleDeleteSchool}
  handleDeleteSubject={handleDeleteSubject}
  handleDeleteMedium={handleDeleteMedium}
  handleDeleteSubSubject={handleDeleteSubSubject}
/>
</div>

  );

}