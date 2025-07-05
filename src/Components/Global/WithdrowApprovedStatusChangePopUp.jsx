import React, { useRef } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { withdrowHistoryStatusChange } from '../../Redux/ReduxSlice';
import { ApiCall } from './GloblalFunction';

const apiUrl = process.env.REACT_APP_API_URL;
const MySwal = withReactContent(Swal);

const WithdrawStatusApprovedToggle = ({ item }) => {

    const dispatch = useDispatch()
    const { token } = useSelector((state) => state);

    const withdrowFormData = useRef({
        transactionMode: "",
        transactionReference: ""
    });

    const transactionModeArray = ["--- Select Transaction Mode ---", "Cash Deposit by Branch", "Cash Deposit Machine (CDM)", "IMPS", "NEFT", "RTGS"];

    // ---------- withdrow approved pop up
    const handleToggleWithdrowApprovedStatus = async (status, userid, transaction_id, popupStatus) => {
        if (status == 1 && popupStatus == 0) {
            MySwal.fire({
                html: (
                    <>
                        <h2 className='pb-4'>Approved Withdraw Request</h2>
                        <div className='flex flex-col gap-5 p-5 border-4 border-[#6440b27a] rounded-lg'>
                            <div className='flex flex-col gap-3'>
                                <p className='w-[300px] text-[16px] text-start'>Transaction Mode:</p>
                                <select
                                    name="transactionMode"
                                    className="border border-[#0000008c] rounded-md outline-none p-1.5 text-[17px] text-black"
                                    onChange={handleOnchange}
                                >
                                    {transactionModeArray.map((mode, index) => (
                                        <option
                                            key={index}
                                            value={mode}
                                            disabled={index === 0}
                                            selected={index === 0}
                                            className={`rounded-md capitalize ${index === 0 ? "text-[#312222]" : "text-black"}`}
                                        >
                                            {
                                                mode
                                            }
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex flex-col gap-3'>
                                <p className='w-[300px] text-[16px] text-start'>Transaction Reference:</p>
                                <input
                                    name="transactionReference"
                                    className='border border-[#0000008c] rounded-md outline-none p-1.5 bg-[#a19a9a2d] text-[#3f3b3b] placeholder:text-[#524e4eb9]'
                                    type="text"
                                    placeholder='Enter Transaction Reference...'
                                    onChange={handleOnchange}
                                />
                            </div>
                            <div className='flex items-center justify-center gap-2'>
                                <button
                                    onClick={() => handleClickOkBtn(status, userid, transaction_id)}
                                    className="bg-customVoilet  text-white rounded-md w-[80px] py-2 hover:bg-[#533397]"
                                >
                                    OK
                                </button>
                                <button
                                    onClick={handleClickCancelBtn}
                                    className="bg-[#636c74]  text-white rounded-md w-[80px] py-2 hover:bg-[#4f575e]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </>
                ),
                showConfirmButton: false,
            });
        } else {
            toast.error("This Request is Already Completed");
        }
    };

    //  --------- on change btn
    const handleOnchange = (e) => {
        withdrowFormData.current[e.target.name] = e.target.value;
    };

    // -------- ok btn click 
    const handleClickOkBtn = async (status, userid, transaction_id) => {
        await withdrowStatusApprovedApi(
            status,
            userid,
            transaction_id,
            withdrowFormData.current.transactionReference,
            withdrowFormData.current.transactionMode
        );
        MySwal.close();
    };

    // -------- cancel btn click
    const handleClickCancelBtn = async () => {
        MySwal.close();
    }

    //   --------- withdrow status
    const withdrowStatusApprovedApi = async (status, userid, transaction_id, transaction_reference, transaction_mode) => {

        try {
            const headers = {
                "x-access-token": token,
                "Content-Type": "application/json"

            }
            const data = {
                userid,
                transaction_id,
                transaction_reference,
                transaction_mode,
                status,
                comment: "",
            };

            const response = await ApiCall(headers, `/admin/withdrawal_approval`, 'POST', data);

            if (response.data) {
                toast.success(response.data.message);
            }
            dispatch(withdrowHistoryStatusChange({ transaction_id, status, transaction_reference, transaction_mode }))
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
                        disabled={item.status == 2}
                        checked={item.status == 1 ? true : false}
                        onChange={() => handleToggleWithdrowApprovedStatus(1, item.userid, item.transaction_id, item.status)}
                    />
                    <div className="toggleSec">
                        <div className="indicatorSec"></div>
                    </div>
                </div>
            </label>
        </div>
    );
};

export default WithdrawStatusApprovedToggle;