"use client"

import { useState } from "react"

export default function Calendar() {
  const [currentDate] = useState(new Date(2023, 10, 28)) // November 28, 2023

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Generate calendar data for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay() // 0 = Sunday, 1 = Monday, etc.

    // Adjust for Monday as first day of week
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

    const calendarDays = []

    // Add days from previous month
    const prevMonth = month === 0 ? 11 : month - 1
    const prevMonthYear = month === 0 ? year - 1 : year
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate()

    for (let i = startDay - 1; i >= 0; i--) {
      calendarDays.push({
        day: daysInPrevMonth - i,
        currentMonth: false,
        date: new Date(prevMonthYear, prevMonth, daysInPrevMonth - i),
      })
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        day: i,
        currentMonth: true,
        date: new Date(year, month, i),
        isToday: i === currentDate.getDate(),
      })
    }

    // Add days from next month
    const nextMonth = month === 11 ? 0 : month + 1
    const nextMonthYear = month === 11 ? year + 1 : year
    const daysToAdd = 42 - calendarDays.length // 6 rows of 7 days

    for (let i = 1; i <= daysToAdd; i++) {
      calendarDays.push({
        day: i,
        currentMonth: false,
        date: new Date(nextMonthYear, nextMonth, i),
      })
    }

    return calendarDays
  }

  const calendarDays = generateCalendarDays()

  // Group days into weeks
  const weeks = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }

  // Get month name and year
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const monthName = monthNames[currentDate.getMonth()]

  // Highlighted dates (for demonstration)
  const highlightedDates = {
    5: { color: "bg-teal-400 text-white" },
    16: { color: "bg-red-400 text-white" },
    18: { color: "bg-red-400 text-white" },
    28: { color: "bg-pink-500 text-white" },
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button className="p-1 text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h2 className="text-lg font-medium text-gray-900 mx-2">Nov 28, Wednesday</h2>
          <button className="p-1 text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}

        {weeks.slice(0, 5).map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const isHighlighted = highlightedDates[day.day] && day.currentMonth
            const colorClass = isHighlighted
              ? highlightedDates[day.day].color
              : day.currentMonth
                ? "hover:bg-gray-100"
                : "text-gray-400"
            const isToday = day.isToday

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`text-center py-1 text-sm rounded-full ${isToday ? "bg-pink-500 text-white" : colorClass}`}
              >
                {day.day}
              </div>
            )
          }),
        )}
      </div>
    </div>
  )
}

