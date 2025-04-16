"use client"
import logo from "@/public/stratologo.png"
import { useState, useEffect } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import toast from "react-hot-toast"

const Homepage = () => {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [modal, setModal] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(true)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [formRegisterData, setFormRegisterData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [error, setError] = useState(null)
  const [error1, setError1] = useState(null)
  const [forgotPasswordError, setForgotPasswordError] = useState(null)
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const closeMenus = () => {
    setIsMenuOpen(false)
    setIsOpen(false)
  }

  const handleModalClick = (isLogin) => {
    setModal(true)
    setShowLoginForm(isLogin)
    setShowForgotPassword(false)
    closeMenus()
  }

  const closeModal = () => {
    setModal(false)
    setShowForgotPassword(false)
  }

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error("Error logging out")
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setError(null)

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (res.ok) {
        try {
          const userRes = await fetch("/api/getUserRole")
          if (!userRes.ok) {
            throw new Error(`API Error: ${userRes.status} ${userRes.statusText}`)
          }

          const userData = await userRes.json()

          if (userData?.role === "admin") {
            router.push("/admin")
          } else if (userData?.role === "technician") {
            router.push("/admin/technicians")
          } else {
            router.push("/dashboard")
          }

          setModal(false)
          toast.success("Logged in successfully")
        } catch (error) {
          console.error("Fetching user role failed:", error)
          setError("Failed to retrieve user role.")
        }
      } else {
        setError(res.error || "Invalid credentials")
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setIsRegistering(true)
    setError1(null)

    if (formRegisterData.password !== formRegisterData.confirmPassword) {
      setError1("Passwords do not match")
      setIsRegistering(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formRegisterData),
      })

      const data = await res.json()
      if (res.status === 201) {
        toast.success("Account created successfully! Please sign in.")
        setShowLoginForm(true)
        setFormData({ ...formData, email: formRegisterData.email })
      } else {
        setError1(data.message || "Registration failed")
      }
    } catch (error) {
      setError1("Something went wrong. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setIsSendingReset(true)
    setForgotPasswordError(null)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success("If your email is registered, you will receive a password reset link")
        setShowForgotPassword(false)
        setShowLoginForm(true)
      } else {
        setForgotPasswordError(data.message || "Failed to send reset email")
      }
    } catch (error) {
      setForgotPasswordError("Something went wrong. Please try again.")
    } finally {
      setIsSendingReset(false)
    }
  }

  return (
    <>
      <div className="w-full items-center bg-[#F6F6F6] flex px-20 justify-center min-h-screen gap-10">
        <div className="flex w-[50%] items-center justify-center h-full">
          <Image src={logo || "/placeholder.svg"} alt="logo" className="" />
        </div>
        <div className="bg-white w-[50%] rounded-[10px] p-16">
          {showForgotPassword ? (
            <form
              onSubmit={handleForgotPassword}
              className="w-full flex flex-col items-center gap-[56px] justify-center lg:px-[10px]"
            >
              <div className="w-full flex items-center gap-[32px] justify-center flex-col">
                <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
                <p className="text-center text-gray-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <div className="w-full">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={forgotPasswordEmail}
                      className="w-full p-[10px] placeholder:text-black text-black border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-4 items-center justify-center">
                <button
                  type="submit"
                  className="bg-[#EC3237] cursor-pointer text-white py-[10px] px-[20px] rounded-[10px] w-full"
                  disabled={isSendingReset}
                >
                  {isSendingReset ? "Sending..." : "Send Reset Link"}
                </button>
                {forgotPasswordError && <p className="text-red-500">{forgotPasswordError}</p>}
                <p className="text-[16px] text-black inter font-[400]">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false)
                      setShowLoginForm(true)
                    }}
                    className="text-[#3777FF] cursor-pointer font-[900]"
                  >
                    Back to Sign In
                  </button>
                </p>
              </div>
            </form>
          ) : showLoginForm ? (
            <form
              onSubmit={handleLoginSubmit}
              className="w-full flex flex-col items-center gap-[56px] justify-center lg:px-[10px]"
            >
              <div className="w-full flex items-center gap-[32px] justify-center flex-col">
                <div className="flex flex-col gap-3 w-full">
                  <div className="w-full">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      className="w-full p-[10px] placeholder:text-black text-black border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="w-full">
                    <div className="w-full relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className="w-full p-[10px] placeholder:text-black border border-[#403D39CC] text-black placeholder:text-[12px] rounded-[10px]"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-[14px] cursor-pointer text-gray-500"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <div className="w-full text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLoginForm(false)
                        setShowForgotPassword(true)
                      }}
                      className="text-[#3777FF] text-sm cursor-pointer font-[500]"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-4 items-center justify-center">
                <button
                  type="submit"
                  className="bg-[#EC3237] cursor-pointer text-white py-[10px] px-[20px] rounded-[10px] w-full"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Signing in..." : "Sign In"}
                </button>
                {error && <p className="text-red-500">{error}</p>}
                <p className="text-[16px] text-black inter font-[400]">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setShowLoginForm(false)}
                    className="text-[#3777FF] cursor-pointer font-[900]"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleRegisterSubmit}
              className="w-full flex flex-col items-center gap-[34px] justify-center lg:px-[10px]"
            >
              <div className="w-full flex items-center gap-[24px] justify-center flex-col">
                <div className="flex flex-col gap-3 w-full">
                  <div className="w-full grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="firstName" className="h4 text-black">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Enter your first name"
                        className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] text-black placeholder:text-black rounded-[10px]"
                        value={formRegisterData.firstName}
                        onChange={(e) => setFormRegisterData({ ...formRegisterData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="w-full flex flex-col gap-1">
                      <label htmlFor="lastName" className="h4 text-black">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Enter your last name"
                        className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] text-black placeholder:text-black rounded-[10px]"
                        value={formRegisterData.lastName}
                        onChange={(e) => setFormRegisterData({ ...formRegisterData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="address" className="h4 text-black">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter your address"
                      className="w-full p-[10px] placeholder:text-black text-black border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                      value={formRegisterData.address}
                      onChange={(e) => setFormRegisterData({ ...formRegisterData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="email" className="h4 text-black">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      className="w-full p-[10px] placeholder:text-black text-black border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                      value={formRegisterData.email}
                      onChange={(e) => setFormRegisterData({ ...formRegisterData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="password" className="h4 text-black">
                      Password
                    </label>
                    <div className="w-full relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className="w-full p-[10px] placeholder:text-black text-black border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                        value={formRegisterData.password}
                        onChange={(e) => setFormRegisterData({ ...formRegisterData, password: e.target.value })}
                        required
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-[14px] cursor-pointer text-gray-500"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="confirmPassword" className="h4 text-black">
                      Confirm Password
                    </label>
                    <div className="w-full relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="w-full p-[10px] placeholder:text-black text-black border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                        value={formRegisterData.confirmPassword}
                        onChange={(e) => setFormRegisterData({ ...formRegisterData, confirmPassword: e.target.value })}
                        required
                      />
                      <span
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-[14px] cursor-pointer text-gray-500"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-4 items-center justify-center">
                <button
                  type="submit"
                  className="bg-[#EC3237] cursor-pointer text-white py-[10px] px-[20px] rounded-[10px] w-full"
                  disabled={isRegistering}
                >
                  {isRegistering ? "Creating account..." : "Sign Up"}
                </button>
                {error1 && <p className="text-red-500">{error1}</p>}
                <p className="text-[16px] inter text-black font-[400]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setShowLoginForm(true)}
                    className="text-[#3777FF] cursor-pointer font-[900]"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default Homepage
