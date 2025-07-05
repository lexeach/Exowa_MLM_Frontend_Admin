
import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { emptyEntireRedux, MyPrivacyPolicyData } from "../../Redux/ReduxSlice";
import { FaSlackHash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { token } = useSelector((state) => state);

  const apiUrl = process.env.REACT_APP_API_URL;
  const update_privacy = [
    "--- Select Privacy ---",
    "Terms & Conditions",
    "Privacy Policy",
  ];
  //---------
  const [formData, setFormData] = useState({
    title: "",
    selectprivacy: "",
    selettext: "",
    description: "",
  });

  // Handle user input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "selectprivacy") {
      handleGetHistory(Number(value));
    }
  };
  // For Editor----
  const config = {
    height: 450,
    toolbar: true,
    clipboard: true,
    enablePasteFromWord: true,
    pastePlainText: false,
    allowPasteHTML: true,
    defaultActionOnPaste: "insert_clear_html",
  };

  // Fetch data based on user selection
  const handleGetHistory = async (selectedId) => {
    try {
      const res = await axios.get(`${apiUrl}/website/static_data`);
      const values = res?.data?.result || [];

      // Find the matching item by ID
      const selectedItem = values.find((item) => item.id === selectedId);
      if (selectedItem) {
        setFormData((prevState) => ({
          ...prevState,
          title: selectedItem.title || "",
          selectprivacy: selectedId.toString(), 
          selettext:
            update_privacy.find(
              (_, index) => values[index]?.id === selectedId
            ) || "",
          description: String.fromCharCode(
            ...(selectedItem.description?.data || [])
          ),
        }));
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // Call API to update data
  const CallAPI = async () => {
    const data = {
      id: formData.selectprivacy,
      title: formData.title,
      selettext: formData.selettext,
      description: formData.description,
    };
    dispatch(MyPrivacyPolicyData(data));
    try {
      const response = await axios.post(
        `${apiUrl}/admin/update_privacy`,
        data,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        toast.success(response.data.message);
        dispatch(MyPrivacyPolicyData(data));
        handleGetHistory(Number(formData.selectprivacy));
      }
    } catch (error) {
      if (error.message == "Invalid Token") {
        dispatch(emptyEntireRedux())
        navigate("/")
      }
      toast.error(
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "An error occured"
      );
    }
  };

  const UpdateData = () => {
    if (!formData.selectprivacy || !formData.title || !formData.description) {
      toast.error("Please provide all data!");
      return;
    }
    CallAPI();
  };

  useEffect(() => {
    handleGetHistory(1); // Load data for ID 1 by default
  }, []);

  return (
    <div className="w-full p-2">
      <div className="w-full p-1">
        <h2 className=" text-[18px]  px-5 py-3 flex  gap-1 w-full bg-slate-100 rounded-md">
          <span>
            <FaSlackHash className="text-2xl" />
          </span>
          Update Policy & Conditions
        </h2>
      </div>

      <div className="w-full lg:flex lg:flex-row flex flex-col-reverse lg:items-center justify-between p-2 lg:p-5 bg-slate-100 rounded-md pt-3 lg:pt-10 lg:gap-0 gap-6 mt-3">
        <div className="lg:w-[40%] flex flex-col gap-2 ml-2">
          <h1 className="pl-1 text-xl">Title:</h1>
          <input
            type="text"
            placeholder="Write here..."
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="outline-none py-2 px-2 rounded-md w-full"
          />
        </div>
        <div className="lg:w-[40%] flex lg:justify-end mr-5">
          <select
            className="py-3 px-2 rounded-md lg:w-[50%] bg-white"
            name="selectprivacy"
            value={formData.selectprivacy} 
            onChange={handleChange}
          >
            {update_privacy.map((item, index) => (
              <option key={index} value={index} disabled={index === 0}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full p-2 lg:p-5 bg-slate-100 pt-3">
        <JoditEditor
          config={config}
          name="description"
          value={formData.description}
          onBlur={(newContent) =>
            setFormData((prevState) => ({
              ...prevState,
              description: newContent,
            }))
          }
        />
      </div>

      <div className="w-full p-5 lg:pb-10 bg-slate-100 pt-3 flex justify-end">
        <button
          onClick={UpdateData}
          className="bg-customVoilet text-white rounded-md lg:w-[180px] lg:py-3 py-2 w-full hover:bg-[#533397] lg:mr-5"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;