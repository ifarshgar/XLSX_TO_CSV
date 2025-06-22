import ExcelJS from 'exceljs';
import { getFilePathSync } from './fileIO.js';

export const flattenObject = (obj: Object, prefix = ''): Object => {
  return Object.keys(obj).reduce((acc, key) => {
    const propName = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], propName));
    } else {
      acc[propName] = obj[key];
    }
    return acc;
  }, {});
};

export const convertJSONToCSV = async (data: Object[]): Promise<string> => {
  if (!data.length) {
    return '';
  }

  const flatArray = data.map((obj) => flattenObject(obj));

  // Get unique headers
  const headers = [...new Set(flatArray.flatMap((obj) => Object.keys(obj)))];

  // Convert to CSV format
  const csvRows = [
    headers.join(','),
    ...flatArray.map((row) => headers.map((header) => JSON.stringify(row[header] || '')).join(',')),
  ];

  return csvRows.join('\n');
};

export const unflattenObject = (data: Object): Object => {
  const result: Record<string, any> = {};

  Object.keys(data).forEach((key) => {
    const keys = key.split('.');
    keys.reduce((acc, part, index) => {
      if (index === keys.length - 1) {
        acc[part] = data[key];
      } else if (typeof acc[part] !== 'object' || acc[part] === null) {
        acc[part] = {};
      }
      return acc[part];
    }, result);
  });

  return result;
};

export const convertXLSXToJSON = async (file: string): Promise<Object[]> => {
  const filePath = getFilePathSync(file);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const result: Object[] = [];

  workbook.eachSheet((worksheet) => {
    const headers: string[] = [];
    let isFirstRow = true;

    worksheet.eachRow((row, rowNumber) => {
      if (isFirstRow) {
        row.eachCell((cell) => {
          headers.push(cell.text);
        });
        isFirstRow = false;
      } else {
        const rowData: Object = {};
        row.eachCell((cell, colNumber) => {
          const key = headers[colNumber - 1] || `column_${colNumber}`;
          rowData[key] = cell.value;
        });
        result.push(rowData);
      }
    });
  });

  return result;
};
