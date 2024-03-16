import React,{useState} from 'react'
import '../css/Register.css'

export default function Register() {
    const [err, setErr] = useState(false);
    const [msg, setMsg] = useState('')
    const [show, setShow]  = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister= async (e) =>{
        e.preventDefault();
        setLoading(true);
        const username = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const response = await fetch(`http://localhost:3001/api/auth/signup`, {
        method: "POST",
        headers: {
              "Content-Type": "application/json",
            },
        body: JSON.stringify({username, email, password}),
        });
        const json = await response.json();
        if(json.success){
          const {authToken, username} = json;
          localStorage.setItem('token', authToken);
          localStorage.setItem('username', username);
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
    <div className='register-wrapper'>
      <div className="container">
        <div className="forms">
            <div className="form login">
                <span className="title">Signup</span>
                <form onSubmit={handleRegister}>
                    {err && <div className="showerror">
                        <h2 className="errortext" style={{color:"red"}}>{msg}</h2>  
                    </div>}
                    <div className="input-field">
                        <input type="text" name="username" id="username" placeholder="Enter your name" required/>
                        <i className="uil uil-user icon"></i>
                    </div>
                    <div className="input-field">
                        <input type="email" name="emailid" id="emailid" placeholder="Enter your email" required/>
                        <i className="uil uil-envelope icon"></i>
                    </div>

                    <div className="input-field">
                        <input type="password" name="password" id="password" placeholder="Enter your password" required/>
                        <i className="uil uil-lock icon"></i>
                        <i className={`uil ${!show ? 'uil-eye-slash': 'uil-eye'} showHidePw`} onClick={() => {setShow(!show)}} ></i>
                    </div>

                    <div className="showerror" id="showerror">

                    </div>
                    
                    <div className="input-field button" id="button">
                        <input type="submit" value="Signup" className= {`form-submit ${loading ? 'cursor-disabled': 'cursor-pointer log-hover'}`} disabled={loading} id="form-submit"/>
                    </div>

                </form>
                <div className="login-signup">
                    <span className="text">Already a member?
                        <a href="/login" className="signup-text">Login</a>
                    </span>
                </div>
            </div>
        </div>
    </div>
    </div>
  )
}
