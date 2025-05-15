// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from 'react-hot-toast';

// const Login = () => {
//     const [formData, setFormData] = useState({ username: "", password: "" });
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const response = await axios.post(
//                 "https://backend.app20.in/api/token/",
//                 new URLSearchParams(formData),
//                 {
//                     headers: {
//                         "Content-Type": "application/x-www-form-urlencoded",
//                     },
//                     withCredentials: true,
//                 }
//             );

//             if (response.status === 200) {
//                 // console.log("Login successful, token received:", response.data);
                
//                 // Store both tokens
//                 localStorage.setItem('accessToken', response.data.access);
//                 localStorage.setItem('refreshToken', response.data.refresh);
                
//                 // Set the Authorization header for future requests
//                 axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                
//                 toast.success("Login Successful");
//                 navigate("/");
//             } else {
//                 toast.error("Login Failed");
//             }
//         } catch (err) {
//             console.error("Login error:", err);
//             toast.error("Invalid Username or Password");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//             <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 space-y-6">
//                 <div className="flex justify-center">
//                     <img src="/logo.png" alt="Logo" className="w-36 h-16" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-center text-gray-800">
//                     Login to Your Account
//                 </h2>
//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     <div>
//                         <label
//                             htmlFor="username"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                         >
//                             Username
//                         </label>
//                         <input
//                             type="text"
//                             id="username"
//                             name="username"
//                             value={formData.username}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label
//                             htmlFor="password"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                         >
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             id="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
//                     >
//                         {loading ? 'Logging in...' : 'Login'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Login;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from 'react-hot-toast';

// const Login = () => {
//     const [formData, setFormData] = useState({ username: "", password: "" });
//     const [loading, setLoading] = useState(false);
//     const [loginSuccess, setLoginSuccess] = useState(false);
//     const navigate = useNavigate();

//     // Effect to handle navigation after successful login
//     useEffect(() => {
//         if (loginSuccess) {
//             const timer = setTimeout(() => {
//                 navigate("/");
//             }, 800); 
//             return () => clearTimeout(timer);
//         }
//     }, [loginSuccess, navigate]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const response = await axios.post(
//                 "https://backend.app20.in/api/token/",
//                 new URLSearchParams(formData),
//                 {
//                     headers: {
//                         "Content-Type": "application/x-www-form-urlencoded",
//                     },
//                     withCredentials: true,
//                 }
//             );

//             if (response.status === 200) {
//                 console.log("Login successful, token received");
                
//                 // Store both tokens
//                 localStorage.setItem('accessToken', response.data.access);
//                 localStorage.setItem('refreshToken', response.data.refresh);
                
//                 // Set the Authorization header for future requests
//                 axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                
//                 // Show success message
//                 toast.success("Login Successful");
                
//                 // Set login success state to trigger navigation
//                 setLoginSuccess(true);
//             } else {
//                 toast.error("Login Failed");
//                 setLoading(false);
//             }
//         } catch (err) {
//             console.error("Login error:", err);
//             toast.error("Invalid Username or Password");
//             setLoading(false);
//         }
//     };

//     // Handle manual navigation if automatic doesn't work
//     const handleManualNavigation = () => {
//         navigate("/");
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//             <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 space-y-6">
//                 <div className="flex justify-center">
//                     <img src="/logo.png" alt="Logo" className="w-36 h-16" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-center text-gray-800">
//                     Login to Your Account
//                 </h2>
                
//                 {loginSuccess && (
//                     <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center">
//                         Login successful! Redirecting...
//                         <button 
//                             onClick={handleManualNavigation}
//                             className="ml-2 underline"
//                         >
//                             Click here if not redirected
//                         </button>
//                     </div>
//                 )}
                
//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     <div>
//                         <label
//                             htmlFor="username"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                         >
//                             Username
//                         </label>
//                         <input
//                             type="text"
//                             id="username"
//                             name="username"
//                             value={formData.username}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label
//                             htmlFor="password"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                         >
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             id="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading || loginSuccess}
//                         className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
//                     >
//                         {loading ? 'Logging in...' : loginSuccess ? 'Logged In' : 'Login'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Login;

// src/components/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const success = await login(formData.username, formData.password);
            
            if (success) {
                toast.success("Login Successful");
                // Add a short delay before navigation
                setTimeout(() => {
                    navigate("/");
                }, 500);
            } else {
                toast.error("Login Failed");
                setLoading(false);
            }
        } catch (err) {
            console.error("Login error:", err);
            toast.error("Invalid Username or Password");
            setLoading(false);
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 space-y-6">
        <div className="flex justify-center">
          <img src="/logo.png" alt="Logo" className="w-36 h-16" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;