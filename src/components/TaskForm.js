import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const TaskForm = ({ addTask, editTask, taskToEdit, setTaskToEdit }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    date: "no date",
    priority: "low",
    comments: [],
    completed: false,
  });

  useEffect(() => {
    if (taskToEdit) {
      setTask(taskToEdit);
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = () => {
    if (taskToEdit) {
      editTask(task);
      setTaskToEdit(null);
    } else {
      addTask({ ...task, id: uuidv4(), createdAt: new Date().toISOString() });
    }
    setTask({
      title: "",
      description: "",
      date: "no date",
      priority: "low",
      comments: [],
      completed: false,
    });
  };

  return (
    <div className="task-form">
      <input
        name="title"
        placeholder="Title"
        value={task.title}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={task.description}
        onChange={handleChange}
      />
      <select name="date" value={task.date} onChange={handleChange}>
        <option value="today">Today</option>
        <option value="tomorrow">Tomorrow</option>
        <option value="next weekend">Next Weekend</option>
        <option value="no date">No Date</option>
      </select>
      <select name="priority" value={task.priority} onChange={handleChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button onClick={handleSubmit}>
        {taskToEdit ? "Update Task" : "Add Task"}
      </button>
      {taskToEdit && (
        <button onClick={() => setTaskToEdit(null)}>Cancel</button>
      )}
    </div>
  );
};

export default TaskForm;
