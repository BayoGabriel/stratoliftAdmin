"use client"
import Image from "next/image"
import { FaExclamationTriangle, FaTimes } from "react-icons/fa"
export default function TechnicianDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 md:bg-gray-100">
      <div className="max-w-md mx-auto w-full bg-gray-50 min-h-screen relative shadow-none md:shadow-lg md:my-8 md:rounded-xl overflow-hidden">
        <main className="flex-1 p-4 overflow-y-auto">
          {/* Emergency Requests */}
          <section className="mb-6">
            <div className="flex items-center mb-3">
              <h2 className="text-lg font-semibold text-red-500 mr-2">Emergency Request Tasks</h2>
              <FaExclamationTriangle size={18} className="text-red-500" />
            </div>

            <div className="space-y-3">
              {/* Task 1 */}
              <div className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Requester"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">XYZ Mall, Elevator #4</h3>
                    <p className="text-xs text-gray-600">Address: Gado Nasco Road</p>
                    <p className="text-xs text-gray-600">Kubwa Gado Nasco Road Kubwa</p>
                  </div>
                </div>
                <button className="bg-green-500 text-white text-xs font-bold py-2 px-4 rounded whitespace-nowrap">
                  ACCEPTED
                </button>
              </div>

              {/* Task 2 */}
              <div className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Requester"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Immediate Visit Request</h3>
                    <p className="text-xs text-gray-600">Address: Gado Nasco Road</p>
                    <p className="text-xs text-gray-600">Kubwa Gado Nasco Road Kubwa</p>
                  </div>
                </div>
                <button className="bg-red-500 text-white text-xs font-bold py-2 px-4 rounded whitespace-nowrap">
                  ACCEPT
                </button>
              </div>

              {/* Task 3 */}
              <div className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Requester"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">XYZ Mall, Elevator #4</h3>
                    <p className="text-xs text-gray-600">Address: Gado Nasco Road</p>
                    <p className="text-xs text-gray-600">Kubwa Gado Nasco Road Kubwa</p>
                  </div>
                </div>
                <button className="bg-red-500 text-white text-xs font-bold py-2 px-4 rounded whitespace-nowrap">
                  ACCEPT
                </button>
              </div>
            </div>
          </section>

          {/* Pending Tasks */}
          <section>
            <div className="flex items-center mb-3">
              <h2 className="text-lg font-semibold text-red-500">Pending Task</h2>
            </div>

            <div className="space-y-3">
              {/* Pending Task 1 */}
              <div className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <FaTimes size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Scheduled Maintenance</h3>
                    <p className="text-xs text-gray-600">Client: XYZ Plaza Evator #4</p>
                    <p className="text-xs text-gray-600">Date: 23 Feb 2025</p>
                  </div>
                </div>
                <button className="bg-red-500 text-white text-xs font-bold py-2 px-4 rounded whitespace-nowrap">
                  ACCEPT
                </button>
              </div>

              {/* Pending Task 2 */}
              <div className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <FaTimes size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Scheduled Maintenance</h3>
                    <p className="text-xs text-gray-600">Client: XYZ Plaza Evator #4</p>
                    <p className="text-xs text-gray-600">Date: 23 Feb 2025</p>
                  </div>
                </div>
                <button className="bg-red-500 text-white text-xs font-bold py-2 px-4 rounded whitespace-nowrap">
                  ACCEPT
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

