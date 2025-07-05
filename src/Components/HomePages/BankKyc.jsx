import React, { useState, useEffect, useRef } from 'react';
import Loader from './Loader';
import DataTable from 'datatables.net-dt';
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux';
import { emptyEntireRedux } from '../../Redux/ReduxSlice';
import { useNavigate } from 'react-router-dom';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import { ApiCall, formatDateTimenumber } from '../Global/GloblalFunction';
import BankKycApproved from '../Global/KycStatusApproved';
import BankKycReject from '../Global/KycStatusReject';
import CustomDownloadFile from '../Custom/CustomDownloadFile';


const BankKyc = () => {
    const [loading, setloading] = useState(false);
    let { token } = useSelector((state) => state);
    const [bankKycData, setbankKycData] = useState([])

    const tableRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fatchData = async () => {
        setloading(true)
        try {
            const headers = { "x-access-token": token }
            const response = await ApiCall(headers, `/admin/bank_kyc_data`);
            if (response.status === 200) {
                setbankKycData(response.data.data)
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
    }, [loading, bankKycData]);

    const formattedBankKycData = bankKycData?.map((item, index) => ({
        "S.No": index + 1,
        "User Id": item.userid || 'N/A',
        "Account Holder": item.acc_holder || 'N/A',
        "Account No": item.acc_no || 'N/A',
        "Bank Name": item.bank_name || 'N/A',
        "IFSC Code": item.ifsc || 'N/A',
        "Bank Branch": item.bank_branch || 'N/A',
        "Pan No": item.pan_no || 'N/A',
        "Bank Address": item.bank_add || 'N/A',
        "Bank KYC Status": item.bank_kyc_status === 1
            ? "Approved"
            : item.bank_kyc_status === 2
                ? "Rejected"
                : "Pending",
        "Date": formatDateTimenumber(item.created_at) || 'N/A',
    }));
    return (
        <>
            {loading ? <Loader /> : (
                <div className='flex flex-col gap-1 box-border w-[85%] overflow-y-auto'>

                    <div className='w-full bg-white border-[1px] border-customBorderColor rounded-xl shadow-sm'>
                        <div className='flex items-center justify-between p-4'>
                            <h4 className='text-[20px] text-[#6540b2] font-[500]'>User Levels</h4>
                        </div>
                        <div className='w-full border border-customBorderColor rounded-lg overflow-auto p-3 relative'>
                            {(bankKycData?.length > 0) ? (
                                <>
                                    <div className='absolute right-[3px] md:right-[337px] top-6 cursor-pointer z-20'>
                                        <CustomDownloadFile
                                            data={formattedBankKycData}
                                            filename="Bank-Kyc-Data"
                                        />
                                    </div>
                                    <table ref={tableRef} className='display ' style={{ width: "100%" }} >
                                        <thead >
                                            <tr>
                                                <th>S.No</th>
                                                <th>User Id</th>
                                                <th>Account Holder</th>
                                                <th>Account No</th>
                                                <th className='min-w-[160px]'>Bank Name</th>
                                                <th>IFSC Code</th>
                                                <th className='min-w-[130px]'>Bank Branch</th>
                                                <th>Pan No</th>
                                                <th className='min-w-[350px]'>Bank Address</th>
                                                <th>Bank Kyc Approved</th>
                                                <th>Bank Kyc Reject</th>
                                                <th className='min-w-[130px]'>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bankKycData?.map((item, index) => {
                                                const userId = item.userid || 'N/A';
                                                const acc_no = item.acc_no || 'N/A';
                                                const acc_holder = item.acc_holder || 'N/A';
                                                const bank_name = item.bank_name || 'N/A';
                                                const ifsc = item.ifsc || 'N/A';
                                                const bank_branch = item.bank_branch || 'N/A';
                                                const pan_no = item.pan_no || 'N/A';
                                                const bank_add = item.bank_add || 'N/A';
                                                const created_at = formatDateTimenumber(item?.created_at) || 'N/A'
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{userId}</td>
                                                        <td className='capitalize'>{acc_holder}</td>
                                                        <td>{acc_no}</td>
                                                        <td className='min-w-[160px]'>{bank_name}</td>
                                                        <td>{ifsc}</td>
                                                        <td className='min-w-[130px]'>{bank_branch}</td>
                                                        <td>{pan_no}</td>
                                                        <td className='min-w-[350px]'>{bank_add}</td>
                                                        <td >
                                                            <BankKycApproved
                                                                item={item}
                                                                setbankKycData={setbankKycData}
                                                            />
                                                        </td>
                                                        <td >
                                                            <BankKycReject
                                                                item={item}
                                                                setbankKycData={setbankKycData}
                                                            />
                                                        </td>
                                                        <td className='min-w-[130px]'>{created_at}</td>
                                                    </tr>
                                                )
                                            }
                                            )}
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <p className="w-full h-[65vh] m-auto flex items-center justify-center text-[20px] font-bold opacity-[.7]">
                                    No bank kyc data found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BankKyc;
