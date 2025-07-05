import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { format, subDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({ onChange }) => {
    const [dateRange, setDateRange] = useState([
        subDays(new Date(), 7),
        new Date(),
    ]);
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, endDate] = dateRange;

    const handleDateChange = (update) => {
        setDateRange(update);
        if (update[0] && update[1]) {
            onChange({ startDate: update[0], endDate: update[1] });
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span>
                    {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
                </span>
                <svg
                    className="w-5 h-5 ml-2 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                // <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-96">
                <div className="p-4 absolute top-10 right-10 z-40 ">
                    <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleDateChange}
                        inline
                        monthsShown={2}
                        className="border-none"
                    />

                    <div className="flex justify-end pt-2 mt-4 border-t border-gray-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 ml-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Apply
                        </button>
                    </div>
                </div>
                // </div>
            )}
        </div>
    );
};

export default DateRangePicker;