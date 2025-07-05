// import React, { useEffect, useState, useRef } from 'react'
// import Loader from './Loader'
// import DataTable from 'datatables.net-dt';
// import 'datatables.net-dt/css/dataTables.dataTables.min.css';
// import toast from 'react-hot-toast';
// import Swal from 'sweetalert2';
// import { emptyEntireRedux, insertUserData } from '../../Redux/ReduxSlice';
// import { Link, useNavigate } from 'react-router-dom';
// import { formatDateFunc, getDepositHistoryApi, getuserListApi } from '../Global/GloblalFunction';
// import { useDispatch, useSelector } from 'react-redux';
// import depositDefaultImage from '../../images/depositImage.png'
// import DepositApprovedStatusChange from '../Global/DepositApprovedStatusChange';
// import DepositRejectStatusChange from '../Global/DepositRejectStatusChange';
// import CustomDownloadFile from '../Custom/CustomDownloadFile';

// const DepositRequestHistory = () => {

//     const [loading, setloading] = useState(false)
//     const tableRef = useRef(null);
//     const { token } = useSelector((state) => state);

//     const imageUrl = process.env.REACT_APP_IMAGE_URL;
//     const dispatch = useDispatch()
//     const navigate = useNavigate()

//     const { allUserData, depositHistory: depositHistoryData } = useSelector((state) => state)

//     // ------- user data show func
//     const handleShowUserData = (userid) => {
//         const userData = allUserData.filter((item) => item.userid === userid)
//         dispatch(insertUserData(userData[0]))
//     }

//     // handle function for show img
//     const showPopUpImage = (e) => {
//         Swal.fire({
//             imageUrl: e,
//             imageAlt: "A tall image",
//             customClass: {
//                 image: 'custom-image'
//             },
//             showConfirmButton: false
//         });
//     }

//     // ------ fetch deposit status
//     const fatchDepositHistoryData = async () => {
//         setloading(true)
//         try {
//             const responce = await getDepositHistoryApi(token, dispatch)
//             if (responce) {
//                 setloading(false)
//             }
//         } catch (error) {
//             if (error == "Invalid Token") {
//                 dispatch(emptyEntireRedux())
//                 navigate("/")
//             }
//             toast.error(error)
//         }
//     }

//     // ---------first run use effect
//     useEffect(() => {
//         fatchDepositHistoryData()
//         getuserListApi(token, dispatch)
//     }, [])

//     useEffect(() => {
//         if (!loading && depositHistoryData?.length > 0 && tableRef.current) {
//             new DataTable(tableRef.current);
//         }
//     }, [loading, depositHistoryData]);


//     return (
//         <>
//             {loading ? <Loader /> : (
//                 <div className='w-[85%] bg-white border-[1px] p-1 border-customBorderColor rounded-xl shadow-sm flex flex-col gap-1 box-border h-[calc(100vh-83px)]'>
//                     <div className='flex items-center justify-between p-4'>
//                         <h4 className='text-[20px] text-[#6540b2] font-[500]'>Deposit History</h4>
//                     </div>
//                     <div className='w-full border border-customBorderColor rounded-lg p-3 overflow-auto relative'>

//                         {
//                             depositHistoryData?.length < 1 ? (<>
//                                 <p className="w-full h-[65vh] m-auto flex items-center justify-center text-[20px] font-bold opacity-[.7]">No Deposit History Found</p>
//                             </>) : (<>
//                                 <div className='absolute right-[3px] md:right-[337px] top-6 cursor-pointer z-20'>
//                                     <CustomDownloadFile
//                                         data={depositHistoryData.map((item, index) => ({
//                                             "S.No": index + 1,
//                                             "User Id": item.userid || "N/A",
//                                             "Transaction Id": item.transaction_id || "N/A",
//                                             "Transaction Reference": item.transaction_reference || "N/A",
//                                             "Depositer Name": item.depositor_name || "N/A",
//                                             "Transaction Mode": item.transaction_mode || "N/A",
//                                             "Amount(₹)": item.payment_amount ? Number(item.payment_amount).toFixed(2).replace(/\.00$/, '') : "N/A",
//                                             "Amount($)": item.amount_dollar ? Number(item.amount_dollar).toFixed(2).replace(/\.00$/, '') : "N/A",
//                                             "Deposit Image": item.slip_image ? `${imageUrl}${item.slip_image}` : "N/A",
//                                             "Deposit Status": item.deposit_status === 1 ? "Approved" : item.deposit_status === 2 ? "Rejected" : "Pending",
//                                             "Date": formatDateFunc(item.date_time) || "N/A",
//                                         }))}
//                                         filename="Deposit-History-Data"
//                                     />
//                                 </div>
//                                 <table ref={tableRef} className='display' style={{ width: "100%" }}>
//                                     <thead>
//                                         <tr>
//                                             <th>S.No</th>
//                                             <th>User Id</th>
//                                             <th>Transaction Id</th>
//                                             <th>Transaction Reference</th>
//                                             <th>Depositer Name</th>
//                                             <th>Transaction Mode</th>
//                                             <th>Amount(₹)</th>
//                                             <th>Amount($)</th>
//                                             <th>Deposit Image</th>
//                                             <th>Deposit Status Approved</th>
//                                             <th>Deposit Status Reject</th>
//                                             <th className='w-[100px]'>Date</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {depositHistoryData?.map((item, index) => (
//                                             <tr key={index}>
//                                                 <td>{index + 1}</td>
//                                                 <td onClick={() => handleShowUserData(item.userid)}>
//                                                     <Link to="/userlinks">
//                                                         {item.userid || 'N/A'}
//                                                     </Link>
//                                                 </td>
//                                                 <td>{item.transaction_id}</td>
//                                                 <td>{item.transaction_reference}</td>
//                                                 <td className='capitalize'>{item.depositor_name}</td>
//                                                 <td>{item.transaction_mode}</td>
//                                                 <td >{Number(item.payment_amount).toFixed(2) || 'N/A'}</td>
//                                                 <td >{Number(item.amount_dollar).toFixed(2) || 'N/A'}</td>
//                                                 <td >
//                                                     <img
//                                                         className='cursor-pointer'
//                                                         src={item.slip_image ? `${imageUrl}${item.slip_image}` : depositDefaultImage}
//                                                         alt=""
//                                                         width="28"
//                                                         height="28"
//                                                         onClick={() =>
//                                                             showPopUpImage(item.slip_image ? `${imageUrl}${item.slip_image}` : depositDefaultImage)
//                                                         }
//                                                     />
//                                                 </td>
//                                                 <td>
//                                                     <DepositApprovedStatusChange
//                                                         item={item} />
//                                                 </td>
//                                                 <td >
//                                                     <DepositRejectStatusChange
//                                                         item={item} />
//                                                 </td>
//                                                 <td>{formatDateFunc(item.date_time) || 'N/A'}</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </>)
//                         }
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }
// export default DepositRequestHistory
