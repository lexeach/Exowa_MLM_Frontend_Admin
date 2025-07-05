import React, { useEffect, useState, useRef } from 'react'
import Loader from './Loader'
import DataTable from 'datatables.net-dt';
import axios from 'axios';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { emptyEntireRedux, insertUserData } from '../../Redux/ReduxSlice';
import { formatDateTimenumber, getuserListApi } from '../Global/GloblalFunction';

const Trading = () => {
    const [loading, setloading] = useState(false)
    const [transactionData, settransactionData] = useState([])
    const tableRef = useRef(null);
    const { token } = useSelector((state) => state);

    const apiUrl = process.env.REACT_APP_API_URL;
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { allUserData } = useSelector((state) => state)

    // transction data fetch api func
    const transactionDataApi = async () => {
        setloading(true)
        try {
            const headers = { "x-access-token": token }
            const response = await ApiCall(headers, `/admin/fees_data`);
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
        const userData = allUserData?.filter((item) => item.userid === userid)
        dispatch(insertUserData(userData[0]))
    }

    useEffect(() => {
        transactionDataApi()
        getuserListApi(token, dispatch)
    }, [])

    useEffect(() => {
        if (!loading && transactionData?.length > 0 && tableRef.current) {
            new DataTable(tableRef.current);
        }
    }, [loading, transactionData]);

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <div className='w-[85%] flex flex-col gap-1 p-1 box-border bg-white border-[1px] border-customBorderColor rounded-xl shadow-sm overflow-auto h-[calc(100vh-83px)]'>
                        <div className='flex items-center justify-between p-4'>
                            <h4 className='text-[20px] text-[#6540b2] font-[500]'>Trading History</h4>
                        </div>
                        <div className='w-full border border-customBorderColor rounded-lg overflow-auto p-3'>

                            {/* transaction Table code */}
                            {
                                transactionData?.length < 1 ? (
                                    <p className="w-full h-[65vh] m-auto flex items-center justify-center text-[20px] font-bold opacity-[.7]">No fees data history found</p>
                                ) : (
                                    <table ref={tableRef} className='display' style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>User Id</th>
                                                <th>User Name</th>
                                                <th>Transaction Id</th>
                                                <th>Amount(₹)</th>
                                                <th>Amount($)</th>
                                                <th>Profit Amount(₹)</th>
                                                <th>Status</th>
                                                <th>Complete Time</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {transactionData?.map((item, index) => (
                                                <tr key={index} >
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <Link to="/userlinks" onClick={() => handleShowUserData(item.userid)}>
                                                            {item.userid || 'N/A'}
                                                        </Link>
                                                    </td>
                                                    <td className='capitalize'>{item.user_name || 'N/A'}</td>
                                                    <td >{item.invest_trx_id || 'N/A'}</td>
                                                    <td >{Number(item.amount).toFixed(2) || 'N/A'}</td>
                                                    <td >{Number(item.amount_dollar).toFixed(2) || 'N/A'}</td>
                                                    <td >{Number(item.profit_amount).toFixed(2) || 'N/A'}</td>
                                                    <td className='capitalize'>{item.status || 'N/A'}</td>
                                                    <td>{formatDateTimenumber(item.complete_time) || 'N/A'}</td>
                                                    <td>{formatDateTimenumber(item.date_time) || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )
                            }
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
export default Trading