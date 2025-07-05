import React, { useEffect, useState } from "react";
import backgroundImg from "../../images/loginimage.jpg";
import iconAutasis from '../../images/autosislogo.png';
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AuthenticationLoader1 from "./AuthenticationLoader1";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaRegUserCircle, FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { adminDetailsData, tokenData } from "../../Redux/ReduxSlice";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ApiCall } from "../Global/GloblalFunction";

const Login = () => {

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [validationStatus, setValidationStatus] = useState({
    adminId: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { adminId: adminIdDetails, token, adminDetails } = useSelector((state) => state);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Validation function
  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "adminId":
        if (!value.trim()) error = "Admin ID is required";
        else if (value.length < 3) error = "Admin ID is must be 3 chars";
        break;
      case "password":
        if (!value.trim()) error = "Password is required";
        else if (!passwordRegex.test(value))
          error =
            "Password must be 8 characters long and include uppercase, lowercase, numbers, and special characters.";
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
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    const errors = {
      adminId: validateField("adminId", adminId),
      password: validateField("password", password),
    };

    if (Object.values(errors).some((error) => error)) {
      toast.error("Please complete all required fields before submitting.");
      return;
    }

    const userData = {
      userid: adminId,
      admin_password: password,
    };
    LoginAPI(userData);
  };

  // Login API call
  const LoginAPI = async (userData) => {
    setLoader(true);
    try {
      const headers = { "Content-Type": "application/json" };
      const response = await ApiCall(headers, `/admin/login`, 'POST', userData);
      if (response) {
        // Save token in redux
        dispatch(tokenData(response.data.result.token));

        setTimeout(async () => {
          const adminDetailsObj = {
            adminName: response.data.result.user.admin_name,
            adminRole: response.data.result.user.admin_role,
            adminStatus: response.data.result.user.status,
            pageAccess: response.data.result.routes
          };

          // Save admin details in redux
          dispatch(adminDetailsData(adminDetailsObj));

          setLoader(false);
          setAdminId("");
          setPassword("");
          const adminRole = response.data?.result?.user?.admin_role;
          console.log(adminRole, "adminRole")

          if (adminRole === "support" || adminRole === "Team") {

            const routesArray = response?.data?.result?.routes

            if (routesArray.length < 1) {
              toast.error("You are not assigned any pages by admin.")
              setValidationStatus({
                adminId: "",
                password: "",
              })
              setAdminId("");
              setPassword("");
            }

            const route = response?.data?.result?.routes[0]?.routes_path
            navigate(route);
          } else {
            navigate("/dashboard");
          }
        }, 1000);
      }
    } catch (error) {
      console.log(error, "error0000")
      setLoader(false);
      toast.error(error);
      setValidationStatus({
        adminId: "",
        password: "",
      })
      setAdminId("");
      setPassword("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (adminIdDetails) {
      setAdminId(adminIdDetails);
    }
  }, [adminIdDetails]);

  useEffect(() => {

    if (token) {
      const adminRole = adminDetails?.adminRole === "admin"
        ||
        adminDetails?.adminRole === "Team"
        ||
        adminDetails?.adminRole === "team";

      if (adminRole) {
        navigate("/Dashboard")
      }

      if (adminDetails?.adminRole === "support") {
        const supportAdminPage =
          adminDetails?.pageAccess?.length > 0
            ?
            adminDetails.pageAccess[0].routes_path : 'Users';
        navigate(supportAdminPage)
      }
    } else {
      navigate("/")
    }

  }, [])

  const inputTagClass = "p-2 border border-[#928c8c] rounded-md pl-12 focus:outline outline-[.1px] outline-[#541aff] focus:border-transparent placeholder:text-[black] placeholder:opacity-[.5]";

  return (
    <>
      <div className="w-full h-100vh flex items-center justify-center" >
        {/* --------- */}
        <div
          className="hidden sm:flex w-[50%] h-svh bg-contain bg-right bg-no-repeat  items-center justify-center"
          style={{ backgroundImage: `url(${backgroundImg})` }}
        ></div>
        {/* -------- */}
        <div className="w-[50%] h-[100vh] flex sm:items-center justify-center">
          <div className="lg:w-[450px] md:[350px] min-h-[70vh] py-12 lg:px-10 flex flex-col gap-5">
            <div className='mx-auto  w-[100px] sm:w-[150px] h-[80px] sm:h-[110px] object-cover'>
              <img src={iconAutasis} alt="Autasis" />
            </div>
            <h2 className="text-center text-[20px] sm:text-[25px] font-semibold">Login to Your Account</h2>
            <p className='text-[15px] opacity-[.6] text-center font-medium'>Please enter your Details</p>

            {/* Admin ID */}
            <div className="flex flex-col gap-2 relative ">
              <FaRegUserCircle className="absolute left-2 top-2 text-[25px] opacity-[.6]" />
              <input
                className={`${inputTagClass} `}
                name="adminId"
                type="text"
                placeholder="User Id"
                value={adminId}
                onChange={(e) => handleInputChange("adminId", e.target.value)}
              />

              {validationStatus.adminId === "success" && (
                <FaCheckCircle className="absolute right-2 top-3 text-[18px] text-[#541aff]" />
              )}
              {validationStatus.adminId === "error" && (
                <span className="text-[red] text-sm">
                  {validateField("adminId", adminId)}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2 relative">
              <input
                className={`${inputTagClass}`}
                name="Password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <LockOpenIcon className="absolute left-2 top-2 text-[31px] opacity-[.6]" />
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
                <span className="text-[red] text-sm">
                  {validateField("password", password)}
                </span>
              )}
            </div>

            <span className="text-end font-medium">
              <Link to="/forget"> Forgot password ?</Link>
            </span>

            {/* Login Button */}
            <button
              className="p-2 border rounded-md bg-[#541aff] text-[white] font-medium text-center outline-none"
              onClick={handleSubmit}
            >
              {loader ? <AuthenticationLoader1 /> : "Login"}
            </button>

            {/* Sign Up Link */}
            <div className="flex items-center justify-center flex-wrap sm:flex-nowrap gap-3">
              <p>No Registered Yet?</p>
              <Link className=" text-[#3930bb] font-bold" to="/signup">Create an account</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;