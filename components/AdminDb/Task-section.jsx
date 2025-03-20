import { MdFilePresent } from "react-icons/md";

export default function TasksSection() {
    const emergencyTasks = [
      {
        id: "UI007",
        location: "XYZ PLAZA",
        elevatorId: "#567ASHQ",
        tech: "Adamu James",
        comments: 3,
        assignees: 2,
        plusCount: 5,
      },
      {
        id: "UI007",
        location: "XYZ PLAZA",
        elevatorId: "#567ASHQ",
        tech: "Adamu James",
        comments: 3,
        assignees: 2,
        plusCount: 5,
      },
      {
        id: "UI007",
        location: "XYZ PLAZA",
        elevatorId: "#567ASHQ",
        tech: "Adamu James",
        comments: 3,
        assignees: 2,
        plusCount: 5,
      },
      {
        id: "UI007",
        location: "XYZ PLAZA",
        elevatorId: "#567ASHQ",
        tech: "Adamu James",
        comments: 3,
        assignees: 2,
        plusCount: 5,
      },
    ]
  
    const serviceTasks = [
      {
        id: "UI007",
        location: "XYZ PLAZA",
        elevatorId: "#567ASHQ",
        tech: "Adamu James",
        comments: 3,
        assignees: 2,
        plusCount: 5,
      },
      {
        id: "UI007",
        location: "XYZ PLAZA",
        elevatorId: "#567ASHQ",
        tech: "Adamu James",
        comments: 3,
        assignees: 2,
        plusCount: 5,
      },
      {
        id: "UI007",
        location: "XYZ PLAZA",
        elevatorId: "#567ASHQ",
        tech: "Adamu James",
        comments: 3,
        assignees: 2,
        plusCount: 5,
      },
      {
        id: "UI007",
        location: "XYZ PLAZA",
        elevatorId: "#567ASHQ",
        tech: "Adamu James",
        comments: 3,
        assignees: 2,
        plusCount: 5,
      },
    ]
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-[600] text-[#1F2633] inter">
              Emergency Tasks{" "}
              <span className="bg-gray-200 font-[600] text-[#1F2633] inter text-sm px-2 py-0.5 rounded ml-2">4</span>
            </h2>
            <button className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            {emergencyTasks.map((task, index) => (
              <TaskCard key={index} task={task} isEmergency={true} />
            ))}
          </div>
        </div>
  
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-[600] text-[#1F2633] inter">
              Service Request Tasks{" "}
              <span className="bg-gray-200 font-[600] text-[#1F2633] inter text-sm px-2 py-0.5 rounded ml-2">4</span>
            </h2>
            <button className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            {serviceTasks.map((task, index) => (
              <TaskCard key={index} task={task} isEmergency={false} />
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  function TaskCard({ task, isEmergency }) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-[45px]">
            <h3 className="font-[700] text-[#1F2633] inter text-[18px]">{task.location}</h3>
            {isEmergency && (
             <span className="inline-flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            )}
          </div>
          <div className="bg-[#EC32371A] text-[#EC3237] text-[14px] font-[800] px-2 py-[5px] rounded">Tech: {task.tech}</div>
        </div>
  
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <div className="text-[#606C80] text-[12px] font-[800] inter border border-[#EBEEF2] py-[5px] px-[8px] rounded-[16px]">Task ID: {task.id}</div>
            <div className="text-[#2563EB] bg-[#3B82F61A] text-[12px] font-[800] inter py-[5px] px-[8px] rounded-[16px]">Elevator ID: {task.elevatorId}</div>
            <div className="bg-[#EAB3081A] text-[#CA8A04] text-[12px] font-[800] inter px-[8px] py-[5px] rounded-[16px]">Gado nasco Kubwa</div>
          </div>
          <div className="flex justify-between flex-col items-start mt-4">
            <div className="flex -space-x-2">
              <div className="h-7 w-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                <img src="/placeholder.svg?height=28&width=28" alt="User" className="h-full w-full rounded-full" />
              </div>
              <div className="h-7 w-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                <img src="/placeholder.svg?height=28&width=28" alt="User" className="h-full w-full rounded-full" />
              </div>
              <div className="h-7 w-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                +{task.plusCount}
              </div>
            </div>
    
            <div className="flex space-x-2">
              <div className="flex items-center space-x-1 text-[#A855F7] px-2 py-1 rounded">
                <MdFilePresent />
                <span>{task.assignees}</span>
              </div>
              <div className="flex items-center space-x-1 text-[#F59E0B] px-2 py-1 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span>{task.comments}</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    )
  }
  
  