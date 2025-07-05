import { useState } from "react";
import UserInformation from "./UserInformation";
import UsertransactionDetails from "./UserTransectionDetails";
import UserWithdrowHistory from "./UserWithdrowHistory";
import UserLevels from "./UserLevels";
import PartnerLevels from "./PartnerLevels";
import UserBankKyc from "./UserBankKyc";
import UserTopUp from "./UserTopUp";

const UserLinks = () => {

    const [activeTab, setActiveTab] = useState("userPanel");

    return (
        <div className="w-[85%] flex flex-col box-border h-[calc(100vh-83px)]">
            <div className="w-full flex flex-col gap-2 sm:p-2 bg-white border-[1px] border-customBorderColor rounded-xl shadow-sm h-[calc(100vh-83px)]">
                {/* links container */}
                <div className=" h-[55px]">
                    <div className="h-[150px] text-sm font-medium text-center text-gray-500  dark:text-gray-400 dark:border-gray-700 overflow-x-auto">
                        <ul className="flex -mb-px">
                            <li className="me-2" onClick={() => setActiveTab("userPanel")}>
                                <button
                                    className={`tab-btn inline-block p-4 border-b-2 rounded-t-lg ${activeTab === "userPanel"
                                        ? "text-customVoilet border-customVoilet"
                                        : "text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    User Information
                                </button>
                            </li>

                            <li className="me-2" onClick={() => setActiveTab("transactionDetails")}>
                                <button
                                    className={`tab-btn inline-block p-4 border-b-2 rounded-t-lg ${activeTab === "transactionDetails"
                                        ? "text-customVoilet border-customVoilet"
                                        : "text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    Transaction History
                                </button>
                            </li>

                            <li className="me-2" onClick={() => setActiveTab("withdrowHistory")}>
                                <button
                                    className={`tab-btn inline-block p-4 border-b-2 rounded-t-lg ${activeTab === "withdrowHistory"
                                        ? "text-customVoilet border-customVoilet"
                                        : "text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    Withdrow History
                                </button>
                            </li>
                            <li className="me-2" onClick={() => setActiveTab("bankKyc")}>
                                <button
                                    className={`tab-btn inline-block p-4 border-b-2 rounded-t-lg ${activeTab === "bankKyc"
                                        ? "text-customVoilet border-customVoilet"
                                        : "text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    Bank Kyc
                                </button>
                            </li>
                            <li className="me-2" onClick={() => setActiveTab("userLevels")}>
                                <button
                                    className={`tab-btn inline-block p-4 border-b-2 rounded-t-lg ${activeTab === "userLevels"
                                        ? "text-customVoilet border-customVoilet"
                                        : "text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    User Levels
                                </button>
                            </li>
                            <li className="me-2" onClick={() => setActiveTab("partnerLevels")}>
                                <button
                                    className={`tab-btn inline-block p-4 border-b-2 rounded-t-lg ${activeTab === "partnerLevels"
                                        ? "text-customVoilet border-customVoilet"
                                        : "text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    Partner Levels
                                </button>
                            </li>

                            <li className="me-2" onClick={() => setActiveTab("Topup")}>
                                <button
                                    className={`tab-btn inline-block p-4 border-b-2 rounded-t-lg ${activeTab === "Topup"
                                        ? "text-customVoilet border-customVoilet"
                                        : "text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    Top Up
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* multiple tabs page code */}
                {/* user details tab */}
                {activeTab === "userPanel" && <>
                    <>
                        <UserInformation />
                    </>
                </>}
                {/* transaction details tab */}
                {activeTab === "transactionDetails" && (<>
                    <UsertransactionDetails />
                </>)
                }
                {/* Withdrow History Tab */}
                {activeTab === "withdrowHistory" && <>
                    <UserWithdrowHistory />
                </>}
                {/* Withdrow History Tab */}
                {activeTab === "bankKyc" && <>
                    <UserBankKyc />
                </>}
                {/* User Levels Tab */}
                {activeTab === "userLevels" && <>
                    <UserLevels />
                </>}
                {/* Partner Levels Tab */}
                {activeTab === "partnerLevels" && <>
                    <PartnerLevels />
                </>}
                {activeTab === "Topup" && <>
                    <UserTopUp />
                </>}
            </div>
        </div>
    );
};

export default UserLinks;









