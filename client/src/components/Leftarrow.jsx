import React from 'react'
import '../css/Leftarrow.css'
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';

export default function Leftarrow() {
  return (
    <Link to={'/'} className="back"><FaArrowLeft className='arrow-left'/></Link>
  )
}
