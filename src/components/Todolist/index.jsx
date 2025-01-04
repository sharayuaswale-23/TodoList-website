import React, { useState, useEffect } from "react";
import './index.css';
import { MdDelete } from "react-icons/md";
import { MdCheckBox } from "react-icons/md";
import { FaEdit } from "react-icons/fa";


function Todolist() {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");
  const [category, setCategory] = useState("");
  const [timePeriod, setTimePeriod] = useState("Daily");
  const [categories, setCategories] = useState([]);
  const [viewCompleted, setViewCompleted] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterTimePeriod, setFilterTimePeriod] = useState("All Time Periods");
  const [editingId, setEditingId] = useState(null);

  // Load data from local storage on initial render
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
    if (savedTodos) setTodos(savedTodos);
    if (savedCategories) setCategories(savedCategories);
  }, []);

  // Save data to local storage whenever todos or categories change
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
    if (categories.length > 0) {
      localStorage.setItem("categories", JSON.stringify(categories));
    }
  }, [todos, categories]);

  const addOrEditTodo = () => {
    if (todoText.trim() === "" || category.trim() === "") {
      alert("TODO text, category, and time period are required!");
      return;
    }

    const newTodo = {
      id: editingId || Date.now(),
      text: todoText,
      category,
      timePeriod,
      completed: false,
      completedAt: null,
    };

    if (editingId) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingId ? { ...todo, ...newTodo } : todo
        )
      );
      setEditingId(null);
    } else {
      setTodos([...todos, newTodo]);
    }

    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }

    setTodoText("");
    setCategory("");
    setTimePeriod("Daily");
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? new Date().toLocaleString() : null,
            }
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const deleteCategory = (categoryToDelete) => {
    if (window.confirm(`Are you sure you want to delete the category "${categoryToDelete}" and its associated TODOs?`)) {
      setTodos(todos.filter((todo) => todo.category !== categoryToDelete));
      setCategories(categories.filter((cat) => cat !== categoryToDelete));
    }
  };

  const filteredTodos = todos.filter((todo) => {
    const categoryMatch =
      filterCategory === "All Categories" || todo.category === filterCategory;
    const timePeriodMatch =
      filterTimePeriod === "All Time Periods" || todo.timePeriod === filterTimePeriod;
    const completionMatch = viewCompleted ? todo.completed : !todo.completed;
    return categoryMatch && timePeriodMatch && completionMatch;
  });

  const startEditing = (todo) => {
    setTodoText(todo.text);
    setCategory(todo.category);
    setTimePeriod(todo.timePeriod);
    setEditingId(todo.id);
  };

  return (
    <div className="Todo">

      {/* Input Section */}
      <div className="todo-main-sidebar">
        <div className="todo-main">
      <div className="todo-cont">
        <label>Title: </label>
        <input
          type="text"
          placeholder="Enter TODO"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
        </div>
        <div className="todo-cont">
          <label>Create Category: </label>
          <input
          type="text"
          placeholder="Enter Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        </div>
        <div className="todo-cont">
          <label>Time Period: </label>
          <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
           >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
        </div>
        <div className="todo-cont">
        <button onClick={addOrEditTodo} className="mybtn">
        {editingId ? "Save Changes" : "Add TODO"}
        </button>
        </div> <br/>

      {/* Filters */}
      <div className="todo-cont">
          <label>Filter by Category:</label>
          <select
         value={filterCategory}
         onChange={(e) => setFilterCategory(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        >
          <option>All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        </div> 
        <div className="todo-cont">
        <label>Filter by Time Period:</label>
        <select
           value={filterTimePeriod}
           onChange={(e) => setFilterTimePeriod(e.target.value)}
          style={{ padding: "5px" }}
        >
           <option>All Time Periods</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
        </div> 
      </div>
      </div>

      {/* Uncompleted TODOs */}
      <div className="todo-main-cont">
      <div className="todo-main-title">
      <h3>Todo-List</h3> <br/>
      <select
          onChange={(e) => deleteCategory(e.target.value)}
          className="deletebtn"
        >
          <option value="">Delete Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="status-area">
        <button className="Statusbtn" style={{backgroundColor: viewCompleted ? "#ccc" : "#5cb85c"}} onClick={() => setViewCompleted(false)}>Uncompleted</button>
        <button className="Statusbtn"  style={{backgroundColor: viewCompleted ? "#5cb85c" : "#ccc"}}  onClick={() => setViewCompleted(true)}>Completed</button>
      </div>
      <div className="todolist">
      <ul className="edit">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className="list-cont"
          >
            <div style={{textAlign:"left"}}>
              <div>
              <strong>{todo.text}</strong> <em>({todo.category})</em>{" "}
              <span style={{ color: "#6c757d" }}>[{todo.timePeriod}]</span>
              </div>
              {todo.completed && (
                <span style={{color: "#5cb85c" }}>
                  Completed At: {todo.completedAt}
                </span>
              )}
            </div>
            <div>
            <MdCheckBox  onClick={() => toggleComplete(todo.id)}className="check-icon mr-3"/>
            <FaEdit   onClick={() => startEditing(todo)}className="check-icons"/>
            <MdDelete onClick={() => deleteTodo(todo.id)} className="icon" />
            </div>
          </li>
        ))}
      </ul>
      </div>
      </div>
      

    </div>
  );
}

export default Todolist;
