import React from 'react';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiDownload } from "react-icons/fi";

const DataTable = ({ data = [] }) => {
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${hours}:${minutes} ${month} ${day}, ${year}`;
    };

    // Capitalize the first letter of the status
    const formatStatus = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    // Handlers for each action
    const handleView = (item) => {
        alert(`Viewing details for: ${item.name}`);
    };

    const handleDelete = (item) => {
        alert(`Deleting transaction: ${item.name}`);
    };

    const handleDownload = (item) => {
        alert(`Downloading transaction details for: ${item.name}`);
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b text-center">Name</th>
                        <th className="py-2 px-4 border-b text-center">Time & Date</th>
                        <th className="py-2 px-4 border-b text-center">Status</th>
                        <th className="py-2 px-4 border-b text-center">Type</th>
                        <th className="py-2 px-4 border-b text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="border-t">
                            <td className="py-4 px-4 border-b text-center">{item.name}</td>
                            <td className="py-4 px-4 border-b text-center">{formatTimestamp(item.timestamp)}</td>
                            <td className="py-4 px-4 border-b text-center">
                                <span
                                    className={`inline-block px-3 py-1 rounded-full font-bold ${item.status === 'success'
                                        ? 'bg-green-200 text-green-700'
                                        : item.status === 'error'
                                            ? 'bg-red-200 text-red-700'
                                            : 'bg-yellow-200 text-yellow-700'
                                        }`}
                                >
                                    {formatStatus(item.status)}
                                </span>
                            </td>
                            <td className="py-2 px-4 border-b text-center">{item.type}</td>
                            <td className="py-2 px-4 border-b text-center">
                                <div className="flex justify-center space-x-2">
                                    <button
                                        onClick={() => handleView(item)}
                                        className="text-gray-500 px-2 py-1 rounded hover:bg-gray-200"
                                    >
                                        <MdOutlineRemoveRedEye />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="text-gray-500 px-2 py-1 rounded hover:bg-gray-200"
                                    >
                                        <RiDeleteBin6Line />
                                    </button>
                                    <button
                                        onClick={() => handleDownload(item)}
                                        className="text-gray-500 px-2 py-1 rounded hover:bg-gray-200"
                                    >
                                        <FiDownload />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
