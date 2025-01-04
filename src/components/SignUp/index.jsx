import React, { useState } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import lapgirl from '../../assets/signupimg.jpg';

const SignUp = ()=> {

    const navigate = useNavigate();

    const[email,setemail] = useState('');
    const[password,setpassword] = useState('');
    const[error, seterror] = useState('');

    const onsubmituserdata = async(e)=>{
        e.preventDefault();

        if(password.length < 6){
            seterror("(Min. 6 characters)");
        }
        else{
                createUserWithEmailAndPassword(auth,email,password)
                  .then(() => {
                    navigate("/login");
                  })
                  .catch((err) => alert(err.message));
              }

    }

    return(

        <div className='signup-container'>
                
        <div className='modal'>

        <div className="signup-left">
            <img className='img' src={lapgirl} />
        </div>

            <div className="signup-right">

                    <h3 style={{textAlign:"center"}} className='signup-title'>Sign Up</h3> <br />

                    <form onSubmit={onsubmituserdata}>
                    <div className="form-group">
                    <label style={{color:"black"}} htmlFor="exampleInputEmail1"><b> Email </b></label>
                    <input onChange={(e) => setemail(e.target.value)} type="email" className="form-control form-rounded" id="exampleInputEmail1" aria-describedby="emailHelp" required/>
                    <small id="emailHelp" className="form-text text-muted"><b> We'll never share your user details with anyone else. </b></small>
                    </div>
                    <div className="form-group">
                    <label style={{color:"black"}} htmlFor="exampleInputPassword1"><b> Password </b> <small className='text-danger'>{error}</small></label> 
                    <input onChange={(e) => setpassword(e.target.value)} type="password" className="form-control form-rounded" id="exampleInputPassword1" required/>
                    </div><br></br>
                    <button type="submit" className="button1">Sign Up</button>

                    <br /><br></br>
                    <p style={{color:"black"}}>Already Registered? <Link to="/login">Login</Link></p>

                    </form>

            </div>
            </div>

    </div>

    )

}

export default SignUp;