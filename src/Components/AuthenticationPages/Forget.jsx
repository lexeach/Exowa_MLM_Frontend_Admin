import React, { useState } from 'react';
import backgroundImg from "../../images/loginimage.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthenticationLoader1 from "./AuthenticationLoader1";
import iconAlgoTrader from '../../images/autosislogo.png'
import { FaCheckCircle, FaRegUserCircle } from 'react-icons/fa';
import { ApiCall } from '../Global/GloblalFunction';

const Forget = () => {
    const navigate = useNavigate()

    const [adminId, setAdminId] = useState('');
    const [loader, setLoader] = useState(false);
    const [validationStatus, setValidationStatus] = useState({
        adminId: ""
    });

    // const adminIdRegex = /^AUTASISAdmin\d+$/;

    // Validation function
    const validateField = (field, value) => {
        let error = "";
        switch (field) {
            case "adminId":
                // if (!value.trim()) error = "Admin ID is required";
                // else if (!adminIdRegex.test(value)) error = "Invalid Admin ID format";
                // break;
                if (!value.trim()) error = "Admin ID is required";
                else if (value.length < 3) error = "Admin ID is must be 3 chars";
                break;
            default:
                break;
        }
        return error;
    };

    // Handle input change and validate
    const handleInputChange = (field, value) => {
        const error = validateField(field, value);
        setValidationStatus((prev) => ({
            ...prev,
            [field]: error ? "error" : value ? "success" : "",
        }));

        // Update state
        switch (field) {
            case "adminId":
                setAdminId(value);
                break;
            default:
                break;
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        const errors = {
            adminId: validateField("adminId", adminId),
        };

        if (Object.values(errors).some((error) => error)) {
            toast.error("Please complete all required fields before submitting.");
            return;
        }

        const userData = {
            userid: adminId,
        };
        forgetPasswordApi(userData);
    };

    const forgetPasswordApi = async (userData) => {
        setLoader(true)
        try {
            const headers = { "Content-Type": "application/json" };
            const response = await ApiCall(headers, `/admin/forgetAppPassword`, 'POST', userData);

            if (response?.data?.message) {
                setLoader(false)
                toast.success(response.data.message)
                setAdminId("");
                navigate("/reset");
            }
        } catch (error) {
            setLoader(false)
            toast.error(error)
            setAdminId("");
            setValidationStatus({
                adminId: ""
            })
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSubmit();
        }
    };

    const inputTagClass = "p-2 border border-[#928c8c] rounded-md pl-12 focus:outline outline-[.1px] outline-[#541aff] focus:border-transparent placeholder:text-[black] placeholder:opacity-[.5]";

    return (
        <>

            <div className="w-full h-100vh flex items-center justify-center" >
                {/* --------- */}
                <div
                    className="hidden sm:flex w-[50%] h-svh bg-contain bg-right bg-no-repeat  items-center justify-center"
                    style={{ backgroundImage: `url(${backgroundImg})` }}
                > </div>

                <div className="w-[50%] h-[100vh] flex sm:items-center justify-center md:py-[30px] ">
                    <div className=" lg:[50%] min-h-[70vh] py-12 md:py-[40px] lg:px-10 xl:mt-10 flex flex-col gap-5">
                        <div className='mx-auto w-[150px] h-[110px] object-cover'>
                            <img src={iconAlgoTrader} alt="AlgoTrader" />
                        </div>
                        <h2 className='text-[25px] font-bold text-center'>Forgot Password</h2>
                        <p className='text-[15px] opacity-[.6] text-center font-medium'>Enter your userId and we'll send you an otp to reset your password</p>

                        <div className="flex flex-col gap-2 relative">
                            <FaRegUserCircle className="absolute left-2 top-2 text-[25px] opacity-[.6]" />
                            <input
                                className={`${inputTagClass}`}
                                name="adminId"
                                type="text"
                                placeholder="Enter Your Registered User Id"
                                value={adminId}
                                onKeyPress={handleKeyPress}
                                onChange={(e) => handleInputChange("adminId", e.target.value)}
                            />
                            {/*  validation code */}
                            {validationStatus.adminId === "success" && (
                                <FaCheckCircle className="absolute right-2 top-3 text-[18px] text-[#541aff]" />
                            )}
                            {validationStatus.adminId === "error" && (
                                <span className="text-[red] text-sm">
                                    {validateField("adminId", adminId)}
                                </span>
                            )}
                        </div>

                        {/* Forget Button */}
                        <button
                            className="p-2 border rounded-md bg-[#541aff] text-[white] font-medium text-center outline-none"
                            onClick={handleSubmit}
                        >
                            {loader ? <AuthenticationLoader1 /> : "Submit"}
                        </button>

                        <div className="flex items-center justify-center flex-wrap sm:flex-nowrap gap-3">
                            <p>Do you want to login?</p>
                            <Link className=" text-[#3930bb] font-bold" to="/signup">Back to login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Forget