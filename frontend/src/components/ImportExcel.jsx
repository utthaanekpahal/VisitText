import React from "react";
import * as XLSX from "xlsx";
import { FiUpload } from "react-icons/fi";

export default function ImportExcel({
  setSchools,
  subjects,
  subjectGroups,
  selectedType,
}) {
  // Create subject structure according to SchoolRecords
  const createSubjectData = () => {
    const data = {};

    subjects.forEach((subject) => {
      if (subjectGroups?.[subject]) {
        data[subject] = {};

        Object.keys(subjectGroups[subject]).forEach(
          (medium) => {
            data[subject][medium] = {};

            (
              subjectGroups[subject][medium] || []
            ).forEach((subSubject) => {
              data[subject][medium][subSubject] = [];
            });
          }
        );
      } else {
        data[subject] = [];
      }
    });

    return data;
  };

  // Create complete year structure
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
    };
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(
          event.target.result
        );

        const workbook = XLSX.read(data, {
          type: "array",
        });

        const sheetName =
          workbook.SheetNames[0];

        const worksheet =
          workbook.Sheets[sheetName];

        const rows =
          XLSX.utils.sheet_to_json(
            worksheet,
            {
              header: 1,
              defval: "",
            }
          );

        console.log("ALL EXCEL ROWS:", rows);

        // Need at least header + one data row
        if (rows.length < 5) {
          alert(
            "Excel file does not contain valid school data."
          );

          return;
        }

        /*
          Excel structure:

          Row 1 -> Subject
          Row 2 -> Medium
          Row 3 -> Sub Subject
          Row 4 -> Name / Number
          Row 5 onwards -> School data
        */

        const subjectRow = rows[0] || [];
        const mediumRow = rows[1] || [];
        const subSubjectRow = rows[2] || [];
        const fieldRow = rows[3] || [];

        // -----------------------------------
        // Find subject columns
        // -----------------------------------

        const columns = [];

        let currentSubject = "";
        let currentMedium = "";
        let currentSubSubject = "";

        for (
          let col = 7;
          col < fieldRow.length;
          col++
        ) {
          // Subject
          if (
            subjectRow[col] !== undefined &&
            String(subjectRow[col]).trim() !== ""
          ) {
            currentSubject =
              String(
                subjectRow[col]
              ).trim();
          }

          // Medium
          if (
            mediumRow[col] !== undefined &&
            String(mediumRow[col]).trim() !== ""
          ) {
            currentMedium =
              String(
                mediumRow[col]
              ).trim();
          }

          // Sub Subject
          if (
            subSubjectRow[col] !== undefined &&
            String(
              subSubjectRow[col]
            ).trim() !== ""
          ) {
            currentSubSubject =
              String(
                subSubjectRow[col]
              ).trim();
          }

          const field =
            String(
              fieldRow[col] || ""
            ).trim();

          // Only Name and Number are imported
          if (
            field !== "Name" &&
            field !== "Number"
          ) {
            continue;
          }

          columns.push({
            col,
            subject: currentSubject,
            medium: currentMedium,
            subSubject: currentSubSubject,
            field,
          });
        }

        console.log(
          "IMPORT COLUMNS:",
          columns
        );

        // -----------------------------------
        // Actual school rows
        // -----------------------------------

        const dataRows = rows.slice(4);

        const formattedData = [];

        dataRows.forEach(
          (row, rowIndex) => {
            // -----------------------------------
            // School basic information
            // -----------------------------------

            const code =
              String(
                row[1] || ""
              ).trim();

            const schoolName =
              String(
                row[2] || ""
              ).trim();

            const className =
              String(
                row[3] || ""
              ).trim();

            const year =
              String(
                row[4] || ""
              ).trim();

            const principal =
              String(
                row[5] || ""
              ).trim();

            const remark =
              String(
                row[6] || ""
              ).trim();

            /*
              IMPORTANT:

              Only completely empty rows are skipped.

              School code/name can exist even
              when Name/Number is empty.
            */

            if (!code && !schoolName) {
              return;
            }

            // -----------------------------------
            // Create school
            // -----------------------------------

            const school = {
              id:
                Date.now() +
                rowIndex,

              code,

              schoolName,

              remark: {
                "Class 11": "",
                "Class 12": "",
              },

              principal: {
                "Class 11": "",
                "Class 12": "",
              },

              classes: {
                "Class 11": {},
                "Class 12": {},
              },
            };

            // -----------------------------------
            // If class/year exists,
            // create class/year data
            // -----------------------------------

            if (
              className === "Class 11" ||
              className === "Class 12"
            ) {
              // Principal
              school.principal[className] =
                principal;

              // Remark
              school.remark[className] =
                remark;

              // Create year
              if (year) {
                school.classes[className][year] =
                  createYearData();

                const subjectsData =
                  school.classes[className][year]
                    ?.[selectedType]
                    ?.subjects;

                // -----------------------------------
                // Add Name / Number data
                // -----------------------------------

                if (subjectsData) {
                  columns.forEach(
                    ({
                      col,
                      subject,
                      medium,
                      subSubject,
                      field,
                    }) => {
                      const value =
                        String(
                          row[col] ?? ""
                        ).trim();

                      // No subject
                      if (!subject) {
                        return;
                      }

                      // -----------------------------------
                      // Group subject
                      // Example:
                      // Science
                      //   English Medium
                      //      Chemistry
                      // -----------------------------------

                      if (
                        subjectGroups?.[subject]
                      ) {
                        if (
                          !subjectsData[
                            subject
                          ]
                        ) {
                          subjectsData[
                            subject
                          ] = {};
                        }

                        if (
                          !subjectsData[
                            subject
                          ][medium]
                        ) {
                          subjectsData[
                            subject
                          ][medium] = {};
                        }

                        if (
                          !subjectsData[
                            subject
                          ][medium][
                            subSubject
                          ]
                        ) {
                          subjectsData[
                            subject
                          ][medium][
                            subSubject
                          ] = [];
                        }

                        if (
                          !subjectsData[
                            subject
                          ][medium][
                            subSubject
                          ][0]
                        ) {
                          subjectsData[
                            subject
                          ][medium][
                            subSubject
                          ][0] = {
                            teacherName: "",
                            number: "",
                            qty: "",
                          };
                        }

                        // Name
                        if (
                          field === "Name"
                        ) {
                          subjectsData[
                            subject
                          ][medium][
                            subSubject
                          ][0].teacherName =
                            value;
                        }

                        // Number
                        if (
                          field === "Number"
                        ) {
                          subjectsData[
                            subject
                          ][medium][
                            subSubject
                          ][0].number =
                            value;
                        }
                      }

                      // -----------------------------------
                      // Normal subject
                      // -----------------------------------

                      else {
                        if (
                          !Array.isArray(
                            subjectsData[
                              subject
                            ]
                          )
                        ) {
                          subjectsData[
                            subject
                          ] = [];
                        }

                        if (
                          !subjectsData[
                            subject
                          ][0]
                        ) {
                          subjectsData[
                            subject
                          ][0] = {
                            teacherName: "",
                            number: "",
                            qty: "",
                          };
                        }

                        // Name
                        if (
                          field === "Name"
                        ) {
                          subjectsData[
                            subject
                          ][0].teacherName =
                            value;
                        }

                        // Number
                        if (
                          field === "Number"
                        ) {
                          subjectsData[
                            subject
                          ][0].number =
                            value;
                        }
                      }
                    }
                  );
                }
              }
            }

            // -----------------------------------
            // VERY IMPORTANT
            //
            // School is pushed even when:
            // Name = empty
            // Number = empty
            //
            // So code + school name will still
            // appear after import.
            // -----------------------------------

            formattedData.push(school);
          }
        );

        console.log(
          "FINAL IMPORT DATA:",
          formattedData
        );

        // -----------------------------------
        // Set imported schools
        // -----------------------------------

        setSchools(formattedData);

        alert(
          `${formattedData.length} school(s) imported successfully.`
        );
      } catch (error) {
        console.error(
          "Excel import failed:",
          error
        );

        alert(
          "Excel import failed. Please check the Excel format."
        );
      }
    };

    reader.readAsArrayBuffer(file);

    // Allow same file to be selected again
    e.target.value = "";
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
      <FiUpload size={20} />

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