import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoCopy } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import img from "../../images/user-avatar-icon-removebg-preview.png";
import { FaUsers } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { MdDoneAll } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { updateEmailState, updatePhoneState, updateUserBlockedState, updateUserQualifyState } from "../../Redux/ReduxSlice";
import { ApiCall, formatDateTimenumber } from "../Global/GloblalFunction";
import { AiOutlineInfoCircle } from "react-icons/ai";
const UserInformation = () => {
  const { userData, token } = useSelector((state) => state);
  const [emailEditable, setemailEditable] = useState(false);
  const [emailChange, setemailChange] = useState(false);
  const [email, setemail] = useState(userData.user_email);
  const [phoneEditable, setphoneEditable] = useState(false);
  const [phoneChange, setphoneChange] = useState(false);
  const [phone, setphone] = useState(userData.mobile_no);
  const [selfie, setselfie] = useState("");
  const imageUrl = process.env.REACT_APP_IMAGE_URL;
  const dispatch = useDispatch()

  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("copied.");
    });
  };
  const formattedAmount = Number(userData?.income || 0).toFixed(2);
  const formatereward = Number(userData?.reward || 0).toFixed(2);

  const handleToggleBlockStatus = async (status, userid) => {
    userBlockStatusChangeApi(status, userid)
  };

  const handleToggleQualifiedStatus = async (userid) => {
    userQualifiedStatusChangeApi(userid)
  };

  // block status change api func
  const userQualifiedStatusChangeApi = async (userid) => {
    try {
      const data = {
        userid
      }

      const headers = {
        "x-access-token": token,
        "Content-Type": "application/json"
      }
      const response = await ApiCall(headers, `/admin/qualify_user`, 'POST', data);

      if (response.data) {
        toast.success(response.data.message)
        dispatch(updateUserQualifyState({ userid: userid, qualify: 1 }))
      }
    } catch (error) {
      toast.error(error);
    }
  }

  // block status change api func
  const userBlockStatusChangeApi = async (status, userid) => {
    try {

      const data = {
        userid,
        status
      }

      const headers = {
        "x-access-token": token,
        "Content-Type": "application/json"
      }
      const response = await ApiCall(headers, `/admin/user_block`, 'POST', data);

      if (response.data) {
        toast.success(response.data.message)
        dispatch(updateUserBlockedState({ userid: userid, block: status }))
      }
    } catch (error) {
      toast.error(error);
    }
  }

  const userselfie = userData?.selfie;

  const handleEmailChange = (e) => {
    setemail(e.target.value);
    setemailChange(true);
  }
  const handlePhoneChange = (e) => {
    setphone(e.target.value);
    setphoneChange(true);
  }

  const handleUpdateEmail = async () => {
    try {
      const data = {
        email: email,
        userid: userData.userid
      }
      const headers = {
        "x-access-token": token,
        "Content-Type": "application/json"
      }
      const response = await ApiCall(headers, `/admin/update_users`, 'POST', data);
      if (response.data) {
        toast.success(response.data.message);
        dispatch(updateEmailState(email))
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setemailEditable(false);
      setemailChange(false);
    }
  }

  const handleUpdatePhone = async () => {
    try {
      const data = {
        phoneno: phone,
        userid: userData.userid
      }
      const headers = {
        "x-access-token": token,
        "Content-Type": "application/json"
      }
      const response = await ApiCall(headers, `/admin/update_users`, 'POST', data);
      if (response.data) {
        toast.success(response.data.message);
        dispatch(updatePhoneState(phone))
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setphoneEditable(false);
      setphoneChange(false);
    }
  }

  useEffect(() => {
    if (userselfie === "https://") {
      setselfie(img);
    } else {
      setselfie(`${imageUrl}/${userData?.selfie}`);
    }
  }, []);

  console.log(userData, "----")

  return (
    <>
      <div className=" overflow-auto h-[calc(100vh-83px)]">

        <div className="w-full bg-slate-50 font-bold px-8 py-4 rounded-md ">
          <h1>User Information</h1>
        </div>
        <div className="w-full max-h-[500px ] overflow-auto">

          <div className="lg:w-[80%] w-full m-auto relative flex  justify-center  items-center lg:mt-3 mt-10">
            <div className="">
              <div className="w-full lg:pl-4 pl-9">
                <img
                  src={selfie}
                  alt="image"
                  className="w-[100px] h-[100px]  lg:w-[130px] lg:h-[130px] rounded-full border p-[.01rem] border-slate-500"
                />
              </div>
              <div className="">
                <h1 className="flex flex-col gap-1 items-center ">
                  <span className="uppercase">

                    {userData?.user_name}
                  </span>
                  <span className="flex  gap-1 items-center ">
                    {userData.userid}
                    <GoCopy
                      className="text-blue-800 font-extrabold"
                      onClick={() => copy(userData?.userid)}
                    />
                  </span>
                </h1>
              </div>
            </div>
          </div>
          <div className="bg-slate-100 gap-2 lg:w-[80%] w-full m-auto lg:-mt-[6rem] -mt-[5rem] rounded-md lg:pt-[7rem] pt-[6rem] flex flex-wrap justify-between lg:px-5 px-2 py-10">
            <div className="lg:w-[48%]  flex flex-col gap-3 lg:gap-4  w-full  rounded-md lg:p-5 p-2 ">
              <p className="p-2 px-5 rounded-md bg-white relative">
                <span className="font-bold"> Email:</span>
                <input
                  className={`pl-2 outline-none rounded-md ${emailEditable ? 'bg-slate-200' : ""}`}
                  type="text"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={emailEditable === false}
                />
                {
                  <div className="absolute top-2 right-2.5 cursor-pointer">
                    {
                      emailChange ?
                        <button className="p-1 bg-green-500 rounded-md text-xs text-white font-bold hover:scale-105 active:scale-90 duration-200 ease-out"
                          onClick={handleUpdateEmail}
                        >
                          Update
                        </button>
                        :
                        <span
                          onClick={() => setemailEditable(true)}
                        >
                          <TbEdit size={20} />
                        </span>
                    }
                  </div>
                }
              </p>
              <p className="p-2 px-5 rounded-md bg-white relative">
                <span className="font-bold"> Mobile No:</span>
                <span className="ml-2">
                  <span className="pr-1 text-blue-900 font-bold">
                    {userData?.country_code}
                  </span>
                  {/* {userData?.mobile_no} */}
                  <input
                    className={`pl-2 outline-none rounded-md ${phoneEditable ? 'bg-slate-200' : ""}`}
                    type="text"
                    value={phone}
                    onChange={handlePhoneChange}
                    disabled={phoneEditable === false}
                  />
                  {
                    <div className="absolute top-2 right-2.5 cursor-pointer">
                      {
                        phoneChange ?
                          <button className="p-1 bg-green-500 rounded-md text-xs text-white font-bold hover:scale-105 active:scale-90 duration-200 ease-out"
                            onClick={handleUpdatePhone}
                          >
                            Update
                          </button>
                          :
                          <span
                            onClick={() => setphoneEditable(true)}
                          >
                            <TbEdit size={20} />
                          </span>
                      }
                    </div>
                  }
                </span>
              </p>

              <p className="p-2 px-5 rounded-md bg-white flex justify-between items-center">
                <div>
                  <span className="font-bold"> Status:</span>
                  <span
                    className={`ml-2 font-bold ${userData?.status === 1 ? "text-green-500" : userData?.status === 2 ? "text-red-500" : "text-orange-500"
                      }`}
                  >
                    {userData?.status === 1 ? "Approved" : userData?.status === 2 ? "Reject" : "Pending"}
                  </span>
                </div>
                <span>
                  {userData?.status === 1 ? (
                    <MdDoneAll className="text-green-500 font-bold" />
                  ) : userData?.status === 2 ? (
                    <IoMdClose className="text-red-500 font-bold" />
                  ) : (
                    <AiOutlineInfoCircle className="text-orange-500 font-bold" />
                  )}
                </span>
              </p>
              {/* terbo */}
              <p className="p-2 px-5 rounded-md bg-white flex justify-between items-center">
                <div>
                  <span className="font-bold">Turbo:</span>
                  <span
                    className={`ml-2 font-bold ${userData?.is_turbo === 1 ? "text-green-500" : userData?.is_turbo === 0 ? "text-red-500" : ""
                      }`}
                  >
                    {userData?.is_turbo === 1 ? "Active" : userData?.is_turbo === 0 ? "Deactive" : ""}
                  </span>
                </div>
                <span>
                  {userData?.is_turbo === 1 ? (
                    <MdDoneAll className="text-green-500 font-bold" />
                  ) : userData?.is_turbo === 0 ? (
                    <IoMdClose className="text-red-500 font-bold" />
                  ) : (
                    <AiOutlineInfoCircle className="text-orange-500 font-bold" />
                  )}
                </span>
              </p>
              {/* partner */}
              <p className="p-2 px-5 rounded-md bg-white flex justify-between items-center">
                <div>
                  <span className="font-bold"> Partner:</span>
                  <span
                    className={`ml-2 font-bold ${userData?.is_partner === 0 ? "text-red-500" : "text-green-500"
                      }`}
                  >
                    {userData?.is_partner === 0 ? "Not Available" : "Available"}
                  </span>
                </div>
                <span>
                  {userData?.is_partner === 0 ? (
                    <IoMdClose className="text-red-500 font-bold" />
                  ) : (
                    <MdDoneAll className="text-green-500 font-bold" />
                  )}
                </span>
              </p>
              <p className="p-2 px-5 rounded-md bg-white ">
                <span className="font-bold"> Date:</span>
                <span className="ml-2"> {formatDateTimenumber(userData?.registration_date)}</span>
              </p>
              <p className="p-2 px-5 rounded-md bg-white ">
                <span className="font-bold">Address:</span>
                <span className="ml-2 ">
                  {userData?.user_address}
                </span>
              </p>
              <p className="p-2 px-5 rounded-md bg-white ">
                <span className="font-bold">State:</span>
                <span className="ml-2 ">
                  {userData?.user_state}
                </span>
              </p>
              <p className="p-2 px-5 rounded-md bg-white ">
                <span className="font-bold">District:</span>
                <span className="ml-2 ">
                  {userData?.user_district}
                </span>
              </p>
              <p className="p-2 px-5 rounded-md bg-white ">
                <span className="font-bold">Pin Code:</span>
                <span className="ml-2">
                  {userData?.user_pincode}
                </span>

              </p>
            </div>
            <div className="lg:w-[48%] w-full flex flex-col gap-3 lg:gap-4  w-md  rounded-md lg:p-5 p-2 ">
              <p className="p-2 px-5 rounded-md bg-white ">
                <span className="font-bold"> Refferal code:</span>
                <span className="ml-2 text-blue-900 font-bold">
                  {userData?.reffereral_code}
                </span>
              </p>
              <p className="p-2 px-5 rounded-md bg-white ">
                <span className="font-bold">Coreferrer Code:</span>
                <span className="ml-2">{userData?.coreferrer_code}</span>
              </p>
              <p className="p-2 px-5 rounded-md bg-white ">
                <span className="font-bold"> Level:</span>
                <span className="ml-2"> {userData?.user_level}</span>
              </p>
              <p className="p-2 px-5 rounded-md bg-white ">
                <span className="font-bold"> Income:</span>
                <span className="ml-2">{formattedAmount}</span>
              </p>
              <p className="p-2 px-5 rounded-md bg-white ">
                <span className="font-bold">Reward:</span>
                <span className="ml-2"> {formatereward}</span>
              </p>
              <p className="p-2 px-5 rounded-md bg-white ">
                <span className="font-bold">Attempt:</span>
                <span className="ml-2"> {userData?.attempt}</span>
              </p>
              <div className="p-2 px-5  flex flex-wrap  justify-between items-center rounded-md bg-white ">

                <p className="p-2 flex items-center justify-between rounded-md gap-10">
                  <span className="font-bold">Qualified :</span>
                  <span className="">
                    <label className="label">
                      <div className="toggle">
                        <input
                          type="checkbox"
                          className="toggle-state"
                          name="check"
                          value="check"
                          checked={userData.is_qualified == 1 ? true : false}
                          disabled={userData.is_qualified == 1}
                          onChange={() => handleToggleQualifiedStatus(userData.userid)}
                        />
                        <div className="indicator"></div>
                      </div>
                    </label>
                  </span>
                </p>

                <p className="p-2 flex items-center justify-between rounded-md gap-10">
                  <span className="font-bold">Block:</span>
                  <span className="">
                    <label className="label">
                      <div className="toggle">
                        <input
                          type="checkbox"
                          className="toggle-state"
                          name="check"
                          value="check"
                          checked={userData.block == 1 ? true : false}
                          onChange={() => handleToggleBlockStatus(userData.block == 1 ? 0 : 1, userData.userid)}
                        />
                        <div className="indicator"></div>
                      </div>
                    </label>
                  </span>
                </p>

              </div>

              <div className="p-2 lg:px-5  gap-3 flex flex-wrap  justify-between  rounded-md ">
                <div className="lg:w-[45%] w-full flex  bg-white p-1 rounded-md pb-2 py-3">
                  <div className="h-full  bg-[#541aff] w-1 rounded-full"></div>
                  <div className="w-full ">
                    <h1 className="flex justify-between items-center px-2">
                      <span>Referred Users</span>
                      <span>
                        <FaUsers />
                      </span>
                    </h1>
                    <div className="w-full flex justify-center my-2">
                      <p className="w-[40px] h-[40px] bg-slate-100 rounded-full flex justify-center items-center">
                        {userData?.referred_users}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="lg:w-[45%] w-full flex  bg-white p-1 rounded-md pb-2 py-3">
                  <div className="h-full  bg-[#38e628] w-1 rounded-full"></div>
                  <div className="w-full ">
                    <h1 className="flex justify-between items-center px-2">
                      <span>Coreferred Users</span>
                      <span>
                        <FaUsers />
                      </span>
                    </h1>
                    <div className="w-full flex justify-center my-2">
                      <p className="w-[40px] h-[40px] bg-slate-100 rounded-full flex justify-center items-center">
                        {userData.coreferred_users}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInformation;
