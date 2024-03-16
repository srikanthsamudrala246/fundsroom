import React from 'react'
import '../css/Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil';
import { LogState } from '../states/LogState';

export default function Navbar() {
  const navigate = useNavigate();
  const setLogin = useSetRecoilState(LogState);
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setLogin(false);
    navigate("/login");
  }
  return (
    <nav className="nav-bar display-flex align-center justify-between" >
        <div className="nav-left display-flex align-center">
            <div className="logo-block">
                <Link className='logo' to={'/'}>SWIGGY</Link>
            </div>
            <div className="nav-items-block display-flex align-center">
                <ul className='display-flex align-center nav-item-group'> 
                    <li className="nav-item">
                        <Link className='nav-link' to={'/'}>Services</Link>
                    </li>
                    <li className="nav-item">
                        <Link className='nav-link' to={'/'}>About</Link>
                    </li>
                </ul>
            </div>
        </div>
        <div className="nav-right">
            <button className='logout-button nav-link' onClick={logout} >Logout</button>
        </div>
        
    {/* <div className="container">

      <a className="navbar-brand me-2" href="/">
        <i className="bi bi-envelope-fill">SWIGGY</i>
      </a>

      <button
        className="navbar-toggler"
        // type="button"
        // data-mdb-toggle="collapse"
        // data-mdb-target="#navbarButtonsExample"
        // aria-controls="navbarButtonsExample"
        // aria-expanded="false"
        // aria-label="Toggle navigation"
      >
        <i className="fas fa-bars "></i>
      </button>
  

      <div className="collapse navbar-collapse" id="navbarButtonsExample">
  
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item me-4">
            <a className="nav-link" href="#">Home</a>
          </li>
          <li className="nav-item me-4">
            <a className="nav-link" href="#">Services</a>
          </li>
          <li className="nav-item me-4">
            <a className="nav-link" href="#">Plans</a>
          </li>
          <li className="nav-item me-4">
            <a className="nav-link" href="#">Services</a>
          </li>
          <li className="nav-item me-4">
            <a className="nav-link" href="#">About Us</a>
          </li>
        </ul>
  
  
        <div className="d-flex align-items-center" style={{marginLeft: "100px"}}>
          <a href="/Login" className="nav-link px-3 me-2 userlog" >
            LOGIN
          </a>
          <a href="/Register" className="nav-link mx-3 me-3 userlog" >
            SIGNUP
          </a>
          
        </div>
      </div>

    </div> */}

  </nav>
  )
}
