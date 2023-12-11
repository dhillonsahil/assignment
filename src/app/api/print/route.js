
const Exceljs = require('exceljs');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs/promises');
import path from 'path';

import { NextResponse } from 'next/server';

export async function POST(request) {
  const { filePath } = await request.json();
  const absoluteFilePath = path.join(__dirname, '..', '..', '..', '..', '..', filePath);

  try {
    const workbook = new Exceljs.Workbook();
    await workbook.xlsx.readFile(absoluteFilePath);
    const worksheet = workbook.getWorksheet('Calculations');

    const pdfDoc = await PDFDocument.create();
    const pdfPage = pdfDoc.addPage();

    const columnspace = 100;

    worksheet.eachRow((row, rowIndex) => {
      row.eachCell((column, columnIndex) => {
        const xPos = columnIndex * 40 + (columnIndex - 1) * columnspace;
        const yPos = pdfPage.getHeight() - rowIndex * 40; // Adjusted y position for pdf-lib
        pdfPage.drawText(column.text, { x: xPos, y: yPos });
      });
    });

    const pdfBytes = await pdfDoc.save();
    
    const pdfurl=`file_${Date.now()}.pdf`
    await fs.writeFile(`file_${Date.now()}.pdf`, pdfBytes);
 

    return NextResponse.json({ success: true ,pdfurl:path.join(__dirname, '..', '..', '..', '..', '..', pdfurl)});
  } catch (error) {
    console.error('Error converting to PDF:', error);
    return NextResponse.json({ success: false, error: 'Error converting to PDF' });
  }
}
