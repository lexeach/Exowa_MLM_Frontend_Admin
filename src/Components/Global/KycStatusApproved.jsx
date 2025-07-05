import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { ApiCall } from './GloblalFunction';

const BankKycApproved = ({ item, setbankKycData }) => {
    const { token } = useSelector((state) => state);
    const dispatch = useDispatch()

    // approved status change api
    const bankKycAppFunc = async (status, userid, id) => {
        try {
            const headers = {
                "x-access-token": token,
                "Content-Type": "application/json"
            }

            const data = {
                id,
                userid,
                status
            }

            const response = await ApiCall(headers, `/admin/approve_bank_kyc`, 'POST', data);

            if (response.data) {
                toast.success(response.data.message)

                try {

                    const headers = { "x-access-token": token }
                    const response = await ApiCall(headers, `/admin/bank_kyc_data`);
                    if (response.status === 200) {
                        setbankKycData(response.data.data)
                    }
                } catch (error) {
                    toast.error(error);
                }
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
                            disabled={item.status == 2}
                            checked={item.status == 1 ? true : false}
                            onChange={() => bankKycAppFunc(1, item.userid, item.id)}
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
export default BankKycApproved