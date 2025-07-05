import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { depositHistoryStatusChange } from '../../Redux/ReduxSlice';
import { ApiCall } from './GloblalFunction';

const DepositApprovedStatusChange = ({ item }) => {

    const { token } = useSelector((state) => state);
    const dispatch = useDispatch()

    // approved status change api
    const depositStatusApprovedApiFunction = async (status, userid, transaction_id) => {
        try {
            const headers = {
                "x-access-token": token,
                "Content-Type": "application/json"

            }

            const data = {
                userid,
                transaction_id,
                status,
                comment: ""
            }

            const response = await ApiCall(headers, `/admin/deposit_approval`, 'POST', data);

            if (response.data) {
                toast.success(response.data.message)
                dispatch(depositHistoryStatusChange({ transaction_id, status }));
            }
        } catch (error) {
            toast.error(error
            );
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
                            disabled={item.status == 2}
                            checked={item.status == 1 ? true : false}
                            onChange={() => depositStatusApprovedApiFunction(1, item.userid, item.transaction_id)}
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

export default DepositApprovedStatusChange