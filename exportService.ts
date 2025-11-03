import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/**
 * Export array data as Excel (.xlsx) or CSV (.csv)
 * with styled headers and sticky header row (for Excel).
 */
export async function exportTableData<T extends Record<string, any>>(
  data: T[],
  headerMap?: { [key: string]: string }, // optional key→header mapping
  fileName: string = "export",
  format: "xlsx" | "csv" = "xlsx"
): Promise<void> {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Only Excel supports freezing and styling
  if (format === "xlsx") {
    worksheet.views = [{ state: "frozen", ySplit: 1 }];
  }

  // Determine columns
  let columns: { header: string; key: string; width: number }[];
  if (headerMap) {
    columns = Object.keys(headerMap).map((key) => ({
      header: headerMap[key],
      key,
      width: Math.max(headerMap[key].length, 20),
    }));
  } else {
    const sample = data[0];
    columns = Object.keys(sample).map((key) => ({
      header: key,
      key,
      width: 20,
    }));
  }
  worksheet.columns = columns;

  // Add data
  data.forEach((item) => worksheet.addRow(item));

  // Style headers (only if Excel)
  if (format === "xlsx") {
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 12 };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.height = 22;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE8E8E8" },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FFBFBFBF" } },
        left: { style: "thin", color: { argb: "FFBFBFBF" } },
        bottom: { style: "thin", color: { argb: "FFBFBFBF" } },
        right: { style: "thin", color: { argb: "FFBFBFBF" } },
      };
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        row.font = { size: 12 };
      }
    });
  }

  let blob: Blob;

  if (format === "xlsx") {
    // Export Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } else {
    // Export CSV file
    const csvBuffer = await workbook.csv.writeBuffer({
      sheetName: "Sheet1",
    });
    blob = new Blob([csvBuffer], { type: "text/csv;charset=utf-8;" });
  }

  saveAs(blob, `${fileName}.${format}`);
}
