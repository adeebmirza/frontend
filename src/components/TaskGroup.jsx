import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import {
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline"; // or use react-icons if you prefer

function TaskGroup({ group, tasks, onEditClick, onDelete, onComplete }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {group || "No Group"}
      </h3>

      <TransitionGroup component="ul" className="space-y-3">
        {tasks.map((task) => (
          <CSSTransition
            key={task._id}
            timeout={300}
            classNames={{
              enter: "opacity-0 translate-y-2",
              enterActive: "opacity-100 translate-y-0 transition-all duration-300",
              exit: "opacity-100",
              exitActive: "opacity-0 transition-opacity duration-200",
            }}
          >
            <li className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-100">
              <span
                className={`flex-1 ${
                  task.status === "completed"
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {task.task}
              </span>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onEditClick(task)}
                  className="text-yellow-500 hover:text-yellow-600 transition"
                  title="Edit"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={() => onDelete(task._id)}
                  className="text-red-500 hover:text-red-600 transition"
                  title="Delete"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>

                {task.status !== "completed" && (
                  <button
                    onClick={() => onComplete(task._id)}
                    className="text-green-600 hover:text-green-700 transition"
                    title="Complete"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </li>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
}

export default TaskGroup;
