import React, { useState } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = ()=> {

    const navigate = useNavigate();

    const[email,setemail] = useState('');
    const[password,setpassword] = useState('');
    const[error,seterror] = useState("");

    const onsubmituserdata = async(e)=>{
        e.preventDefault();
        try{
            await signInWithEmailAndPassword(auth,email, password);
            navigate("/home");
            seterror("");
            
        }catch(error){
            seterror("Please enter valid ID and password");
        }
       
    }

    return(

        <div className='login-main-cont'>
        <div className="login-container">
          <div className="card">
            <form onSubmit={onsubmituserdata} className="box">
              <h1>Login</h1>
              <p className="text-muted">Please enter your E-mail and password!</p>
              <input
                type="text"
                placeholder="Username"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                required
              />

              <p className='text-danger'>{error}</p>
             
              <input type="submit" value="Login" />
             
              <p>
                Not registered yet? <Link to="/">Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
        </div>

    )

}

export default Login;