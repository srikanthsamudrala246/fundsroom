import React from 'react'
import { Link } from 'react-router-dom'
import '../css/Button.css'

export default function Button({buttonName, path}) {
  return (
    <Link className='home-button display-flex align-center justify-center' to={`/${path}`} >{buttonName}</Link>
  )
}
