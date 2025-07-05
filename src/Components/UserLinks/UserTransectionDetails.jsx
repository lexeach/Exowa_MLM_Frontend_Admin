import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast'
import DataTable from 'datatables.net-dt';
import Loader from '../HomePages/Loader';
import { ApiCall, formatAmount, formatDateTimenumber } from '../Global/GloblalFunction';
import { emptyEntireRedux } from '../../Redux/ReduxSlice';
import CustomDownloadFile from '../Custom/CustomDownloadFile';
import { useNavigate } from 'react-router-dom';

const UsertransactionDetails = () => {

    const [loading, setLoading] = useState(false)
    const [usertransactionDetailData, setUsertransactionDetailData] = useState([]);
    const filterTrnasectionData = usertransactionDetailData?.filter((data) => data.transaction_type !== 'withdrawal')
    const { token, userData } = useSelector((state) => state);

    const tableRef = useRef(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const getUsertransactionDetailApi = async () => {
        setLoading(true)
        try {
            const headers = {
                "x-access-token": token
            }
            const response = await ApiCall(headers, `/admin/transaction_users_list`);
            if (response.data.data) {
                const filterUsertransaction = response.data.data?.filter((item) => item.userid === userData.userid);
                setUsertransactionDetailData(filterUsertransaction);
            }
            setLoading(false)
        } catch (error) {
            if (error.message === "Invalid Token") {
                dispatch(emptyEntireRedux())
                navigate("/")
            }
            toast.error(
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                error?.message ||
                "An error occured"
            )
        }
    }

    useEffect(() => {
        getUsertransactionDetailApi()
    }, [])

    useEffect(() => {
        if (!loading && filterTrnasectionData?.length > 0 && tableRef.current) {
            new DataTable(tableRef.current);
        }
    }, [loading, filterTrnasectionData]);


    console.log(filterTrnasectionData, "filterTrnasectionData")

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
            {
                loading ?
                    <Loader />
                    : <div className='w-full bg-white border-[1px] border-customBorderColor rounded-xl shadow-sm h-[calc(100vh-140px)] overflow-auto'>
                        <div className='flex items-center justify-between p-4 '>
                            <h4 className='text-[20px] text-[#6540b2] font-[500]'>Transaction History</h4>
                        </div>

                        <div className='w-full border border-customBorderColor rounded-lg overflow-auto p-3 relative'>

                            {
                                usertransactionDetailData?.length < 1 ? (
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
                                                    <th className='min-w-[120px]'>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formatTransactionData?.map((item, index) => (
                                                    <tr key={index} >
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            {item['Receiver Id'] || 'N/A'}
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
                                                        <td className='min-w-[120px]'>{item['Date'] || 'N/A'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )
                            }
                        </div>
                    </div>
            }

        </>
    )
}

export default UsertransactionDetails