import React, { useEffect, useState } from 'react'
import '../css/Paypending.css'
import Navbar from './Navbar'
import Leftarrow from './Leftarrow';
import { useNavigate } from 'react-router-dom';

export default function Paypending() {
    const [disabled, setDisabled] = useState(false);
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
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
  
    }, [])
    const handleClick = async(e) => {
        e.preventDefault();
        setDisabled(true);
        const response = await fetch(`http://localhost:3001/api/action/payPending`, {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json",
                      'auth-token': localStorage.getItem('token')
                  }
          });
          const json = await response.json();
          if(!json.success){
            alert(json.error);
          }
          else{
            alert(json.message);
          }
          setDisabled(false);
          navigate('/');
    }
  return (
    <>
    <Navbar/>
    <div className='pay-pending display-flex align-center justify-center'>
       <div className={`pay-pending-block display-flex flex-column ${loading ? 'align-center justify-center': 'justify-around'}`}>
        <Leftarrow/>
           {loading ? "loading...": <>
           <div className="view-due display-flex align-center flex-column">
            <span className='pending-label'>Your bill amount</span>
              <span className='pending-due'>{amount}</span>
           </div>
           <div className="pay-due display-flex align-center justify-center">
              {amount > 0 ? <button className={`pending-button display-flex cursor-${disabled ? 'disabled': 'pointer pay-hover'}`} disabled = {disabled} onClick={handleClick}>Pay <strong>{amount}</strong></button>: "No dues left..."}
           </div></>}
       </div>
    </div>
    </>
  )
}
