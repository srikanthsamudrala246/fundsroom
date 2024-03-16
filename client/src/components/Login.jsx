import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import '../css/Login.css';
import { LogState } from '../states/LogState';

export default function Login() {
    const [err, setErr] = useState(false);
    const [msg, setMsg] = useState('')
    const [show, setShow]  = useState(false);
    const [loading, setLoading] = useState(false);
    const setLogin = useSetRecoilState(LogState);
    const navigate = useNavigate()

    const handleLogin = async(e) => {
        e.preventDefault();
        setLoading(true);
        const email = e.target[0].value;
        const password = e.target[1].value;
        const response = await fetch(`http://localhost:3001/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify({email, password}),
        });
        const json = await response.json();
        if(json.success){
          const {authToken, username} = json;
          localStorage.setItem('token', authToken);
          localStorage.setItem('username', username);
          setLogin(true);
          navigate("/");
        }
        else{
          setErr(true);
          setMsg(json.error);
          setTimeout(() => {
            setErr(false);
            setMsg('');
          }, 3000);
        }
        setLoading(false);
  
    }
  
    
  return (
     <div className="login-wrapper">
        <div className="container">
        <div className="forms">
            <div className="form login">
                <span className="title">Login</span>
                <form onSubmit={handleLogin}>
                    {err && <div className="showerror">
                        <h2 className="errortext" id="errortext" style={{color:"red"}} >{msg}</h2>  
                    </div>}
                    
                    <div className="input-field">
                        <input type="email" name="emailid" id="emailid"  placeholder="Enter your email" required/>
                        <i className="uil uil-envelope icon"></i>
                    </div>

                    <div className="input-field">
                        <input type={show? 'text': 'password'} name="password" id="password"  placeholder="Enter your password" required/>
                        <i className="uil uil-lock icon"></i>
                        <i className={`uil ${!show ? 'uil-eye-slash': 'uil-eye'} showHidePw`} onClick={() => {setShow(!show)}} ></i>
                    </div>
                    <div className="input-field button">
                        <input type="submit" className = {`${loading ? 'cursor-disabled': 'cursor-pointer log-hover'}`} disabled={loading} value="Login"/>   
                    </div>

                </form>
                <div className="login-signup">
                    <span className="text">Not a member?
                        <a href="/register" className="signup-text">Signup</a>
                    </span>
                </div>
            </div>
        </div>
    </div>
     </div>
  )
}

