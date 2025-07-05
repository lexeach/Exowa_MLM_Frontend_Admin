import React, { useEffect, useState, useRef } from 'react'
import Loader from './Loader'
import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { emptyEntireRedux, insertUserData } from '../../Redux/ReduxSlice';
import { ApiCall, formatAmount, formatDateTimenumber, getuserListApi } from '../Global/GloblalFunction';
import CustomDownloadFile from '../Custom/CustomDownloadFile';

const Transaction = () => {
    const [loading, setloading] = useState(false);
    const [transactionData, settransactionData] = useState([]);
    const filterTrnasectionData = transactionData?.filter((data) => data.transaction_type !== 'withdrawal');
    const tableRef = useRef(null);
    const { token } = useSelector((state) => state);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { allUserData } = useSelector((state) => state);

    // transction data fetch api func
    const transactionDataApi = async () => {
        setloading(true)
        try {
            const headers = { "x-access-token": token }
            const response = await ApiCall(headers, `/admin/transaction_users_list`);
            if (response?.data?.data) {
                settransactionData(response.data.data)
                setloading(false)
            }
        } catch (error) {
            if (error.message == "Invalid Token") {
                dispatch(emptyEntireRedux())
                navigate("/")
            }
            toast.error(error)
        } finally {
            setloading(false)
        }
    }
    // show details navigate func
    const handleShowUserData = (userid) => {
        const userData = allUserData.filter((item) => item.userid === userid)
        dispatch(insertUserData(userData[0]))
    }

    useEffect(() => {
        transactionDataApi()
        getuserListApi(token, dispatch)
    }, [])

    useEffect(() => {
        if (!loading && filterTrnasectionData?.length > 0 && tableRef.current) {
            new DataTable(tableRef.current);
        }
    }, [loading, filterTrnasectionData]);

    const formatTransactionData = filterTrnasectionData?.map((item, index) => ({
        "S.No": index + 1,
        "Receiver Id": item.userid || 'N/A',
        'Sender Id': item.sender_id || 'N/A',
        'Income(₹)': formatAmount(item.amount) || 'N/A',
        'Power(₹)': formatAmount(item.power),
        "Level": item.level || 'N/A',
        "Upgrade Level": item.upgrade_level || 'N/A',
        "Transaction Type": item.transaction_type || 'N/A',
        "Transaction Id": item.transaction_id || 'N/A',
        "Payment Id": item.payment_id || 'N/A',
        'Old Income(₹)': formatAmount(item.old_balance) || 'N/A',
        'Current Income(₹)': formatAmount(item.current_balance) || 'N/A',
        'Old Power(₹)': formatAmount(item.old_power) || 'N/A',
        'Current Power(₹)': formatAmount(item.current_power) || 'N/A',
        "Date": formatDateTimenumber(item.datetime) || 'N/A',
    }))

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <div className='w-[85%] flex flex-col gap-1 p-1 box-border bg-white border-[1px] border-customBorderColor rounded-xl shadow-sm overflow-auto h-[calc(100vh-83px)]'>
                        <div className='flex items-center justify-between p-4'>
                            <h4 className='text-[20px] text-[#6540b2] font-[500]'>Transaction History</h4>
                        </div>
                        <div className='w-full border border-customBorderColor rounded-lg overflow-auto p-3 relative'>

                            {
                                transactionData?.length < 1 ? (
                                    <p className="w-full h-[65vh] m-auto flex items-center justify-center text-[20px] font-bold opacity-[.7]">No transaction Details Found</p>
                                ) : (
                                    <>
                                        <div className='absolute right-[3px] md:right-[335px] top-6 cursor-pointer z-20'>
                                            <CustomDownloadFile
                                                data={formatTransactionData}
                                                filename="Transection-History-Data"
                                            />
                                        </div>
                                        <table ref={tableRef} className='display' style={{ width: "100%" }}>
                                            <thead>
                                                <tr>
                                                    <th>S.No</th>
                                                    <th>Receiver Id</th>
                                                    <th>Sender Id</th>
                                                    <th>Income(₹)</th>
                                                    <th>Power(₹)</th>
                                                    <th>Level</th>
                                                    <th>Upgrade Level</th>
                                                    <th>Transaction Type</th>
                                                    <th>Transaction Id</th>
                                                    <th>Payment Id</th>
                                                    <th>Old Income(₹)</th>
                                                    <th>Current Income(₹)</th>
                                                    <th>Old Power(₹)</th>
                                                    <th>Current Power(₹)</th>
                                                    <th className='min-w-[130px]'>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formatTransactionData?.map((item, index) => (
                                                    <tr key={index} >
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <Link to="/userlinks" onClick={() => handleShowUserData(item['Receiver Id'])}>
                                                                {item['Receiver Id'] || 'N/A'}
                                                            </Link>
                                                        </td>
                                                        <td >{item['Sender Id']}</td>
                                                        <td >{item['Income(₹)']}</td>
                                                        <td >{item['Power(₹)']}</td>
                                                        <td>{item['Level'] || 'N/A'}</td>
                                                        <td>{item['Upgrade Level'] || 'N/A'}</td>
                                                        <td >{item['Transaction Type'] || 'N/A'}</td>
                                                        <td >{item['Transaction Id'] || 'N/A'}</td>
                                                        <td >{item['Payment Id'] || 'N/A'}</td>
                                                        <td>{item['Old Income(₹)'] || 'N/A'}</td>
                                                        <td>{item['Current Income(₹)'] || 'N/A'}</td>
                                                        <td>{item['Old Power(₹)'] || 'N/A'}</td>
                                                        <td>{item['Current Power(₹)'] || 'N/A'}</td>
                                                        <td className='min-w-[130px]'>{item['Date'] || 'N/A'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
export default Transaction