// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { IoMdCheckmark } from "react-icons/io";
// import axios from "axios";
// import { RxCross2 } from "react-icons/rx";
// import { FaSpinner } from 'react-icons/fa';
// import { toast } from 'react-hot-toast';

// const ShowList = () => {
//     const [imageData, setImageData] = useState([]);
//     const [chunkedData, setChunkedData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const params = useParams();
//     const imagesPerRow = 7;
//     const rowsPerPage = 2;
//     const navigate = useNavigate()

//     useEffect(() => {
//         fetchData();
//     }, [params.offer]);

//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(`https://backend.app20.in/api/form/get-form-entries/?name=${(params.offer.trim())}`, {
//                 withCredentials: true,
//             });
//             const data = response.data || [];
//             setImageData(data);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             navigate("/login")
//             toast.success('Load data failed');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         const chunks = [];
//         for (let i = 0; i < imageData.length; i += imagesPerRow) {
//             chunks.push(imageData.slice(i, i + imagesPerRow));
//         }
//         setChunkedData(chunks);
//     }, [imageData]);

//     const handleImageAction = (rowIndex, colIndex, action) => {
//         const newData = [...imageData];
//         const actualRowIndex = rowIndex + (currentPage - 1) * rowsPerPage;
//         const flatIndex = actualRowIndex * imagesPerRow + colIndex;

//         if (flatIndex < newData.length) {
//             newData[flatIndex] = {
//                 ...newData[flatIndex],
//                 status: action
//             };
//             setImageData(newData);
//         }
//     };

//     const handleRowAction = (rowIndex, action) => {
//         const newData = [...imageData];
//         const actualRowIndex = rowIndex + (currentPage - 1) * rowsPerPage;
//         const startIndex = actualRowIndex * imagesPerRow;
//         const endIndex = Math.min(startIndex + imagesPerRow, imageData.length);

//         for (let i = startIndex; i < endIndex; i++) {
//             newData[i] = { ...newData[i], status: action };
//         }

//         setImageData(newData);
//     };

//     const handleSave = async (continueToNext = false) => {
//         try {
//             setSaving(true);

//             const acceptedIds = imageData
//                 .filter(item => item.status === "accepted")
//                 .map(item => item.id);

//             const rejectedIds = imageData
//                 .filter(item => item.status === "rejected")
//                 .map(item => item.id);

//             const apiCalls = [];

//             if (acceptedIds.length > 0) {
//                 apiCalls.push(
//                     axios.post('https://backend.app20.in/api/form/bulk-update-status/', {
//                         ids: acceptedIds,
//                         status: "paid"
//                     },
//                         {
//                             withCredentials: true,
//                         })
//                 );
//             }

//             if (rejectedIds.length > 0) {
//                 apiCalls.push(
//                     axios.post('https://backend.app20.in/api/form/bulk-update-status/', {
//                         ids: rejectedIds,
//                         status: "rejected"
//                     },
//                         {
//                             withCredentials: true,
//                         })
//                 );
//             }

//             if (apiCalls.length > 0) {
//                 await Promise.all(apiCalls);
//             }

//             if (continueToNext) {
//                 await fetchData();
//             } else {
//                 toast.success('successfully saved!');
//             }
//         } catch (error) {
//             console.error("Error saving changes:", error);
//             toast.error('Failed to save!');
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleSaveAndContinue = () => {
//         handleSave(true);
//     };

//     const currentRows = chunkedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <FaSpinner className="animate-spin text-4xl text-indigo-600" />
//                 <span className="ml-2 text-gray-700 text-2xl">Loading...</span>
//             </div>
//         );
//     }
//     const displaydate = (data) => {
//         const dateObj = new Date(data);
//         const date = dateObj.toISOString().split('T')[0];
//         return date;
//     }
//     const displaytime = (data) => {
//         const dateObj = new Date(data);
//         const time = dateObj.toTimeString().split(' ')[0];
//         return time;
//     }

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-6">Image Review</h1>

//             {currentRows.map((row, rowIndex) => (
//                 <div key={rowIndex} className="mb-8">
//                     <div className="flex gap-4 mb-2">
//                         {row.map((item, colIndex) => (
//                             <div className="flex flex-col">
//                                 <div className='flex justify-between w-[200px]'>
//                                     <p className='px-1'>{displaydate(item.created_at)} </p>
//                                     <p className='px-1'>{displaytime(item.created_at)}</p>
//                                 </div>
//                                 <div
//                                     key={colIndex}
//                                     className={`w-[200px] h-[500px] border-2 rounded-lg shadow-md ${item.status === "pending"
//                                         ? "border-[#000000]"
//                                         : item.status === "accepted"
//                                             ? "border-[#00ff00]"
//                                             : "border-[#ff0000]"
//                                         }`}
//                                 >

//                                     <div className="relative h-[87%]">
//                                         <img
//                                             src={`${item.image}`}
//                                             alt={`Image ${((currentPage - 1) * rowsPerPage + rowIndex) * imagesPerRow + colIndex + 1}`}
//                                             className="w-full h-[100%] rounded-t-md"
//                                         />
//                                     </div>
//                                     <div className="flex justify-center items-center p-1 bg-white h-[10%]">
//                                         <div className="grid grid-cols-2 gap-2 h-[100%] w-[100%]">
//                                             <button
//                                                 onClick={() => handleImageAction(rowIndex, colIndex, "accepted")}
//                                                 className={`flex justify-center item-center py-2 px-4 rounded ${item.status === "accepted"
//                                                     ? "bg-green-600 text-white"
//                                                     : "bg-gray-100 hover:bg-green-100"
//                                                     }`}
//                                             >
//                                                 <IoMdCheckmark />
//                                             </button>
//                                             <button
//                                                 onClick={() => handleImageAction(rowIndex, colIndex, "rejected")}
//                                                 className={`flex justify-center item-center py-2 px-4 rounded ${item.status === "rejected"
//                                                     ? "bg-red-600 text-white"
//                                                     : "bg-gray-100 hover:bg-red-100"
//                                                     }`}
//                                             >
//                                                 <RxCross2 />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="flex justify-end gap-3 mt-2">
//                         <span className="text-sm font-medium text-gray-700 self-center">
//                             Row {(currentPage - 1) * rowsPerPage + rowIndex + 1}:
//                         </span>
//                         <button
//                             onClick={() => handleRowAction(rowIndex, "accepted")}
//                             className="bg-green-50 hover:bg-green-100 text-green-700 py-1 px-3 rounded border border-green-200 text-sm"
//                         >
//                             Accept All
//                         </button>
//                         <button
//                             onClick={() => handleRowAction(rowIndex, "rejected")}
//                             className="bg-red-50 hover:bg-red-100 text-red-700 py-1 px-3 rounded border border-red-200 text-sm"
//                         >
//                             Reject All
//                         </button>
//                     </div>
//                 </div>
//             ))}

//             {imageData.length < 1 && (
//                 <div>
//                     <p className="text-center text-gray-500">No entries available for this offer.</p>
//                 </div>
//             )}

//             {imageData.length > 0 && (
//                 <div className="mt-8 border-t pt-4">
//                     <div className="flex justify-end items-center">
//                         <div>
//                             <button
//                                 onClick={() => handleSave(false)}
//                                 disabled={saving}
//                                 className={`bg-blue-600 mr-4 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium ${saving ? 'opacity-75 cursor-not-allowed' : ''
//                                     }`}
//                             >
//                                 {saving ? 'Saving...' : 'Save'}
//                             </button>
//                             <button
//                                 onClick={handleSaveAndContinue}
//                                 disabled={saving}
//                                 className={`bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-medium ${saving ? 'opacity-75 cursor-not-allowed' : ''
//                                     }`}
//                             >
//                                 {saving ? 'Processing...' : 'Save & Continue'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ShowList;



import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdCheckmark } from "react-icons/io";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { RiArrowRightUpLine } from 'react-icons/ri';

const ShowList = () => {
    const [imageData, setImageData] = useState([]);
    const [chunkedData, setChunkedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPending, setTotalPending] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const params = useParams();
    const imagesPerRow = 7;
    const rowsPerPage = 2;
    const imagesPerPage = imagesPerRow * rowsPerPage;
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppDetails();
        fetchData();
    }, [params.offer, currentPage]);

    const fetchAppDetails = async () => {
        try {
            const response = await axios.get('https://backend.app20.in/api/form/app-details/', {
                withCredentials: true,
            });

            const currentOffer = response.data.find(
                (offer) => {
                    return offer.name.trim() === (params.offer.trim() + " Form")
                }
            );

            if (currentOffer) {
                setTotalPending(currentOffer.pending);
                const calculatedPages = Math.ceil(currentOffer.pending / imagesPerPage);
                setTotalPages(calculatedPages > 0 ? calculatedPages : 1);
            }
        } catch (error) {
            console.error("Error fetching app details:", error);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://backend.app20.in/api/form/get-form-entries/?name=${params.offer.trim()}&page=${currentPage}&limit=${imagesPerPage}`,
                {
                    withCredentials: true,
                }
            );
            const data = response.data || [];
            setImageData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            navigate("/login");
            toast.error('Load data failed');
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
        const actualRowIndex = rowIndex;
        const flatIndex = actualRowIndex * imagesPerRow + colIndex;

        if (flatIndex < newData.length) {
            newData[flatIndex] = {
                ...newData[flatIndex],
                status: action
            };
            setImageData(newData);
        }
    };

    const handleRowAction = (rowIndex, action) => {
        const newData = [...imageData];
        const actualRowIndex = rowIndex;
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
                .filter(item => item.status === "accepted")
                .map(item => item.id);

            const rejectedIds = imageData
                .filter(item => item.status === "rejected")
                .map(item => item.id);

            const apiCalls = [];

            if (acceptedIds.length > 0) {
                apiCalls.push(
                    axios.post('https://backend.app20.in/api/form/bulk-update-status/', {
                        ids: acceptedIds,
                        status: "paid"
                    },
                        {
                            withCredentials: true,
                        })
                );
            }

            if (rejectedIds.length > 0) {
                apiCalls.push(
                    axios.post('https://backend.app20.in/api/form/bulk-update-status/', {
                        ids: rejectedIds,
                        status: "rejected"
                    },
                        {
                            withCredentials: true,
                        })
                );
            }

            if (apiCalls.length > 0) {
                await Promise.all(apiCalls);
            }

            if (continueToNext) {
                if (currentPage < totalPages) {
                    setCurrentPage(prevPage => prevPage + 1);
                } else {
                    await fetchData();
                    toast.success('All pages processed!');
                }
            } else {
                toast.success('Successfully saved!');
                await fetchData();
                await fetchAppDetails();
            }
        } catch (error) {
            console.error("Error saving changes:", error);
            toast.error('Failed to save!');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAndContinue = () => {
        handleSave(true);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPaginationNumbers = () => {
        const pageNumbers = [];

        // Always show first page
        pageNumbers.push(
            <button
                key={1}
                onClick={() => handlePageChange(1)}
                className={`px-5 py-1 rounded-md ${currentPage === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
                1
            </button>
        );

        // If there are more than 5 pages
        if (totalPages > 5) {
            // Show second page if current page is 1, 2, or 3
            if (currentPage <= 3) {
                pageNumbers.push(
                    <button
                        key={2}
                        onClick={() => handlePageChange(2)}
                        className={`px-5 py-1 rounded-md ${currentPage === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        2
                    </button>
                );
            }

            // Show ellipsis if needed
            if (currentPage > 3) {
                pageNumbers.push(
                    <span key="ellipsis1" className="px-2">...</span>
                );
            }

            // Show current page and surrounding pages if not near the edges
            if (currentPage > 2 && currentPage < totalPages - 1) {
                pageNumbers.push(
                    <button
                        key={currentPage}
                        onClick={() => handlePageChange(currentPage)}
                        className="px-5 py-1 rounded-md bg-indigo-600 text-white"
                    >
                        {currentPage}
                    </button>
                );
            }

            // Show ellipsis if needed
            if (currentPage < totalPages - 2) {
                pageNumbers.push(
                    <span key="ellipsis2" className="px-2">...</span>
                );
            }

            // Show second-to-last page
            if (currentPage >= totalPages - 2) {
                pageNumbers.push(
                    <button
                        key={totalPages - 1}
                        onClick={() => handlePageChange(totalPages - 1)}
                        className={`px-5 py-1 rounded-md ${currentPage === totalPages - 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        {totalPages - 1}
                    </button>
                );
            }

            // Always show last page if more than 1 page
            if (totalPages > 1) {
                pageNumbers.push(
                    <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-5 py-1 rounded-md ${currentPage === totalPages ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        {totalPages}
                    </button>
                );
            }
        } else {
            // If 5 or fewer pages, show all page numbers
            for (let i = 2; i <= totalPages; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-5 py-1 rounded-md ${currentPage === i ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        {i}
                    </button>
                );
            }
        }

        return pageNumbers;
    };

    const currentRows = chunkedData;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
                <span className="ml-2 text-gray-700 text-2xl">Loading...</span>
            </div>
        );
    }

    const displaydate = (data) => {
        const dateObj = new Date(data);
        const date = dateObj.toISOString().split('T')[0];
        return date;
    }

    const displaytime = (data) => {
        const dateObj = new Date(data);
        const time = dateObj.toTimeString().split(' ')[0];
        return time;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Image Review</h1>

            {currentRows.map((row, rowIndex) => (
                <div key={rowIndex} className="mb-8">
                    <div className="flex gap-4 mb-2">
                        {row.map((item, colIndex) => (
                            <div key={colIndex} className="flex flex-col">
                                <div className='flex justify-between w-[200px]'>
                                    <p className='px-1'>{displaydate(item.created_at)} </p>
                                    <p className='px-1'>{displaytime(item.created_at)}</p>
                                </div>
                                <div
                                    className={`w-[200px] h-[500px] border-2 rounded-lg shadow-md ${item.status === "pending"
                                        ? "border-[#000000]"
                                        : item.status === "accepted"
                                            ? "border-[#00ff00]"
                                            : "border-[#ff0000]"
                                        }`}
                                >
                                    <div className="relative h-[87%]">
                                        <img
                                            src={`${item.image}`}
                                            alt={`Image ${rowIndex * imagesPerRow + colIndex + 1}`}
                                            className="w-full h-[100%] rounded-t-md"
                                        />
                                    </div>
                                    <div className="flex justify-center items-center p-1 bg-white h-[10%]">
                                        <div className="grid grid-cols-2 gap-2 h-[100%] w-[100%]">
                                            <button
                                                onClick={() => handleImageAction(rowIndex, colIndex, "accepted")}
                                                className={`flex justify-center item-center py-2 px-4 rounded ${item.status === "accepted"
                                                    ? "bg-green-600 text-white"
                                                    : "bg-gray-100 hover:bg-green-100"
                                                    }`}
                                            >
                                                <IoMdCheckmark />
                                            </button>
                                            <button
                                                onClick={() => handleImageAction(rowIndex, colIndex, "rejected")}
                                                className={`flex justify-center item-center py-2 px-4 rounded ${item.status === "rejected"
                                                    ? "bg-red-600 text-white"
                                                    : "bg-gray-100 hover:bg-red-100"
                                                    }`}
                                            >
                                                <RxCross2 />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <span className="text-sm font-medium text-gray-700 self-center">
                            Row {rowIndex + 1}:
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
                <div className='flex justify-center items-center h-[70vh] flex-col'>
                    <p className="text-center text-gray-500 text-2xl">No entries available for this offer.</p>
                    <h2 className='my-5 text-xl'>All done ✌️</h2>
                    <button className='text-white px-5 flex cursor-pointer py-2 bg-black rounded-3xl' onClick={() => navigate("/")}>Go To Home<RiArrowRightUpLine className='text-[25px]' /></button>
                </div>
            )}

            {imageData.length > 0 && (
                <div className="mt-8 border-t pt-4">
                    {/* Pagination */}
                    <div className="flex justify-center items-center mb-4">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className={`px-5 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                First
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-5 py-2 rounded-md flex items-center ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                <IoChevronBackOutline />
                                <span className="ml-1">Prev</span>
                            </button>

                            {renderPaginationNumbers()}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-5 py-2 rounded-md flex items-center ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                <span className="mr-1">Next</span>
                                <IoChevronForwardOutline />
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className={`px-5 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                Last
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500 font-bold">
                            Showing page <span className='text-green-500'>{currentPage}</span> of <span className='text-orange-400'>{totalPages}</span> • Total pending: <span className='text-yellow-500'>{totalPending}</span>
                        </div>
                        <div>
                            <button
                                onClick={() => handleSave()}
                                disabled={saving}
                                className={`bg-green-600 mr-4 cursor-pointer hover:bg-green-700 text-white py-2 px-10 rounded-lg font-medium ${saving ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            {/* <button
                                onClick={handleSaveAndContinue}
                                disabled={saving || currentPage === totalPages}
                                className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium ${(saving || currentPage === totalPages) ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                            >
                                {saving ? 'Processing...' : 'Save & Continue'}
                            </button> */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowList;