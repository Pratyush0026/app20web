import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backend.app20.in/api/form/app-details/",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch offers");
      }

      const data = await response.json();
      setOffers(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching offers:", err);
      navigate("/login");
      setError("Failed to load offers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  function extractName(input) {
    return input.replace(/\s*Form\s*$/, "");
  }

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleCardClick = (name) => {
    navigate(`/analytics/${name}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        <span className="ml-2 text-gray-700">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 text-red-700 rounded-lg m-4">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <button
          onClick={fetchOffers}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Form Analytics Dashboard
        </h1>
        <div className="text-sm text-gray-500">
          Total Forms: {offers.length}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            onClick={() => handleCardClick(offer.name)}
            className={` rounded-lg shadow hover:shadow-md transition cursor-pointer border border-gray-200 flex items-center justify-center p-6 hover:bg-blue-50 ${
              offer.isActive ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            <h2 className="text-lg font-medium text-gray-800 text-center">
              {extractName(offer.name)}
            </h2>
          </div>
        ))}
      </div>

      {offers.length === 0 && !loading && !error && (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">
            No forms found
          </h2>
          <p className="text-gray-500 mt-2">
            No form data is currently available
          </p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
