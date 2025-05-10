import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

const Showanalytics = () => {
  const params = useParams();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    submissions: 0,
    accepted: 0,
    rejected: 0,
  });
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://backend.app20.in/api/form/date-wise-data/?name=${params.offer}`
      );
      const data = response.data || [];
      setAnalyticsData(data);
      setLoading(false);
      setTotals(calculateTotals(data));
    } catch (err) {
      setError("Failed to fetch analytics data");
      navigate("/login");
      setLoading(false);
      console.error("Error fetching analytics:", err);
    }
  };

  const calculateTotals = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { submissions: 0, accepted: 0, rejected: 0 };
    }

    return data.reduce(
      (totals, item) => {
        return {
          submissions: totals.submissions + (item.submissions || 0),
          accepted: totals.accepted + (item.accepted || 0),
          rejected: totals.rejected + (item.rejected || 0),
        };
      },
      { submissions: 0, accepted: 0, rejected: 0 }
    );
  };

  useEffect(() => {
    fetchData();
  }, [params.offer]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateRate = (accepted, total) => {
    if (total === 0) return "0%";
    return `${((accepted / total) * 100).toFixed(2)}%`;
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
    return <div className="text-red-500 p-4 text-center text-2xl">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Analytics for {params.offer}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-blue-800">
            Total Submissions
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {totals.submissions}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-green-800">Total Accepted</h3>
          <p className="text-3xl font-bold text-green-600">{totals.accepted}</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-red-800">Total Rejected</h3>
          <p className="text-3xl font-bold text-red-600">{totals.rejected}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-purple-800">
            Acceptance Rate
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {calculateRate(totals.accepted, totals.submissions)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">
                Date
              </th>
              <th className="py-3 px-4 border-b text-center font-semibold text-gray-700">
                Submissions
              </th>
              <th className="py-3 px-4 border-b text-center font-semibold text-gray-700">
                Accepted
              </th>
              <th className="py-3 px-4 border-b text-center font-semibold text-gray-700">
                Rejected
              </th>
              <th className="py-3 px-4 border-b text-center font-semibold text-gray-700">
                Acceptance Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {analyticsData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-3 px-4 border-b text-gray-800 font-medium">
                  {formatDate(item.date)}
                </td>
                <td className="py-3 px-4 border-b text-center text-gray-800">
                  {item.submissions}
                </td>
                <td className="py-3 px-4 border-b text-center text-green-600">
                  {item.accepted}
                </td>
                <td className="py-3 px-4 border-b text-center text-red-600">
                  {item.rejected}
                </td>
                <td className="py-3 px-4 border-b text-center text-purple-600">
                  {calculateRate(item.accepted, item.submissions)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing data for the last {analyticsData.length} days
      </div>
    </div>
  );
};

export default Showanalytics;
