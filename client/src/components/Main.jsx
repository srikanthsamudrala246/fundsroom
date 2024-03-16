import React from 'react'
import '../css/Main.css'
import Button from './Button'

export default function Main() {
  return (
    <div className='main display-flex align-center justify-center'>
      <div className="main-block display-flex align-center flex-column justify-center">
        <Button buttonName={'Buy Now Pay Later'} path={'payLater'}/>
        <Button buttonName={'Generate Bill'} path={'generateBill'}/>
        <Button buttonName={'Pay Pending Amount'} path={'payPending'}/>
      </div>
    </div>
  )
}
