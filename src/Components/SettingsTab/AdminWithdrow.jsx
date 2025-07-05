import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'react-hot-toast'
import DataTable from 'datatables.net-dt';
import { useDispatch, useSelector } from 'react-redux';
import { ApiCall, formatAmount, formatDateTimenumber, } from '../Global/GloblalFunction';
import Loader from '../HomePages/Loader';
import { useNavigate } from 'react-router-dom';
import { emptyEntireRedux } from '../../Redux/ReduxSlice';
import LevelIncomeUpdatePopUp from '../Global/LevelIncomeUpdatePopUp';
import CustomDownloadFile from '../Custom/CustomDownloadFile';
const AdminWithdraw = () => {

    const [loading, setLoading] = useState(false);
    const [adminWithdrawData, setadminWithdrawData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [withdrowAmount, setwithdrowAmount] = useState('');
    const [transectionReference, settransectionReference] = useState('');

    const { token } = useSelector((state) => state);

    const tableRef = useRef(null);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // ------ fetch withdrow status
    const fatchAdminWithdrowData = async () => {
        try {
            const headers = { "x-access-token": token }
            const responce = await ApiCall(headers, '/admin/admin_withdraw_history')
            setadminWithdrawData(responce.data.data);
            if (responce.status === 200) {
                setLoading(false)
            }
        } catch (error) {
            if (error === "Invalid Token") {
                dispatch(emptyEntireRedux())
                navigate("/")
            }
            toast.error(error)
        }
    }

    async function withdrwaAmountFunc() {
        try {
            const headers = {
                "x-access-token": token,
                "Content-Type": "application/json",
            }
            const data = {
                amount: withdrowAmount,
                trxnID: transectionReference
            }
            const responce = await ApiCall(headers, '/admin/admin_withdrawal', 'POST', data)
            if (responce.status === 200) {
                toast.success(responce.data.message)
                fatchAdminWithdrowData();
                setwithdrowAmount('');
                settransectionReference('');
            }
        } catch (error) {
            if (error === "Invalid Token") {
                dispatch(emptyEntireRedux())
                navigate("/")
            }
            toast.error(error)
            setwithdrowAmount('')
            settransectionReference('');
        }
    }

    // -----------
    useEffect(() => {
        setLoading(true)
        fatchAdminWithdrowData();
    }, [])

    // ------- useEffect for table 
    useEffect(() => {
        if (!loading && adminWithdrawData?.length > 0 && tableRef.current) {
            new DataTable(tableRef.current);
        }
    }, [loading, adminWithdrawData]);

    const formattedAdminWithdrawData = adminWithdrawData?.map(item => ({
        ID: item.id || "N/A",
        "Transaction ID": item.transaction_id || "N/A",
        Amount: formatAmount(item.amount),
        Date: formatDateTimenumber(item.datetime)
    }));

    return (
        <>
            <div className='w-full flex flex-col'>
                <div className='w-full border-t-[1px] border-customBorderColor min-h-[100px] flex items-center justify-center gap-3 p-2 md:p-0'>
                    <div className=' flex items-center md:gap-3 gap-1 overflow-auto flex-wrap md:px-3 px-1'>
                        <span className='text-md font-bold'>
                            Withdraw Amount:
                        </span>
                        <input
                            className='input-no-spinner w-52 md:p-1.5 p-1 outline-none border border-gray-400 rounded-md '
                            placeholder='Enter Withdraw Amount'
                            type="number"
                            value={withdrowAmount}
                            onChange={(e) => setwithdrowAmount(e.target.value)}
                        />
                        <span className='text-md font-bold'>
                            Transection Reference:
                        </span>
                        <input
                            className='input-no-spinner w-52 md:p-1.5 p-1 outline-none border border-gray-400 rounded-md '
                            placeholder='Enter Transection Reference'
                            type="text"
                            value={transectionReference}
                            onChange={(e) => settransectionReference(e.target.value)}
                        />

                        <button
                            onClick={withdrwaAmountFunc}
                            className="bg-customVoilet text-white rounded-md w-[100px] md:p-2 p-1.5 hover:bg-[#533397] lg:mr-5"
                        >
                            Withdraw
                        </button>
                    </div>
                </div>
                {
                    loading ?
                        <Loader />
                        :
                        <>
                            <div className='w-full bg-white border-[1px] border-customBorderColor rounded-xl shadow-sm h-[calc(100vh-90px)] relative' >
                                {
                                    selectedItem &&
                                    <LevelIncomeUpdatePopUp item={selectedItem} setpopup={setSelectedItem} />
                                }
                                <div className='flex items-center justify-between p-4'>
                                    <h4 className='text-[20px] text-[#6540b2] font-[500]'>Admin Withdrawal</h4>
                                </div>

                                <div className='w-full border border-customBorderColor rounded-lg overflow-auto p-3 h-[calc(100vh-145px)] relative'>
                                    {adminWithdrawData?.length < 1 ? (
                                        <>
                                            <p className="w-full h-[65vh] m-auto flex items-center justify-center text-[20px] font-bold opacity-[.7]">No Admin Withdraw History found.</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className='absolute right-[3px] md:right-[337px] top-6 cursor-pointer z-20'>
                                                <CustomDownloadFile
                                                    data={formattedAdminWithdrawData}
                                                    filename="Admin-Withdrow-Data"
                                                />
                                            </div>
                                            <table ref={tableRef} className='display' style={{ width: "100%" }}>
                                                <thead>
                                                    <tr>
                                                        <th>Id</th>
                                                        <th>Transection Id</th>
                                                        <th>Amount</th>
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {adminWithdrawData.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.id || "N/A"}</td>
                                                            <th >{item.transaction_id}</th>
                                                            <th>{formatAmount(item.amount)}</th>
                                                            <th>{formatDateTimenumber(item.datetime)}</th>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                }
            </div>
        </>
    )
}

export default AdminWithdraw