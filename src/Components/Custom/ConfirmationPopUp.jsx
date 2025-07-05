// import React, { useState } from 'react'
// import { ApiCall } from '../Global/GloblalFunction'
// import { useDispatch, useSelector } from 'react-redux';
// import toast from 'react-hot-toast';
// import { updatePartnerQualifyState } from '../../Redux/ReduxSlice';

// const ConfirmationPopUp = ({
//     setpopup,
//     userid
// }) => {
//     const dispatch = useDispatch();
//     const { token } = useSelector((state) => state);
//     const handleSubmit = async () => {

//         try {
//             const headers = {
//                 "x-access-token": token,
//                 "Content-Type": "application/json",
//             };
//             const data = {
//                 userid: userid
//             }
//             const response = await ApiCall(headers, `/admin/allow_transfer_partnership`, "POST", data);
//             if (response?.data) {
//                 toast.success(response.data.message);
//                 dispatch(updatePartnerQualifyState({ userid: userid, status: 1 }))
//                 setpopup(null)
//             }
//         } catch (error) {
//             toast.error(error);
//         }
//     }
//     return (
//         <>
//             <div className='w-full sm:w-[83%] h-[100%] flex items-center justify-center absolute xl:bg-[#7e7e7e2e] z-20'>
//                 <div className="w-[95%] sm:w-[500px] flex flex-col items-center gap-4 p-4 md:p-8 bg-slate-50 border border-[#dad8d8] shadow-3xl rounded-xl">
//                     <h2 className="text-3xl font-semibold  text-[#2e1f5e] text-center">Are you sure?</h2>
//                     <p className='text-xl font-medium opacity-70 text-center'>
//                         Are you sure you will allow the user to transfer the partnership?
//                     </p>
//                     <div className="flex justify-center gap-4 pt-2">
//                         <button
//                             className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md"
//                             onClick={handleSubmit}
//                         >
//                             Transfer
//                         </button>
//                         <button
//                             onClick={() => setpopup(null)}
//                             className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-md"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default ConfirmationPopUp
