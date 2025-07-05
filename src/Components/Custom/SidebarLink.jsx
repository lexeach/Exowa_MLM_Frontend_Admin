import { Link, useLocation } from "react-router-dom";
import { MdOutlineKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

const SidebarLink = ({
    to,
    icon: Icon,
    label,
    activeTab,
    currentTab,
    isDropdown = false,
    isDropdownVisible = false,
    onClick,
    children,
    isSuperAdmin,
    isSubAdmin,
    pageAccess,
    routesPath
}) => {
    const location = useLocation();

    // Normalize to arrays
    const currentTabArray = Array.isArray(currentTab) ? currentTab : [currentTab];
    const routesPathArray = Array.isArray(routesPath) ? routesPath : [routesPath];

    // Check user access
    const hasAccess =
        isSuperAdmin ||
        (isSubAdmin &&
            routesPathArray.some(path =>
                pageAccess.some(route => route.routes_path === path)
            ));

    if (!hasAccess) return null;

    const isActive = currentTabArray.includes(activeTab);

    const linkTagClasses =
        "w-full group flex items-center justify-center gap-3 text-[#4b5563] hover:bg-[#593ec71a] box-border hover:text-[#6c45b6] rounded-md lg:justify-start py-2 px-2";
    const paraTagClasses =
        "hidden p-1 text-[#4b5563] font-medium group-hover:lg:text-[#6c45b6] rounded lg:static lg:bg-transparent md:left-20 lg:p-0 z-10 lg:flex gap-1 flex-wrap";
    const activeClasses = "bg-[#593ec71a] text-[#6c45b6]";
    const dropDownSpanTagClasses =
        "min-w-full w-full group text-[#4b5563] hover:bg-[#593ec71a] box-border hover:text-[#6c45b6] rounded-md lg:justify-start py-2 px-2 cursor-pointer";

    if (isDropdown) {
        return (
            <span
                className={`${dropDownSpanTagClasses} ${isActive && !isDropdownVisible ? activeClasses : ""
                    }`}
                onClick={onClick}
            >
                <div className="w-full flex items-center justify-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <Icon className="text-2xl" />
                        <p
                            className={`${paraTagClasses} ${isActive && !isDropdownVisible ? activeClasses : ""
                                }`}
                        >
                            {label}
                        </p>
                    </div>
                    {isDropdownVisible ? (
                        <MdOutlineKeyboardArrowDown
                            className={`text-[25px] text-[#4b5563] group-hover:lg:text-[#6c45b6] hidden lg:flex ${isActive && !isDropdownVisible ? "text-[#6c45b6]" : ""
                                }`}
                        />
                    ) : (
                        <MdKeyboardArrowRight
                            className={`text-[25px] text-[#4b5563] group-hover:lg:text-[#6c45b6] hidden lg:flex ${isActive && !isDropdownVisible ? "text-[#6c45b6]" : ""
                                }`}
                        />
                    )}
                </div>
            </span>
        );
    }

    const handleClick = (e) => {
        if (location.pathname === to) {
            e.preventDefault();
            return;
        }
        onClick?.();
    };

    return (
        <Link
            to={to}
            className={`${linkTagClasses} ${isActive ? activeClasses : ""}`}
            onClick={handleClick}
        >
            <div className="min-w-[25px] text-2xl">
                <Icon />
            </div>
            <p className={`${paraTagClasses} ${isActive ? "text-[#6c45b6]" : ""}`}>
                {label}
            </p>
        </Link>
    );
};

export default SidebarLink;
