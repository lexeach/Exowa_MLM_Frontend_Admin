import React, { useState, useEffect, useRef } from 'react';
import Loader from './Loader';
import DataTable from 'datatables.net-dt';
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux';
import { emptyEntireRedux, insertUserData } from '../../Redux/ReduxSlice';
import { Link, useNavigate } from 'react-router-dom';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import { formatDateTimenumber, getuserListApi } from '../Global/GloblalFunction';
import CustomDownloadFile from '../Custom/CustomDownloadFile';

const Users = () => {
  const [loading, setloading] = useState(false);
  let { token, allUserData: userData } = useSelector((state) => state);

  const tableRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fatchData = async () => {
    setloading(true)
    try {
      const response = await getuserListApi(token, dispatch)
      if (response.status === 200) {
        setloading(false)
      }

    } catch (error) {
      if (error === "Invalid Token") {
        dispatch(emptyEntireRedux())
        navigate("/")
      } else {
        toast.error(error)
      }
    }
  }

  useEffect(() => {
    fatchData()
  }, [token]);

  useEffect(() => {
    if (!loading && tableRef.current) {
      new DataTable(tableRef.current);
    }
  }, [loading, userData]);

  const sendUserDataFunc = (item) => {
    dispatch(insertUserData(item));
  }

  return (
    <>
      {loading ? <Loader /> : (
        <div className='flex flex-col gap-1 box-border w-[85%] overflow-y-auto'>

          <div className='w-full bg-white border-[1px] border-customBorderColor rounded-xl shadow-sm'>
            <div className='flex items-center justify-between p-4'>
              <h4 className='text-[20px] text-[#6540b2] font-[500]'>Users</h4>

            </div>
            <div className='w-full border border-customBorderColor rounded-lg overflow-auto p-3 relative'>
              {(userData.length) ? (
                <>
                  <div className='absolute right-[3px] md:right-[335px] top-6 cursor-pointer z-20'>
                    <CustomDownloadFile
                      data={userData?.map((item, index) => ({
                        "S.No": index + 1,
                        "User Id": item.userid || 'N/A',
                        "User Name": item.user_name || 'N/A',
                        "Amount(₹)": item.income ? parseFloat(item?.income).toFixed(2).replace(/\.00$/, '') : 'N/A',
                        "Status": item.status === 1 ? "Approved" : "Pending",
                        "Registration Date": formatDateTimenumber(item?.registration_date) || 'N/A'
                      }))}
                      filename="User-Table"
                    />
                  </div>
                  <table ref={tableRef} className='display' style={{ width: "100%" }} >
                    <thead >
                      <tr>
                        <th>S.No</th>
                        <th>User Id</th>
                        <th>User Name</th>
                        <th>Income(₹)</th>
                        <th>Status</th>
                        <th>Registration Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData?.map((item, index) => {
                        const userId = item.userid || 'N/A';
                        const userName = item.user_name || 'N/A';
                        const amount = item.income ? parseFloat(item?.income).toFixed(2).replace(/\.00$/, '') : 'N/A';
                        const status = item?.status;
                        const registration_date = formatDateTimenumber(item?.registration_date) || 'N/A'
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <Link to="/userlinks" onClick={() => sendUserDataFunc(item)} className='hover:text-violet-700'>
                                {userId}
                              </Link>
                            </td>
                            <td className='capitalize'>{
                              userName
                            }</td>
                            <td>{
                              amount
                            }</td>
                            <td
                              className={
                                status === 1
                                  ?
                                  'text-green-700' :
                                  status === 2
                                    ? 'text-red-600'
                                    :
                                    'text-orange-600'}
                            >
                              <span
                                className={`p-1 bg-[#fcf8f8] rounded-md border ${status === 1
                                  ?
                                  'bg-green-50 border-green-200'
                                  :
                                  'bg-red-50 border-orange-200'
                                  }`}
                              >
                                {
                                  status === 1 ? "Approved" : status === 2 ? "Reject" : "Pending"
                                }
                              </span>
                            </td>
                            <td>{registration_date}</td>
                          </tr>
                        )
                      }
                      )}
                    </tbody>

                  </table>
                </>
              ) : (
                <p className="w-full h-[65vh] m-auto flex items-center justify-center text-[20px] font-bold opacity-[.7]">
                  No users found.
                </p>
              )}
            </div>
          </div>
        </div >
      )}
    </>
  );
};

export default Users;
