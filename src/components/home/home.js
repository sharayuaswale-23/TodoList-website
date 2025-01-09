import { useNavigate } from 'react-router-dom';
import './home.css';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useEffect } from 'react';



const Home = ()=>{

    const navigate = useNavigate();

    useEffect( ()=> {
    
        const unLogin = onAuthStateChanged(auth, (user) => {

            if( !user ){
                navigate("/");
            }
        });

        return () => unLogin();

    }, [navigate]);
    


    const onGetStartedToDo = ()=> {

        navigate("/todolist");
    }

        const onLogoutTodo = async() => {

            try {
                
                await signOut(auth);

                navigate("/");
            } 
            catch (error) {
                alert("error");
            }
        }
    
    return(


    <div className='home-main-cont'>
        <div className='left-blank'></div>
        <div className='right-cont'>
            <div className='top-cont'>
                <button onClick={onLogoutTodo} className='btn btn-danger'>Log Out</button>
            </div>
            <div className='lower-cont'>
                <h2>Build Your <span>To-Do List</span></h2>
                <h4>Simple tool to organize everything</h4> <br/>
                <p>Add your daily tasks in a powerful tool that helps you organize and prioritize your tasks.</p>
                <button onClick={onGetStartedToDo} className='startbtn'>Get Started</button>
            </div>
        </div>
    </div>

    )
}

export default Home;