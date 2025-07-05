import React, { useState, useEffect, useRef } from 'react';
import Loader from './Loader';
import DataTable from 'datatables.net-dt';
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux';
import { emptyEntireRedux } from '../../Redux/ReduxSlice';
import { useNavigate } from 'react-router-dom';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import { ApiCall, formatAmount, formatDateTimenumber } from '../Global/GloblalFunction';
import CustomDownloadFile from '../Custom/CustomDownloadFile';

const PartnerLevels = () => {
    const [loading, setloading] = useState(false);
    let { token } = useSelector((state) => state);
    const [partnerLevelData, setPartnerLevelData] = useState([])

    const tableRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fatchData = async () => {
        setloading(true)
        try {
            const headers = { "x-access-token": token }
            const response = await ApiCall(headers, `/admin/partner_levels`);
            if (response.status === 200) {
                setPartnerLevelData(response.data.data)
                setloading(false)
            }
        } catch (error) {

            if (error === "Invalid Token") {
                dispatch(emptyEntireRedux())
                navigate("/")
            } else {
                toast.error(error)
            }
        }
    }

    useEffect(() => {
        fatchData()
    }, [token]);

    useEffect(() => {
        if (!loading && tableRef.current) {
            new DataTable(tableRef.current);
        }
    }, [loading, partnerLevelData]);

    const formattedPartnerLevelData = partnerLevelData?.map((item, index) => ({
        "S.No": index + 1,
        "User Id": item.userid || 'N/A',
        "User Name": item.user_name || 'N/A',
        "Income(₹)": item.transaction_sum ? formatAmount(item.transaction_sum) : 'N/A',
        "Power(₹)": item.power ? formatAmount(item.power) : 'N/A',
        "Level": item.level || 'N/A',
        "Status": item.is_active === 1 ? 'Active' : 'Deactive',
        "Date": formatDateTimenumber(item.upgrade_time) || 'N/A',
    }));
    return (
        <>
            {loading ? <Loader /> : (
                <div className='flex flex-col gap-1 box-border w-[85%] overflow-y-auto'>

                    <div className='w-full bg-white border-[1px] border-customBorderColor rounded-xl shadow-sm'>
                        <div className='flex items-center justify-between p-4'>
                            <h4 className='text-[20px] text-[#6540b2] font-[500]'>Partner Levels</h4>
                        </div>
                        <div className='w-full border border-customBorderColor rounded-lg overflow-auto p-3 relative'>
                            {(formattedPartnerLevelData?.length > 0) ? (
                                <>
                                    <div className='absolute right-[3px] md:right-[337px] top-6 cursor-pointer z-20'>
                                        <CustomDownloadFile
                                            data={formattedPartnerLevelData}
                                            filename="Partner-Levels-Data"
                                        />
                                    </div>
                                    <table ref={tableRef} className='display' style={{ width: "100%" }} >
                                        <thead >
                                            <tr>
                                                <th>S.No</th>
                                                <th>User Id</th>
                                                <th>User Name</th>
                                                <th>Income(₹)</th>
                                                <th>Power(₹)</th>
                                                <th>Level</th>
                                                <th>Status</th>

                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formattedPartnerLevelData?.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item['User Id']}</td>
                                                        <td className='capitalize'>{item['User Name']}</td>
                                                        <td>{item['Income(₹)']}</td>
                                                        <td>{item['Power(₹)']}</td>
                                                        <td>{item['Level']}</td>
                                                        <td
                                                            className={
                                                                item['Status'] === 'Active'
                                                                    ?
                                                                    'text-green-700'
                                                                    :
                                                                    'text-red-600'}
                                                        >
                                                            <span
                                                                className={`w-10 p-1 bg-[#fcf8f8] rounded-md border ${item['Status'] === 'Active'
                                                                    ?
                                                                    'bg-green-50 border-green-200'
                                                                    :
                                                                    'bg-red-50 border-red-200'
                                                                    }`}
                                                            >
                                                                {
                                                                    item['Status']
                                                                }
                                                            </span>
                                                        </td>
                                                        <td>{item['Date']}</td>

                                                    </tr>
                                                )
                                            }
                                            )}
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <p className="w-full h-[65vh] m-auto flex items-center justify-center text-[20px] font-bold opacity-[.7]">
                                    No partner levels data found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PartnerLevels;
