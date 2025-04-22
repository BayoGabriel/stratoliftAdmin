// "use client"
// import { useState } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { FaEye, FaEyeSlash } from "react-icons/fa"
// import toast from "react-hot-toast"
// import Image from "next/image"
// import logo from "@/public/stratologo.png"

// export default function ResetPassword() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const token = searchParams.get("token")

//   const [formData, setFormData] = useState({
//     password: "",
//     confirmPassword: "",
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [isResetting, setIsResetting] = useState(false)
//   const [error, setError] = useState(null)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsResetting(true)
//     setError(null)

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match")
//       setIsResetting(false)
//       return
//     }

//     if (!token) {
//       setError("Invalid reset token")
//       setIsResetting(false)
//       return
//     }

//     try {
//       const res = await fetch("/api/auth/reset-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           token,
//           password: formData.password,
//           confirmPassword: formData.confirmPassword,
//         }),
//       })

//       const data = await res.json()

//       if (res.ok) {
//         toast.success("Password reset successfully")
//         router.push("/")
//       } else {
//         setError(data.message || "Failed to reset password")
//       }
//     } catch (error) {
//       setError("Something went wrong. Please try again.")
//     } finally {
//       setIsResetting(false)
//     }
//   }

//   return (
//     <div className="w-full items-center bg-[#F6F6F6] flex px-20 justify-center min-h-screen gap-10">
//       <div className="flex w-[50%] items-center justify-center h-full">
//         <Image src={logo || "/placeholder.svg"} alt="logo" className="" />
//       </div>
//       <div className="bg-white w-[50%] rounded-[10px] p-16">
//         <form
//           onSubmit={handleSubmit}
//           className="w-full flex flex-col items-center gap-[56px] justify-center lg:px-[10px]"
//         >
//           <div className="w-full flex items-center gap-[32px] justify-center flex-col">
//             <h2 className="text-2xl font-bold text-center">Reset Your Password</h2>
//             <p className="text-center text-gray-600">Please enter your new password below.</p>
//             <div className="flex flex-col gap-3 w-full">
//               <div className="w-full flex flex-col gap-1">
//                 <label htmlFor="password" className="h4 text-black">
//                   New Password
//                 </label>
//                 <div className="w-full relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     placeholder="Enter new password"
//                     className="w-full p-[10px] placeholder:text-black text-black border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
//                     value={formData.password}
//                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     required
//                   />
//                   <span
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-[14px] cursor-pointer text-gray-500"
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </span>
//                 </div>
//               </div>
//               <div className="w-full flex flex-col gap-1">
//                 <label htmlFor="confirmPassword" className="h4 text-black">
//                   Confirm New Password
//                 </label>
//                 <div className="w-full relative">
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     placeholder="Confirm new password"
//                     className="w-full p-[10px] placeholder:text-black text-black border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
//                     value={formData.confirmPassword}
//                     onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                     required
//                   />
//                   <span
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-4 top-[14px] cursor-pointer text-gray-500"
//                   >
//                     {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="w-full flex flex-col gap-4 items-center justify-center">
//             <button
//               type="submit"
//               className="bg-[#EC3237] cursor-pointer text-white py-[10px] px-[20px] rounded-[10px] w-full"
//               disabled={isResetting}
//             >
//               {isResetting ? "Resetting..." : "Reset Password"}
//             </button>
//             {error && <p className="text-red-500">{error}</p>}
//             <p className="text-[16px] text-black inter font-[400]">
//               Remember your password?{" "}
//               <button
//                 type="button"
//                 onClick={() => router.push("/")}
//                 className="text-[#3777FF] cursor-pointer font-[900]"
//               >
//                 Sign in
//               </button>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page