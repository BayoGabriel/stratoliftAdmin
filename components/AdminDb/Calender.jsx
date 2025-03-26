"use client"

import { useState } from "react"

export default function Calendar() {
  const [currentDate] = useState(new Date()) // Use actual current date

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
        isToday:
          i === currentDate.getDate() &&
          month === currentDate.getMonth() &&
          year === currentDate.getFullYear(),
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

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          {monthName} {currentDate.getFullYear()}
        </h2>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}

        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const isToday = day.isToday
            const colorClass = isToday
              ? "bg-blue-900 text-white"
              : day.currentMonth
              ? "hover:bg-gray-100"
              : "text-gray-400"

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`text-center py-1 text-sm rounded-full ${colorClass}`}
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
