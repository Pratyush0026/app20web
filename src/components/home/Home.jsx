import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaExclamationCircle, FaSpinner, FaCheck } from 'react-icons/fa';
import { RiArrowRightUpLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists first
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate("/login");
      return;
    }

    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');

      // Use axios with explicit headers
      const response = await axios.get('https://backend.app20.in/api/form/app-details/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      setOffers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching offers:', err);

      // Handle 401 errors
      if (err.response && err.response.status === 401) {
        // Try to refresh the token
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const refreshResponse = await axios.post(
            'https://backend.app20.in/api/token/refresh/',
            { refresh: refreshToken },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          if (refreshResponse.status === 200) {
            // Store new access token
            localStorage.setItem('accessToken', refreshResponse.data.access);

            // Try the original request again
            const newToken = refreshResponse.data.access;
            const retryResponse = await axios.get('https://backend.app20.in/api/form/app-details/', {
              headers: {
                'Authorization': `Bearer ${newToken}`,
                'Content-Type': 'application/json'
              },
              withCredentials: true
            });

            setOffers(retryResponse.data);
            setError(null);
            return;
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // If refresh fails, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate("/login");
        }
      }

      setError('Failed to load offers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  function extractName(input) {
    return input.replace(/\s*Form\s*$/, '');
  }

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">

        <header className="flex items-center justify-between mb-10 text-center ">
          <div>
            <h1 className="text-4xl flex items-center justify-center font-bold text-indigo-700 ">Welcome to <img src="/logo.png" alt="app20" className='ml-5' /></h1>
            {/* <p className="mt-2 text-lg text-gray-600">Explore all available offers and rewards</p> */}
          </div>
          <div className="flex items-center space-x-4">
            <button
              className='flex items-center bg-indigo-700 hover:bg-indigo-600 px-5 py-2 text-white text-[20px] font-bold rounded-4xl cursor-pointer'
              onClick={() => navigate("/analytics")}
            >
              See Analytics <RiArrowRightUpLine className='text-[25px]' />
            </button>
            <button
              className='flex items-center bg-red-600 hover:bg-red-700 px-5 py-2 text-white text-[20px] font-bold rounded-4xl cursor-pointer'
              onClick={handleLogout}
            >
              Logout <RiArrowRightUpLine className='text-[25px]' />
            </button>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-4xl text-indigo-600" />
              <span className="ml-2 text-gray-700">Loading offers...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <FaExclamationCircle className="text-4xl mx-auto mb-4" />
              <p>{error}</p>
              <button
                onClick={fetchOffers}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Submissions</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pending</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Today Submissions</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accepted Today</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejected Today</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {offers.map((offer) => (
                      <tr key={offer.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/showlist/${extractName(offer.name)}`)}>
                        <td className="py-4 px-4 font-medium">{extractName(offer.name)}</td>
                        <td className="py-4 px-4 text-indigo-600 font-medium">₹{offer.amount}</td>
                        <td className="py-4 px-4">{offer.submissions.toLocaleString()}</td>
                        <td className="py-4 px-4">{offer.pending}</td>
                        <td className="py-4 px-4">{offer.submissions_today}</td>
                        <td className="py-4 px-4">{offer.accepted_today}</td>
                        <td className="py-4 px-4">{offer.rejected_today}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {offer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {offers.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p>No offers match your search criteria.</p>
                </div>
              )}
            </>
          )}
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2025 app20. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;