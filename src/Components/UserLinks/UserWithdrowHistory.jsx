import React, { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { emptyEntireRedux } from '../../Redux/ReduxSlice';
import { formatDateFunc, getuserListApi, getWithdrowHistoryApi } from '../Global/GloblalFunction';
import WithdrawApprovedStatusToggle from '../Global/WithdrowApprovedStatusChangePopUp';
import WithdrawRejectStatusToggle from '../Global/WithdrowRejectStatusChangePopUp';
import CustomDownloadFile from '../Custom/CustomDownloadFile';
import DateRangePicker from '../Custom/DateRangePicker';
import Loader from '../HomePages/Loader';

const WithdrowRequestHistory = () => {
    const [loading, setloading] = useState(false);
    const { token, withdrowHistory: withdrow, userData } = useSelector((state) => state);
    const withdrowHistory = withdrow?.filter((item) => item?.userid === userData.userid);
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const filteredData = useMemo(() => {
        let result = withdrowHistory || [];

        // Date range filtering
        if (dateRange.startDate && dateRange.endDate) {
            const start = new Date(dateRange.startDate);
            const end = new Date(dateRange.endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            result = result.filter(item => {
                if (!item.date_time) return false;
                const itemDate = new Date(item.date_time);
                itemDate.setHours(0, 0, 0, 0);
                return itemDate >= start && itemDate <= end;
            });
        }

        // Search filtering
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(item =>
                Object.values(item).some(
                    val => val && val.toString().toLowerCase().includes(term)
                )
            );
        }

        // Sorting
        if (sortConfig.key) {
            result = [...result].sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [withdrowHistory, dateRange, sortConfig, searchTerm]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const fatchWithdrowHistoryData = async () => {
        try {
            const responce = await getWithdrowHistoryApi(token, dispatch);
            if (responce) setloading(false);
        } catch (error) {
            if (error === "Invalid Token") {
                dispatch(emptyEntireRedux());
                navigate("/");
            }
            toast.error(error);
        }
    };

    useEffect(() => {
        setloading(true);
        fatchWithdrowHistoryData();
        getuserListApi(token, dispatch);
    }, []);

    const handleDateChange = ({ startDate, endDate }) => {
        setDateRange({ startDate, endDate });
    };

    const formattedWithdrawData = useMemo(() => {
        return filteredData?.map((item, index) => ({
            "S.No": index + 1,
            "User Id": item?.userid || "N/A",
            "Transaction Id": item?.transaction_id || "N/A",
            "Transaction Reference": item?.transaction_reference || "N/A",
            "Bank Account": item?.bank_account || "N/A",
            "Transaction Mode": item?.transaction_mode || "N/A",
            "Pan Card": item.pancard,
            "Amount(₹)": item?.payment_amount ? Number(item?.payment_amount).toFixed(2).replace(/\.00$/, '') : "N/A",
            "Withdraw Status": item?.status == 1 ? "Approved" : item?.status == 2 ? "Rejected" : "Pending",
            "Date": formatDateFunc(item?.date_time) || "N/A",
        }));
    }, [filteredData]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className='w-full flex flex-col gap-1 p-1 box-border bg-white border-[1px] border-customBorderColor rounded-xl shadow-sm overflow-auto h-[calc(100vh-83px)]'>
                    <div className='flex items-center justify-between p-4 flex-wrap relative'>
                        <h4 className='text-[20px] text-[#6540b2] font-[500]'>Withdrow History</h4>

                        <div className='flex gap-4 items-center flex-wrap'>
                            <CustomDownloadFile data={formattedWithdrawData} filename="Withdrow-History-Data" />
                            <DateRangePicker onChange={handleDateChange} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="border border-gray-300 rounded px-3 py-1"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='w-full border border-customBorderColor rounded-lg overflow-auto p-3 relative'>
                        {dateRange.startDate && dateRange.endDate && filteredData.length === 0 ? (
                            <p className="w-full h-[65vh] m-auto flex items-center justify-center text-[20px] font-bold opacity-[.7]">
                                No data found for selected date range
                            </p>
                        ) : filteredData?.length < 1 ? (
                            <p className="w-full h-[65vh] m-auto flex items-center justify-center text-[20px] font-bold opacity-[.7]">
                                No Withdrow History found.
                            </p>
                        ) : (
                            <>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100 rounded-lg">
                                                <th
                                                    className="p-3 text-left cursor-pointer "
                                                    onClick={() => requestSort('S.No')}
                                                >
                                                    S.No
                                                    {sortConfig.key === 'S.No' && (
                                                        <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                                                    )}
                                                </th>
                                                <th className="p-3 text-left">User Id</th>
                                                <th className="p-3 text-left">Transaction Id</th>
                                                <th className="p-3 text-left">Transaction Reference</th>
                                                <th className="p-3 text-left">Bank Account</th>
                                                <th className="p-3 text-left">Transaction Mode</th>
                                                <th className="p-3 text-left">Pan Card</th>
                                                <th
                                                    className="p-3 text-left cursor-pointer"
                                                    onClick={() => requestSort('payment_amount')}
                                                >
                                                    Amount(₹)
                                                    {sortConfig.key === 'payment_amount' && (
                                                        <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                                                    )}
                                                </th>
                                                <th className="p-3 text-left">Withdraw Status Approved</th>
                                                <th className="p-3 text-left">Withdraw Status Reject</th>
                                                <th
                                                    className="p-3 text-left cursor-pointer  min-w-[120px]"
                                                    onClick={() => requestSort('date_time')}
                                                >
                                                    Date
                                                    {sortConfig.key === 'date_time' && (
                                                        <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                                                    )}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData?.map((item, index) => (
                                                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                                                    <td className="p-3">{index + 1}</td>
                                                    <td className="p-3">
                                                        <Link
                                                            to="/userlinks"
                                                        >
                                                            {item.userid || 'N/A'}
                                                        </Link>
                                                    </td>
                                                    <td className="p-3">{item.transaction_id || "N/A"}</td>
                                                    <td className="p-3">{item.transaction_reference || 'N/A'}</td>
                                                    <td className="p-3">{item.bank_account || "N/A"}</td>
                                                    <td className="p-3">{item.transaction_mode || 'N/A'}</td>
                                                    <td className="p-3">{item.pancard || 'N/A'}</td>
                                                    <td className="p-3">{Number(item.payment_amount).toFixed(2) || 'N/A'}</td>
                                                    <td className="p-3"><WithdrawApprovedStatusToggle item={item} /></td>
                                                    <td className="p-3"><WithdrawRejectStatusToggle item={item} /></td>
                                                    <td className="p-3  min-w-[120px]">{formatDateFunc(item.date_time) || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default WithdrowRequestHistory;