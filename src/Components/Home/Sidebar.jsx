import React, { useState, useEffect } from "react";
import { RxDashboard } from "react-icons/rx";
import { FaRegUserCircle } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { MdOutlinePrivacyTip, MdOutlineAssignment } from "react-icons/md";
import { PiHandDepositBold, PiInstagramLogo, PiHandWithdrawBold } from "react-icons/pi";
import { LiaUserCheckSolid, LiaUserSecretSolid } from "react-icons/lia";
import { TbTransfer, TbCoins, TbUsersGroup } from "react-icons/tb";
import { BiFile } from "react-icons/bi";
import { BsGraphUpArrow, BsBank2 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { activeTabData } from "../../Redux/ReduxSlice";
import SidebarLink from "../Custom/SidebarLink";
import DropdownContainer from "../Custom/DropDownContainer";

// Sidebar Config
const sidebarLinks = [
  { label: "Dashboard", to: "/Dashboard", icon: RxDashboard, route: "Dashboard" },
  { label: "Users", to: "/Users", icon: FaRegUserCircle, route: "Users" },
  { label: "Transaction History", to: "/TransectionHistory", icon: TbTransfer, route: "TransectionHistory" },
  // { label: "Deposit History", to: "/DepositHistory", icon: PiHandDepositBold, route: "DepositHistory" },
  { label: "Withdrow History", to: "/WithdrowHistory", icon: PiHandWithdrawBold, route: "WithdrowHistory" },
  { label: "Bank Kyc", to: "/BankKyc", icon: BsBank2, route: "BankKyc" },
  { label: "User Levels", to: "/UserLevels", icon: BsGraphUpArrow, route: "UserLevels" },
  { label: "Partner Levels", to: "/PartnerLevels", icon: TbUsersGroup, route: "PartnerLevels" },
  {
    label: "Setting",
    icon: CiSettings,
    isDropdown: true,
    currentTab: ["PrivacyPolicy", "SocialMedia", "FileData", "LevelIncome"],
    routesPath: ["PrivacyPolicy", "SocialMedia", "FileData", "LevelIncome"],
    dropdownState: "settings",
    children: [
      { label: "Privacy Policy", to: "/PrivacyPolicy", icon: MdOutlinePrivacyTip, route: "PrivacyPolicy" },
      { label: "Social Media", to: "/SocialMedia", icon: PiInstagramLogo, route: "SocialMedia" },
      { label: "File Data", to: "/FileData", icon: BiFile, route: "FileData" },
      { label: "Levels", to: "/LevelIncome", icon: TbCoins, route: "LevelIncome" },
      { label: "Admin Withdrawal", to: "/AdminWithdraw", icon: PiHandWithdrawBold, route: "AdminWithdraw" }
    ]
  },
  {
    label: "Security",
    icon: LiaUserSecretSolid,
    isDropdown: true,
    currentTab: ["AdminApprovel", "AdminAssignment"],
    routesPath: ["AdminApprovel", "AdminAssignment"],
    dropdownState: "security",
    children: [
      { label: "Admin Approvel", to: "/AdminApprovel", icon: LiaUserCheckSolid, route: "AdminApprovel" },
      { label: "Admin Assignment", to: "/AdminAssignment", icon: MdOutlineAssignment, route: "AdminAssignment" }
    ]
  }
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const { activeTab: activeTabState, adminDetails } = useSelector((state) => state);

  const subAdminPage = adminDetails?.pageAccess?.length > 0 ? adminDetails.pageAccess[0].routes_path : "Dashboard";
  const initialActiveTabState = (adminDetails.adminRole === "support" || adminDetails.adminRole === "Team")
    ? `${subAdminPage}` : "Dashboard";

  const [activeTab, setActiveTab] = useState(initialActiveTabState);
  const [dropdownStates, setDropdownStates] = useState({ settings: false, security: false });

  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
    dispatch(activeTabData({ activeTab: tabName }));
  };

  const toggleDropdown = (key) => {
    setDropdownStates((prev) => ({
      ...Object.fromEntries(Object.keys(prev).map(k => [k, false])),
      [key]: !prev[key]
    }));
  };


  useEffect(() => {
    if (activeTabState) setActiveTab(activeTabState);
  }, [activeTabState]);

  const adminRole = adminDetails?.adminRole || "";
  const adminStatus = adminDetails?.adminStatus || "";
  const adminPageAccess = adminDetails?.pageAccess || "";
  const isSuperAdmin = (adminRole === "Admin" && adminStatus === "1");
  const isSubAdmin = (["Team", "support"].includes(adminRole) && adminStatus === "1");

  return (
    <div className="flex flex-col gap-3 py-5 bg-white box-border border border-customBorderColor rounded-xl h-[calc(100vh-84px)] lg:py-3 lg:px-2 xl:p-5">
      {sidebarLinks.map((item, index) => {
        if (!item.isDropdown) {
          return (
            <SidebarLink
              key={index}
              to={item.to}
              icon={item.icon}
              label={item.label}
              activeTab={activeTab}
              currentTab={item.route}
              onClick={() => handleTabSwitch(item.route)}
              isSuperAdmin={isSuperAdmin}
              isSubAdmin={isSubAdmin}
              pageAccess={adminPageAccess}
              routesPath={item.route}
            />
          );
        } else {
          const isVisible = dropdownStates[item.dropdownState];
          return (
            <React.Fragment key={index}>
              <SidebarLink
                icon={item.icon}
                label={item.label}
                activeTab={activeTab}
                currentTab={item.currentTab}
                onClick={() => toggleDropdown(item.dropdownState)}
                isDropdown
                isDropdownVisible={isVisible}
                isSuperAdmin={isSuperAdmin}
                isSubAdmin={isSubAdmin}
                pageAccess={adminPageAccess}
                routesPath={item.routesPath}
              />
              <DropdownContainer isVisible={isVisible}>
                {item.children.map((child, childIndex) => (
                  <SidebarLink
                    key={childIndex}
                    to={child.to}
                    icon={child.icon}
                    label={child.label}
                    activeTab={activeTab}
                    currentTab={child.route}
                    onClick={() => handleTabSwitch(child.route)}
                    isSuperAdmin={isSuperAdmin}
                    isSubAdmin={isSubAdmin}
                    pageAccess={adminPageAccess}
                    routesPath={child.route}
                  />
                ))}
              </DropdownContainer>
            </React.Fragment>
          );
        }
      })}
    </div>
  );
};

export default Sidebar;
