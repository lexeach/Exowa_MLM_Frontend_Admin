import React, { useEffect, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { TiArrowRight } from "react-icons/ti";
import { useDispatch, useSelector } from 'react-redux';
import { addAndRemoveTabToAdminData } from '../../Redux/ReduxSlice';
import toast from 'react-hot-toast';
import { ApiCall } from '../Global/GloblalFunction';

const AsignTabToAdminPopUp = ({ setOpenPopup }) => {

    const dispatch = useDispatch();

    const { token, particularAdminState } = useSelector((state) => state);

    const [assignTabToAdmin, setAssignTabToAdmin] = useState([])
    const assignPageToAdmin = async (adminId, page, status) => {
        try {
            const headers = {
                "x-access-token": token,
                "Content-Type": "application/json"
            }
            const data = {
                routeid: page,
                state: status,
                adminid: adminId
            }
            const response = await ApiCall(headers, `/admin/routes_add`, 'POST', data);

            if (response.status === 200) {
                dispatch(addAndRemoveTabToAdminData({ page, adminId, status }))
            }

        } catch (error) {
            toast.error(error);
        }
    }

    const getRoutesList = async () => {
        try {
            const headers = { "x-access-token": token }

            const response = await ApiCall(headers, `/admin/routes_list`);

            if (response?.data?.data) {
                setAssignTabToAdmin(response?.data?.data)
            }
        } catch (error) {
            toast.error(error);
        }
    }

    useEffect(() => {
        getRoutesList()
    }, [])

    const adminAssignRoutesArray = particularAdminState.routes
    const adminId = particularAdminState.admin_id

    return (
        <>
            <>
                <div className='shadow-lg shadow-[#e7e7e7] w-[280px] md:w-[400px] sm:w-[320px] flex flex-col gap-3 p-3 text-[black] border border-[#818181] rounded-xl bg-gray-100 fixed top-[17%] left-[10%] sm:left-[30%] lg:left-[40%] z-10 '>
                    <div className='flex items-center justify-between '>
                        <div className='flex items-center gap-1'>
                            <span className='text-[19px] font-medium'>Assign Pages</span>
                            <TiArrowRight
                                className='text-[25px]'
                            />
                            <span className='text-[19px] font-bold text-[#4013c7] capitalize'>{particularAdminState.admin_name}</span>
                        </div>

                        <div className='bg-[#e4e3e3] border border-[#111111] rounded-full p-[3px] absolute right-[-7px] top-[-7px] cursor-pointer'
                            onClick={() => setOpenPopup((prev) => !prev)}
                        >
                            <RxCross2
                                className='text-[18px] opacity-[.8]'

                            />
                        </div>
                    </div>

                    <div className='p-2 border-[2px] border-[#331883] border-dashed rounded-md flex flex-col gap-0'>
                        {
                            assignTabToAdmin.map((page, index) => (

                                <div className='flex items-center justify-center p-2 hover:bg-gray-200  rounded-md'>
                                    <div className='flex items-center justify-between w-full sm:w-[85%] '>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-[18px]'>{index + 1}.</span>
                                            <p className='text-[18px] font-medium'>{page.routes_name}</p>
                                        </div>
                                        <div>
                                            <label className="labelSec cursor-pointer">
                                                <div className="toggleSec">
                                                    <input
                                                        type="checkbox"
                                                        className="toggle-stateSec"
                                                        checked={((index == 0 && adminAssignRoutesArray.includes(1)) || (index == 1 && adminAssignRoutesArray.includes(2)) || (index == 2 && adminAssignRoutesArray.includes(3)) || (index == 3 && adminAssignRoutesArray.includes(4)) || (index == 4 && adminAssignRoutesArray.includes(5)) || (index == 5 && adminAssignRoutesArray.includes(6)) || (index == 6 && adminAssignRoutesArray.includes(7)) || (index == 7 && adminAssignRoutesArray.includes(8)) || (index == 8 && adminAssignRoutesArray.includes(9))
                                                            || (index == 9 && adminAssignRoutesArray.includes(10))
                                                            || (index == 10 && adminAssignRoutesArray.includes(11))
                                                            || (index == 11 && adminAssignRoutesArray.includes(12))
                                                            || (index == 12 && adminAssignRoutesArray.includes(13))
                                                            || (index == 13 && adminAssignRoutesArray.includes(14))
                                                            ? true : false)}
                                                        onChange={(e) => assignPageToAdmin(adminId, page.id, e.target.checked == true ? 0 : 1)}
                                                    />
                                                    <div className="toggleSec">
                                                        <div className="indicatorSec"></div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </>
        </>
    )
}

export default AsignTabToAdminPopUp





