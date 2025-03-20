"use client"

import { useState } from "react"
import TasksSection from "@/components/AdminDb/Task-section"
import Calendar from "@/components/AdminDb/Calender"
import TechniciansSection from "@/components/AdminDb/Technician-section"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex bg-gray-50">
      <main className="flex-1 overflow-auto">
        <div className="">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TasksSection />
            </div>
            <div className="space-y-6">
              <Calendar />
              <TechniciansSection />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

