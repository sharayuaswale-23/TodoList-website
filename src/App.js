import './App.css';
import Todolist from './components/Todolist/todolist';
import Login from './components/Login/login';
import SignUp from './components/SignUp/signup';
import Home from './components/home/home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/todolist' element = {<Todolist/>}></Route>
      <Route path='/home' element = {<Home/>}></Route>
      <Route path='/' element = {<Login/>}></Route>
      <Route path='/signup' element = {<SignUp/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
