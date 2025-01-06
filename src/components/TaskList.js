import React, { useState } from "react";

const TaskList = ({ tasks, updateTask, deleteTask, filter, setFilter }) => {
  const [comment, setComment] = useState("");

  const filteredTasks = tasks.filter((task) => {
    if (filter.day !== "all") {
      const today = new Date();
      const taskDate = new Date(task.createdAt);
      if (
        (filter.day === "today" && taskDate.toDateString() !== today.toDateString()) ||
        (filter.day === "tomorrow" &&
          taskDate.toDateString() !==
            new Date(today.setDate(today.getDate() + 1)).toDateString()) ||
        (filter.day === "next weekend" && task.date !== "next weekend")
      ) {
        return false;
      }
    }
    if (filter.priority !== "all" && task.priority !== filter.priority) return false;
    if (filter.status !== "all" && task.completed !== (filter.status === "completed"))
      return false;
    return true;
  });

  const handleCommentAdd = (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      const updatedComments = [...task.comments, comment];
      updateTask({ ...task, comments: updatedComments });
      setComment("");
    }
  };

  return (
    <div className="task-list">
      <div className="filters">
        <select onChange={(e) => setFilter("day", e.target.value)}>
          <option value="all">All Days</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="next weekend">Next Weekend</option>
          <option value="no date">No Date</option>
        </select>
        <select onChange={(e) => setFilter("priority", e.target.value)}>
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select onChange={(e) => setFilter("status", e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Uncompleted</option>
        </select>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Date: {task.date}</p>
            <p>Priority: {task.priority}</p>
            <p>Comments: {task.comments.join(", ")}</p>
            <input
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={() => handleCommentAdd(task.id)}>Add Comment</button>
            <button onClick={() => updateTask({ ...task, completed: !task.completed })}>
              {task.completed ? "Mark Uncompleted" : "Mark Completed"}
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
