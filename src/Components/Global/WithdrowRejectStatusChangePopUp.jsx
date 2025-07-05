import React from 'react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { withdrowHistoryStatusChange } from '../../Redux/ReduxSlice';
import { ApiCall } from './GloblalFunction';

const WithdrawStatusRejectToggle = ({ item }) => {

    const { token } = useSelector((state) => state);
    const apiUrl = process.env.REACT_APP_API_URL;
    const dispatch = useDispatch()

    const handleToggleWithdrowRejectStatus = async (status, userid, transaction_id, transaction_reference, transaction_mode, popupStatus) => {
        if (status == 2 && popupStatus == 0) {
            const { value: text } = await Swal.fire({
                input: "textarea",
                inputLabel: "Why Reject Withdraw Request?",
                inputPlaceholder: "Type your message here...",
                showCancelButton: true,
                confirmButtonColor: "#6540b2"
            });
            if (text) {
                withdrowStatusRejectApi(status, userid, transaction_id, transaction_reference, transaction_mode, text);
            }
        } else {
            toast.error("This Request is Already Completed");
        }
    };

    const withdrowStatusRejectApi = async (status, userid, transaction_id, transaction_reference, transaction_mode, comment) => {

        try {
            const headers = {
                "x-access-token": token,
                "Content-Type": "application/json"
            }

            const data = {
                status,
                userid,
                transaction_id,
                transaction_reference,
                transaction_mode,
                comment
            };

            const response = await ApiCall(headers, `/admin/withdrawal_approval`, 'POST', data);

            if (response.data) {
                toast.success(response.data.message);
                dispatch(withdrowHistoryStatusChange({ transaction_id, status, transaction_reference, transaction_mode }))
            }
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div className="flex flex-col gap-5 items-center">
            <label className="labelSec">
                <div className="toggleSec">
                    <input
                        type="checkbox"
                        className="toggle-stateSec"
                        disabled={item.status == 1}
                        checked={item.status == 2}
                        onChange={() => handleToggleWithdrowRejectStatus(2, item.userid, item.transaction_id, item.transaction_reference, item.transaction_mode, item.status)}
                    />
                    <div className="toggleSec">
                        <div className="indicatorSec"></div>
                    </div>
                </div>
            </label>
        </div>
    );
};

export default WithdrawStatusRejectToggle;
