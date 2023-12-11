import {NextResponse} from 'next/server'
const fs = require('fs');
var xlsx = require("xlsx");

export async function GET() {
  
    let json_response = {
      status: "success"
    };
    return NextResponse.json(json_response);
  }
  

  export async function POST(request) {
  
    let {num1,num2} = await request.json();
   
    const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.aoa_to_sheet([
      ['Number 1', 'Number 2', 'Sum'],
      [num1, num2, { t: 'n', f: 'A2+B2' ,v:Number(num1)+Number(num2)}],
    ]);
  
    xlsx.utils.book_append_sheet(workbook, sheet, 'Calculations');
  
    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const filePath = `public/calculations_${Date.now()}.xlsx`;
    fs.writeFileSync(filePath, excelBuffer);

    // res.status(200).json({ excelBase64 });
   
    const cellC2Reference = xlsx.utils.encode_cell({ c: 2, r: 1 }); // C2

    // Get C2 cell object
    const cellC2 = sheet[cellC2Reference];

  
    // Access cell C2 data
    const cellC2Value = cellC2.v !== undefined ? cellC2.v : cellC2.w;
  
    
    
    return NextResponse.json({status:"success",filePath , sum:cellC2Value});
  }
  