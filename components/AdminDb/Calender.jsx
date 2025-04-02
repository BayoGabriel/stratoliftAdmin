const Calendar = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const currentDate = new Date()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  const leadingDays = firstDayOfMonth.getDay()
  const trailingDays = 6 - lastDayOfMonth.getDay()
  const totalDays = lastDayOfMonth.getDate()

  let dayCounter = 1
  let nextMonthDayCounter = 1
  let prevMonthDayCounter = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate() - leadingDays + 1

  const weeks = []
  for (let i = 0; i < 6; i++) {
    const week = []
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < leadingDays) {
        week.push({
          day: prevMonthDayCounter,
          currentMonth: false,
          date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDayCounter),
        })
        prevMonthDayCounter++
      } else if (dayCounter <= totalDays) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayCounter)
        week.push({
          day: dayCounter,
          currentMonth: true,
          isToday:
            currentDate.getDate() === dayCounter &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear(),
          date: date,
        })
        dayCounter++
      } else {
        week.push({
          day: nextMonthDayCounter,
          currentMonth: false,
          date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, nextMonthDayCounter),
        })
        nextMonthDayCounter++
      }
    }
    weeks.push(week)
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
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-6">
        <button className="text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-left"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-900">
          {monthName} {currentDate.getDate()}, {days[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]}
        </h2>
        <button className="text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-gray-700 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            let bgColorClass = "hover:bg-gray-100"
            let textColorClass = day.currentMonth ? "text-gray-900" : "text-gray-400"

            if (day.isToday) {
              bgColorClass = "bg-pink-500"
              textColorClass = "text-white"
            }

            // Sample highlighted dates (similar to the image)
            const date = day.date.getDate()
            const isHighlighted = [5, 8].includes(date) && day.currentMonth
            const isRedHighlighted = [16, 18].includes(date) && day.currentMonth

            if (isHighlighted) {
              bgColorClass = "bg-cyan-300"
              textColorClass = "text-gray-900"
            }

            if (isRedHighlighted) {
              bgColorClass = "bg-red-400"
              textColorClass = "text-white"
            }

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`flex items-center justify-center w-10 h-10 mx-auto rounded-full ${bgColorClass} ${textColorClass}`}
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

export default Calendar

