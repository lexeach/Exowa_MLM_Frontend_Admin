import axios from 'axios';
import React from 'react'
import Swal from 'sweetalert2';
import toast from "react-hot-toast"
import { depositHistoryStatusChange } from '../../Redux/ReduxSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ApiCall } from './GloblalFunction';


const DepositRejectStatusChange = ({ item }) => {

    const { token } = useSelector((state) => state);
    const apiUrl = process.env.REACT_APP_API_URL;
    const dispatch = useDispatch()

    const handleToggleDepositRejectStatus = async (status, userid, transaction_id, popupStatus) => {

        if (status == 2 && popupStatus == 0) {
            const { value: text } = await Swal.fire({
                input: "textarea",
                inputLabel: "Why Reject Deposit Request",
                inputPlaceholder: "Type your message here...",
                inputAttributes: {
                    "aria-label": "Type your message here"
                },
                showCancelButton: true,
                confirmButtonColor: "#6540b2"
            });
            if (text) {
                depositStatusRejectApi(status, userid, transaction_id, text)
            }
        } else {
            toast.error("This Request is Already Completed");
        }
    };


    // approved status change api
    const depositStatusRejectApi = async (status, userid, transaction_id, comment) => {
        try {
            const headers = {
                "x-access-token": token,
                "Content-Type": "application/json"
            }
            const data = {
                userid,
                transaction_id,
                status,
                comment
            }
            const response = await ApiCall(headers, `/admin/deposit_approval`, 'POST', data);
            if (response.data) {
                toast.success(response.data.message)
                dispatch(depositHistoryStatusChange({ transaction_id, status }));
            }
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <>
            <div className=' flex flex-col gap-5 items-center'>

                <label className="labelSec cursor-pointer">
                    <div className="toggleSec ">
                        <input
                            type="checkbox"
                            className="toggle-stateSec"
                            disabled={item.status == 1}
                            checked={item.status == 2 ? true : false}
                            onChange={() => handleToggleDepositRejectStatus(2, item.userid, item.transaction_id, item.status)}
                        />
                        <div className="toggleSec">
                            <div className="indicatorSec"></div>
                        </div>
                    </div>
                </label>
            </div>
        </>
    )
}

export default DepositRejectStatusChange