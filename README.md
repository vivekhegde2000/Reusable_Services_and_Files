# Reusable_Services_and_Files
Only reusable , generic solutions


exportService.ts
------------------
# 📤 Export Table Data Utility

A reusable TypeScript helper for exporting JSON data into Excel (`.xlsx`) or CSV (`.csv`)
with support for:
- Custom header labels
- Column ordering
- Styled + sticky headers (Excel only)

Powered by:
- [`exceljs`](https://www.npmjs.com/package/exceljs)
- [`file-saver`](https://www.npmjs.com/package/file-saver)

---

## 🔧 Installation

```bash
npm install exceljs file-saver
# or
yarn add exceljs file-saver
```


📌 API
---------------------------------
export async function exportTableData<T extends Record<string, any>>(
  data: T[],
  headerMap?: { [key: string]: string },
  fileName: string = "export",
  format: "xlsx" | "csv" = "xlsx"
): Promise<void>;


| Parameter   | Type                   | Required | Description                          |
| ----------- | ---------------------- | -------- | ------------------------------------ |
| `data`      | `T[]`                  | ✅        | Array of objects to export           |
| `headerMap` | `{ key: headerTitle }` | ❌        | Rename & reorder columns             |
| `fileName`  | `string`               | ❌        | Output file name (default: `export`) |
| `format`    | `"xlsx" \| "csv"`      | ❌        | File format (default: `"xlsx"`)      |



🚀 Usage Examples
-----------------------------
1️⃣ Basic Export (Auto headers)
import { exportTableData } from "./exportTableData";

const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
];

exportTableData(users, undefined, "Users", "xlsx");


📌 Headers will automatically be "name" and "age"

2️⃣ Custom Headers + Column Order
const employees = [
  { firstName: "Alice", lastName: "Smith", dept: "HR" },
  { firstName: "Bob", lastName: "Jones", dept: "IT" },
];

const headerMap = {
  firstName: "First Name",
  lastName: "Last Name",
  dept: "Department",
};

exportTableData(employees, headerMap, "Employees", "xlsx");


📝 Column ordering matches headerMap keys

3️⃣ Export as CSV
exportTableData(users, undefined, "UsersList", "csv");


⚠️ CSV export: No styling / no sticky header


--------------------------------------------
🎨 Excel Styling Applied Automatically

Applied only when format = "xlsx":

| Feature                             | Status |
| ----------------------------------- | :----: |
| Bold + centered header text         |    ✔   |
| Header background color             |    ✔   |
| Borders for header cells            |    ✔   |
| Sticky header row (freeze viewport) |    ✔   |
| Row height + font styling           |    ✔   |
| Auto width based on header label    |    ✔   |

-------------------------
📄 MIME Types Used

| Format  | MIME Type                                                           |
| ------- | ------------------------------------------------------------------- |
| `.xlsx` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| `.csv`  | `text/csv;charset=utf-8;`                                           |


----------------------------
🛑 Error Handling

If data array is empty → Export stops

No data to export

----------------------
✔ Feature Matrix

| Capability           |  Supported |
| -------------------- | :--------: |
| Excel Export         |      ✔     |
| CSV Export           |      ✔     |
| Custom Header Labels |      ✔     |
| Column Reordering    |      ✔     |
| Excel Styling        |      ✔     |
| Sticky Header        | Excel Only |
| TS Strong Typing     |      ✔     |



