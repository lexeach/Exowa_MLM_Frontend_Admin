import React from 'react'
import iconAutaSis from '../../images/autosislogo.png'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { emptyEntireRedux } from '../../Redux/ReduxSlice';
import { TbLogout } from "react-icons/tb";

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { adminDetails } = useSelector((state) => state)

  const handleLogOutClick = () => {
    dispatch(emptyEntireRedux());

    toast.success('User Logged Out Successfully');
    navigate('/');
  };

  return (
    <div className='w-full h-[70px] bg-white border border-customBorderColor rounded-xl flex items-center justify-between px-3 z-50'>
      <div className='flex items-center gap-3'>

        <div className='w-[60px] object-contain sm:w-[70px]'>
          <img src={iconAutaSis} alt="iconAutaSis" />
        </div>
        <span className='font-semibold text-2xl opacity-[.9]'>AUTASIS</span>
      </div>

      <div className='flex items-center gap-[150px]'>

        <div className='hidden sm:flex flex-col gap-0.5 '>
          <span className='font-normal'>Welcome,</span>
          <p className='text-[17px] font-semibold capitalize'>{adminDetails?.adminName}</p>
        </div>

        <div
          className='w-[110px] py-3 pl-3 pr-1 bg-[#531affe5] rounded-xl flex items-center justify-between cursor-pointer'
          onClick={handleLogOutClick}
        >
          <span className='text-[16px] text-white font-medium' >Log Out</span>
          <TbLogout className='text-[25px] font-bold text-white' />
        </div>

      </div>
    </div>
  )
}

export default Header;