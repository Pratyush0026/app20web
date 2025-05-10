import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdCheckmark } from "react-icons/io";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";

const ShowList = () => {
  const [imageData, setImageData] = useState([]);
  const [chunkedData, setChunkedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const params = useParams();
  const imagesPerRow = 7;
  const rowsPerPage = 2;
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [params.offer]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://backend.app20.in/api/form/get-form-entries/?name=${params.offer.trim()}`,
        {
          withCredentials: true,
        }
      );
      const data = response.data || [];
      setImageData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      navigate("/login");
      toast.success("Load data failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const chunks = [];
    for (let i = 0; i < imageData.length; i += imagesPerRow) {
      chunks.push(imageData.slice(i, i + imagesPerRow));
    }
    setChunkedData(chunks);
  }, [imageData]);

  const handleImageAction = (rowIndex, colIndex, action) => {
    const newData = [...imageData];
    const actualRowIndex = rowIndex + (currentPage - 1) * rowsPerPage;
    const flatIndex = actualRowIndex * imagesPerRow + colIndex;

    if (flatIndex < newData.length) {
      newData[flatIndex] = {
        ...newData[flatIndex],
        status: action,
      };
      setImageData(newData);
    }
  };

  const handleRowAction = (rowIndex, action) => {
    const newData = [...imageData];
    const actualRowIndex = rowIndex + (currentPage - 1) * rowsPerPage;
    const startIndex = actualRowIndex * imagesPerRow;
    const endIndex = Math.min(startIndex + imagesPerRow, imageData.length);

    for (let i = startIndex; i < endIndex; i++) {
      newData[i] = { ...newData[i], status: action };
    }

    setImageData(newData);
  };

  const handleSave = async (continueToNext = false) => {
    try {
      setSaving(true);

      const acceptedIds = imageData
        .filter((item) => item.status === "accepted")
        .map((item) => item.id);

      const rejectedIds = imageData
        .filter((item) => item.status === "rejected")
        .map((item) => item.id);

      const apiCalls = [];

      if (acceptedIds.length > 0) {
        apiCalls.push(
          axios.post(
            "https://backend.app20.in/api/form/bulk-update-status/",
            {
              ids: acceptedIds,
              status: "paid",
            },
            {
              withCredentials: true,
            }
          )
        );
      }

      if (rejectedIds.length > 0) {
        apiCalls.push(
          axios.post(
            "https://backend.app20.in/api/form/bulk-update-status/",
            {
              ids: rejectedIds,
              status: "rejected",
            },
            {
              withCredentials: true,
            }
          )
        );
      }

      if (apiCalls.length > 0) {
        await Promise.all(apiCalls);
      }

      if (continueToNext) {
        await fetchData();
      } else {
        toast.success("successfully saved!");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save!");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndContinue = () => {
    handleSave(true);
  };

  const currentRows = chunkedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        <span className="ml-2 text-gray-700 text-2xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Image Review</h1>

      {currentRows.map((row, rowIndex) => (
        <div key={rowIndex} className="mb-8">
          <div className="flex gap-4 mb-2">
            {row.map((item, colIndex) => (
              <div
                key={colIndex}
                className={`w-[200px] border-2 rounded-lg shadow-md ${
                  item.status === "pending"
                    ? "border-[#000000]"
                    : item.status === "accepted"
                    ? "border-[#00ff00]"
                    : "border-[#ff0000]"
                }`}
              >
                <div className="relative h-[87%]">
                  <img
                    src={`${item.image}`}
                    alt={`Image ${
                      ((currentPage - 1) * rowsPerPage + rowIndex) *
                        imagesPerRow +
                      colIndex +
                      1
                    }`}
                    className="w-full h-[100%] rounded-t-md"
                  />
                </div>
                <div className="flex justify-center items-center p-1 bg-white h-[10%]">
                  <div className="grid grid-cols-2 gap-2 h-[100%] w-[100%]">
                    <button
                      onClick={() =>
                        handleImageAction(rowIndex, colIndex, "accepted")
                      }
                      className={`flex justify-center item-center py-2 px-4 rounded ${
                        item.status === "accepted"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 hover:bg-green-100"
                      }`}
                    >
                      <IoMdCheckmark />
                    </button>
                    <button
                      onClick={() =>
                        handleImageAction(rowIndex, colIndex, "rejected")
                      }
                      className={`flex justify-center item-center py-2 px-4 rounded ${
                        item.status === "rejected"
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 hover:bg-red-100"
                      }`}
                    >
                      <RxCross2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <span className="text-sm font-medium text-gray-700 self-center">
              Row {(currentPage - 1) * rowsPerPage + rowIndex + 1}:
            </span>
            <button
              onClick={() => handleRowAction(rowIndex, "accepted")}
              className="bg-green-50 hover:bg-green-100 text-green-700 py-1 px-3 rounded border border-green-200 text-sm"
            >
              Accept All
            </button>
            <button
              onClick={() => handleRowAction(rowIndex, "rejected")}
              className="bg-red-50 hover:bg-red-100 text-red-700 py-1 px-3 rounded border border-red-200 text-sm"
            >
              Reject All
            </button>
          </div>
        </div>
      ))}

      {imageData.length < 1 && (
        <div>
          <p className="text-center text-gray-500">
            No entries available for this offer.
          </p>
        </div>
      )}

      {imageData.length > 0 && (
        <div className="mt-8 border-t pt-4">
          <div className="flex justify-end items-center">
            <div>
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className={`bg-blue-600 mr-4 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium ${
                  saving ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleSaveAndContinue}
                disabled={saving}
                className={`bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-medium ${
                  saving ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {saving ? "Processing..." : "Save & Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowList;
