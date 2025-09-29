import React, { useState, useEffect } from "react";

export default function TaskForm({ onSubmit, initial }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
  });

  useEffect(() => {
    if (initial) setTask((prev) => ({ ...prev, ...initial }));
  }, [initial]);

  const handle = (e) => setTask({ ...task, [e.target.name]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(task);
      }}
      className="space-y-4"
    >
      {/* Title */}
      <input
        name="title"
        value={task.title}
        onChange={handle}
        placeholder="Task title"
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      {/* Description */}
      <textarea
        name="description"
        value={task.description}
        onChange={handle}
        placeholder="Description"
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
      />

      {/* Priority, Status, DueDate */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          name="priority"
          value={task.priority}
          onChange={handle}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <select
          name="status"
          value={task.status}
          onChange={handle}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          name="dueDate"
          value={task.dueDate ? task.dueDate.split("T")[0] : ""}
          onChange={handle}
          type="date"
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit button */}
      <button
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-all"
      >
        ➕ Add Task
      </button>
    </form>
  );
}
