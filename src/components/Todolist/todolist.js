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

const Todolist = () => {

  const tasksRef = ref(database, "tasks");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "Low", day: "No Date" });
  const [editTaskData, setEditTaskData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState("inbox");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userUID, setUserUID] = useState(null);

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


  // Add a new task
  // const addTask = () => {
  //   if (!newTask.title.trim()) {
  //     alert("Title is required");
  //     return;
  //   }

  //   const dateMap = {
  //     Today: new Date().toLocaleDateString(),
  //     Tomorrow: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
  //     Weekend: ["Saturday", "Sunday"].includes(
  //       new Date().toLocaleDateString("en-US", { weekday: "long" })
  //     )
  //       ? new Date().toLocaleDateString()
  //       : "Next Weekend",
  //     "No Date": "No Date",
  //   };

  //   push(tasksRef, {
  //     ...newTask,
  //     date: dateMap[newTask.day],
  //     completed: false,
  //     comments: [],
  //   });

  //   setNewTask({ title: "", description: "", priority: "Low", day: "No Date" });
  //   setShowAddForm(false);
  // };

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
      });
  
      setNewTask({ title: "", description: "", priority: "Low", day: "No Date" });
      setShowAddForm(false);
    };

  // Update task
  // const saveEditTask = () => {
  //   if (!editTaskData.title.trim()) {
  //     alert("Title is required");
  //     return;
  //   }

  //   const dateMap = {
  //     Today: new Date().toLocaleDateString(),
  //     Tomorrow: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
  //     Weekend: ["Saturday", "Sunday"].includes(
  //       new Date().toLocaleDateString("en-US", { weekday: "long" })
  //     )
  //       ? new Date().toLocaleDateString()
  //       : "Next Weekend",
  //     "No Date": "No Date",
  //   };

  //   update(ref(database, `tasks/${editTaskData.id}`), {
  //     ...editTaskData,
  //     date: dateMap[editTaskData.day],
  //   });

  //   setEditTaskData(null);
  // };

  const saveEditTask = () => {
    if (!editTaskData.title.trim()) {
      alert("Title is required");
      return;
    }

    const taskRef = ref(database, `tasks/${userUID}/${editTaskData.id}`);
    update(taskRef, editTaskData);

    setEditTaskData(null);
  };
  // Toggle completion
  // const toggleCompletion = (id, completed) => {
  //   update(ref(database, `tasks/${id}`), { completed: !completed });
  // };

    // Toggle completion
    const toggleCompletion = (id, completed) => {
      const taskRef = ref(database, `tasks/${userUID}/${id}`);
      update(taskRef, { completed: !completed });
    };

  // Delete task
  // const deleteTask = (id) => {
  //   remove(ref(database, `tasks/${id}`));
  // };
  const deleteTask = (id) => {
    const taskRef = ref(database, `tasks/${userUID}/${id}`);
    remove(taskRef);
  };

  // Add comment
  // const addComment = (id, comment) => {
  //   if (!comment.trim()) {
  //     alert("Enter a comment");
  //     return;
  //   }

  //   const task = tasks.find((task) => task.id === id);
  //   if (task) {
  //     update(ref(database, `tasks/${id}`), {
  //       comments: [...(task.comments || []), comment],
  //     });
  //   } else {
  //     console.log("Task not found.");
  //   }
  // };


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

  // Delete comment
  // const deleteComment = (id, commentIndex) => {
  //   const task = tasks.find((task) => task.id === id);
  //   const updatedComments = task.comments.filter(
  //     (_, index) => index !== commentIndex
  //   );
  //   update(ref(database, `tasks/${id}`), { comments: updatedComments });
  // };

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
    if (filter === "today" && task.date !== new Date().toLocaleDateString())
      return false;
    if (
      filter === "tomorrow" &&
      task.date !==
        new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()
    )
      return false;
    if (filter === "weekend" && task.date !== "Next Weekend") return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter)
      return false;
    return true;
  });

  // Search tasks
  const searchedTasks = filteredTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* --------------------------------------------right side------------------------------------------------ */}
      <div className="main-cont">
        {/* Add Button */}
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
            </div>
          </div>
        )}

        {/* Task List */}
        <ul className="ul-list-cont">
          {searchedTasks.map((task) => (
            <li className="list-cont" key={task.id}>
              {/* <h3>{searchedTasks}</h3> */}
              <div className="save-cont">
                <div className="list-upper-part">
                  <p>{task.day}</p>
                </div>
                {/* ------------------------------------title-des-comment------------------------------------------------ */}

                <div className="title-des-comment-content">
                  <div className="left-cont-check-des">
                    <div className="checkbox-box">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() =>
                          toggleCompletion(task.id, task.completed)
                        }
                      />
                    </div>
                    {/* ------------------------------------------------------------------------------------ */}
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
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todolist;