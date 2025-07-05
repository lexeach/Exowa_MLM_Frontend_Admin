import React, { memo } from "react";
import * as XLSX from "xlsx";
import { MdOutlineFileDownload } from "react-icons/md";
const CustomDownloadFile = ({ data, filename }) => {
    const downloadExcel = (data, filename = "wepe-wallet") => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, filename);
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };
    return (
        <>
            <button
                onClick={() => downloadExcel(data, filename)}
                className="px-4 py-[5px] flex items-center justify-center border border-[#b3b3b3] gap-1 bg-white rounded-[4px] ease-in duration-[0.4s] cursor-pointer"
            >
                Export{" "}
                <MdOutlineFileDownload size={23} />
            </button>
        </>
    );
};

export default memo(CustomDownloadFile);
