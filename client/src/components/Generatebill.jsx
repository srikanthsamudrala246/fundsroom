import React, { useEffect, useState } from 'react'
import '../css/Generatebill.css'
import Navbar from './Navbar'
import Leftarrow from './Leftarrow'

export default function Generatebill() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/api/action/generateBill`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'auth-token': localStorage.getItem('token')
                },
        }).then(async(response) => {
          const json = await response.json();
          if(!json.success){
            alert(json.error);
          }
          else{
            setAmount(json.dueAmount);
          }
          setLoading(false);
        })

  }, []);

  
  return (
    <>
    <Navbar/>
    <div className='generate-bill display-flex align-center justify-center'>
       <div className="generate-bill-block display-flex align-center flex-column justify-center">
        <Leftarrow/>
         {loading ? "loading..." : <>
         <span className='bill-label'>Your total bill</span>
         <span className='bill-amount'>{amount}</span></>}
       </div>
    </div>
    </>
  )
}
