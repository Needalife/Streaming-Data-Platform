// src/dashboard/sub-components/MonthlyCalendar.jsx
import React, { useState } from 'react';

const MonthlyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Calculate first and last days of the month.
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDays = lastDayOfMonth.getDate();
  const startWeekDay = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)

  // Build weeks array, filling in null for empty cells.
  const weeks = [];
  let week = [];
  for (let i = 0; i < startWeekDay; i++) {
    week.push(null);
  }
  for (let day = 1; day <= totalDays; day++) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }

  // Helper: Check if a given day is today.
  const today = new Date();
  const isToday = (day) =>
    day &&
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  // Handlers for month navigation.
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  return (
    <div className="mt-4 w-full max-w-md bg-white rounded p-4 shadow">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={handlePrevMonth}
          className="bg-indigo-500 text-white p-2 rounded"
        >
          {/* Left Arrow Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-bold text-gray-800 text-sm">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button
          onClick={handleNextMonth}
          className="bg-indigo-500 text-white p-2 rounded"
        >
          {/* Right Arrow Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {/* Header for day names */}
      <div className="grid grid-cols-7 gap-1 text-xs text-gray-800">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-center font-bold">
            {d}
          </div>
        ))}
      </div>
      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1 text-xs text-gray-800">
        {weeks.map((weekArr, weekIndex) =>
          weekArr.map((day, dayIndex) => {
            const todayFlag = isToday(day);
            const isSelected = day && day === selectedDay;
            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`w-full aspect-square flex items-center justify-center rounded cursor-pointer
                  ${day ? 'bg-gray-100 hover:bg-gray-200' : ''}
                  ${todayFlag ? 'border-2 border-indigo-500' : ''}
                  ${isSelected ? 'bg-indigo-500 text-white' : ''}`}
                onClick={() => day && setSelectedDay(day)}
              >
                {day || ''}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MonthlyCalendar;
