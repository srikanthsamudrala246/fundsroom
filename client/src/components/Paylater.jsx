import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import '../css/Paylater.css'
import Leftarrow from './Leftarrow'
import { useNavigate } from 'react-router-dom'

export default function Paylater() {
  const [disabled, setDisabled] =useState(false);
  const [cardlimit, setLimit] = useState(0);
  const [loading, setLoading] = useState(false);
  const amount = Math.floor(Math.random() * 500);
  const navigate = useNavigate();
  useEffect(()=> {
        setLoading(true);
        fetch(`http://localhost:3001/api/action/fetchLimit`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'auth-token': localStorage.getItem('token')
                  },
        }).then(async(response) => {
           const json = await response.json();
           if(json.success){
              const {limit} = json;
              setLimit(limit);
           }
           setLoading(false);
        })
  }, []) 
  const handleClick = async(e) => {
     e.preventDefault();
     const response = await fetch(`http://localhost:3001/api/action/makePayment`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'auth-token': localStorage.getItem('token')
                  },
                body: JSON.stringify({amount}),
        });
        const json = await response.json();
        if(json.success){
           alert(json.message);
        }
        else{
          alert(json.error);
        }
     setDisabled(true);
     navigate('/');
  }
  return (
    <>
    <Navbar/>
    <div className='paylater display-flex align-center justify-center'>
      <div className="paylater-block display-flex flex-column align-center">
      <Leftarrow/>
        {loading ? "loading...": <>
        <span className='pay-title'>Pay</span>
        <div className="credit-limit display-flex flex-column gap-10 align-center">
        <span className='credit-label'>Credit limit</span>
        <span className='credit-amount'>{cardlimit}</span>
        </div>
        <div className="pay-main display-flex align-center flex-column">
           <span className="pay-amount">Amount to pay: <strong>{amount}</strong></span>
           <button className={`pay-button cursor-${disabled ? 'disabled': 'pointer pay-hover'}`} disabled = {disabled} onClick={handleClick}>Pay</button>
        </div>
        </>}
      </div>
    </div>
    </>
  )
}
