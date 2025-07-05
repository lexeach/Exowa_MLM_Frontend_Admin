import React, { useEffect } from "react";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Sidebar from "./Sidebar";
import Header from "../HomePages/Header";
import ProtectedRoute from "../ProtectedRoutes/ProtectedRoute";

// Pages
import Dashboard from "../HomePages/Dashboard";
import Users from "../HomePages/Users";
import Transaction from "../HomePages/Transection";
import UserLinks from "../UserLinks/UserLinks";
import PrivacyPolicy from "../SettingsTab/PrivacyPolicy";
import SocialMedia from "../SettingsTab/SocialMedia";
import AdminWithdraw from "../SettingsTab/AdminWithdrow";
import SubAdminAssignment from "../SecurityTab/SubAdminAssignment";
import AdminApprovel from "../SecurityTab/AdminApprovel";
import DepositRequestHistory from "../HomePages/DepositRequestHistory";
import WithdrowRequestHistory from "../HomePages/WithdrowRequestHistory";
import UserLevels from "../HomePages/UserLevels";
import FileData from "../SettingsTab/FileData";
import LevelIncome from "../SettingsTab/LevelIncome";
import PartnerLevels from "../HomePages/PartnerLevels";
import BankKyc from "../HomePages/BankKyc";

const routeConfig = [
  { path: "Dashboard", component: Dashboard, page: "Dashboard" },
  { path: "Users", component: Users, page: "Users" },
  { path: "TransectionHistory", component: Transaction, page: "TransectionHistory" },
  { path: "userlinks", component: UserLinks, page: "Users" },
  // { path: "DepositHistory", component: DepositRequestHistory, page: "DepositHistory" },
  { path: "WithdrowHistory", component: WithdrowRequestHistory, page: "WithdrowHistory" },
  { path: "BankKyc", component: BankKyc, page: "BankKyc" },
  { path: "UserLevels", component: UserLevels, page: "UserLevels" },
  { path: "PartnerLevels", component: PartnerLevels, page: "PartnerLevels" },
  { path: "PrivacyPolicy", component: PrivacyPolicy, page: "PrivacyPolicy" },
  { path: "SocialMedia", component: SocialMedia, page: "SocialMedia" },
  { path: "FileData", component: FileData, page: "FileData" },
  { path: "LevelIncome", component: LevelIncome, page: "LevelIncome" },
  { path: "AdminWithdraw", component: AdminWithdraw, page: "AdminWithdraw" },
  { path: "AdminApprovel", component: AdminApprovel, page: "AdminApprovel" },
  { path: "AdminAssignment", component: SubAdminAssignment, page: "AdminAssignment" },
];

const Home = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className="flex flex-col p-1 gap-1">
      <div className="sticky top-0 z-10">
        <Header />
      </div>
      <div className="flex gap-1 box-border w-full">
        <div className="min-w-[15%] box-border sticky left-0 top-[70px] h-[calc(100vh-83px)] bg-white shadow-md overflow-auto">
          <Sidebar />
        </div>
        <Routes>
          {routeConfig.map(({ path, component: Component, page }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute page={page}>
                  <Component />
                </ProtectedRoute>
              }
            />
          ))}
        </Routes>
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
