import React, { useState } from 'react'
import { ApiCall, handleChange } from '../Global/GloblalFunction'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const UserTopUp = () => {
    const { userData, token } = useSelector((state) => state);

    const [formdata, setformdata] = useState({
        tableName: "",
        level: "",
        amount: "",
        userid: userData.userid
    })
    const sponserOptions = [
        { label: 'My Sponser', value: 'user_upgrade_power' },
        { label: 'My Partner', value: 'partner_upgrade_power' }
    ];

    const levelsOptions = [
        { label: 'Level 1', value: 1 },
        { label: 'Level 2', value: 2 },
        { label: 'Level 3', value: 3 },
        { label: 'Level 4', value: 4 },
        { label: 'Level 5', value: 5 },
        { label: 'Level 6', value: 6 },
        { label: 'Level 7', value: 7 },
        { label: 'Level 8', value: 8 },
        { label: 'Level 9', value: 9 },
        { label: 'Level 10', value: 10 },

    ];

    const handleClick = async () => {
        try {
            if (!formdata.tableName || !formdata.level || !formdata.amount) {
                toast.error('Please fill all fields');
                return;
            }

            const headers = {
                "x-access-token": token,
                "Content-Type": "application/json"
            }

            const payload = {
                userid: formdata.userid,
                tableName: formdata.tableName,
                level: formdata.level,
                amount: formdata.amount
            };

            const response = await ApiCall(headers, `/admin/TOP_UP`, 'POST', payload);
            if (response.data) {
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setformdata({
                tableName: "",
                level: "",
                amount: "",
                userid: userData.userid
            })
        }
    }

    return (
        <div className="h-full">
            <div className="w-full bg-slate-50 font-bold px-8 py-4 rounded-md">
                <h1>Top up</h1>
            </div>
            <div className="w-full">
                <div className='lg:w-[80%] w-full m-auto relative flex bg-slate-50 justify-center items-center lg:mt-8 mt-10 md:p-8 rounded-lg'>
                    <div className='w-full xl:w-[50%] lg:w-[80%] flex flex-col gap-6'>
                        <div className='flex flex-col gap-1'>
                            <label>Sponser:</label>
                            <select
                                name="tableName"
                                value={formdata.tableName}
                                onChange={(e) => handleChange(e, setformdata)}
                                className={`w-full p-2.5 rounded-lg outline-none border border-customVoilet bg-transparent ${!formdata.tableName ? 'text-gray-400' : ""}`}
                            >
                                <option value="">Select a Sponser</option>
                                {sponserOptions.map((item, index) => (
                                    <option key={index} value={item.value}>{item.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label>Partner Level:</label>
                            <select
                                name="level"
                                value={formdata.level}
                                onChange={(e) => handleChange(e, setformdata)}
                                className={`w-full p-2.5 rounded-lg outline-none border border-customVoilet bg-transparent ${!formdata.level ? 'text-gray-400' : ""}`}
                            >
                                <option value="">Select a level</option>
                                {/* {levels.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))} */}

                                {levelsOptions.map((item, index) => (
                                    <option key={index} value={item.value}>{item.label}</option>
                                ))}
                                levelsOptions
                            </select>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label>Amount:</label>
                            <input
                                name='amount'
                                type="number"
                                value={formdata.amount}
                                onChange={(e) => handleChange(e, setformdata)}
                                placeholder='Enter amount'
                                className='w-full p-2 rounded-lg outline-none border border-customVoilet'
                            />
                        </div>
                        <div className="w-full flex justify-end ">
                            <button
                                onClick={handleClick}
                                className="bg-customVoilet text-white rounded-md lg:w-[120px] py-2 w-full hover:bg-[#533397] "
                            >
                                Top Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserTopUp