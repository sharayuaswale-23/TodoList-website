import './signup.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { auth } from '../../firebase';
import { useState, useEffect } from 'react';
import signImg from '../../assets/signupimg.jpg'
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import {  GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
   
  


const SignUp = ()=> {

    const navigate = useNavigate();


    const [ email, setEmail ] = useState('');

    const [ password, setPassword ] = useState('');

    const [ error, setError ] = useState('');


    useEffect( ()=> {

        const unLogin = onAuthStateChanged(auth, (user) => {

            if( user ){
                navigate("/login");
            }

        });

        return () => unLogin();

    }, [navigate]);



    const onSubmitUserData = async(e)=>{

        e.preventDefault();


        if( password.length < 6 ){

            setError("(Minimun 6 characters.)")
        }

        else{

            createUserWithEmailAndPassword( auth, email, password )
            .then( ()=>{

                navigate("/login")
            })
            .catch( (error)=> alert("Email Already Used!!!") );
        }
    }

    // const signupWithGoogle = async()=>{

    //     const provider = new GoogleAuthProvider();

    //     try {
    //         await signInWithPopup(auth, provider);
    //         navigate("/login")
    //     } 
    //     catch (error) {
    //         console.log("error")
    //     }
    // }



    return(

        <div className='signup-main-cont'>
        <div className='signup-container'>

                <div className='signup-cont'>

                        <div className='signupImg'>

                                <img src={signImg} alt='' />

                        </div>

                            
                        <div className='signup-form'>

                            <form onSubmit={onSubmitUserData}>

                                <h3 className='heading'> SignUp </h3>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Email</label>
                                    <input onChange={ (e) => setEmail(e.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required/>
                                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1">Password <small className='text-danger'> {error} </small></label>
                                    <input  onChange={ (e) => setPassword(e.target.value)} type="password" className="form-control" id="exampleInputPassword1" required/>
                                </div>
                           
                                <button type="submit" className="btn btn-primary w-100"> SignUp </button>
                                <br/><br/>
                                
                                <p className='myform'> Already Registered? <Link to={"/login"}> Login </Link> </p>
                            </form>

                            {/* <div className='google-signup'>
                                <p className='myform'> or continue with </p>
                                <span> <button onClick={signupWithGoogle} className='myform p-2'> <FcGoogle  className= 'mr-2 ml-2'/>  SignUp with Google </button> </span> 

                         </div> */}


                        </div>     
                </div>

        </div> 
        </div>
       
    )

}


export default SignUp;