"use client"
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginImage from "../../../public/Login.png";

export default function Signup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    location: ''
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Invalid email format';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = 'Invalid phone number (10 digits required)';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: formData.username, 
          email: formData.email, 
          password: formData.password,
          phone: formData.phone,
          location: formData.location,
          role: 'CUSTOMER' 
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
  
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.data));
  
      // Redirect to dashboard
      router.push("/login");
  
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({
        submit: error.message || 'Failed to create account. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md">
        <div className="flex justify-center mb-4 sm:mb-6">
          <Image 
            src={LoginImage} 
            alt="Logo" 
            width={100} 
            height={80} 
            priority 
            className="w-20 h-16 sm:w-24 sm:h-20"
          />
        </div>

        <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800">
          Sign up your account
        </h2>

        {errors.submit && (
          <div className="mt-3 sm:mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm sm:text-base text-gray-600 font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className={`mt-1 w-full p-2 sm:p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-black ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm sm:text-base text-gray-600 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="hello@example.com"
              className={`mt-1 w-full p-2 sm:p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-black ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm sm:text-base text-gray-600 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`mt-1 w-full p-2 sm:p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-black pr-10 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm sm:text-base text-gray-600 font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={`mt-1 w-full p-2 sm:p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-black ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-sm sm:text-base text-gray-600 font-medium">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your location"
              className={`mt-1 w-full p-2 sm:p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-black ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.location && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                <span>Signing up...</span>
              </>
            ) : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm mt-4 sm:mt-6 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}