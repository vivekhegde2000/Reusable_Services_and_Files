import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/**
 * Export array data as Excel file with bold headers, 14px font,
 * and sticky header row (using ExcelJS)
 */
export async function exportTableData<T extends Record<string, any>>(
  data: T[],
  headerMap?: { [key: string]: string }, // optional custom mapping key→header
  fileName: string = "export.xlsx"
): Promise<void> {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Apply frozen header row (sticky)
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  // Determine headers and map data
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

  // Add rows
  data.forEach((item) => worksheet.addRow(item));

  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, size: 12 };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.height = 22;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE8E8E8" }, // light gray
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FFBFBFBF" } },
      left: { style: "thin", color: { argb: "FFBFBFBF" } },
      bottom: { style: "thin", color: { argb: "FFBFBFBF" } },
      right: { style: "thin", color: { argb: "FFBFBFBF" } },
    };
  });

  // Style data rows (font size 14)
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.font = { size: 12 };
    }
  });

  // Export file as Blob
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, fileName);
}
