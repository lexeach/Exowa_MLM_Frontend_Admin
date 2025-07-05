import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'react-hot-toast'
import DataTable from 'datatables.net-dt';
import { useDispatch, useSelector } from 'react-redux';
import { ApiCall, formatAmount, } from '../Global/GloblalFunction';
import Loader from '../HomePages/Loader';
import { useNavigate } from 'react-router-dom';
import { emptyEntireRedux } from '../../Redux/ReduxSlice';
import { MdOutlineEdit } from "react-icons/md";
import LevelIncomeUpdatePopUp from '../Global/LevelIncomeUpdatePopUp';
import CustomDownloadFile from '../Custom/CustomDownloadFile';
const LevelIncome = () => {

    const [loading, setLoading] = useState(false);
    const [levelIncomeData, setlevelIncomeData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const { token } = useSelector((state) => state);

    const tableRef = useRef(null);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // ------ fetch withdrow status
    const fatchLevelIncomeData = async () => {
        try {
            const headers = { "x-access-token": token }
            const responce = await ApiCall(headers, '/admin/levels')
            setlevelIncomeData(responce.data.data);
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

    // -----------
    useEffect(() => {
        setLoading(true)
        fatchLevelIncomeData();
    }, [])

    // ------- useEffect for table 
    useEffect(() => {
        if (!loading && levelIncomeData?.length > 0 && tableRef.current) {
            new DataTable(tableRef.current);
        }
    }, [loading, levelIncomeData]);

    const formattedLevelIncomeData = levelIncomeData?.map((item) => ({
        Level: item.level || "N/A",
        Amount: formatAmount(item.amount) || "0",
        Status: item.status === 1 ? "Active" : "Deactive",
    }));
    return (
        <>
            {
                loading ? <Loader /> : <>
                    <div className='w-full bg-white border-[1px] border-customBorderColor rounded-xl shadow-sm h-[calc(100vh-90px)] relative' >
                        {
                            selectedItem &&
                            <LevelIncomeUpdatePopUp item={selectedItem} setpopup={setSelectedItem} />
                        }
                        <div className='flex items-center justify-between p-4'>
                            <h4 className='text-[20px] text-[#6540b2] font-[500]'>Level Income</h4>
                        </div>

                        <div className='w-full border border-customBorderColor rounded-lg overflow-auto p-3 h-[calc(100vh-145px)] relative'>
                            {levelIncomeData?.length < 1 ? (
                                <>
                                    <p className="w-full h-[65vh] m-auto flex items-center justify-center text-[20px] font-bold opacity-[.7]">No Withdrow History found.</p>
                                </>
                            ) : (
                                <>
                                    <div className='absolute right-[3px] md:right-[337px] top-6 cursor-pointer z-20'>
                                        <CustomDownloadFile
                                            data={formattedLevelIncomeData}
                                            filename="Level-Income-Data"
                                        />
                                    </div>
                                    <table ref={tableRef} className='display' style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th>Level</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {levelIncomeData.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.level || "N/A"}</td>
                                                    <th>{formatAmount(item.amount)}</th>
                                                    <td
                                                        className={
                                                            item.status === 1
                                                                ?
                                                                'text-green-700'
                                                                :
                                                                'text-red-600'}
                                                    >
                                                        <span
                                                            className={`w-10 p-1 bg-[#fcf8f8] rounded-md border ${item.status === 1
                                                                ?
                                                                'bg-green-50 border-green-200'
                                                                :
                                                                'bg-red-50 border-red-200'
                                                                }`}
                                                        >
                                                            {
                                                                item.status === 1 ? "Active" : "Deactive"
                                                            }
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button className="flex gap-1 border-2  w-fit px-2 rounded-md py-[.4rem] justify-center items-center"
                                                            onClick={() => setSelectedItem(item)}
                                                        >
                                                            <MdOutlineEdit />
                                                            Edit
                                                        </button>
                                                    </td>
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

        </>
    )
}

export default LevelIncome