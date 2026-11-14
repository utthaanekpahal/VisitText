
import React from "react";
import * as XLSX from "xlsx-js-style";


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
export default function SecondaryExcel({
  schools,
  setSchools,
  selectedLocation,
  selectedMedium,
}) {
  const visibleSubjects = selectedMedium
    ? SUBJECTS[selectedMedium]
    : [
        ...(SUBJECTS.English || []),
        ...(SUBJECTS.Hindi || []),
      ];
  // EXPORT EXCEL
 


const handleExport = () => {
  try {
    const rows = [];

    // 1. DETERMINE MEDIUMS TO EXPORT
    const mediumsToExport = selectedMedium
      ? [selectedMedium]
      : ["English", "Hindi"];

    // 2. LOCATION INFORMATION
    const locationText =
      `State: ${selectedLocation?.state || "N/A"}   |   ` +
      `Division: ${selectedLocation?.division || "N/A"}   |   ` +
      `Area: ${selectedLocation?.area || "N/A"}   |   ` +
      `Agent: ${selectedLocation?.agent || "N/A"}`;

    rows.push([locationText]);

    // 3. GET SUBJECTS FOR SELECTED MEDIUMS
    const allSubjects = mediumsToExport.flatMap((medium) =>
      (SUBJECTS[medium] || []).map((subject) => ({
        subject,
        medium,
      }))
    );

    // 4. MAIN HEADINGS
    rows.push([
      "S.No.",
      "School Code",
      "School Name",
      "Class",
      ...allSubjects.flatMap(({ subject }) => [subject, ""]),
    ]);

    // 5. SECOND HEADINGS
    rows.push([
      "",
      "",
      "",
      "",
      ...allSubjects.flatMap(() => ["Name", "Number"]),
    ]);

    // 6. SCHOOL DATA
    schools.forEach((school, index) => {
      ["Class 9", "Class 10"].forEach((className) => {
        const row = [
          index + 1,
          school.schoolCode || "",
          school.schoolName || "",
          className,
        ];

        // English and Hindi data in the SAME ROW
        allSubjects.forEach(({ subject, medium }) => {
          const subjectData =
            school.classes?.[className]?.[medium]?.[subject] ||
            school.classes?.[className]?.[subject] ||
            {};

          row.push(subjectData.name || "");
          row.push(subjectData.number || "");
        });

        rows.push(row);
      });
    });

    // 7. CREATE WORKSHEET
    const worksheet = XLSX.utils.aoa_to_sheet(rows);

    const lastCol = rows[1].length - 1;

    // 8. MERGES
    const merges = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: lastCol },
      },
    ];

    // Merge common headings vertically
    for (let c = 0; c < 4; c++) {
      merges.push({
        s: { r: 1, c },
        e: { r: 2, c },
      });
    }

    // Merge subject headings horizontally
    let col = 4;

    allSubjects.forEach(() => {
      merges.push({
        s: { r: 1, c: col },
        e: { r: 1, c: col + 1 },
      });

      col += 2;
    });

    worksheet["!merges"] = merges;

    // 9. COLUMN WIDTHS
    worksheet["!cols"] = rows[1].map((_, index) => ({
      wch:
        index === 0 ? 10 :
        index === 1 ? 18 :
        index === 2 ? 35 :
        index === 3 ? 15 :
        22,
    }));

    // 10. BORDER
    const border = {
      top: { style: "thin", color: { rgb: "808080" } },
      bottom: { style: "thin", color: { rgb: "808080" } },
      left: { style: "thin", color: { rgb: "808080" } },
      right: { style: "thin", color: { rgb: "808080" } },
    };

    // 11. STYLE FUNCTION
    const styleCell = (cell, color, size = 11, bold = true) => {
      if (!cell) return;

      cell.s = {
        fill: {
          patternType: "solid",
          fgColor: { rgb: color },
        },
        font: {
          bold,
          color: { rgb: "000000" },
          sz: size,
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
          wrapText: true,
        },
        border,
      };
    };

    // 12. LOCATION STYLE
    styleCell(worksheet["A1"], "D9EAF7", 12);

    if (worksheet["A1"]) {
      worksheet["A1"].s.alignment.horizontal = "left";
    }

    // 13. COMMON HEADINGS
    for (let c = 0; c < 4; c++) {
      styleCell(
        worksheet[XLSX.utils.encode_cell({ r: 1, c })],
        "DCE6F1",
        12
      );
    }

    // 14. SUBJECT HEADINGS
    for (let c = 4; c <= lastCol; c += 2) {
      const subjectIndex = (c - 4) / 2;
      const medium = allSubjects[subjectIndex]?.medium;

      styleCell(
        worksheet[XLSX.utils.encode_cell({ r: 1, c })],
        medium === "Hindi" ? "FCE4D6" : "D9EAD3",
        12
      );
    }

    // 15. NAME AND NUMBER HEADINGS
    for (let c = 4; c <= lastCol; c++) {
      styleCell(
        worksheet[XLSX.utils.encode_cell({ r: 2, c })],
        "FFF2CC",
        10
      );
    }

    // 16. DATA CELL STYLE
    for (let r = 3; r < rows.length; r++) {
      for (let c = 0; c < rows[r].length; c++) {
        const address = XLSX.utils.encode_cell({ r, c });

        if (!worksheet[address]) continue;

        worksheet[address].s = {
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          border,
        };
      }
    }

    // 17. ROW HEIGHTS
    worksheet["!rows"] = [
      { hpt: 30 },
      { hpt: 35 },
      { hpt: 28 },
      ...rows.slice(3).map(() => ({ hpt: 35 })),
    ];

    // 18. WORKBOOK
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Secondary Records"
    );

    // 19. EXPORT FILE
    XLSX.writeFile(
      workbook,
      `Secondary_${mediumsToExport.join("_")}_Records.xlsx`
    );

    alert("Excel exported successfully!");

  } catch (error) {
    console.error("Export failed:", error);
    alert("Export failed: " + error.message);
  }
};




  // IMPORT EXCEL

const handleImport = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const workbook = XLSX.read(event.target.result, {
        type: "array",
        codepage: 65001,
      });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
      });

      // Find header row
      const headerIndex = rows.findIndex((row) => {
        const headers = row.map((cell) =>
          String(cell).trim().toLowerCase()
        );

        return (
          headers.includes("school code") &&
          headers.includes("school name")
        );
      });

      if (headerIndex === -1) {
        alert("School Code and School Name headings not found.");
        return;
      }

      const headers = rows[headerIndex].map((cell) =>
        String(cell).trim().toLowerCase()
      );

      const codeIndex = headers.indexOf("school code");
      const nameIndex = headers.indexOf("school name");

      // Find Medium column
      const mediumIndex = headers.indexOf("medium");

      const schoolMap = new Map();

      rows.slice(headerIndex + 1).forEach((row) => {
        const code = String(row[codeIndex] || "").trim();
        const name = String(row[nameIndex] || "").trim();

        // School name is compulsory
        if (!name) return;

        // Read medium from Excel
        const excelMedium =
          mediumIndex !== -1
            ? String(row[mediumIndex] || "").trim()
            : "";

        // Normalize medium
        const mediumText = excelMedium.toLowerCase();

        let medium = "English";

        if (
          mediumText === "hindi" ||
          mediumText === "hindi medium" ||
          mediumText === "हिंदी" ||
          mediumText === "हिंदी माध्यम"
        ) {
          medium = "Hindi";
        } else if (
          mediumText === "english" ||
          mediumText === "english medium" ||
          mediumText === "अंग्रेजी" ||
          mediumText === "अंग्रेज़ी माध्यम"
        ) {
          medium = "English";
        }

        // Duplicate checking
        const mapKey = code
          ? `${code}__${name}`.toLowerCase()
          : `no-code__${name}`.toLowerCase();

        if (schoolMap.has(mapKey)) return;

        const emptyClasses = {};

        ["Class 9", "Class 10"].forEach((className) => {
          emptyClasses[className] = {};

          Object.values(SUBJECTS).flat().forEach((subject) => {
            emptyClasses[className][subject] = {
              name: "",
              number: "",
            };
          });
        });

        schoolMap.set(mapKey, {
          id: `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,

          schoolCode: code,
          schoolName: name,

          // Imported medium
          medium: medium,

          classes: emptyClasses,
        });
      });

      const importedSchools = Array.from(schoolMap.values());

      if (importedSchools.length === 0) {
        alert("No valid school names found.");
        return;
      }

      setSchools((prev) => {
        const existing = new Set(
          prev.map((school) =>
            `${school.schoolCode || ""}__${school.schoolName}`
              .toLowerCase()
          )
        );

        const newSchools = importedSchools.filter((school) => {
          const key = `${school.schoolCode || ""}__${school.schoolName}`
            .toLowerCase();

          return !existing.has(key);
        });

        if (newSchools.length === 0) {
          alert("All schools already exist.");
          return prev;
        }

        alert(
          `${newSchools.length} school(s) imported successfully!`
        );

        return [...prev, ...newSchools];
      });

    } catch (error) {
      console.error("Import error:", error);
      alert("Unable to import Excel file.");
    }

    e.target.value = "";
  };

  reader.readAsArrayBuffer(file);
};



  return (
    <div className="flex flex-wrap items-center gap-3">

      {/* Import Button */}
      <label className="cursor-pointer rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700 text-xl">
        Import Excel

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleImport}
          className="hidden"
        />
      </label>

      {/* Export Button */}
      <button
        type="button"
        onClick={handleExport}
        className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 text-xl"
      >
        Export Excel
      </button>

    </div>
  );
}
