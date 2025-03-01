import React, { useState, useCallback, useEffect } from "react";
import { FiCheck } from "react-icons/fi";

const StatusFilterCheckboxes = ({ onStatusChange, selectedStatuses: propSelectedStatuses }) => {
  // Initialize local state: default is "all" selected.
  const [checkboxStates, setCheckboxStates] = useState({
    all: true,
    completed: false,
    pending: false,
    failed: false
  });

  // Optionally sync with external selectedStatuses prop if provided.
  useEffect(() => {
    if (propSelectedStatuses && propSelectedStatuses.length) {
      if (propSelectedStatuses.includes("All")) {
        setCheckboxStates({
          all: true,
          completed: false,
          pending: false,
          failed: false
        });
      } else {
        setCheckboxStates({
          all: false,
          completed: propSelectedStatuses.includes("completed"),
          pending: propSelectedStatuses.includes("pending"),
          failed: propSelectedStatuses.includes("failed")
        });
      }
    }
  }, [propSelectedStatuses]);

  const handleCheckboxChange = useCallback(
    (status) => {
      setCheckboxStates((prev) => {
        if (status === "all") {
          // Selecting "All" resets other checkboxes.
          const newState = {
            all: true,
            completed: false,
            pending: false,
            failed: false
          };
          if (onStatusChange) onStatusChange(["All"]);
          return newState;
        }

        // Toggle the selected status and uncheck "All"
        const newStates = {
          ...prev,
          all: false,
          [status]: !prev[status]
        };

        // If no individual status is selected, default back to "All"
        const hasAnyStatusSelected = newStates.completed || newStates.pending || newStates.failed;
        if (!hasAnyStatusSelected) {
          if (onStatusChange) onStatusChange(["All"]);
          return {
            all: true,
            completed: false,
            pending: false,
            failed: false
          };
        } else {
          const selected = [];
          if (newStates.completed) selected.push("completed");
          if (newStates.pending) selected.push("pending");
          if (newStates.failed) selected.push("failed");
          if (onStatusChange) onStatusChange(selected);
          return newStates;
        }
      });
    },
    [onStatusChange]
  );

  // A reusable custom checkbox component with a check icon when selected.
  const CustomCheckbox = ({ label, status, checked, onChange }) => (
    <div className="relative flex items-center gap-2 group">
      <input
        type="checkbox"
        id={status}
        checked={checked}
        onChange={() => onChange(status)}
        className="peer absolute opacity-0 w-5 h-5 cursor-pointer"
        aria-label={`Filter by ${label} status`}
      />
      <div className="w-5 h-5 border-2 border-gray-300 rounded transition-colors duration-200 ease-in-out peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-blue-500 peer-checked:bg-blue-500 peer-checked:border-blue-500 flex items-center justify-center">
        {checked && <FiCheck className="text-white" />}
      </div>
      <label
        htmlFor={status}
        className="text-sm font-medium text-gray-700 cursor-pointer select-none transition-colors duration-200 group-hover:text-blue-600"
      >
        {label}
      </label>
    </div>
  );

  return (
    <div>
      <label className="block mb-4 font-semibold">Filter by Statuses</label>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* "All" checkbox on the left */}
        <div className="flex-none">
          <CustomCheckbox
            label="All"
            status="all"
            checked={checkboxStates.all}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className="w-px h-6 bg-gray-200 hidden sm:block" />
        {/* Other status checkboxes */}
        <div className="flex flex-wrap gap-4">
          <CustomCheckbox
            label="Completed"
            status="completed"
            checked={checkboxStates.completed}
            onChange={handleCheckboxChange}
          />
          <CustomCheckbox
            label="Pending"
            status="pending"
            checked={checkboxStates.pending}
            onChange={handleCheckboxChange}
          />
          <CustomCheckbox
            label="Failed"
            status="failed"
            checked={checkboxStates.failed}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusFilterCheckboxes;
