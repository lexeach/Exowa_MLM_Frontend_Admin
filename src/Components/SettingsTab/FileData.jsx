import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FaSlackHash } from "react-icons/fa";
import { TbReceiptTax, TbUsersGroup } from "react-icons/tb";
import { GiCash } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { emptyEntireRedux } from "../../Redux/ReduxSlice";
import { useNavigate } from "react-router-dom";
import { ApiCall, copy, formatAmount, handleChange } from "../Global/GloblalFunction";
import { PiSealPercent, PiSealPercentDuotone, PiHandWithdraw, PiSealCheck, PiPiggyBankBold } from "react-icons/pi";
import { LuBadgePercent } from "react-icons/lu";
import { TbMoneybag } from "react-icons/tb";
import { TbSquareRoundedPercentage } from "react-icons/tb";
const FileData = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state);
    const apiUrl = process.env.REACT_APP_API_URL;

    const [formData, setFormData] = useState({
        tax_rate: "",
        partner_referral_required: "",
        partner_fee: "",
        is_top_approving: 0,
        min_withdrawal: "",
        SPONSOR_REWARD_PERCENT: "",
        COREFFERAL_REWARD_PERCENT: "",
        total_distributed: "",
        system_reserve: "",
        is_notTurbo_per: "",
        passed_perc: "",
        total_withdrawal: ""
    });
    const fields = [
        {
            icon: TbReceiptTax,
            title: "Tax Rate",
            name: "tax_rate",
        },
        {
            icon: PiHandWithdraw,
            title: "Min Withdrawal",
            name: "min_withdrawal",
        },

        {
            icon: TbUsersGroup,
            title: "Partner Referral Required",
            name: "partner_referral_required",
        },
        {
            icon: GiCash,
            title: "Partner Fee",
            name: "partner_fee",
        },
        {
            icon: PiSealPercent,
            title: "Refferal Reward Percentage",
            name: "SPONSOR_REWARD_PERCENT",
        },
        {
            icon: PiSealPercentDuotone,
            title: "Corefferal Reward Percentage",
            name: "COREFFERAL_REWARD_PERCENT",
        },
        {
            icon: LuBadgePercent,
            title: "Turbo Percentage",
            name: "is_notTurbo_per",
        },
        {
            icon: TbSquareRoundedPercentage,
            title: "Exam Passed Percentage",
            name: "passed_perc",
        },
        {
            icon: PiPiggyBankBold,
            title: "System Reserve Amount",
            name: "system_reserve",
            readOnly: true
        },
        {
            icon: TbMoneybag,
            title: "Total Distributed Amount",
            name: "total_distributed",
            readOnly: true
        },
        {
            icon: PiHandWithdraw,
            title: "Total Withdrawal Amount",
            name: "total_withdrawal",
            readOnly: true
        }
    ];

    const updateAPIFunction = async () => {
        try {
            const headers = {
                "x-access-token": token,
                "Content-Type": "application/json",
            };

            const data = {
                tax_rate: formData.tax_rate,
                registration_fees: formData.registration_fees,
                partner_referral_required: formData.partner_referral_required,
                partner_fee: formData.partner_fee,
                is_top_approving: formData.is_top_approving,
                min_withdrawal: formData.min_withdrawal,
                SPONSOR_REWARD_PERCENT: formData.SPONSOR_REWARD_PERCENT,
                COREFFERAL_REWARD_PERCENT: formData.COREFFERAL_REWARD_PERCENT,
                is_notTurbo_per: formData.is_notTurbo_per,
                passed_perc: formData.passed_perc,

            }
            const response = await ApiCall(headers, `/admin/update_fees_data`, "POST", data);
            if (response?.data) {
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error);
        }
    };

    useEffect(() => {
        const config = {
            headers: { "x-access-token": token }
        };
        axios
            .post(`${apiUrl}/admin/fees_data`, null, config)
            .then(async (response) => {
                const data = response?.data?.data;
                if (data) {
                    setFormData({
                        tax_rate: await formatAmount(data?.tax_rate),
                        partner_referral_required: data?.partner_referral_required,
                        partner_fee: await formatAmount(data?.partner_fee),
                        is_top_approving: data?.is_top_approving,
                        min_withdrawal: await formatAmount(data?.min_withdrawal),
                        SPONSOR_REWARD_PERCENT: data?.SPONSOR_REWARD_PERCENT,
                        COREFFERAL_REWARD_PERCENT: data?.COREFFERAL_REWARD_PERCENT,
                        total_distributed: await formatAmount(data.total_distributed),
                        system_reserve: await formatAmount(data.system_reserve),
                        is_notTurbo_per: data.is_notTurbo_per,
                        passed_perc: data.passed_perc,
                        total_withdrawal: data.total_withdrawal
                    });
                }
            })
            .catch((error) => {
                if (error.message === "Invalid Token") {
                    dispatch(emptyEntireRedux());
                    navigate("/");
                }
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <div className="w-full p-1 sm:p-2">
            <div className="w-full p-0 sm:p-2">
                <h2 className="text-[18px] px-5 py-3 w-full flex items-center gap-1 bg-slate-100 rounded-md">
                    <FaSlackHash className="text-2xl" />
                    Update File-Data
                </h2>
                <div className="w-full flex flex-col gap-7 sm:p-5 p-1  bg-slate-100 rounded-md pt-3 mt-5">
                    {/* Dynamic Field Cards */}
                    <div className="flex flex-wrap gap-4 justify-between w-full px-2">

                        <div className="bg-white lg:w-[48%] w-full p-2 flex gap-3 lg:px-5 px-1 rounded-sm pb-3">
                            <div className="bg-slate-100 p-2 rounded-lg">
                                <PiSealCheck className="w-[40px] h-[40px] opacity-[.7]" />
                            </div>
                            <div className="w-full flex flex-col gap-1">
                                <div className="flex flex-col gap-1">
                                    <h1>Top Approving</h1>
                                    <select
                                        className={`lg:w-[100%] w-full px-4 py-1.5 bg-slate-100 outline-none rounded-3xl overflow-auto`}
                                        value={formData.is_top_approving}

                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                is_top_approving: Number(e.target.value)
                                            }))
                                        }
                                    >
                                        <option value={1}>Active</option>
                                        <option value={0}>Deactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {fields.map((
                            { icon, title, name, disable, readOnly }
                        ) => (
                            <InputCard
                                key={name}
                                icon={icon}
                                title={title}
                                name={name}
                                value={formData[name]}
                                setFormData={setFormData}
                                copy={copy}
                                disable={disable}
                                readOnly={readOnly}
                            />
                        ))}

                    </div>
                    <div className="w-full flex justify-end p-5">
                        <button
                            onClick={updateAPIFunction}
                            className="bg-customVoilet text-white rounded-md lg:w-[180px] lg:py-3 py-2 w-full hover:bg-[#533397] lg:mr-5"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Card Component
const InputCard = ({
    icon: Icon,
    title,
    value,
    name,
    setFormData,
    copy,
    disable = false,
    readOnly = false
}) => {

    return (
        <div className="bg-white lg:w-[48%] w-full p-2 flex items-center gap-3 lg:px-5 px-1 rounded-sm pb-3">
            <div className="bg-slate-100 p-2 rounded-lg">
                <Icon className="w-[40px] h-[40px] opacity-[.7]" />
            </div>
            <div className="w-full flex flex-col gap-1">
                <div className="flex justify-between">
                    <h1>{title}</h1>
                </div>
                <input
                    type="number"
                    name={name}
                    value={value}
                    onChange={(e) => handleChange(e, setFormData)}
                    disabled={disable}
                    readOnly={readOnly}
                    className={`input-no-spinner lg:w-[100%] w-full px-4 py-1 ${readOnly ? "bg-slate-200" : "bg-slate-100"} outline-none rounded-3xl overflow-auto`}
                />
            </div>
        </div>
    )
};

export default FileData;