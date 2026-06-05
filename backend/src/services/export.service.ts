import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const EXPORT_DIR = path.join(__dirname, '../../exports');

if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

export const exportToPDF = async (data: any[], columns: { header: string; key: string }[], title: string): Promise<string> => {
  const filename = `export_${uuidv4()}.pdf`;
  const filePath = path.join(EXPORT_DIR, filename);

  const doc = new PDFDocument({ margin: 30, size: 'A4' });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(20).font('Helvetica-Bold').text(title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toISOString()}`, { align: 'right' });
  doc.moveDown();

  const tableTop = doc.y;
  const colWidth = (doc.page.width - 60) / columns.length;

  doc.font('Helvetica-Bold').fontSize(9);
  columns.forEach((col, i) => {
    doc.text(col.header, 30 + i * colWidth, tableTop, { width: colWidth, align: 'left' });
  });

  doc.moveDown(0.5);
  let y = doc.y;

  doc.font('Helvetica').fontSize(8);
  for (const row of data) {
    if (y > doc.page.height - 60) {
      doc.addPage();
      y = 30;
    }

    columns.forEach((col, i) => {
      const value = row[col.key]?.toString() || '';
      doc.text(value, 30 + i * colWidth, y, { width: colWidth, align: 'left' });
    });

    y += 20;
  }

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filename));
    stream.on('error', reject);
  });
};

export const exportToExcel = async (data: any[], columns: { header: string; key: string }[], title: string): Promise<string> => {
  const filename = `export_${uuidv4()}.xlsx`;
  const filePath = path.join(EXPORT_DIR, filename);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title.substring(0, 31));

  worksheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: Math.max(col.header.length, 20),
  }));

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };

  data.forEach((row) => worksheet.addRow(row));

  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  await workbook.xlsx.writeFile(filePath);
  return filename;
};

export const getExportFilePath = (filename: string): string => {
  return path.join(EXPORT_DIR, filename);
};

export const cleanupExports = async () => {
  const files = fs.readdirSync(EXPORT_DIR);
  const now = Date.now();

  for (const file of files) {
    const filePath = path.join(EXPORT_DIR, file);
    const stats = fs.statSync(filePath);
    if (now - stats.mtimeMs > 3600000) {
      fs.unlinkSync(filePath);
    }
  }
};
