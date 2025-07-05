import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthenticationLoader1 from "./AuthenticationLoader1";
import backgroundImg from "../../images/loginimage.jpg";
import iconAlgoTrader from '../../images/autosislogo.png'
import { MdLockOpen, MdLockOutline } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import KeyIcon from '@mui/icons-material/Key';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { ApiCall } from '../Global/GloblalFunction';
const apiUrl = process.env.REACT_APP_API_URL;

const Reset = () => {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loader, setLoader] = useState(false);
    const [validationStatus, setValidationStatus] = useState({
        otp: "",
        password: "",
        confirmPassword: ""
    });

    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validation function
    const validateField = (field, value) => {
        let error = "";
        switch (field) {
            case "password":
                if (!value.trim()) error = "Password is required";
                else if (!passwordRegex.test(value))
                    error = "Password must be 8 characters long and include uppercase, lowercase, numbers, and special characters.";
                break;
            case "otp":
                if (!value.trim()) error = "Otp is required";
                else if (value.length != 4)
                    error = "Otp must be 4 chars";
                break;
            case "confirmPassword":
                if (!value.trim()) error = "Confirm password is required";
                else if (value !== password)
                    error = "Confirm password don't match.";
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
            case "password":
                setPassword(value);
                break;
            case "otp":
                setOtp(value);
                break;
            case "confirmPassword":
                setConfirmPassword(value);
                break;
            default:
                break;
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        const errors = {
            adminId: validateField("password", password),
            password: validateField("otp", otp),
            confirmPassword: validateField("confirmPassword", confirmPassword),
        };

        if (Object.values(errors).some((error) => error)) {
            toast.error("Please complete all required fields before submitting.");
            return;
        }

        const userData = {
            password: password,
            otp: otp
        };
        resetPasswordApi(userData);
    };

    // ----- reset password api func
    const resetPasswordApi = async (userData) => {
        setLoader(true)
        try {
            const headers = { "Content-Type": "application/json" };
            const response = await ApiCall(headers, `/admin/updateForgetPassword`, 'POST', userData);

            if (response?.data) {
                setLoader(false)
                toast.success(response.data.message)
                setPassword('')
                setOtp('')
                setConfirmPassword("")
                setValidationStatus({
                    otp: "",
                    password: "",
                    confirmPassword: ""
                })
                navigate("/");
            }
        } catch (error) {
            setLoader(false)
            toast.error(error)
            setPassword('')
            setOtp("")
            setConfirmPassword("")
            setValidationStatus({
                otp: "",
                password: "",
                confirmPassword: ""
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
                ></div>
                <div className="w-[50%] h-[100vh] flex sm:items-center justify-center">
                    <div className="lg:w-[450px] md:[350px] min-h-[70vh] py-12 lg:px-10 flex flex-col gap-5">
                        <div className='mx-auto w-[150px] h-[110px]  object-cover'>
                            <img src={iconAlgoTrader} alt="algoTrader" />
                        </div>
                        <h2 className='text-[24px] font-bold text-center'>Update Password</h2>
                        <p className='text-[15px] font-medium opacity-[.6] text-center pb-3'>Enter your otp and new password</p>

                        <div className="flex flex-col gap-2 relative">
                            <KeyIcon className="absolute left-2 top-2 text-[25px] opacity-[.6]" />
                            <input
                                className={`${inputTagClass}`}
                                name="otp"
                                type="number"
                                placeholder="Enter your otp."
                                value={otp}
                                onChange={(e) => handleInputChange("otp", e.target.value)}
                            />
                            {/*  validation code */}
                            {validationStatus.otp === "success" && (
                                <FaCheckCircle className="absolute right-2 top-3 text-[18px] text-[#541aff]" />
                            )}
                            {validationStatus.otp === "error" && (
                                <span className="text-[red] text-sm">
                                    {validateField("otp", otp)}
                                </span>
                            )}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2 relative">
                            <MdLockOpen className="absolute left-2 top-2 text-2xl opacity-[.6]" />
                            <input
                                className={`${inputTagClass}`}
                                name="Password"
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Enter your new password."
                                value={password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                            />
                            <span
                                className="absolute right-4 top-3 opacity-[.7] w-[20px]"
                                onClick={() => setPasswordVisible((prev) => !prev)}
                            >
                                {passwordVisible ? <FiEye className="text-[20px]"
                                /> : < FiEyeOff className="text-[20px]" />}
                            </span>

                            {validationStatus.password === "success" && (
                                <span className="w-full flex justify-end px-2">
                                    <FaCheckCircle className="text-[#541aff] text-[18px]" />
                                </span>
                            )}
                            {validationStatus.password === "error" && (
                                <span className="text-[red] text-sm">{validateField("password", password)}</span>
                            )}
                        </div>

                        {/* Conform Password */}
                        <div className="flex flex-col gap-2 relative">
                            <MdLockOutline className="absolute left-2 top-2 text-2xl opacity-[.6]" />
                            <input
                                className={`${inputTagClass}`}
                                name="Password"
                                type={confirmPasswordVisible ? "text" : "password"}
                                placeholder="Enter Confirm Password"
                                value={confirmPassword}
                                onKeyPress={handleKeyPress}
                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            />
                            <span
                                className="absolute right-4 top-3 opacity-[.7] w-[20px]"
                                onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                            >
                                {confirmPasswordVisible ? <FiEye className="text-[20px]"
                                /> : < FiEyeOff className="text-[20px]" />}
                            </span>
                            {validationStatus.confirmPassword === "success" && (
                                <span className="w-full flex justify-end px-2">
                                    <FaCheckCircle className="text-[#541aff] text-[18px]" />
                                </span>
                            )}
                            {validationStatus.confirmPassword === "error" && (
                                <span className="text-[red] text-sm">{validateField("confirmPassword", confirmPassword)}</span>
                            )}
                        </div>

                        {/* Reset Button */}
                        <button
                            className="p-2 border rounded-md bg-[#541aff] text-[white] font-medium text-center outline-none"
                            onClick={handleSubmit}
                        >
                            {loader ? <AuthenticationLoader1 /> : "Submit"}
                        </button>
                        <div className="flex items-center justify-center flex-wrap sm:flex-nowrap gap-3">
                            <p>Do you want to login?</p>
                            <Link className=" text-[#3930bb] font-bold" to="/">Back to login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Reset;