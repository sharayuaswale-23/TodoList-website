import { useNavigate } from 'react-router-dom';
import './home.css';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';



const Home = ()=>{

    const navigate = useNavigate();


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

       <div className='home-cont'>

                <div className='myhome'>

                                <div className='myinfo'>

                                    <span className='head'> Bulid Your  </span>

                                    <span className='todo'>  To-Do List </span>

                                    <br/><br/>

                                    <h4> Simple tool to organise everything </h4>


                                    <p className='para'> <b> Add your daily tasks in a powerful tool that helps you organize and prioritize your tasks. </b> </p>

                                    <button className='mybtn' onClick={onGetStartedToDo}> Get Started </button>

                                </div>

                                <br/>
                            
                                <div className='logbtn'>

                                     <button className='mylogoutbtn' onClick={onLogoutTodo}> LogOut </button> 

                                </div>
                </div>
       </div>

    )
}

export default Home;