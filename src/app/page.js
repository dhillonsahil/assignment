'use client'
import { useState } from "react"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Home() {

  const [num1,SetNum1]=useState(0);
  const [num2,SetNum2]=useState(0);
  const [filePath,setFilePath]=useState('');
  const [result,setResult]=useState(0);

  const handleCalculate = async()=>{
    setResult(0);
    if(num1==0 || num2==0){
      toast.error("Values Can't be zero", {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        })
    }else{

      const resp =  await fetch('http://localhost:3000/api/hello',{
        method:"POST",
        headers:{
          'Content-Type': 'application/json'
        },body:JSON.stringify({
          'num1':num1,
          "num2":num2
        })
      })

      const response = await resp.json();
      if(response.status=="success"){
        toast.success(`Result fetched`, {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          })
          setFilePath(response.filePath);
          setResult(response.sum);
      }
    }
  }


  // const handlePrint=async()=>{
  //   const resp = await fetch('http://localhost:3000/api/print', {
  //         method: "POST",
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           'filePath': filePath, 
  //         }),
  //       });

  //       if (resp.ok) {
  //         const { pdfurl } = await resp.json();

  //         if (success) {
  //           // Decode base64 string to binary
  //           const pdfBytes = atob();

  //           // Create a blob from the binary data
  //           const pdfBlob = new Blob([new Uint8Array([...pdfBytes].map(char => char.charCodeAt(0)))], { type: 'application/pdf' });

  //           // Create a URL for the blob
  //           const pdfUrl = URL.createObjectURL(pdfBlob);

  //           // Open the PDF in a new tab
  //           window.open(pdfUrl, '_blank');
  //         } else {
  //           console.error('Failed to convert to PDF:', pdf);
  //         }
  //       } else {
  //         console.error('Failed to convert to PDF:', await resp.text());
  //       }
  // }


  const handlePrint = async () => {
    if (!filePath) {
      toast.error("File path is empty", {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    try {
      // Fetch the PDF URL from the server
      const resp = await fetch('http://localhost:3000/api/print', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'filePath': filePath,
        }),
      });
  
      if (resp.ok) {
        const { pdfurl } = await resp.json();
  
        // Open the PDF in a new tab
        window.open(pdfurl, '_blank');
      } else {
        console.error('Failed to fetch PDF URL:', await resp.text());
      }
    } catch (error) {
      console.error('Error handling print:', error);
    }
  };
  

  return (
    <div className="relative flex min-h-screen text-gray-800 antialiased flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
    <div className="relative py-3 sm:w-96 mx-auto text-center">
    <ToastContainer
position="top-left"
autoClose={1500}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
      <span className="text-2xl font-light">Calculate Number Using Excel</span>
      <div className="mt-4 bg-white shadow-md rounded-lg text-left">
        <div className="h-2 bg-purple-400 rounded-t-md"></div>
        <div className="px-8 py-6">
          <label className="block font-semibold">Number 1</label>
          <input type="number" onChange={(e)=>{
            SetNum1(e.target.value)
          }} value={num1==0?'':num1}  className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md" />
          <label className="block font-semibold">Number 2</label>
          <input type="number" onChange={(e)=>{
            SetNum2(e.target.value)
          }} value={num2==0?'':num2}  className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md" />
          
{
  result!=0 &&           <div className="my-3 block font-semibold text-red-500">Result : {result}</div>
}
          <div className="flex justify-between items-baseline">
            <button onClick={handleCalculate} type="submit" className="mt-4 bg-purple-500 text-white py-2 px-6 rounded-md hover:bg-purple-600">Calculate</button>
            <button  onClick={handlePrint} type="submit" className="mt-4 bg-purple-500 text-white py-2 px-6 rounded-md hover:bg-purple-600">Print</button>
            
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
