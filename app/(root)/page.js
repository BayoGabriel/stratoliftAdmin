'use client';
import { LiaTimesSolid } from "react-icons/lia";
import { CiMenuFries } from "react-icons/ci";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { HiOutlineBell } from 'react-icons/hi'; 
import { GoPerson } from 'react-icons/go'; 
import toast from 'react-hot-toast';

const Homepage = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formRegisterData, setFormRegisterData] = useState({ username: '', email: '', password: '', school: '' });
  const [error, setError] = useState(null);
  const [error1, setError1] = useState(null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsOpen(false);
  };

  const handleModalClick = (isLogin) => {
    setModal(true);
    setShowLoginForm(isLogin);
    closeMenus()
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res.ok) {
      // Redirect to the dashboard after successful login
      router.push('/dashboard');
      setModal(false);
    } else {
      setError('Invalid credentials');
    }
  };
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formRegisterData),
      });

      const data = await res.json();
      if (res.status === 201) {
        setShowLoginForm(true)
      } else {
        setError1(data.message);
      }
    } catch (error1) {
      setError1('Something went wrong. Please try again.');
    }
  };

  return (
    <>
          <div className="justify-end items-end flex overflow-x-hidden overflow-y-auto fixed h-screen inset-0 z-50 outline-none focus:outline-none">
            <div className="w-full h-full absolute top-0 bg-black opacity-25 max-lg:hidden"></div>
            <div className="absolute h-full top-0 w-[720px] max-lg:w-full">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col h-full top-0 bottom-0 right-0 w-full bg-white outline-none focus:outline-none p-10">
                <div className="flex items-center justify-end">
                  <button onClick={closeModal} className="rounded-full size-[32px] hover:bg-slate-200">
                    ✕
                  </button>
                </div>
                <div className="relative">
                  {showLoginForm ? (
                    <form onSubmit={handleLoginSubmit} className="w-full flex flex-col items-center gap-[56px] justify-center lg:px-[10px]">
                      <div className="w-full flex flex-col items-center justify-center gap-3 max-lg:gap-2">
                        {/* <Image src={logo} alt="logo" className="w-[120px] h-[40px]" /> */}
                        <h3 className="h3">Sign In to Epoch</h3>
                      </div>
                      <div className="w-full flex items-center gap-[32px] justify-center flex-col">
                        <button className="flex items-center gap-8 p-3 border-[#403D39CC] border rounded-[30px] w-full justify-center">
                          <FcGoogle />
                          <span>Continue with Google</span>
                        </button>
                        <div className="w-full flex items-center gap-4">
                          <hr className="flex-grow border-t-1 border-black" />
                          <span className="px-2 text-black">or</span>
                          <hr className="flex-grow border-t-1 border-black" />
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                          <div className="w-full flex flex-col gap-1">
                            <label htmlFor="email" className="h4 text-black">Email address</label>
                            <input
                              type="email"
                              name="email"
                              placeholder="Enter your email address"
                              value={formData.email}
                              className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                          <div className="w-full flex flex-col gap-1">
                            <label htmlFor="password" className="h4 text-black">Password</label>
                            <div className="w-full relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              placeholder="Password"
                              className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <span
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-[14px] cursor-pointer text-gray-500"
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-4 items-center justify-center">
                        <button type="submit" className="primarybtn">
                        {isLoggingIn ? <span>Signing in...</span> : 'Sign In'}
                        </button>
                        {error && <p className="text-red-500">{error}</p>}
                        <p className="text-[16px] inter font-[400]">
                          Don't have an account?{" "}
                          <button
                            type="button"
                            onClick={() => setShowLoginForm(false)}
                            className="text-[#3777FF] font-[900]"
                          >
                            Sign Up
                          </button>
                        </p>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleRegisterSubmit} className="w-full flex flex-col items-center gap-[34px] justify-center lg:px-[10px]">
                      <div className="w-full flex flex-col items-center justify-center gap-3 max-lg:gap-2">
                        {/* <Image src={logo} alt="logo" className="w-[120px] h-[40px]" /> */}
                        <h3 className="h3">Sign Up to Join Epoch</h3>
                      </div>
                      <div className="w-full flex items-center gap-[24px] justify-center flex-col">
                        <button className="flex items-center gap-8 p-3 border-[#403D39CC] border rounded-[30px] w-full justify-center">
                          <FcGoogle />
                          <span>Continue with Google</span>
                        </button>
                        <div className="w-full flex items-center gap-4">
                          <hr className="flex-grow border-t-1 border-black" />
                          <span className="px-2 text-black">or</span>
                          <hr className="flex-grow border-t-1 border-black" />
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                          <div className="w-full grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <label htmlFor="email" className="h4 text-black">First Name</label>
                              <input
                                type="text"
                                name="firstName"
                                placeholder="Enter your first name"
                                className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                value={formRegisterData.username}
                                onChange={(e) => setFormRegisterData({ ...formRegisterData, username: e.target.value })}
                              />
                            </div>
                            <div className="w-full flex flex-col gap-1">
                              <label htmlFor="email" className="h4 text-black">Last Name</label>
                              <input
                                type="text"
                                name="lastname"
                                placeholder="Enter your last name"
                                className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                value={formRegisterData.school}
                                onChange={(e) => setFormRegisterData({ ...formRegisterData, school: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="w-full flex flex-col gap-1">
                            <label htmlFor="email" className="h4 text-black">Email address</label>
                            <input
                              type="email"
                              name="email"
                              placeholder="Enter your email address"
                              className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                              value={formRegisterData.email}
                              onChange={(e) => setFormRegisterData({ ...formRegisterData, email: e.target.value })}
                            />
                          </div>
                          <div className="w-full flex flex-col gap-1">
                            <label htmlFor="password" className="h4 text-black">Password</label>
                            <div className="w-full relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              placeholder="Password"
                              className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                              value={formRegisterData.password}
                              onChange={(e) => setFormRegisterData({ ...formRegisterData, password: e.target.value })}
                            />
                            <span
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-[14px] cursor-pointer text-gray-500"
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-4 items-center justify-center">
                        <button type="submit" className="primarybtn">
                        {isRegistering ? <span>Creating account...</span> : 'Sign Up'}
                        </button>
                        {error1 && <p className="text-red-500">{error1}</p>}
                        <p className="text-[16px] inter font-[400]">
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={() => setShowLoginForm(true)}
                            className="text-[#3777FF] font-[900]"
                          >
                            Sign in
                          </button>
                        </p>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
  )
}

export default Homepage