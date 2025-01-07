import { useNavigate } from 'react-router-dom';
import './home.css';
import homeimage from '../../assets/todoimg.jpg';
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

                navigate("/login");
            } 
            catch (error) {
                alert("error");
            }
        }
    
    return(

       <div className='home-cont'>

                <div className='myhome'>

                    <div className='left-cont'>

                        <img src={homeimage} className='myimg' alt=''/>

                    </div>

                    <div className='right-cont'>
                           
                            <div className='right-body'>

                                <h3> Bulid Your To-Do List </h3>

                                <h4> Simple tool to organise everything. </h4>


                                <div className='myinfo'>

                                    <p> Add your daily tasks in a powerful tool that helps you organize and prioritize your tasks.</p>

                                </div>

                                <br/>

                                <button className='btn start' onClick={onGetStartedToDo}> Get Started </button>

                            </div>

                            <div className='logbtn'>

                                     <button className='btn btn-danger' onClick={onLogoutTodo}> LogOut </button> 

                            </div>

                    </div>


                </div>

       </div>
    )
}

export default Home;