import React, { useEffect, useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../HomePages/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { AdminApprovelStatusChange, AdminBlockStatusChange, allAdminData, emptyEntireRedux, particularAdminData } from '../../Redux/ReduxSlice';
import AsignTabToAdmin from '../Custom/AsignTabToAdminPopUp';
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ApiCall } from '../Global/GloblalFunction';

const AdminApprovel = () => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { token, allAdmin } = useSelector((state) => state);
    const [loading, setloading] = useState(false);
    const [openPopup, setOpenPopup] = useState(false)

    const allAdminListApi = async () => {
        setloading(true)
        try {

            const headers = { "x-access-token": token }
            const response = await ApiCall(headers, `/admin/admin_list`);

            if (response.data.data) {
                dispatch(allAdminData(response.data.data))
            }
            setloading(false)
        } catch (error) {
            if (error.message == "Invalid Token") {
                dispatch(emptyEntireRedux())
                navigate("/")
            }
            setloading(false)
            toast.error(error);
        }
    }

    const statusChangeApiFunction = async (status, admin_id, apiStatus) => {
        try {
            const config = {
                headers: {
                    "x-access-token": token,
                    "Content-Type": "application/json"
                }
            };
            const data = {
                status,
                admin_id
            }
            if (apiStatus == "approvedStatus") {
                const response = await axios.post(`${apiUrl}/admin/admin_approve`, data, config);
                if (response.data) {
                    toast.success(response.data.message)
                    dispatch(AdminApprovelStatusChange({ adminId: admin_id, status }))
                }
            }
            if (apiStatus == "blockStatus") {
                const response = await axios.post(`${apiUrl}/admin/admin_block`, data, config);
                if (response.data) {
                    toast.success(response.data.message)
                    dispatch(AdminBlockStatusChange({ adminId: admin_id, status }))
                }
            }

        } catch (error) {
            toast.error(
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                error?.message ||
                "An error occured"
            );
        }
    }

    useEffect(() => {
        allAdminListApi()
    }, [])

    const handleClickPlusIcon = (item) => {
        setOpenPopup((prev) => !prev)
        dispatch(particularAdminData(item))
    }

    return (
        <>
            {
                loading ? <Loader /> :
                    <div className='flex flex-col gap-4 box-border w-[85%] relative'>
                        <div className='w-full flex flex-col gap-4 md:p-3 bg-white border-[1px] border-customBorderColor rounded-xl shadow-sm sm-gap-4  h-[calc(100vh-83px)]'>
                            <h2 className='text-customVoilet text-[18px] font-bold px-7 py-3 w-full border-b border-customBorderColor'>Admin Approvel</h2>

                            <div className='w-full overflow-auto border rounded-lg'>
                                {
                                    allAdmin?.length > 0 ? (
                                        <div className="w-full overflow-x-auto">
                                            <table className="w-full table-fixed text-center  min-w-[1350px] ">
                                                <thead className="bg-[#ebebeb] text-[15px] ">
                                                    <tr>
                                                        <th className="p-1 md:p-4  w-[270px] border border-customBorderColor">Admin Id</th>
                                                        <th className="p-1 md:p-4  w-[200px] border border-customBorderColor">Admin Name</th>
                                                        <th className="p-1 md:p-4  w-[250px] border border-customBorderColor">Admin Email</th>
                                                        <th className="p-1 md:p-4  w-[200px] border border-customBorderColor">Admin Role</th>
                                                        <th className="p-1 md:p-4  w-[200px] border border-customBorderColor">Approval Status</th>
                                                        <th className="p-1 md:p-4  w-[250px] border border-customBorderColor">Block Status</th>
                                                        <th className="p-1 md:p-4  w-[100px] border border-customBorderColor">Tab Access</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-[14px]">
                                                    {
                                                        allAdmin.map((item, index) => (
                                                            <tr key={index}>
                                                                <td className="p-1 md:p-4  w-[270px] border border-customBorderColor text-[16px]">{item.admin_id}</td>
                                                                <td className="p-1 md:p-4  w-[200px] border border-customBorderColor text-[16px] capitalize">{item.admin_name}</td>
                                                                <td className="p-1 md:p-4  w-[250px] border border-customBorderColor text-[16px] ">{item.admin_email}</td>
                                                                <td className="p-1 md:p-4  w-[200px] border border-customBorderColor text-[16px] capitalize">{item.admin_role}</td>
                                                                <td className="p-1 md:p-4  w-[200px] border border-customBorderColor">
                                                                    <div className='w-full flex justify-center'>
                                                                        <label className="labelSec">
                                                                            <div className="toggleSec ">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="toggle-stateSec"
                                                                                    checked={item.status == 1 ? true : false}
                                                                                    onChange={() => statusChangeApiFunction(item.status == 1 ? 0 : 1, item.admin_id, "approvedStatus")}
                                                                                />
                                                                                <div className="toggleSec">
                                                                                    <div className="indicatorSec"></div>
                                                                                </div>
                                                                            </div>
                                                                        </label>
                                                                    </div>
                                                                </td>
                                                                <td className="p-1 md:p-4  w-[250px] border border-customBorderColor">
                                                                    <div className='w-full flex justify-center '>
                                                                        <label className="labelSec ">
                                                                            <div className="toggleSec">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="toggle-stateSec"
                                                                                    checked={item.block == 1 ? true : false}
                                                                                    onChange={() => statusChangeApiFunction(item.block == 1 ? 0 : 1, item.admin_id, "blockStatus")}
                                                                                />
                                                                                <div className="toggleSec">
                                                                                    <div className="indicatorSec"></div>
                                                                                </div>
                                                                            </div>
                                                                        </label>
                                                                    </div>
                                                                </td>
                                                                <td className='p-1 md:p-2  w-[100px] border border-customBorderColor'>
                                                                    {
                                                                        openPopup && (
                                                                            <AsignTabToAdmin setOpenPopup={setOpenPopup} />
                                                                        )
                                                                    }
                                                                    <div className='flex items-center justify-center'>
                                                                        <FiPlusCircle
                                                                            className='text-[25px] cursor-pointer hover:text-[#541aff] hover:text-[29px]'
                                                                            onClick={() => handleClickPlusIcon(item)}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="w-full h-[65vh] m-auto flex items-center justify-center text-[20px] font-bold opacity-[.7]">No Users Found</p>
                                    )
                                }
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default AdminApprovel
