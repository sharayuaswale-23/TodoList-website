import React, { useState, useEffect } from "react";
import { database } from "../../firebase";
import './todolist.css';
import { ref, push, onValue, update, remove } from "firebase/database";
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

const Todolist = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Low",
    day: "No Date",
  });
  const [editTaskData, setEditTaskData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState("inbox");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const tasksRef = ref(database, "tasks");

  // Fetch tasks from Firebase
  useEffect(() => {
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const tasksArray = data ? Object.entries(data).map(([id, task]) => ({ id, ...task })) : [];
      setTasks(tasksArray);
    });
  }, []);

  // Add a new task
  const addTask = () => {
    if (!newTask.title.trim()) {
      alert("Title is required");
      return;
    }

    const dateMap = {
      Today: new Date().toLocaleDateString(),
      Tomorrow: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
      Weekend: ["Saturday", "Sunday"].includes(new Date().toLocaleDateString("en-US", { weekday: "long" }))
        ? new Date().toLocaleDateString()
        : "Next Weekend",
      "No Date": "No Date",
    };

    push(tasksRef, {
      ...newTask,
      date: dateMap[newTask.day],
      completed: false,
      comments: [],
    });

    setNewTask({ title: "", description: "", priority: "Low", day: "No Date" });
    setShowAddForm(false);
  };

  // Update task
  const saveEditTask = () => {
    if (!editTaskData.title.trim()) {
      alert("Title is required");
      return;
    }

    const dateMap = {
      Today: new Date().toLocaleDateString(),
      Tomorrow: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
      Weekend: ["Saturday", "Sunday"].includes(new Date().toLocaleDateString("en-US", { weekday: "long" }))
        ? new Date().toLocaleDateString()
        : "Next Weekend",
      "No Date": "No Date",
    };

    update(ref(database, `tasks/${editTaskData.id}`), {
      ...editTaskData,
      date: dateMap[editTaskData.day],
    });

    setEditTaskData(null);
  };

  // Toggle completion
  const toggleCompletion = (id, completed) => {
    update(ref(database, `tasks/${id}`), { completed: !completed });
  };

  // Delete task
  const deleteTask = (id) => {
    remove(ref(database, `tasks/${id}`));
  };

  // Add comment
  const addComment = (id, comment) => {
    if (!comment.trim()) {
      alert("Enter a comment");
      return;
    }
    
    const task = tasks.find((task) => task.id === id);
    if (task) {
      update(ref(database, `tasks/${id}`), { comments: [...(task.comments || []), comment] });
    } else {
      console.log("Task not found.");
    }
  };

  // Delete comment
  const deleteComment = (id, commentIndex) => {
    const task = tasks.find((task) => task.id === id);
    const updatedComments = task.comments.filter((_, index) => index !== commentIndex);
    update(ref(database, `tasks/${id}`), { comments: updatedComments });
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed" && !task.completed) return false;
    if (filter === "inbox" && task.completed) return false;
    if (filter === "today" && task.date !== new Date().toLocaleDateString()) return false;
    if (filter === "tomorrow" && task.date !== new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()) return false;
    if (filter === "weekend" && task.date !== "Next Weekend") return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    return true;
  });

  // Search tasks
  const searchedTasks = filteredTasks.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
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
              <MdOutlineTaskAlt className=" icons mr-2" /> Completed
            </button>
          </div>
          <div className="side-btn-cont">
            <button onClick={() => setFilter("inbox")}>
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
            {" "}
            <button onClick={() => setFilter("weekend")}>
              <IoTodayOutline className="icons mr-2" />
              Weekend
            </button>
          </div>
          {/* Priority Filter */}
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
      <div className="main-cont">
        {/* Add Button */}
        <div className="right-addbtn">
          <button className="addbtn" onClick={() => setShowAddForm(true)}>
            <IoMdAdd className="icon" /> Add Task
          </button> <br/>
          <h3>{filter.charAt(0).toUpperCase()}{filter.slice(1)}</h3>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
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
              <select
                value={newTask.day}
                onChange={(e) =>
                  setNewTask({ ...newTask, day: e.target.value })
                }
              >
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="Weekend">Weekend</option>
                <option value="No Date">No Date</option>
              </select>
            </div>
            <div className="btndiv">
              <button onClick={addTask}>Save</button>
              <button onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Edit Task Form */}
        {editTaskData && (
          <div className="form-container">
            <input
              type="text"
              placeholder="Enter a new Title"
              value={editTaskData.title}
              onChange={(e) =>
                setEditTaskData({ ...editTaskData, title: e.target.value })
              }
            />
            <textarea
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
                value={editTaskData.priority}
                onChange={(e) =>
                  setEditTaskData({ ...editTaskData, priority: e.target.value })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select
                value={editTaskData.day}
                onChange={(e) =>
                  setEditTaskData({ ...editTaskData, day: e.target.value })
                }
              >
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="Weekend">Weekend</option>
                <option value="No Date">No Date</option>
              </select>
            </div>
            <div className="btndiv">
              <button onClick={saveEditTask}>Save</button>
              <button onClick={() => setEditTaskData(null)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Task List */}
        <ul className="ul-list-cont">
          {searchedTasks.map((task) => (
            <li className="list-cont" key={task.id}>
              {/* <h3>{searchedTasks}</h3> */}
              <div>
                <div className="list-upper-part">
                  <p>{task.date}</p>
                  <p>{task.day}</p>
                </div>
              </div>
              {/* ------------------------------------------------------------------------------------ */}

              <div className="title-des-comment-content">
                <div className="left-cont-check-des">
                  <div className="checkbox-box">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleCompletion(task.id, task.completed)}
                    />
                  </div>
                  {/* --------------------------------- */}
                  <div className="title-des-comment-cont">
                    <h5>{task.title}</h5>
                    <p>{task.description}</p>
                    <p className="cmnt">Comment:</p>

                    <ul className="commentul">
                      {task.comments?.map((comment, index) => (
                        <li key={index}>
                          {comment}
                          <RiDeleteBack2Line
                            style={{ margin: "8px" }}
                            onClick={() => deleteComment(task.id, index)}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* --------------------- */}
                <div className="functionbtn">
                  <FaEdit
                    className="icon"
                    onClick={() => setEditTaskData(task)}
                  />
                  <MdDelete
                    className="icon"
                    onClick={() => deleteTask(task.id)}
                  />
                  <FaComment
                    className="icon"
                    onClick={() =>
                      addComment(task.id, prompt("Add comment") || "")
                    }
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      </div>
  );
};

export default Todolist;
