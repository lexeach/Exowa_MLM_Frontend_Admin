import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const ProtectedRoute = ({ page, children }) => {

    const { adminDetails } = useSelector((state) => state)

    const adminRole = adminDetails?.adminRole || "";
    const adminStatus = adminDetails?.adminStatus || ""
    const adminPageAccess = adminDetails?.pageAccess || "";

    const hasPageAccess = adminPageAccess.some(item => item.routes_path === page);

    const superAdmin = ( adminDetails.adminRole == "Admin" && adminStatus == "1")

    const subAdmins = (adminRole == "Team" || adminDetails.adminRole == "support" && adminStatus == "1")

    if (superAdmin) {
        return children ? children : <Outlet />;
    } else if (subAdmins && hasPageAccess) {
        return children ? children : <Outlet />;
    } else {
        return <>
            <div className="flex flex-col gap-2 box-border w-[85%] mx-auto ">
                <div className="w-full h-[80vh] flex flex-col justify-center items-center p-5 bg-white border-[1px] border-customBorderColor rounded-xl shadow-sm gap-4">
                    <div className="text-xl font-semibold text-gray-800">You Cannot Access This Route.</div>
                    <p className="text-gray-600 text-center">
                        It seems you don't have the necessary permissions to access this page. Please contact your Super Admin if you believe this is a mistake.
                    </p>
                </div>
            </div>
        </>;
    }
};

export default ProtectedRoute;