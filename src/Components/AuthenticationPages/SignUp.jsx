import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import backgroundImg from "../../images/loginimage.jpg";
import iconAlgoTrader from '../../images/autosislogo.png'
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { FaCheckCircle, FaRegUserCircle, } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Loader1 from "./AuthenticationLoader1";
import { adminId } from "../../Redux/ReduxSlice";
import { useDispatch } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ApiCall } from "../Global/GloblalFunction";

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State variables
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminRole, setAdminRole] = useState("--- Select Admin Role ---");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loader, setLoader] = useState(false);
    const [validationStatus, setValidationStatus] = useState({
        name: "",
        email: "",
        password: "",
        adminRole: "",
    });

    const apiUrl = process.env.REACT_APP_API_URL;

    // Regex patterns for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validation function
    const validateField = (field, value) => {
        let error = "";
        switch (field) {
            case "name":
                if (!value.trim()) error = "Name is required";
                else if (value.length < 4) error = "Name must be at least 4 characters";
                break;
            case "email":
                if (!value.trim()) error = "Email is required";
                else if (!emailRegex.test(value)) error = "Invalid email format";
                break;
            case "password":
                if (!value.trim()) error = "Password is required";
                else if (!passwordRegex.test(value))
                    error = "Password must be 8 characters long and include uppercase, lowercase, numbers, and special characters.";
                break;
            case "adminRole":
                if (!value.trim()) error = "Admin role is required";
                else if (!["support", "team", "Team"].includes(value)) error = "Invalid admin role";
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
            case "name":
                setName(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "adminRole":
                setAdminRole(value);
                break;
            default:
                break;
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        const errors = {
            name: validateField("name", name),
            email: validateField("email", email),
            password: validateField("password", password),
            adminRole: validateField("adminRole", adminRole),
        };

        if (Object.values(errors).some((error) => error)) {
            toast.error("Please complete all required fields before submitting.");
            return;
        }

        const userData = {
            fullname: name,
            email: email,
            password: password,
            role: adminRole,
        };

        signUpApi(userData);
    };

    // Signup API call
    const signUpApi = async (userData) => {
        setLoader(true);
        try {
            const headers = { "Content-Type": "application/json" };
            const response = await ApiCall(headers, `/admin/register`, 'POST', userData);

            if (response.data) {
                dispatch(adminId(response.data.data));
                setLoader(false);

                setName("");
                setEmail("");
                setPassword("");
                setAdminRole("--- Select Admin Role ---")
                setValidationStatus({
                    name: "",
                    email: "",
                    password: "",
                    adminRole: "",
                })
                toast.success(response.data.message);
                navigate("/");
            }
        } catch (error) {
            setLoader(false);
            setName("");
            setEmail("");
            setPassword("");
            setAdminRole("--- Select Admin Role ---");
            setValidationStatus({
                name: "",
                email: "",
                password: "",
                adminRole: "",
            })
            toast.error(error);
        }
    };

    const roleArray = ["--- Select Admin Role ---", "Team", "support"];

    const inputTagClass = "p-2 border border-[#928c8c] rounded-md pl-12 focus:outline outline-[.1px] outline-[#541aff] focus:border-transparent placeholder:text-[black] placeholder:opacity-[.5]";

    const selectTagClass = "bg-white py-2 px-11 border border-[#181818] rounded-md focus:outline outline-[.1px] outline-[#541aff] focus:border-transparent capitalize appearance-none "

    return (
        <>
            <div className="w-full h-100vh flex items-center justify-center" >
                {/* --------- */}
                <div
                    className=" w-[50%] hidden sm:flex h-svh bg-contain bg-right bg-no-repeat  items-center justify-center"
                    style={{ backgroundImage: `url(${backgroundImg})` }}
                > </div>
                {/* -------- */}
                <div className="w-[50%] h-[100vh] flex xl:items-center justify-center md:py-[30px] ">
                    <div className="lg:w-[450px] md:[350px] min-h-[70vh] py-12 lg:px-10 flex flex-col gap-5">
                        <div className='mx-auto w-[150px] h-[110px]  object-cover'>
                            <img src={iconAlgoTrader} alt="algoTrader" />
                        </div>
                        <h2 className="text-center text-[25px] font-bold">Create your account</h2>

                        {/* Name */}
                        <div className="flex flex-col gap-2 relative">
                            <PersonOutlineOutlinedIcon className="absolute left-2 top-2 text-5xl opacity-[.6]" />
                            <input
                                className={`${inputTagClass}`}
                                name="name"
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                            />
                            {validationStatus.name === "success" && (
                                <FaCheckCircle className="absolute right-2 top-3 text-[18px] text-[#541aff]" />
                            )}
                            {validationStatus.name === "error" && (
                                <span className="text-[red] text-sm">{validateField("name", name)}</span>
                            )}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2 relative">
                            <MailOutlineIcon className="absolute left-2 top-2 text-5xl opacity-[.6]" />
                            <input
                                className={`${inputTagClass}`}
                                name="email"
                                type="text"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                            />
                            {validationStatus.email === "success" && (
                                <FaCheckCircle className="absolute right-2 top-3 text-[18px] text-[#541aff]" />
                            )}
                            {validationStatus.email === "error" && (
                                <span className="text-[red] text-sm">{validateField("email", email)}</span>
                            )}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2 relative">
                            <LockOpenIcon className="absolute left-2 top-2 text-5xl opacity-[.6]" />
                            <input
                                className={`${inputTagClass}`}
                                name="Password"
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Password"
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

                        {/* role */}
                        <div className="flex flex-col gap-2 relative">

                            <select
                                className={`${selectTagClass} ${adminRole == "Team" || adminRole == "support" ? "text-black" : "text-[black] opacity-[.5]"
                                    }`}
                                value={adminRole}
                                onChange={(e) => setAdminRole(e.target.value)}
                            >
                                {roleArray.map((role, index) => (
                                    <option
                                        key={index}
                                        selected={index == 0}
                                        disabled={index == 0}
                                        value={role}
                                        className={`rounded-md capitalize ${index === 0 ? "text-[black] opacity-[.5]" : "text-black"}`}
                                    >
                                        {
                                            role
                                        }
                                    </option>
                                ))}
                            </select>
                            <IoIosArrowDown className={`absolute top-3.5 right-3  ${adminRole == "Team" || adminRole == "support" ? "text-[black]" : "text-[#a19f9f"}`} />
                            <FaRegUserCircle className="absolute left-2 top-2 text-[25px] opacity-[.6]" />
                            {validationStatus.adminRole === "success" && (
                                <FaCheckCircle className="text-[#541aff] text-[18px]" />
                            )}
                            {validationStatus.adminRole === "error" && (
                                <span className="text-[red] text-sm">
                                    {validateField("adminRole", adminRole)}
                                </span>
                            )}
                        </div>

                        <button
                            className="p-2 border rounded-md bg-[#541aff] text-[white] font-medium text-center outline-none"
                            onClick={handleSubmit}
                        >
                            {loader ? <Loader1 /> : "SignUp"}
                        </button>

                        <div className="flex justify-center gap-3">
                            <p >If you have an account</p>
                            <Link to="/" className=" text-[#3930bb] font-bold">Login</Link>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default SignUp;
