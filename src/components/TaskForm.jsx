import React, { useState, useEffect } from "react";

function TaskForm({ onSubmit, editingTask, onEdit }) {
  const [title, setTitle] = useState("");
  const [group, setGroup] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.task);
      setGroup(editingTask.group || "");
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const task = {
      task: title,
      group: group.trim() === "" ? "Others" : group,
    };

    if (editingTask) {
      onEdit(editingTask._id, task);
    } else {
      onSubmit(task);
    }

    setTitle("");
    setGroup("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {editingTask ? "✏️ Edit Task" : "➕ Add Task"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title
        </label>
        <input
          type="text"
          placeholder="e.g., Finish project proposal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Group (optional)
        </label>
        <input
          type="text"
          placeholder="e.g., Work, Personal..."
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
