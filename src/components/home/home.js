import React from "react";
import './home.css';
import { useNavigate } from 'react-router-dom';
import image from '../../assets/Home-image.png'
const Home = ()=>{

    const navigate = useNavigate();

    const startbtn = ()=> {
        navigate("/todolist");
    }

    const logout = ()=> {
        navigate("/login");
    }
    
    return(
        <>
        <div className="home_main_cont">
            <div className="left_cont">
                <h2 className="home-head">Todo-List</h2>
                <img className="image" src={image}/>
            </div>
            <div className="right_main_cont">
                <div className="right_btn">
                <button onClick={logout} className="btn btn-danger">Logout</button>
                </div>
                <div className="right_cont">
                <h2>Productive Mind</h2>
                <p>With only the features you need, Organic Mind is customized for individuals seeking a stress-free way to stay focused on their goals, projects, and tasks.</p>
                <br/>
                <button onClick={startbtn} className="w-25 btn btn-warning">Get Started</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default Home;