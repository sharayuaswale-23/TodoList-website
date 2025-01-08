import React, { useState, useEffect } from "react";
import "./todolist.css";
import { ref, push, onValue, update, remove } from "firebase/database";
import { database, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaComment } from "react-icons/fa";
import { RiDeleteBack2Line } from "react-icons/ri";
import { FaInbox } from "react-icons/fa";
import { MdToday } from "react-icons/md";
import { MdOutlineTaskAlt } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { IoTodayOutline } from "react-icons/io5";
import { HiMiniCalendarDays } from "react-icons/hi2";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBack2Fill } from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the DatePicker CSS
import { MdOutlineNavigateNext } from "react-icons/md";

const Todolist = () => {
  const tasksRef = ref(database, "tasks");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "Low", day: new Date() });
  const [editTaskData, setEditTaskData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState("inbox");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userUID, setUserUID] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [selectedWeekendDate, setSelectedWeekendDate] = useState(null); // State for weekend date

  const [selectedFilterDate, setSelectedFilterDate] = useState(null); 
  

  // Fetch tasks from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUID(user.uid);
      } else {
        setUserUID(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userUID) return;

    const userTasksRef = ref(database, `tasks/${userUID}`);
    onValue(userTasksRef, (snapshot) => {
      const data = snapshot.val();
      const tasksArray = data
        ? Object.entries(data).map(([id, task]) => ({ id, ...task }))
        : [];
      setTasks(tasksArray);
    });
  }, [userUID]);

  const formatDateAndDay = (date) => {
    const taskDate = new Date(date);
    const options = { day: "2-digit", month: "short", year: "numeric", weekday: "long" };
    return taskDate.toLocaleDateString(undefined, options); // e.g., "08 Jan 2025 (Wednesday)"
  };

  // Function to categorize date as "Today", "Tomorrow", or "Upcoming"
  const categorizeDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const taskDate = new Date(date);

    if (taskDate.toLocaleDateString() === today.toLocaleDateString()) {
      return "today";
    } else if (taskDate.toLocaleDateString() === tomorrow.toLocaleDateString()) {
      return "tomorrow";
    } else {
      return "upcoming";
    }
  };

  // Add a new task
  const addTask = () => {
    if (!newTask.title.trim()) {
      alert("Title is required");
      return;
    }

    const userTasksRef = ref(database, `tasks/${userUID}`);
    push(userTasksRef, {
      ...newTask,
      completed: false,
      comments: [],
      category: categorizeDate(newTask.day),
    });

    setNewTask({ title: "", description: "", priority: "Low", day: new Date() });
    setShowAddForm(false);
  };

  const saveEditTask = () => {
    if (!editTaskData.title.trim()) {
      alert("Title is required");
      return;
    }

    const taskRef = ref(database, `tasks/${userUID}/${editTaskData.id}`);
    update(taskRef, {
      ...editTaskData,
      category: categorizeDate(editTaskData.day),
    });

    setEditTaskData(null);
  };

  // Toggle completion
  const toggleCompletion = (id, completed) => {
    const taskRef = ref(database, `tasks/${userUID}/${id}`);
    update(taskRef, { completed: !completed });
  };

  const deleteTask = (id) => {
    const taskRef = ref(database, `tasks/${userUID}/${id}`);
    remove(taskRef);
  };

  const addComment = (id, comment) => {
    if (!comment.trim()) {
      alert("Enter a comment");
      return;
    }

    const task = tasks.find((task) => task.id === id);
    if (task) {
      const taskRef = ref(database, `tasks/${userUID}/${id}`);
      update(taskRef, { comments: [...(task.comments || []), comment] });
    }
  };

  const deleteComment = (id, commentIndex) => {
    const task = tasks.find((task) => task.id === id);
    const updatedComments = task.comments.filter((_, index) => index !== commentIndex);
    const taskRef = ref(database, `tasks/${userUID}/${id}`);
    update(taskRef, { comments: updatedComments });
  };

  // Filter tasks

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed" && !task.completed) return false;
    if (filter === "inbox" && task.completed) return false;
    if (filter === "today" && task.category !== "today") return false;
    if (filter === "tomorrow" && task.category !== "tomorrow") return false;
    if (filter === "upcoming" && task.category !== "upcoming") return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
  
    // Apply selectedFilterDate for "upcoming" tasks
    if (filter === "upcoming" && selectedFilterDate) {
      const taskDate = new Date(task.day).toLocaleDateString();
      const filterDate = new Date(selectedFilterDate).toLocaleDateString();
      return taskDate === filterDate;
    }
    return true;
  });
  // Search tasks
  const searchedTasks = filteredTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <div className="lap-view">
    <div className="todo-main-cont">
      <div className="sidebar-main-cont">
        <div className="add-cont">
          <button className="addbtn" onClick={() => setShowAddForm(true)}>
            <IoMdAddCircle className="plusAdd mr-1" /> Add task
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="m-2 searchinput"
          />
        </div>

        <div className="side-button">
          <div className="side-btn-cont">
            <button onClick={() => setFilter("inbox")}>
              <FaInbox className="icons mr-2" />
              Inbox
            </button>
          </div>
          <div className="side-btn-cont">
            <button onClick={() => setFilter("completed")}>
              <MdOutlineTaskAlt className="icons mr-2" /> Completed
            </button>
          </div>
          <div className="side-btn-cont">
            <button onClick={() => setFilter("today")}>
              <MdToday className="icons mr-2" />
              Today
            </button>
          </div>
          <div className="side-btn-cont">
            <button onClick={() => setFilter("tomorrow")}>
              <HiMiniCalendarDays className="icons mr-2" />
              Tomorrow
            </button>
          </div>
          <div className="side-btn-cont">
            <button onClick={() => setFilter("upcoming")}>
              <IoTodayOutline className="icons mr-2" />
              Upcoming
            </button>
          </div>
        </div>

        <div className="priority-section">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* --------------------------------------------right side------------------------------------------------ */}
      <div className="main-cont">
        <div className="right-addbtn">
          <button className="addbtn" onClick={() => setShowAddForm(true)}>
            <IoMdAdd className="icon" /> Add Task
          </button>{" "}
          <br />
          <h3>
            {filter.charAt(0).toUpperCase()}
            {filter.slice(1)}
          </h3>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="popup-overlay">
            <div className="popup-container">
              <div className="form-container">
                <input
                  type="text"
                  placeholder="Title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="mt-2"
                />
                <textarea
                  className="mt-3"
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
                <div>
                  <select
                    className="mt-3"
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <DatePicker
                    selected={newTask.day}
                    onChange={(date) => setNewTask({ ...newTask, day: date })}
                    className="mt-3 datepicker"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                <div className="btndiv">
                  <button onClick={addTask}>Add</button>
                  <button onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Task Form */}
        {editTaskData && (
          <div className="popup-overlay">
            <div className="popup-container">
              <div className="form-container">
                <input
                  type="text"
                  placeholder="Enter a new Title"
                  value={editTaskData.title}
                  onChange={(e) =>
                    setEditTaskData({ ...editTaskData, title: e.target.value })
                  }
                  className="mt-2"
                />
                <textarea
                  className="mt-3"
                  placeholder="Enter a new Description"
                  value={editTaskData.description}
                  onChange={(e) =>
                    setEditTaskData({
                      ...editTaskData,
                      description: e.target.value,
                    })
                  }
                />
                <div>
                  <select
                    className="mt-3"
                    value={editTaskData.priority}
                    onChange={(e) =>
                      setEditTaskData({ ...editTaskData, priority: e.target.value })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <DatePicker
                    selected={editTaskData.day}
                    onChange={(date) =>
                      setEditTaskData({ ...editTaskData, day: date })
                    }
                    className="mt-3"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                <div className="btndiv">
                  <button onClick={saveEditTask}>Save</button>
                  <button onClick={() => setEditTaskData(null)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
          <ul className="ul-list-cont">
            {searchedTasks.map((task) => {
              const taskDate = new Date(task.day);
              const formattedDate = taskDate.toLocaleDateString(); // e.g., "01/08/2025"
              const formattedDay = taskDate.toLocaleDateString(undefined, { weekday: "long" }); // e.g., "Wednesday"

              return (
                <li className="list-cont" key={task.id}>
                  <div className="save-cont">
                    <div className="list-upper-part">
                      {/* <p>
                        {formattedDate} - {formattedDay}
                      </p> */}
                      <p>
                        {task.priority}
                      </p>
                    </div>
                    <div className="title-des-comment-content">
                      <div className="left-cont-check-des">
                        <div className="checkbox-box">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleCompletion(task.id, task.completed)}
                          />
                        </div>
                        <div className="title-des-comment-cont">
                          <h5>{task.title}</h5>
                          <p>{task.description}</p>
                          <p className="cmnt">Comment:</p>
                          <ul className="commentul">
                            <div className="comment-box">
                              {task.comments?.map((comment, index) => (
                                <li key={index}>
                                  {comment}
                                  <RiDeleteBack2Fill
                                    style={{
                                      margin: "8px",
                                      color: "#a81f00",
                                    }}
                                    onClick={() => deleteComment(task.id, index)}
                                  />
                                </li>
                              ))}
                            </div>
                          </ul>
                        </div>
                      </div>
                      <div className="functionbtn">
                        <FaEdit className="icon" onClick={() => setEditTaskData(task)} />
                        <MdDelete className="icon" onClick={() => deleteTask(task.id)} />
                        <FaComment
                          className="icon"
                          onClick={() =>
                            addComment(task.id, prompt("Add comment") || "")
                          }
                        />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

      </div>
    </div>
    </div>

     {/* Mobile View************************************************************************************** */}

      <div className="m-view">
        <div className="toggle">
        <div>
            {/* Toggle Button */}
            <button
              className="toggle-btn"
              onClick={() => setSidebarVisible(!isSidebarVisible)}
            >
              {isSidebarVisible ? (
                <MdOutlineNavigateNext />
              ) : (
                <MdOutlineNavigateNext />
              )}
            </button>

            {/* Sidebar */}
            {isSidebarVisible && (
             <div className="sidebar-main-cont">
             <div className="add-cont">
               <button className="addbtn" onClick={() => setShowAddForm(true)}>
                 <IoMdAddCircle className="plusAdd mr-1" /> Add task
               </button>
             </div>
             <div>
               <input
                 type="text"
                 placeholder="Search by title"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="m-2 searchinput"
               />
             </div>
     
             <div className="side-button">
               <div className="side-btn-cont">
                 <button onClick={() => setFilter("inbox")}>
                   <FaInbox className="icons mr-2" />
                   Inbox
                 </button>
               </div>
               <div className="side-btn-cont">
                 <button onClick={() => setFilter("completed")}>
                   <MdOutlineTaskAlt className="icons mr-2" /> Completed
                 </button>
               </div>
               <div className="side-btn-cont">
                 <button onClick={() => setFilter("today")}>
                   <MdToday className="icons mr-2" />
                   Today
                 </button>
               </div>
               <div className="side-btn-cont">
                 <button onClick={() => setFilter("tomorrow")}>
                   <HiMiniCalendarDays className="icons mr-2" />
                   Tomorrow
                 </button>
               </div>
               <div className="side-btn-cont">
                 <button onClick={() => setFilter("upcoming")}>
                   <IoTodayOutline className="icons mr-2" />
                   Upcoming
                 </button>
               </div>
             </div>
     
             <div className="priority-section">
               <select
                 value={priorityFilter}
                 onChange={(e) => setPriorityFilter(e.target.value)}
               >
                 <option value="all">All Priorities</option>
                 <option value="Low">Low</option>
                 <option value="Medium">Medium</option>
                 <option value="High">High</option>
               </select>
             </div>
           </div>
            )}
          </div>
          <div className="main-cont-mob">
          <div className="main-cont">
        <div className="right-addbtn">
          <button className="addbtn" onClick={() => setShowAddForm(true)}>
            <IoMdAdd className="icon" /> Add Task
          </button>{" "}
          <br />
          <h3>
            {filter.charAt(0).toUpperCase()}
            {filter.slice(1)}
          </h3>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="popup-overlay">
            <div className="popup-container">
              <div className="form-container">
                <input
                  type="text"
                  placeholder="Title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="mt-2"
                />
                <textarea
                  className="mt-3"
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
                <div>
                  <select
                    className="mt-3"
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <DatePicker
                    selected={newTask.day}
                    onChange={(date) => setNewTask({ ...newTask, day: date })}
                    className="mt-3"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                <div className="btndiv">
                  <button onClick={addTask}>Add</button>
                  <button onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Task Form */}
        {editTaskData && (
          <div className="popup-overlay">
            <div className="popup-container">
              <div className="form-container">
                <input
                  type="text"
                  placeholder="Enter a new Title"
                  value={editTaskData.title}
                  onChange={(e) =>
                    setEditTaskData({ ...editTaskData, title: e.target.value })
                  }
                  className="mt-2"
                />
                <textarea
                  className="mt-3"
                  placeholder="Enter a new Description"
                  value={editTaskData.description}
                  onChange={(e) =>
                    setEditTaskData({
                      ...editTaskData,
                      description: e.target.value,
                    })
                  }
                />
                <div>
                  <select
                    className="mt-3"
                    value={editTaskData.priority}
                    onChange={(e) =>
                      setEditTaskData({ ...editTaskData, priority: e.target.value })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <DatePicker
                    selected={editTaskData.day}
                    onChange={(date) =>
                      setEditTaskData({ ...editTaskData, day: date })
                    }
                    className="mt-3"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                <div className="btndiv">
                  <button onClick={saveEditTask}>Save</button>
                  <button onClick={() => setEditTaskData(null)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
          <ul className="ul-list-cont">
            {searchedTasks.map((task) => {
              const taskDate = new Date(task.day);
              const formattedDate = taskDate.toLocaleDateString(); // e.g., "01/08/2025"
              const formattedDay = taskDate.toLocaleDateString(undefined, { weekday: "long" }); // e.g., "Wednesday"

              return (
                <li className="list-cont" key={task.id}>
                  <div className="save-cont">
                    <div className="list-upper-part">
                      {/* <p>
                        {formattedDate} - {formattedDay}
                      </p> */}
                      <p>Priority: {task.priority}</p>
                    </div>
                    <div className="title-des-comment-content">
                      <div className="left-cont-check-des">
                        <div className="checkbox-box">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleCompletion(task.id, task.completed)}
                          />
                        </div>
                        <div className="title-des-comment-cont">
                          <h5>{task.title}</h5>
                          <p>{task.description}</p>
                          <p className="cmnt">Comment:</p>
                          <ul className="commentul">
                            <div className="comment-box">
                              {task.comments?.map((comment, index) => (
                                <li key={index}>
                                  {comment}
                                  <RiDeleteBack2Fill
                                    style={{
                                      margin: "8px",
                                      color: "#a81f00",
                                    }}
                                    onClick={() => deleteComment(task.id, index)}
                                  />
                                </li>
                              ))}
                            </div>
                          </ul>
                        </div>
                      </div>
                      <div className="functionbtn">
                        <FaEdit className="icon" onClick={() => setEditTaskData(task)} />
                        <MdDelete className="icon" onClick={() => deleteTask(task.id)} />
                        <FaComment
                          className="icon"
                          onClick={() =>
                            addComment(task.id, prompt("Add comment") || "")
                          }
                        />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

      </div>
          </div>
        </div>
      </div>

      </>

    
  );
};

export default Todolist;

