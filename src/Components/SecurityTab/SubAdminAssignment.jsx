

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { IoMdArrowDropdown } from "react-icons/io";
import Loader from '../HomePages/Loader';
import toast from "react-hot-toast";
import { emptyEntireRedux, supportAdminUsersData } from "../../Redux/ReduxSlice";
import { useNavigate } from "react-router-dom";
import { ApiCall } from "../Global/GloblalFunction";

const SubAdminAssignment = () => {
    const [loading, setLoading] = useState(false);
    const [supportAdmins, setSupportAdmins] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([])
    const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([{
        adminId: "",
        users: [{
            userId: "",
            username: ""
        }]
    }]);

    const apiUrl = process.env.REACT_APP_API_URL;
    const { token, supportAdminUsersAssignState } = useSelector((state) => state);

    const dispatch = useDispatch();
    const navigate = useNavigate()

    // get support admins api func
    const getSupportAdminsApi = async () => {
        setLoading(true);
        try {

            const headers = { "x-access-token": token };
            const response = await ApiCall(headers, `/admin/admin_list`);

            setSupportAdmins(response?.data?.data ? response?.data?.data?.filter((admin) => admin?.status == 1 && admin?.admin_role == "support") : []);
        } catch (error) {
            if (error.message == "Invalid Token") {
                dispatch(emptyEntireRedux())
                navigate("/")
            }
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    // get users api func
    const getUsersApi = async () => {
        try {

            const headers = { "x-access-token": token };
            const response = await ApiCall(headers, `/admin/users_list`);

            // Extract user data
            const usersData = response.data.data;

            // Group users by agent_name
            const groupedUsers = usersData.reduce((acc, user) => {
                const agent = user.agent_name;

                if (!acc[agent]) {
                    acc[agent] = {
                        adminId: agent,
                        users: []
                    };
                }

                acc[agent].users.push({
                    userId: user.userid,
                    username: user.user_name
                });

                return acc;
            }, {});

            // Convert object to array
            const groupedUsersArray = Object.values(groupedUsers);

            // Set the state
            setSelectedUsers(groupedUsersArray);

            const availableUsersArray = usersData.filter((data) => data.agent_name == 'Admin')

            const availableUser = [...availableUsersArray].map((data) => {
                return {
                    userid: data.userid,
                    username: data.user_name
                }
            })
            const availableUserData = Object.values(availableUser);

            setAvailableUsers(availableUserData)

        } catch (error) {
            if (error == "Invalid Token") {
                dispatch(emptyEntireRedux())
                navigate("/")
            }
            toast.error(error);
        }
    };

    // handle assign user to support admin api func
    const handleAssignUserToSupportAdminApi = async (supportAdminId) => {
        try {

            const headers = {
                "x-access-token": token,
                "Content-Type": "application/json"
            }

            const adminData = selectedUsers?.find((item) => item.adminId === supportAdminId);

            if (adminData) {

                const data = {
                    adminid: supportAdminId,
                    usersid: adminData.users.map((user) => user.userId),
                }

                const response = await ApiCall(headers, `/admin/user_assign`, 'POST', data);

                if (response.data.message) {

                    toast.success(response.data.message);

                    const users = adminData.users.map((user) => {
                        return {
                            userId: user.userId,
                            username: user.username,
                        }
                    })
                    dispatch(
                        supportAdminUsersData({
                            adminId: supportAdminId || null,
                            users: [...users] || []
                        })
                    );
                }
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

    //  add user to selected user state
    const handleAddUser = (userId, supportAdminId, username) => {

        setSelectedUsers((prev) => {
            const updated = prev.map(item =>
                item.adminId === supportAdminId
                    ? { ...item, users: [...item.users, { userId, username }] }
                    : item
            );

            if (!updated.some(item => item.adminId === supportAdminId)) {
                updated.push({
                    adminId: supportAdminId,
                    users: [{ userId, username }]
                });
            }
            return updated;
        });

        const filterAvailableUsers = availableUsers.filter((user) => user.userid !== userId)

        setAvailableUsers(filterAvailableUsers);

    };

    // ------- remove user from array
    const handleRemoveUser = (userId, supportAdminId, username) => {

        setSelectedUsers((prev) =>
            prev.map((item) =>
                item.adminId === supportAdminId
                    ? { ...item, users: item.users.filter((user) => user.userId !== userId) }
                    : item
            )
        );
        setAvailableUsers((prev) => [...prev, { userid: userId, username }]);
    };

    useEffect(() => {
        getSupportAdminsApi();
        getUsersApi()
        setSelectedUsers(supportAdminUsersAssignState);
    }, []);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className='flex flex-col gap-4 box-border w-[85%] relative'>
                        <div className='w-full flex flex-col gap-4 md:p-3 bg-white border-[1px] border-customBorderColor rounded-xl shadow-sm sm-gap-4  h-[calc(100vh-83px)]'>
                            <h2 className="text-lg font-bold text-customVoilet px-7 py-3 border-b border-customBorderColor">
                                Admin Assignment
                            </h2>

                            <div className='w-full overflow-auto border rounded-lg'>
                                {
                                    supportAdmins?.length > 0 ? (<>
                                        <div className="w-full min-h-[700px] overflow-x-auto">
                                            <table className="w-full  border-collapse text-center ">
                                                <thead className="bg-[#ebebeb] text-[15px]">
                                                    <tr>
                                                        <th className="p-4 border ">Support Admin</th>
                                                        <th className="p-4 border">Assigned Users</th>
                                                        <th className="p-4 border">Actions</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {supportAdmins.map((admin, index) => (
                                                        <tr key={index}>
                                                            <td className="p-4 border bg-[#8d8d8d07]">
                                                                <p className="capitalize">{admin.admin_name}</p>
                                                                <p>{admin.admin_id}</p>
                                                            </td>
                                                            <td className="p-2 border bg-[#8d8d8d07] min-w-[320px] xl:w-[1200px]">
                                                                <div className="relative">
                                                                    <button
                                                                        className="w-full flex items-center justify-between bg-[white] border border-[#302e2e85] p-2 rounded-md"
                                                                        onClick={() =>
                                                                            setVisibleDropdownIndex((prev) => (prev === index ? null : index))
                                                                        }
                                                                    >
                                                                        <span className="flex flex-wrap gap-3">
                                                                            {selectedUsers.find((item) => item.adminId === admin.admin_id)?.users.map((user) => (

                                                                                <span key={user.userId} className="inline-flex items-center gap-1.5">
                                                                                    <span>{user.userId}</span>
                                                                                    <span> - </span>
                                                                                    <span className="capitalize">{user.username}</span>
                                                                                    <RxCross2
                                                                                        className="min-w-4"
                                                                                        onClick={() => handleRemoveUser(user.userId, admin.admin_id, user.username)}
                                                                                    />
                                                                                </span>
                                                                            ))}
                                                                        </span>
                                                                        <span className="text-[15px]">
                                                                            <IoMdArrowDropdown />
                                                                        </span>
                                                                    </button>
                                                                    {visibleDropdownIndex === index && (
                                                                        <ul className="absolute z-10 mt-1 w-full bg-[#f1f1f1] border border-[#c7c7c7] rounded-lg shadow-2xl">

                                                                            {availableUsers.map((user, index) => (
                                                                                <li
                                                                                    key={index}
                                                                                    className=" p-1 sm:p-2 cursor-pointer hover:text-violet-950 hover:font-medium hover:bg-[#e2e2e2] capitalize rounded-lg"
                                                                                    onClick={() =>
                                                                                        handleAddUser(user.userid, admin.admin_id, user.username)
                                                                                    }
                                                                                >
                                                                                    {user.userid} - {user.username}
                                                                                </li>
                                                                            ))}
                                                                            <li className="flex items-center justify-end pb-1.5 pr-2">
                                                                                {availableUsers.length < 1 && <span
                                                                                    className="mx-auto font-medium"
                                                                                >
                                                                                    No user have in this list
                                                                                </span>
                                                                                }
                                                                                <RxCross2
                                                                                    className="text-[22px] cursor-pointer text-[#363636]"
                                                                                    onClick={() =>
                                                                                        setVisibleDropdownIndex((prev) => (prev === index ? null : index))
                                                                                    }
                                                                                />
                                                                            </li>
                                                                        </ul>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="p-2 sm:p-4 border bg-[#8d8d8d07]">
                                                                <button
                                                                    className='bg-[#6540b2] text-white font-medium px-4 py-2 rounded hover:bg-[#5128a3] transition-all ease-in-out delay-100'
                                                                    onClick={() => handleAssignUserToSupportAdminApi(admin.admin_id)}
                                                                >
                                                                    Assign
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>

                                            </table>
                                        </div>
                                    </>) : (
                                        <>
                                            <p className="w-full h-[70vh] m-auto flex items-center justify-center text-[20px] font-bold opacity-[.7]">No admins yet to assign</p>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default SubAdminAssignment;