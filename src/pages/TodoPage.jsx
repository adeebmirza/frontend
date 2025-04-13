import React from "react";
import TaskForm from "../components/TaskForm";
import TaskGroup from "../components/TaskGroup";
import useTasks from "../hooks/useTasks";

function TodoPage() {
  const {
    tasksGrouped,
    selectedGroup,
    setSelectedGroup,
    editingTask,
    setEditingTask,
    handleAdd,
    handleEdit,
    handleDelete,
    handleComplete,
  } = useTasks();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📝 Task Manager</h1>
          <p className="text-gray-500">Stay organized and manage your day efficiently</p>
        </header>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <TaskForm
            onSubmit={handleAdd}
            editingTask={editingTask}
            onEdit={handleEdit}
          />
        </div>

        <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Select a Group
          </label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select a Group --</option>
            {Object.keys(tasksGrouped).map((group) => (
              <option key={group} value={group}>
                {group || "(No Group)"}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          {selectedGroup ? (
            <TaskGroup
              group={selectedGroup}
              tasks={tasksGrouped[selectedGroup] || []}
              onEditClick={setEditingTask}
              onDelete={handleDelete}
              onComplete={handleComplete}
            />
          ) : (
            <div className="text-center text-gray-500 italic">
              Please select a group to view tasks.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoPage;
