import './login.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { auth } from '../../firebase';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import {  GoogleAuthProvider, signInWithPopup } from 'firebase/auth';




const Login = ()=> {

    const navigate = useNavigate();


    const [ email, setEmail ] = useState('');

    const [ password, setPassword ] = useState('');

    const [ error, setError ] = useState('');


    useEffect( ()=> {
    
            const unLogin = onAuthStateChanged(auth, (user) => {
    
                if( user ){
                    navigate("/home");
                }
    
            });
    
            return () => unLogin();
    
        }, [navigate]);
        


    const onSubmitUserData = async(e)=>{

        e.preventDefault();

            try {

                await signInWithEmailAndPassword( auth, email, password );
                navigate("/home");
                setError("");
                
            } 
            catch (error) {
                
                setError("Please Enter Valid Email And Password.");
            }
    }



    // const signupWithGoogle = async(e)=>{

    //     const provider = new GoogleAuthProvider();

    //     try {
    //         await signInWithPopup(auth, provider);
    //         navigate("/home")
    //     } 
    //     catch (error) {
    //         console.log("error")
    //     }

    // }

    return(

        <div className='login-cont'>

            <div className='login-form'>

                    <form onSubmit={onSubmitUserData}>

                    <h3 className='heading2'> Login </h3>

                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email</label>
                            <input onChange={ (e) => setEmail(e.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required/>
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password </label>
                            <input  onChange={ (e) => setPassword(e.target.value)} type="password" className="form-control" id="exampleInputPassword1" required/>
                        </div>
                        <p className='text-danger'> {error} </p>
                       <br/>
                        <button type="submit" className="btn btn-primary w-100"> Login </button>
                        <br/><br/>
                        <p className='mylogin'> Don't have an account? <Link to={"/"}> SignUp </Link> </p>
                    </form>
                    {/* <div className='google-signup'>
                        <p className='mylogin'> or continue with </p>
                        <span> <button onClick={signupWithGoogle} className='p-2'> <FcGoogle  className= 'mr-2 ml-2'/>  Login with Google </button> </span> 

                    </div> */}

            </div>

        </div>
        
    )

}


export default Login;