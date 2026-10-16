import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx-js-style";
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
const [selectedExportClass, setSelectedExportClass] = useState("both");

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
    const saved = localStorage.getItem("schoolSubjectGroups");

    const defaultGroups = {
      Science: {
        "English Medium": [
          "Chemistry",
          "Physics",
          "Biology",
          "Mathematics",
        ],
        "Hindi Medium": [
          "रसायन",
          "भौतिक",
          "जीव विज्ञान",
          "गणित",
        ],
      },

      Commerce: {
        "English Medium": [
          "Accounts",
          "Business Studies",
          "Economics",
        ],
        "Hindi Medium": [
          "लेखाशास्त्र",
          "व्यवसाय अध्ययन",
          "अर्थशास्त्र",
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
          "राजनीति विज्ञान",
          "भूगोल",
          "इतिहास",
          "अर्थशास्त्र",
          "समाजशास्त्र",
        ],
      },

      Agriculture: {
        "English Medium": [
          "Horticulture",
          "Animal Husbandry",
          "Crop Production",
        ],
        "Hindi Medium": [
          "कृषि विज्ञान",
          "पशु विज्ञान",
          "फसल विज्ञान",
        ],
      },

      Bharti: {
        "English Medium": [
          "Hindi",
          "English",
          "Sanskrit",
        ],
        "Hindi Medium": [
          "हिंदी",
          "अंग्रेज़ी",
          "संस्कृत",
        ],
      },
    };

    const hindiMap = {
      Rasayan: "रसायन",
      Bhautik: "भौतिक",
      "Jeev Vigyan": "जीव विज्ञान",
      Ganit: "गणित",
      Lekhashastra: "लेखाशास्त्र",
      "Vyavsay Adhyayan": "व्यवसाय अध्ययन",
      Arthashastra: "अर्थशास्त्र",
      "Bahi Khata": "बही खाता",
      "Rajneeti Vigyan": "राजनीति विज्ञान",
      Bhugol: "भूगोल",
      Itihas: "इतिहास",
      Samajshastra: "समाजशास्त्र",
      "krishi vigyan": "कृषि विज्ञान",
      Pashupalan: "पशु विज्ञान",
      "Fasal Utpadan": "फसल विज्ञान",
      Hindi: "हिंदी",
      Angrezi: "अंग्रेज़ी",
      Sanskrit: "संस्कृत",
    };

    if (!saved) {
      return defaultGroups;
    }

    const parsed = JSON.parse(saved);
    const updated = { ...defaultGroups };

    // Keep existing subjects and custom groups
    Object.keys(parsed).forEach((subject) => {
      updated[subject] = {
        ...(defaultGroups[subject] || {}),
        ...parsed[subject],
      };
    });

    // Convert only Hindi Medium names
    Object.keys(updated).forEach((subject) => {
      const groups = updated[subject];
      const hindiSubjects = groups?.["Hindi Medium"];

      if (Array.isArray(hindiSubjects)) {
        updated[subject] = {
          ...groups,
          "Hindi Medium": hindiSubjects.map(
            (name) => hindiMap[name] || name
          ),
        };
      }
    });

    localStorage.setItem(
      "schoolSubjectGroups",
      JSON.stringify(updated)
    );

    return updated;
  } catch (error) {
    console.error("Error loading subject groups:", error);
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

const exportClassNames =
  selectedExportClass === "both"
    ? ["Class 11", "Class 12"]
    : [`Class ${selectedExportClass}`];

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
    // VALIDATE YEARS
    // =====================================================

    const validExportYears = selectedExportYears.filter((year) =>
      exportYears.some(
        (existingYear) => String(existingYear) === String(year)
      )
    );

    if (validExportYears.length === 0) {
      alert("Selected export years are not available.");
      return;
    }

    // ====================================================
    // HELPERS
    // =====================================================
const classNames = exportClassNames;

    const mediumNames = ["English Medium", "Hindi Medium"];

    const getVerticalValues = (items, field) => {
      if (!Array.isArray(items)) return "";

      return items
        .map((item) => String(item?.[field] ?? "").trim())
        .filter(Boolean)
        .join("\n");
    };

    const getClassPrincipal = (school, className) =>
      String(school?.principal?.[className] ?? "").trim();

    const getClassRemark = (school, className) =>
      String(school?.remark?.[className] ?? "").trim();

    const hasItemData = (items) => {
      if (!Array.isArray(items)) return false;

      return items.some(
        (item) =>
          String(item?.teacherName ?? "").trim() !== "" ||
          String(item?.number ?? "").trim() !== "" ||
          Number(item?.qty || 0) > 0
      );
    };

    const hasSubjectData = (subjectData) => {
      if (Array.isArray(subjectData)) {
        return hasItemData(subjectData);
      }

      if (!subjectData || typeof subjectData !== "object") {
        return false;
      }

      return Object.values(subjectData).some((mediumData) => {
        if (!mediumData || typeof mediumData !== "object") {
          return false;
        }

        return Object.values(mediumData).some((subItems) =>
          hasItemData(subItems)
        );
      });
    };

    const getSchoolClassData = (school, className, year) =>
      school?.classes?.[className]?.[year];

    // =====================================================
    // CHECK DATA FOR SELECTED TYPE AND SELECTED YEARS
    // =====================================================

    const checkSchoolHasData = (school) => {
      return classNames.some((className) => {
        const principal = getClassPrincipal(school, className);
        const remark = getClassRemark(school, className);

        if (principal || remark) return true;

        return validExportYears.some((year) => {
          const classData = getSchoolClassData(
            school,
            className,
            year
          );

          const subjectData =
            classData?.[selectedType]?.subjects || {};

          return exportSubjects.some((subject) =>
            hasSubjectData(subjectData[subject])
          );
        });
      });
    };

    // =====================================================
    // DETERMINE WHICH SUBJECT COLUMNS CONTAIN DATA
    // FILLED EXPORT: ONLY EXPORT SUBJECTS WITH DATA
    // EMPTY EXPORT: KEEP ALL SUBJECTS FOR DATA ENTRY
    // =====================================================

    const activeSubjects = exportSubjects.filter((subject) => {
      if (type === "empty") return true;

      return exportSchools.some((school) =>
        classNames.some((className) =>
          validExportYears.some((year) => {
            const classData = getSchoolClassData(
              school,
              className,
              year
            );

            const data =
              classData?.[selectedType]?.subjects?.[subject];

            return hasSubjectData(data);
          })
        )
      );
    });

    // =====================================================
    // BUILD FOUR HEADER ROWS
    // =====================================================

    const rows = [
      ["S.No", "Code", "School Name", "Class", "Year", "Principal", "Remarks"],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
    ];

    const merges = [];

    // =====================================================
    // COMMON HEADERS MERGE
    // =====================================================

    for (let col = 0; col < 7; col++) {
      merges.push({
        s: { r: 0, c: col },
        e: { r: 3, c: col },
      });
    }

    // =====================================================
    // BUILD SUBJECT / MEDIUM / SUB-SUBJECT HEADERS
    // =====================================================

    const columnDefinitions = [];
    let colIndex = 7;

    activeSubjects.forEach((subject) => {
      const group = exportSubjectGroups?.[subject];

      if (group) {
        const mediumDefinitions = mediumNames
          .map((medium) => ({
            medium,
            subSubjects: Array.isArray(group?.[medium])
              ? group[medium]
              : [],
          }))
          .filter((item) => item.subSubjects.length > 0);

        const totalCols = mediumDefinitions.reduce(
          (sum, item) => sum + item.subSubjects.length * 2,
          0
        );

        if (totalCols === 0) return;

        const subjectStart = colIndex;

        merges.push({
          s: { r: 0, c: subjectStart },
          e: { r: 0, c: subjectStart + totalCols - 1 },
        });

        rows[0][subjectStart] = subject;

        mediumDefinitions.forEach(({ medium, subSubjects }) => {
          const mediumStart = colIndex;
          const mediumCols = subSubjects.length * 2;

          merges.push({
            s: { r: 1, c: mediumStart },
            e: { r: 1, c: mediumStart + mediumCols - 1 },
          });

          rows[1][mediumStart] = medium;

          subSubjects.forEach((sub) => {
            merges.push({
              s: { r: 2, c: colIndex },
              e: { r: 2, c: colIndex + 1 },
            });

            rows[2][colIndex] = sub;
            rows[3][colIndex] = "Name";
            rows[3][colIndex + 1] = "Number";

            columnDefinitions.push({
              subject,
              medium,
              subSubject: sub,
              nameCol: colIndex,
              numberCol: colIndex + 1,
              grouped: true,
            });

            colIndex += 2;
          });
        });
      } else {
        const subjectStart = colIndex;

        merges.push({
          s: { r: 0, c: subjectStart },
          e: { r: 2, c: subjectStart + 1 },
        });

        rows[0][subjectStart] = subject;
        rows[3][subjectStart] = "Name";
        rows[3][subjectStart + 1] = "Number";

        columnDefinitions.push({
          subject,
          medium: null,
          subSubject: null,
          nameCol: subjectStart,
          numberCol: subjectStart + 1,
          grouped: false,
        });

        colIndex += 2;
      }
    });

    // =====================================================
    // EXPORT SCHOOL / CLASS / YEAR ROWS
    // =====================================================

    exportSchools.forEach((school, schoolIndex) => {
      const schoolHasData = checkSchoolHasData(school);

      if (type === "filled" && !schoolHasData) return;
      if (type === "empty" && schoolHasData) return;

      classNames.forEach((className) => {
        validExportYears.forEach((year) => {
          const classData = getSchoolClassData(
            school,
            className,
            year
          );

          const row = Array(colIndex).fill("");

          row[0] = schoolIndex + 1;
          row[1] = school?.code || "";
          row[2] = school?.schoolName || "";
          row[3] = className;
          row[4] = year;
          row[5] = getClassPrincipal(school, className);
          row[6] = getClassRemark(school, className);

          const subjectData =
            classData?.[selectedType]?.subjects || {};

          // Use each column's own subject path.
          // Physics values can never shift into Chemistry columns.
          columnDefinitions.forEach((definition) => {
            const {
              subject,
              medium,
              subSubject,
              nameCol,
              numberCol,
              grouped,
            } = definition;

            const data = subjectData[subject];

            let items = [];

            if (grouped) {
              const mediumData = data?.[medium];
              const subItems = mediumData?.[subSubject];

              items = Array.isArray(subItems) ? subItems : [];
            } else {
              items = Array.isArray(data) ? data : [];
            }

            row[nameCol] = getVerticalValues(items, "teacherName");
            row[numberCol] = getVerticalValues(items, "number");
          });

          if (
            type === "empty" &&
            !String(row[6] || "").trim()
          ) {
            row[6] = "Pending Book Entry";
          }

          rows.push(row);
        });
      });
    });

    // =====================================================
    // CHECK RESULT
    // =====================================================

    if (rows.length <= 4) {
      alert(
        type === "filled"
          ? `No filled school data found for ${validExportYears.join(", ")}.`
          : `No empty school data found for ${validExportYears.join(", ")}.`
      );
      return;
    }

    // =====================================================
    // CREATE WORKSHEET
    // =====================================================


const sheet = XLSX.utils.aoa_to_sheet(rows);

// School Name column: wrap text and prevent overlap
sheet["!cols"] = sheet["!cols"] || [];
sheet["!cols"][2] = {
  ...sheet["!cols"][2],
  wch: 30,
};

// Increase data row height
sheet["!rows"] = sheet["!rows"] || [];


for (let r = 4; r < rows.length; r++) {
  const cellAddress = XLSX.utils.encode_cell({
    r,
    c: 2,
  });

  if (sheet[cellAddress]) {
    sheet[cellAddress].s = {
      ...sheet[cellAddress].s,
      alignment: {
        ...sheet[cellAddress].s?.alignment,
        wrapText: true,
        vertical: "center",
      },
    };
  }

  sheet["!rows"][r] = {
    ...sheet["!rows"][r],
    hpt: 45,
  };
}



    sheet["!merges"] = merges;

    // =====================================================
    // COLUMN WIDTHS
    // =====================================================

    sheet["!cols"] = Array.from(
      { length: colIndex },
      (_, index) => {
        if (index === 0) return { wch: 8 };
        if (index === 1) return { wch: 15 };
        if (index === 2) return { wch: 35 };
        if (index === 3) return { wch: 13 };
        if (index === 4) return { wch: 12 };
        if (index === 5) return { wch: 25 };
        if (index === 6) return { wch: 30 };

        return { wch: 22 };
      }
    );

    // =====================================================
    // LIGHT COLOURFUL HEADERS + CENTER ALIGNMENT
    // =====================================================

    const headerColors = {
      common: "DCE6F1",
      subject: "D9EAD3",
      english: "DDEBF7",
      hindi: "FCE4D6",
      subSubject: "E4DFEC",
      nameNumber: "FFF2CC",
    };

    const borderStyle = {
      top: { style: "thin", color: { rgb: "B7C9D6" } },
      bottom: { style: "thin", color: { rgb: "B7C9D6" } },
      left: { style: "thin", color: { rgb: "B7C9D6" } },
      right: { style: "thin", color: { rgb: "B7C9D6" } },
    };

    const applyCellStyle = (
      cell,
      {
        fillColor,
        bold = false,
        fontColor = "263238",
        fontSize = 10,
      } = {}
    ) => {
      cell.s = {
        alignment: {
          horizontal: "center",
          vertical: "center",
          wrapText: true,
        },
        font: {
          bold,
          color: { rgb: fontColor },
          sz: fontSize,
        },
        border: borderStyle,
        ...(fillColor
          ? {
              fill: {
                patternType: "solid",
                fgColor: { rgb: fillColor },
              },
            }
          : {}),
      };
    };

    // Common header cells
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let col = 0; col < 7; col++) {
        const address = XLSX.utils.encode_cell({
          r: rowIndex,
          c: col,
        });

        if (sheet[address]) {
          applyCellStyle(sheet[address], {
            fillColor: headerColors.common,
            bold: true,
            fontSize: 11,
          });
        }
      }
    }

    // Subject / medium / sub-subject / Name / Number
    columnDefinitions.forEach((definition) => {
      const {
        subject,
        medium,
        subSubject,
        nameCol,
        numberCol,
        grouped,
      } = definition;

      const subjectCell = XLSX.utils.encode_cell({
        r: 0,
        c: nameCol,
      });

      if (sheet[subjectCell]) {
        applyCellStyle(sheet[subjectCell], {
          fillColor: headerColors.subject,
          bold: true,
          fontSize: 12,
        });
      }

      if (grouped) {
        const mediumCell = XLSX.utils.encode_cell({
          r: 1,
          c: nameCol,
        });

        if (sheet[mediumCell]) {
          applyCellStyle(sheet[mediumCell], {
            fillColor:
              medium === "Hindi Medium"
                ? headerColors.hindi
                : headerColors.english,
            bold: true,
            fontSize: 11,
          });
        }

        const subCell = XLSX.utils.encode_cell({
          r: 2,
          c: nameCol,
        });

        if (sheet[subCell]) {
          applyCellStyle(sheet[subCell], {
            fillColor: headerColors.subSubject,
            bold: true,
            fontSize: 10,
          });
        }
      }

      [nameCol, numberCol].forEach((col) => {
        const cellAddress = XLSX.utils.encode_cell({
          r: 3,
          c: col,
        });

        if (sheet[cellAddress]) {
          applyCellStyle(sheet[cellAddress], {
            fillColor: headerColors.nameNumber,
            bold: true,
            fontSize: 10,
          });
        }
      });
    });

    // Center-align data rows and add borders.
    for (let r = 4; r < rows.length; r++) {
      for (let c = 0; c < colIndex; c++) {
        const address = XLSX.utils.encode_cell({ r, c });

        if (!sheet[address]) continue;

        sheet[address].s = {
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          border: borderStyle,
        };
      }
    }

    // =====================================================
    // ROW HEIGHTS
    // =====================================================

    sheet["!rows"] = rows.map((row, rowIndex) => {
      if (rowIndex === 0) return { hpt: 30 };
      if (rowIndex === 1) return { hpt: 27 };
      if (rowIndex === 2) return { hpt: 27 };
      if (rowIndex === 3) return { hpt: 25 };

      let maxLines = 1;

      row.forEach((value) => {
        if (typeof value === "string") {
          maxLines = Math.max(maxLines, value.split("\n").length);
        }
      });

      return {
  hpt: Math.max(45, maxLines * 18),
};
    });

    // =====================================================
    // FREEZE HEADER ROWS + COMMON COLUMNS
    // =====================================================

    sheet["!freeze"] = {
      xSplit: 7,
      ySplit: 4,
      topLeftCell: "H5",
      activePane: "bottomRight",
      state: "frozen",
    };

    // =====================================================
    // CREATE WORKBOOK
    // =====================================================

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      sheet,
      "School Records"
    );

    // =====================================================
    // EXPORT FILE
    // =====================================================

    const yearText = validExportYears.join("_");

   
const classText =
  selectedExportClass === "both"
    ? "Class11_12"
    : `Class${selectedExportClass}`;

const fileName =
  type === "filled"
    ? `School_Filled_${classText}_${yearText}.xlsx`
    : `School_Empty_${classText}_${yearText}.xlsx`;


    XLSX.writeFile(wb, fileName);

    alert(
      `${type === "filled" ? "Filled" : "Empty"} records exported for: ${validExportYears.join(", ")}`
    );
  } catch (error) {
    console.error("Export failed:", error);

    alert("Export failed. Please check your data.");
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
  // CHECK MAIN SUBJECT
  // ==========================================

  const isNewMainSubject = !subjectGroups[main];


  // ==========================================
  // UPDATE SUBJECT GROUPS
  // ==========================================

setSubjectGroups((prev) => {
  const updated = structuredClone(prev || {});

  // Create main subject if missing
  if (!updated[main]) {
    updated[main] = {
      "English Medium": [],
      "Hindi Medium": [],
    };
  }

  // Keep existing data and normalize arrays
  ["English Medium", "Hindi Medium"].forEach((medium) => {
    const existing = updated[main][medium];

    if (Array.isArray(existing)) {
      updated[main][medium] = existing;
    } else if (existing && typeof existing === "object") {
      // Preserve old object-format subject names
      updated[main][medium] = Object.keys(existing);
    } else {
      updated[main][medium] = [];
    }
  });

  // Add English sub-subjects
  englishList.forEach((sub) => {
    const name = sub.trim();

    if (
      name &&
      !updated[main]["English Medium"].some(
        (item) =>
          item.toLowerCase() === name.toLowerCase()
      )
    ) {
      updated[main]["English Medium"].push(name);
    }
  });

  // Add Hindi sub-subjects
  hindiList.forEach((sub) => {
    const name = sub.trim();

    if (
      name &&
      !updated[main]["Hindi Medium"].some(
        (item) =>
          item.toLowerCase() === name.toLowerCase()
      )
    ) {
      updated[main]["Hindi Medium"].push(name);
    }
  });

  console.log(
    "UPDATED SUBJECT GROUP:",
    JSON.stringify(updated[main], null, 2)
  );

  return updated;
});



  // ==========================================
  // ADD MAIN SUBJECT TO HEADER
  // ONLY IF NEW
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


            // ==================================
            // BOOK TYPES
            // ==================================

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


              // ==================================
              // MAIN SUBJECT
              // ==================================

              if (!subjectsData[main]) {
                subjectsData[main] = {};
              }


              // ==================================
              // ENGLISH MEDIUM
              // ==================================

              if (englishList.length > 0) {

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

              if (hindiList.length > 0) {

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
    font-bold
    text-slate-900
    shadow-lg
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-2xl
    text-2xl
  "
  onClick={addSubSubject}
>
  Add Subject
</button>

            <button
onClick={() => handleExport("filled")}
className="bg-green-600 text-white px-5 py-3 rounded-xl text-2xl font-bold"
>
Export Filled
</button>
<button
  disabled
  className="
    bg-gray-400
    text-black
    font-bold
    text-2xl
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
    font-bold
    text-2xl
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
    className=" text-black font-bold text-2xl px-5 py-2 rounded-lg "
  >
    + Add Year
  </button>

    <select
  className="text-xl font-bold p-2 rounded-lg border border-gray-300"
  value={selectedExportClass}
  onChange={(e) => setSelectedExportClass(e.target.value)}
>
  <option value="11">Class 11</option>
  <option value="12">Class 12</option>
  <option value="both">Both Classes (11 + 12)</option>
</select>

  {/* EXPORT YEAR */}
  {/* ================= EXPORT YEAR ================= */}
<div className="relative z-[9999]">
  <details className="relative z-[9999]">

    <summary
      className="
        list-none
        cursor-pointer
        rounded-lg
        text-2xl
        font-bold
        px-5
        py-2
        text-black
      
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
            text-black
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