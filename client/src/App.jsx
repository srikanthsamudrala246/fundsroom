import './App.css'
import Login from './components/Login'
import {BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import Register from './components/Register';
import Home from './components/Home';
import Paylater from './components/Paylater';
import Generatebill from './components/Generatebill';
import Paypending from './components/Paypending';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { LogState } from './states/LogState';

function App() {
  const [loading, setLoading] =useState(false);
  const login = useRecoilValue(LogState)
  const setLogin = useSetRecoilState(LogState);
  useEffect(() => {
    const token = localStorage.getItem('token');
     setLogin(false);
    if(token){
       setLogin(true);
    }
    setLoading(false);
  }, [login]);

  return (
    <>
     <Router>
      <Routes>
        <Route  path='/'  element={loading? "loading": login? <Home/>: <Login/>}></Route>
        <Route  path='/login'  element={<Login/>}></Route>
        <Route  path='/register' element={<Register/>}></Route>
        <Route  path='/payLater' element={<Paylater/>}></Route>
        <Route  path='/generateBill' element={<Generatebill/>}></Route>
        <Route  path='/payPending' element={<Paypending/>}></Route>
      </Routes>
     </Router>
    </>
  )
}

export default App
