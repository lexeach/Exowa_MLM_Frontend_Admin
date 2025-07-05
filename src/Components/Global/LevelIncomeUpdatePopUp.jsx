import React, { useState } from 'react'
import { ApiCall, formatAmount, handleChange } from './GloblalFunction'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const LevelIncomeUpdatePopUp = ({
    setpopup,
    item
}) => {
    const { token } = useSelector((state) => state);
    const [formData, setformData] = useState({
        id: item.id,
        level: item.level,
        amount: formatAmount(item.amount),
        status: item.status
    })
    const handleSubmit = async () => {

        try {
            const headers = {
                "x-access-token": token,
                "Content-Type": "application/json",
            };
            const response = await ApiCall(headers, `/admin/update_levels`, "POST", formData);
            if (response?.data) {
                toast.success(response.data.message);
                setpopup(null)
            }
        } catch (error) {
            toast.error(error);
        }
    }
    return (
        <>
            <div className='w-full h-[100%] flex items-center justify-center absolute bg-[#7e7e7e2e] z-20'>
                <div className=" w-full sm:w-[500px] bg-slate-50 border border-[#d1cddf] shadow-xl rounded-lg ">
                    <h2 className="text-xl font-semibold pt-4 text-[#2e1f5e] text-center">Edit Level Income</h2>
                    <div className="flex flex-col gap-3 py-6 px-2 md:px-0 text-left max-w-md mx-auto">

                        <InputBox
                            label="Amount"
                            name="amount"
                            placeholder="Amount"
                            value={formData.amount}
                            setformData={setformData}
                        />

                        <InputBox
                            label="Level"
                            name="level"
                            placeholder="Level"
                            value={formData.level}
                            setformData={setformData}
                        />
                        <div>
                            <label className="block mb-1 font-medium text-[#3a3a3a]">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) =>
                                    setformData((prev) => ({
                                        ...prev,
                                        status: Number(e.target.value)
                                    }))
                                }
                                className="w-full border border-gray-400 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value={1}>Active</option>
                                <option value={0}>Deactive</option>
                            </select>
                        </div>
                        <div className="flex justify-center gap-4 pt-2">
                            <button
                                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md"
                                onClick={handleSubmit}
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setpopup(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


const InputBox = ({
    label,
    name,
    placeholder,
    value,
    setformData
}) => {
    return (
        <div>
            <label className="block mb-1 font-medium text-[#3a3a3a]">{label}</label>
            <input
                className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                type="text"
                name={name}
                value={value}
                onChange={(e) => handleChange(e, setformData)}
                placeholder={placeholder}
            />
        </div>
    )
}


export default LevelIncomeUpdatePopUp