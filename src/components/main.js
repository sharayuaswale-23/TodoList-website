// // import React, { useState, useEffect } from 'react';

// // function Main() {
// //   const [tasks, setTasks] = useState([]);
// //   const [isContainerOpen, setIsContainerOpen] = useState(false);
// //   const [newTask, setNewTask] = useState({
// //     title: '',
// //     description: '',
// //     date: '',
// //     priority: '',
// //     comments: [],
// //     completed: false,
// //   });
// //   const [filter, setFilter] = useState({ day: 'all', priority: 'all', status: 'all' });

// //   useEffect(() => {
// //     const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
// //     setTasks(storedTasks);
// //   }, []);

// //   useEffect(() => {
// //     localStorage.setItem('tasks', JSON.stringify(tasks));
// //   }, [tasks]);

// //   const handleAddTask = () => {
// //     setTasks([...tasks, { ...newTask, id: Date.now() }]);
// //     setNewTask({ title: '', description: '', date: '', priority: '', comments: [], completed: false });
// //     setIsContainerOpen(false);
// //   };

// //   const handleEditTask = (id) => {
// //     const task = tasks.find((t) => t.id === id);
// //     setNewTask(task);
// //     setIsContainerOpen(true);
// //     handleDeleteTask(id);
// //   };

// //   const handleDeleteTask = (id) => {
// //     setTasks(tasks.filter((task) => task.id !== id));
// //   };

// //   const handleAddComment = (id, comment) => {
// //     setTasks(
// //       tasks.map((task) =>
// //         task.id === id ? { ...task, comments: [...task.comments, comment] } : task
// //       )
// //     );
// //   };

// //   const handleFilter = (tasks) => {
// //     return tasks.filter((task) => {
// //       const dayMatch =
// //         filter.day === 'all' ||
// //         (filter.day === 'today' && task.date === new Date().toISOString().split('T')[0]) ||
// //         (filter.day === 'tomorrow' &&
// //           task.date ===
// //             new Date(new Date().setDate(new Date().getDate() + 1))
// //               .toISOString()
// //               .split('T')[0]) ||
// //         (filter.day === 'next_weekend' &&
// //           task.date ===
// //             new Date(new Date().setDate(new Date().getDate() + (6 - new Date().getDay())))
// //               .toISOString()
// //               .split('T')[0]);

// //       const priorityMatch = filter.priority === 'all' || task.priority === filter.priority;

// //       const statusMatch =
// //         filter.status === 'all' ||
// //         (filter.status === 'completed' && task.completed) ||
// //         (filter.status === 'uncompleted' && !task.completed);

// //       return dayMatch && priorityMatch && statusMatch;
// //     });
// //   };

// //   return (
// //     <div className="App">
// //       <h1>Todo List</h1>
// //       <button onClick={() => setIsContainerOpen(true)}>Add Task</button>

// //       {isContainerOpen && (
// //         <div className="task-container">
// //           <input
// //             type="text"
// //             placeholder="Title"
// //             value={newTask.title}
// //             onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
// //           />
// //           <textarea
// //             placeholder="Description"
// //             value={newTask.description}
// //             onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
// //           />
// //           <select
// //             onChange={(e) => {
// //               const selected = e.target.value;
// //               let date = '';
// //               if (selected === 'today') {
// //                 date = new Date().toISOString().split('T')[0];
// //               } else if (selected === 'tomorrow') {
// //                 date = new Date(new Date().setDate(new Date().getDate() + 1))
// //                   .toISOString()
// //                   .split('T')[0];
// //               } else if (selected === 'next_weekend') {
// //                 date = new Date(new Date().setDate(new Date().getDate() + (6 - new Date().getDay())))
// //                   .toISOString()
// //                   .split('T')[0];
// //               }
// //               setNewTask({ ...newTask, date });
// //             }}
// //           >
// //             <option value="">Select Day</option>
// //             <option value="today">Today</option>
// //             <option value="tomorrow">Tomorrow</option>
// //             <option value="next_weekend">Next Weekend</option>
// //             <option value="no_date">No Date</option>
// //           </select>
// //           <select
// //             value={newTask.priority}
// //             onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
// //           >
// //             <option value="">Select Priority</option>
// //             <option value="low">Low</option>
// //             <option value="medium">Medium</option>
// //             <option value="high">High</option>
// //           </select>
// //           <button onClick={handleAddTask}>Add Task</button>
// //           <button onClick={() => setIsContainerOpen(false)}>Close</button>
// //         </div>
// //       )}

// //       <div className="filters">
// //         <select onChange={(e) => setFilter({ ...filter, day: e.target.value })}>
// //           <option value="all">All Days</option>
// //           <option value="today">Today</option>
// //           <option value="tomorrow">Tomorrow</option>
// //           <option value="next_weekend">Next Weekend</option>
// //         </select>
// //         <select onChange={(e) => setFilter({ ...filter, priority: e.target.value })}>
// //           <option value="all">All Priorities</option>
// //           <option value="low">Low</option>
// //           <option value="medium">Medium</option>
// //           <option value="high">High</option>
// //         </select>
// //         <select onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
// //           <option value="all">All Status</option>
// //           <option value="completed">Completed</option>
// //           <option value="uncompleted">Uncompleted</option>
// //         </select>
// //       </div>

// //       <ul>
// //         {handleFilter(tasks).map((task) => (
// //           <li key={task.id} className={task.completed ? 'completed' : ''}>
// //             <h3>{task.title}</h3>
// //             <p>{task.description}</p>
// //             <p>Priority: {task.priority}</p>
// //             <p>Date: {task.date}</p>
// //             <button onClick={() => handleEditTask(task.id)}>Edit</button>
// //             <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
// //             <button onClick={() => setTasks(tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)))}>
// //               {task.completed ? 'Mark Uncompleted' : 'Mark Completed'}
// //             </button>
// //             <div>
// //               <h4>Comments</h4>
// //               <ul>
// //                 {task.comments.map((comment, index) => (
// //                   <li key={index}>{comment}</li>
// //                 ))}
// //               </ul>
// //               <input
// //                 type="text"
// //                 placeholder="Add Comment"
// //                 onKeyDown={(e) => {
// //                   if (e.key === 'Enter') {
// //                     handleAddComment(task.id, e.target.value);
// //                     e.target.value = '';
// //                   }
// //                 }}
// //               />
// //             </div>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }

// // export default Main;


// import React, { useState, useEffect } from 'react';

// const Main = () => {
//   const [tasks, setTasks] = useState([]);
//   const [showInputContainer, setShowInputContainer] = useState(false);
//   const [newTask, setNewTask] = useState({
//     title: '',
//     description: '',
//     date: '',
//     priority: '',
//     comments: [],
//     completed: false
//   });
//   const [filter, setFilter] = useState({ day: 'all', priority: 'all' });
//   const [viewCompleted, setViewCompleted] = useState(false);

//   useEffect(() => {
//     const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
//     setTasks(storedTasks);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('tasks', JSON.stringify(tasks));
//   }, [tasks]);

//   const handleAddTask = () => {
//     setTasks([...tasks, newTask]);
//     setNewTask({ title: '', description: '', date: '', priority: '', comments: [], completed: false });
//     setShowInputContainer(false);
//   };

//   const handleEditTask = (index) => {
//     const taskToEdit = tasks[index];
//     setNewTask(taskToEdit);
//     setShowInputContainer(true);
//     setTasks(tasks.filter((_, i) => i !== index));
//   };

//   const handleDeleteTask = (index) => {
//     setTasks(tasks.filter((_, i) => i !== index));
//   };

//   const handleAddComment = (index, comment) => {
//     const updatedTasks = [...tasks];
//     updatedTasks[index].comments.push(comment);
//     setTasks(updatedTasks);
//   };

//   const filteredTasks = tasks.filter(task => {
//     if (viewCompleted) return task.completed;
//     if (filter.day !== 'all') {
//       const today = new Date();
//       const taskDate = new Date(task.date);
//       if (
//         (filter.day === 'today' && taskDate.toDateString() !== today.toDateString()) ||
//         (filter.day === 'tomorrow' && taskDate.toDateString() !== new Date(today.setDate(today.getDate() + 1)).toDateString()) ||
//         (filter.day === 'nextWeekend' && taskDate.getDay() !== 6)
//       ) {
//         return false;
//       }
//     }
//     if (filter.priority !== 'all' && task.priority !== filter.priority) {
//       return false;
//     }
//     return true;
//   });

//   return (
//     <div>
//       <button onClick={() => setShowInputContainer(true)}>Add Task</button>
//       {showInputContainer && (
//         <div>
//           <input
//             type="text"
//             placeholder="Title"
//             value={newTask.title}
//             onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//           />
//           <textarea
//             placeholder="Description"
//             value={newTask.description}
//             onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//           ></textarea>
//           <select
//             onChange={(e) => {
//               const today = new Date();
//               if (e.target.value === 'today') {
//                 setNewTask({ ...newTask, date: today.toISOString().split('T')[0] });
//               } else if (e.target.value === 'tomorrow') {
//                 setNewTask({ ...newTask, date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0] });
//               } else if (e.target.value === 'nextWeekend') {
//                 const nextSaturday = new Date(today.setDate(today.getDate() + ((6 - today.getDay()) % 7 || 7)));
//                 setNewTask({ ...newTask, date: nextSaturday.toISOString().split('T')[0] });
//               } else {
//                 setNewTask({ ...newTask, date: '' });
//               }
//             }}
//           >
//             <option value="">Select Date</option>
//             <option value="today">Today</option>
//             <option value="tomorrow">Tomorrow</option>
//             <option value="nextWeekend">Next Weekend</option>
//             <option value="noDate">No Date</option>
//           </select>
//           <select
//             onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
//           >
//             <option value="">Select Priority</option>
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//           </select>
//           <button onClick={handleAddTask}>Add Task</button>
//           <button onClick={() => setShowInputContainer(false)}>Close</button>
//         </div>
//       )}

//       <div>
//         <button onClick={() => setViewCompleted(false)}>Uncompleted</button>
//         <button onClick={() => setViewCompleted(true)}>Completed</button>
//         <select onChange={(e) => setFilter({ ...filter, day: e.target.value })}>
//           <option value="all">All Days</option>
//           <option value="today">Today</option>
//           <option value="tomorrow">Tomorrow</option>
//           <option value="nextWeekend">Next Weekend</option>
//         </select>
//         <select onChange={(e) => setFilter({ ...filter, priority: e.target.value })}>
//           <option value="all">All Priorities</option>
//           <option value="low">Low</option>
//           <option value="medium">Medium</option>
//           <option value="high">High</option>
//         </select>
//       </div>

//       <ul>
//         {filteredTasks.map((task, index) => (
//           <li key={index}>
//             <h3>{task.title}</h3>
//             <p>{task.description}</p>
//             <p>Priority: {task.priority}</p>
//             <p>Date: {task.date || 'No Date'}</p>
//             <button onClick={() => handleEditTask(index)}>Edit</button>
//             <button onClick={() => handleDeleteTask(index)}>Delete</button>
//             <button onClick={() => {
//               const updatedTasks = [...tasks];
//               updatedTasks[index].completed = !updatedTasks[index].completed;
//               setTasks(updatedTasks);
//             }}>
//               {task.completed ? 'Mark Uncompleted' : 'Mark Completed'}
//             </button>
//             <div>
//               <h4>Comments:</h4>
//               <ul>
//                 {task.comments.map((comment, i) => (
//                   <li key={i}>{comment}</li>
//                 ))}
//               </ul>
//               <input
//                 type="text"
//                 placeholder="Add a comment"
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     handleAddComment(index, e.target.value);
//                     e.target.value = '';
//                   }
//                 }}
//               />
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Main;

// Import necessary modules
import React, { useState, useEffect } from "react";

const Main = () => {
  const [tasks, setTasks] = useState([]);
  const [showInputContainer, setShowInputContainer] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
    priority: "",
  });
  const [comments, setComments] = useState("");
  const [filter, setFilter] = useState({ day: "all", priority: "all" });
  const [viewCompleted, setViewCompleted] = useState(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    const currentDate = new Date();
    let taskDate = "";

    switch (newTask.date) {
      case "today":
        taskDate = currentDate.toISOString().split("T")[0];
        break;
      case "tomorrow":
        taskDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
          .toISOString()
          .split("T")[0];
        break;
      case "next weekend":
        const nextWeekend = new Date(currentDate.setDate(currentDate.getDate() + (6 - currentDate.getDay())));
        taskDate = nextWeekend.toISOString().split("T")[0];
        break;
      default:
        taskDate = "No Date";
    }

    const task = {
      ...newTask,
      date: taskDate,
      id: Date.now(),
      completed: false,
      comments: [],
    };

    setTasks([...tasks, task]);
    setNewTask({ title: "", description: "", date: "", priority: "" });
    setShowInputContainer(false);
  };

  const handleEditTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    setNewTask(taskToEdit);
    setShowInputContainer(true);
    handleDeleteTask(id);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

    const handleAddComment = (index, comment) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].comments.push(comment);
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (viewCompleted !== null) {
      return task.completed === viewCompleted;
    }

    if (filter.day !== "all" && task.date !== filter.day) {
      return false;
    }

    if (filter.priority !== "all" && task.priority !== filter.priority) {
      return false;
    }

    return true;
  });

  return (
    <div className="todo-list">
      <h1>Todo List</h1>
      <button onClick={() => setShowInputContainer(true)}>Add Task</button>

      {showInputContainer && (
        <div className="input-container">
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
            }
          />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          ></textarea>
          <select
            value={newTask.date}
            onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
          >
            <option value="">Select Date</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="next weekend">Next Weekend</option>
            <option value="no date">No Date</option>
          </select>
          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button onClick={handleAddTask}>Add Task</button>
          <button onClick={() => setShowInputContainer(false)}>Close</button>
        </div>
      )}

      <div className="filters">
        <select
          onChange={(e) => setFilter({ ...filter, day: e.target.value })}
        >
          <option value="all">All Days</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="next weekend">Next Weekend</option>
          <option value="no date">No Date</option>
        </select>

        <select
          onChange={(e) =>
            setFilter({ ...filter, priority: e.target.value })
          }
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button onClick={() => setViewCompleted(true)}>Completed Tasks</button>
      <button onClick={() => setViewCompleted(false)}>Uncompleted Tasks</button>
      <button onClick={() => setViewCompleted(null)}>All Tasks</button>

      <ul>
        {filteredTasks.map((task,index) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Date: {task.date}</p>
            <p>Priority: {task.priority}</p>
            <h4>Comments:</h4>
            <ul>
                {task.comments.map((comment, i) => (
                  <li key={i}>{comment}</li>
                ))}
              </ul>
            <button onClick={() => handleToggleCompletion(task.id)}>
              {task.completed ? "Mark Uncompleted" : "Mark Completed"}
            </button>
            <button onClick={() => handleEditTask(task.id)}>Edit</button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
              <input
                type="text"
                placeholder="Add a comment"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment(index, e.target.value);
                    e.target.value = '';
                  }
                }}
              />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Main;


