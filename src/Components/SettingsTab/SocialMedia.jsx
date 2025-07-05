
import React, { useState, useEffect } from "react";
import { FaFacebook } from "react-icons/fa6";
import { FaSlackHash } from "react-icons/fa";
import { GoCopy } from "react-icons/go";
import toast from "react-hot-toast";
import axios from "axios";
import { FaYoutube } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";
import { LuMail } from "react-icons/lu";
import { FaTelegram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { emptyEntireRedux } from "../../Redux/ReduxSlice";
import { useNavigate } from "react-router-dom";
import { ApiCall } from "../Global/GloblalFunction";

const SocialMedia = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setformData] = useState({
    email: "",
    mobile: "",
    whatsAppNo: "",
    telegramChannel: "",
    whatsAppChannel: "",
    linkedIn: "",
    facebook: "",
    whatsAppChannel: "",
    instagram: "",
    youTube: "",
    Twitter: "",
  });
  //---------
  const { token } = useSelector((state) => state);

  const apiUrl = process.env.REACT_APP_API_URL;
  const updateAPIFunction = async () => {
    try {

      const headers = {
        "x-access-token": token,
        "Content-Type": "application/json",
      }

      const data = {
        support_email: formData.email,
        mobile_no: formData.mobile,
        whatsapp_no: formData.whatsAppNo,
        telegram_channel: formData.telegramChannel,
        whatsapp_channel: formData.whatsAppChannel,
        linkedin: formData.linkedIn,
        facebook: formData.facebook,
        twitter: formData.Twitter,
        instagram: formData.instagram,
        youtube: formData.youTube,
      };

      const response = await ApiCall(headers, `/admin/update_social_media`, 'POST', data);

      if (response.data) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "An error occured"
      );
    }
  };
  //-------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData({
      ...formData,
      [name]: value,
    });
  };
  //-------------
  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("copied.");
    });
  };
  //--------------
  const handleUpdate = () => {
    updateAPIFunction();
  };
  // -------------------
  useEffect(() => {
    axios
      .get(`${apiUrl}/website/social_media`)
      .then((response) => {
        const data = response?.data?.result[0];
        if (data) {
          setformData({
            email: data.support_email || "",
            mobile: data.mobile_no || "",
            whatsAppNo: data.whatsapp_no || "",
            telegramChannel: data.telegram_channel || "",
            whatsAppChannel: data.whatsapp_channel || "",
            linkedIn: data.linkedin || "",
            facebook: data.facebook || "",
            instagram: data.instagram || "",
            youTube: data.youtube || "",
            Twitter: data.twitter || "",
          });
        }
      })
      .catch((error) => {
        if (error.message == "Invalid Token") {
          dispatch(emptyEntireRedux())
          navigate("/")
        }
        console.error("Error fetching data:", error)
      }
      );
  }, []);

  return (
    <>
      <div className="w-full p-2">
        <div className="w-full p-2">
          <div className="w-full p-1">
            <h2 className="t text-[18px] px-5 py-3 w-full flex items-center gap-1 bg-slate-100 rounded-md">
              <span>
                <FaSlackHash className="text-2xl" />
              </span>
              Update Social-Media
            </h2>
          </div>
          <div className="w-full flex flex-col lg:gap-7 gap-2 p-2-16 lg:p-5 bg-slate-100 rounded-md pt-3 mt-5">
            {/* ----- */}
            <div className="flex flex-wrap gap-2 justify-between w-full px-2 m-auto mt-6">
              {/* first box */}
              <div className="bg-white lg:w-[48%] w-full p-2 flex items-center lg:gap-5 gap-3 lg:px-5 px-1 rounded-sm pb-3">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <MdLocalPhone className="w-[40px] h-[40px] opacity-[.7]" />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <div className="flex justify-between">
                    <div>
                      <h1>Mobile</h1>
                    </div>
                    <div className="flex gap-2">
                      <GoCopy
                        className="text-[#767676] font-extrabold"
                        onClick={() => copy(formData.mobile)}
                      />
                      <FaLink className="text-[#767676]" />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="lg:w-[90%] w-full px-4 py-1 bg-slate-100 outline-none rounded-3xl overflow-auto"
                    />
                  </div>
                </div>
              </div>
              {/* secend box S*/}
              <div className="bg-white lg:w-[48%] w-full p-2 flex items-center lg:gap-5 gap-3 lg:px-5 px-1 rounded-sm pb-3">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <FaWhatsapp className="w-[40px] h-[40px] opacity-[.7]" />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <div className="flex justify-between">
                    <div>
                      <h1>WhatsApp No</h1>
                    </div>
                    <div className="flex gap-2">
                      <GoCopy
                        className="text-[#767676] font-extrabold"
                        onClick={() => copy(formData.whatsAppNo)}
                      />
                      <FaLink className="text-[#767676]" />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.whatsAppNo}
                      onChange={handleChange}
                      className="lg:w-[90%] w-full px-4 py-1 bg-slate-100 outline-none rounded-3xl overflow-auto"
                    />
                  </div>
                </div>
              </div>
              {/* secend box  e*/}
            </div>
            {/* ----- */}

            {/* ----- */}
            <div className="flex flex-wrap gap-2 justify-between w-full px-2 m-auto">
              {/* first box */}
              <div className="bg-white lg:w-[48%] w-full p-2 flex items-center lg:gap-5 gap-3 lg:px-5 px-1 rounded-sm pb-3">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <FaInstagram className="w-[40px] h-[40px] opacity-[.7]" />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <div className="flex justify-between">
                    <div>
                      <h1>Instagram</h1>
                    </div>
                    <div className="flex gap-2">
                      <GoCopy
                        className="text-[#767676] font-extrabold"
                        onClick={() => copy(formData.instagram)}
                      />
                      <a href={formData.instagram} target="_blank">
                        <FaLink className="text-[#767676]" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="lg:w-[90%] w-full px-4 py-1 bg-slate-100 outline-none rounded-3xl overflow-auto"
                    />
                  </div>
                </div>
              </div>
              {/* secend box S*/}
              <div className="bg-white lg:w-[48%] w-full p-2 flex items-center lg:gap-5 gap-3 lg:px-5 px-1 rounded-sm pb-3">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <FaFacebook className="w-[40px] h-[40px] opacity-[.7]" />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <div className="flex justify-between">
                    <div>
                      <h1>Facebook</h1>
                    </div>
                    <div className="flex gap-2">
                      <GoCopy
                        className="text-[#767676] font-extrabold"
                        onClick={() => copy(formData.mobile)}
                      />
                      <a href={formData.facebook} target="_blank">
                        <FaLink className="text-[#767676]" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="lg:w-[90%] w-full px-4 py-1 bg-slate-100 outline-none rounded-3xl overflow-auto"
                    />
                  </div>
                </div>
              </div>
              {/* secend box  e*/}
            </div>
            {/* ----- */}
            {/* ----- */}
            <div className="flex flex-wrap gap-2 justify-between w-full px-2 m-auto">
              {/* first box */}
              <div className="bg-white lg:w-[48%] w-full p-2 flex items-center lg:gap-5 gap-3 lg:px-5 px-1 rounded-sm pb-3">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <FaYoutube className="w-[40px] h-[40px] opacity-[.7]" />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <div className="flex justify-between">
                    <div>
                      <h1>YouTube</h1>
                    </div>
                    <div className="flex gap-2">
                      <GoCopy
                        className="text-[#767676] font-extrabold"
                        onClick={() => copy(formData.youTube)}
                      />
                      <a href={formData.youTube} target="_blank">
                        <FaLink className="text-[#767676]" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="youTube"
                      value={formData.youTube}
                      onChange={handleChange}
                      className="lg:w-[90%] w-full px-4 py-1 bg-slate-100 outline-none rounded-3xl overflow-auto"
                    />
                  </div>
                </div>
              </div>
              {/* secend box S*/}
              <div className="bg-white lg:w-[48%] w-full p-2 flex items-center lg:gap-5 gap-3 lg:px-5 px-1 rounded-sm pb-3">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <IoLogoLinkedin className="w-[40px] h-[40px] opacity-[.7]" />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <div className="flex justify-between">
                    <div>
                      <h1>LinkedIn</h1>
                    </div>
                    <div className="flex gap-2">
                      <GoCopy
                        className="text-[#767676] font-extrabold"
                        onClick={() => copy(formData.linkedIn)}
                      />
                      <a href={formData.youTube} target="_blank">
                        <FaLink className="text-[#767676]" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleChange}
                      className="lg:w-[90%] w-full px-4 py-1 bg-slate-100 outline-none rounded-3xl overflow-auto"
                    />
                  </div>
                </div>
              </div>
              {/* secend box  e*/}
            </div>
            {/* ----- */}
            {/* ----- */}
            <div className="flex flex-wrap gap-2 justify-between w-full px-2 m-auto">
              {/* first box */}
              <div className="bg-white lg:w-[48%] w-full p-2 flex items-center lg:gap-5 gap-3 lg:px-5 px-1 rounded-sm pb-3">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <FaTelegram className="w-[40px] h-[40px] opacity-[.7]" />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <div className="flex justify-between">
                    <div>
                      <h1>Telegram Channel</h1>
                    </div>
                    <div className="flex gap-2">
                      <GoCopy
                        className="text-[#767676] font-extrabold"
                        onClick={() => copy(formData.telegramChannel)}
                      />
                      <a href={formData.telegramChannel} target="_blank">
                        <FaLink className="text-[#767676]" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="telegramChannel"
                      value={formData.telegramChannel}
                      onChange={handleChange}
                      className="lg:w-[90%] w-full px-4 py-1 bg-slate-100 outline-none rounded-3xl overflow-auto"
                    />
                  </div>
                </div>
              </div>
              {/* secend box S*/}
              <div className="bg-white lg:w-[48%] w-full p-2 flex items-center lg:gap-5 gap-3 lg:px-5 px-1 rounded-sm pb-3">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <FaWhatsapp className="w-[40px] h-[40px] opacity-[.7]" />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <div className="flex justify-between">
                    <div>
                      <h1>WhatsApp Channel</h1>
                    </div>
                    <div className="flex gap-2">
                      <GoCopy
                        className="text-[#767676] font-extrabold"
                        onClick={() => copy(formData.whatsAppChannel)}
                      />
                      <a href={formData.whatsAppChannel} target="_blank">
                        <FaLink className="text-[#767676]" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="whatsAppChannel"
                      value={formData.whatsAppChannel}
                      onChange={handleChange}
                      className="lg:w-[90%] w-full px-4 py-1 bg-slate-100 outline-none rounded-3xl overflow-auto"
                    />
                  </div>
                </div>
              </div>
              {/* secend box  e*/}
            </div>
            {/* ----- */}

            {/* ----- */}
            <div className="flex flex-wrap gap-2 justify-between w-full px-2 m-auto">
              {/* first box */}
              <div className="bg-white lg:w-[48%] w-full p-2 flex items-center lg:gap-5 gap-3 lg:px-5 px-1 rounded-sm pb-3">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <FaTwitter className="w-[40px] h-[40px] opacity-[.7]" />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <div className="flex justify-between">
                    <div>
                      <h1>Twitter</h1>
                    </div>
                    <div className="flex gap-2">
                      <GoCopy
                        className="text-[#767676] font-extrabold"
                        onClick={() => copy(formData.Twitter)}
                      />
                      <a href={formData.Twitter} target="_blank">
                        <FaLink className="text-[#767676]" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="Twitter"
                      value={formData.Twitter}
                      onChange={handleChange}
                      className="lg:w-[90%] w-full px-4 py-1 bg-slate-100 outline-none rounded-3xl overflow-auto"
                    />
                  </div>
                </div>
              </div>
              {/* secend box S*/}
              <div className="bg-white lg:w-[48%] w-full p-2 flex items-center lg:gap-5 gap-3 lg:px-5 px-1 rounded-sm pb-3">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <LuMail className="w-[40px] h-[40px] opacity-[.7]" />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <div className="flex justify-between">
                    <div>
                      <h1>Support Email</h1>
                    </div>
                    <div className="flex gap-2">
                      <GoCopy
                        className="text-[#767676] font-extrabold"
                        onClick={() => copy(formData.email)}
                      />
                      <a href={formData.email} target="_blank">
                        <FaLink className="text-[#767676]" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="lg:w-[90%] w-full px-4 py-1 bg-slate-100 outline-none rounded-3xl overflow-auto"
                    />
                  </div>
                </div>
              </div>
              {/* secend box  e*/}
            </div>
            {/* ----- */}
            <div className="w-full p-5  bg-slate-100 pt-3 flex justify-end">
              <button
                onClick={handleUpdate}
                className="bg-customVoilet text-white rounded-md lg:w-[180px] lg:py-3 py-2 w-full hover:bg-[#533397] lg:mr-5"
              >
                Update
              </button>
              {/* <button
                className="bg-customVoilet flex justify-center items-center text-white rounded-md lg:w-[180px]  py-3 w-full  lg:mr-5"
              >
               <MyLoader/>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SocialMedia;
