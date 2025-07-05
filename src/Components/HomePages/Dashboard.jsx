import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import BarChart from '../Charts/BarChart';
import LineChart from '../Charts/LineChart';
import PieChart from '../Charts/PieChart';
import { GiReceiveMoney } from "react-icons/gi";
import { FaUsersSlash } from "react-icons/fa";
import { HiMiniUserCircle } from "react-icons/hi2";
import { FaUsersGear } from "react-icons/fa6";
import { TbUsersGroup } from "react-icons/tb";
import { PiSealCheck } from "react-icons/pi";
import { useDispatch, useSelector } from 'react-redux';
import { emptyEntireRedux } from '../../Redux/ReduxSlice';
import { useNavigate } from 'react-router-dom';
import { ApiCall, formatDateTimenumber } from '../Global/GloblalFunction';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalInvestment: 0,
    totalReward: 0,
    totalUsers: 0,
    totalPartners: 0,
    totalQualified: 0,
    totalTopApproved: 0,
    registeredUsers: [],
    userDepositData: [],
    userWithdrowData: [],
  });

  const { token } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getDashboardDataApi = async () => {
    try {
      const header = {
        "x-access-token": token,
      };

      const response = await ApiCall(header, '/admin/dashboard_data');
      const [[{ total_user, total_top_approved }]] = response.data.data;

      const [{ totalPartners }] = response.data.data[5];
      const [{ totalQualified }] = response.data.data[6];
      const [{ company_revenue: toatl_investment }] = response.data.data[7];
      const reward = total_user - totalQualified;

      setDashboardData({
        totalInvestment: toatl_investment,
        totalUsers: total_user,
        totalReward: reward,
        totalPartners: totalPartners,
        totalQualified: totalQualified,
        totalTopApproved: total_top_approved,
        registeredUsers: response.data.data[1],
        userDepositData: response.data.data[2],
        userWithdrowData: response.data.data[3],

      });
    } catch (error) {
      if (error === "Invalid Token") {
        dispatch(emptyEntireRedux());
        navigate("/");
      } else {
        toast.error(error);
      }
    }
  };


  useEffect(() => {
    getDashboardDataApi();
  }, [token]);

  const {
    totalInvestment,
    totalReward,
    totalUsers,
    totalPartners,
    totalQualified,
    totalTopApproved,
    registeredUsers,
    userDepositData,
    userWithdrowData,
  } = dashboardData;
  const allUsersArray = registeredUsers?.map((item) => item.total_users);
  const allUsersRegisterdDateArray = registeredUsers?.map((item) =>
    new Date(item.registration_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  );

  const userDepositAmountArray = userDepositData?.map((item) =>
    parseFloat(item.total_deposit).toFixed(2).replace(/\.00$/, "")
  );
  const userDepositDateArray = userDepositData?.map((item) =>
    formatDateTimenumber(item.datetime)
  );

  const userWithdrowAmountArray = userWithdrowData?.map((item) =>
    parseFloat(item.total_withdrawal).toFixed(2).replace(/\.00$/, "")
  );

  const userWithdrowDateArray = userWithdrowData?.map((item) =>
    formatDateTimenumber(item.datetime)
  );


  return (
    <div className='flex flex-col gap-4 border-[1px] bg-[#f5f5f59c] border-customBorderColor rounded-xl w-[85%] overflow-auto p-2 sm:p-4'>
      <div className='flex gap-4 flex-wrap justify-between 2xl:flex-nowrap'>
        <StatBox icon={<GiReceiveMoney />} label="Total Investment" value={totalInvestment} />
        <StatBox icon={<FaUsersSlash />} label="Total UnQualified User" value={totalReward} />
        <StatBox icon={<HiMiniUserCircle />} label="Total User" value={totalUsers} />
        <StatBox icon={<TbUsersGroup />} label="Total Partners" value={totalPartners} />
        <StatBox icon={<FaUsersGear />} label="Total Qualified User" value={totalQualified} />
        <StatBox icon={<PiSealCheck />} label="Total Pending User" value={totalTopApproved} />
      </div>

      <div className="flex flex-wrap-reverse w-full gap-4 xl:flex-nowrap ">
        <div className="bg-white border border-[#634fbd] rounded-2xl w-full h-[350px] flex flex-col gap-4 px-2 pt-4 pb-2 xl:w-[66.5%] z-0">
          <LineChart allUsersRegisterdDateArray={allUsersRegisterdDateArray} allUsersArray={allUsersArray} />
        </div>
        <div className='bg-white border border-[#634fbd] rounded-2xl w-full h-[200] sm:h-[350px] flex justify-center py-4 xl:w-[34.5%]'>
          <PieChart totalInvestment={totalInvestment} totalReward={totalReward} totalUsers={totalUsers} totalPartners={totalPartners} totalQualified={totalQualified} totalTopApproved={totalTopApproved} />
        </div>
      </div>

      <div className='bg-white border border-[#634fbd] rounded-2xl m-auto w-full h-[380px] flex flex-col px-2 pt-4 pb-2'>
        <p className="text-xl font-semibold text-gray-800 px-4">Total Deposit And Withdrow Amount</p>
        <BarChart
          userDepositAmountArray={userDepositAmountArray}
          userDepositDateArray={userDepositDateArray}
          userWithdrowAmountArray={userWithdrowAmountArray}
          userWithdrowDateArray={userWithdrowDateArray}
        />
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value }) => {
  const AnimatedNumber = ({ targetNumber, duration = 1000 }) => {
    const [currentNumber, setCurrentNumber] = useState(0);
    useEffect(() => {
      let current = 0;
      const increment = targetNumber / (duration / 50);
      const interval = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
          clearInterval(interval);
          current = targetNumber;
        }
        setCurrentNumber(Math.floor(current));
      }, 50);
      return () => clearInterval(interval);
    }, [targetNumber, duration]);
    return <>{currentNumber}</>;
  };

  return (
    <div className='bg-white px-3 pt-2 border-[1px] border-[#634fbd] rounded-xl shadow-sm w-full flex flex-col gap-1 2xl:w-[25.1%] lg:w-[32%] sm:w-[48%]'>

      <div className='w-full flex justify-between '>
        <p className="text-[18px] font-medium opacity-[.8]">{label}</p>
        <div className="text-[28px] opacity-[.8]">{icon}</div>
      </div>
      <h2 className="text-black font-medium text-[23px] text-start">
        <AnimatedNumber targetNumber={Number(value)} />
      </h2>
    </div>
  );
}

export default Dashboard;