import axios from "axios";
import { allUserData, depositHistoryData, WithdrowHistoryData } from "../../Redux/ReduxSlice";
import toast from 'react-hot-toast';

export const getuserListApi = async (token, dispatch) => {
    try {
        const header = { "x-access-token": token }

        const response = await ApiCall(header, "/admin/users_list");

        if (response.data.data) {
            dispatch(allUserData(response.data.data));
        }
        if (response.data.message) {
            dispatch(allUserData([]));
        }
        return response
    } catch (error) {
        throw error
    }
}

// get User Withdrow History func
export const getWithdrowHistoryApi = async (token, dispatch) => {
    try {
        const header = { "x-access-token": token }
        const response = await ApiCall(header, "/admin/withdrawal_request")
        if (response.data) {
            if (response?.data?.data) {
                dispatch(WithdrowHistoryData(response.data.data))
                return response
            }
            if (response?.data?.message) {
                dispatch(WithdrowHistoryData([]))
                return response
            }
        }
    } catch (error) {
        throw error
    }
}

// transction data fetch api func
export const getDepositHistoryApi = async (token, dispatch) => {
    try {
        const header = { "x-access-token": token }

        const response = await ApiCall(header, "/admin/deposit_request")

        if (response.data) {
            if (response.data.message) {
                dispatch(depositHistoryData([]))
            }
            if (response.data.data) {
                dispatch(depositHistoryData(response.data.data))
            }
            return response
        }
    } catch (error) {

        throw error
    }
}

export const formatDateFunc = (date) => {
    return new Date(date).toLocaleString(
        "en-GB",
        {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }
    )
}

export const formatDateTimenumber = (timestamp) => {
    try {
        if (timestamp === null || timestamp === 0) {
            return "Invalid Date";
        }
        const dateObj = new Date(Number(timestamp) * 1000);
        const formattedDate = dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
        return formattedDate;
    } catch (error) {
        return "Invalid Date";
    }
};


// Calling....   FormateAmount(80.90987)
const BaseURI = process.env.REACT_APP_API_URL;
export const ApiCall = async (
    header,
    subUri,
    method = 'POST',
    body = null,
    base = BaseURI
) => {
    const config = {
        method,
        url: `${base}${subUri}`,
        headers: header,
        data: method.toLowerCase() !== "get" ? body : undefined,
    };
    try {
        const response = await axios(config);
        return response;
    } catch (error) {
        throw error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "An error occured"
    }
};

export const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        toast.success("Copied.");
    });
};

export const handleChange = (e, setFormData) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: value
    }));
};

export const formatAmount = (data) => {
    try {
        const number = Number(data);
        if (isNaN(number)) return "0.00";
        return number.toFixed(2);
    } catch (error) {
        return "0.00";
    }
};