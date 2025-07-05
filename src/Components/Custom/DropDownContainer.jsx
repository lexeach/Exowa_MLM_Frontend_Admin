// Custom Dropdown Container Component
const DropdownContainer = ({ children, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="pl-0.5 flex flex-col gap-2 xl:items-start xl:pl-[30px] lg:pl-[20px]">
            {children}
        </div>
    );
};

export default DropdownContainer;