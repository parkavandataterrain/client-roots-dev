import React, { useRef, useState, useEffect } from 'react';

const Sidebar = () => {
    const [showSidebar, setShowSidebar] = useState(true)
    const [sidebarWidth, setSidebarWidth] = useState('38.22vh');

    const handleResize = (e) => {
        setShowSidebar(!showSidebar);
        if (showSidebar) {
            setSidebarWidth(0);
        } else {
            setSidebarWidth('38.22vh');
        }
    };
    return (
        <></>
        // <div className='flex flex-row justify-center items-center'>
        //     <div className={`flex pb-4 shadow-lg ${showSidebar ? 'h-full' : 'h-screen'}`} style={{ width: sidebarWidth }}>
        //         <div className="bg-white">
        //             <div className="px-0">
        //                 {showSidebar && (
        //                     <ul className="ml-5 text-md">
        //                         <button onClick={() => handleClick(1)}>
        //                             <li className=" flex items-center mt-10">
        //                                 <img src={GeneralInformationPNG} className="h-[25px] w-[25px] mr-4" alt="general information" />
        //                                 <p className=''>General Information</p>
        //                             </li>
        //                         </button>
        //                         <button onClick={() => handleClick(2)}>
        //                             <li className=" flex items-center mt-10">
        //                                 <img src={ContactInformationPNG} className="h-[25px] w-[25px] mr-4" alt="contact information" />
        //                                 Contact Information
        //                             </li>
        //                         </button>
        //                         <button onClick={() => handleClick(3)}>
        //                             <li className=" flex items-center mt-10">
        //                                 <img src={DemographicsPNG} className="h-[25px] w-[25px] mr-4" alt="demographics" />
        //                                 Demographics
        //                             </li>
        //                         </button>
        //                         <button onClick={() => handleClick(4)}>
        //                             <li className=" flex items-center  mt-10">
        //                                 <img src={AddressPNG} className="h-[25px] w-[25px] mr-4" alt="address" />
        //                                 <p className=''>Address/Usual Location</p>
        //                             </li>
        //                         </button>
        //                         <button onClick={() => handleClick(5)}>
        //                             <li className=" flex items-center mt-10">
        //                                 <img src={CustomFieldsPNG} className="h-[25px] w-[25px] mr-4" alt="custom fields" />
        //                                 Custom Fields
        //                             </li>
        //                         </button>
        //                         <button onClick={() => handleClick(6)}>
        //                             <li className=" flex items-center mt-10">
        //                                 <img src={PharmacyPNG} className="h-[25px] w-[25px] mr-4" alt="preferred pharmacy" />
        //                                 Preferred Pharmacy
        //                             </li>
        //                         </button>
        //                         <button onClick={() => handleClick(7)}>
        //                             <li className=" flex items-center mt-10">
        //                                 <img src={InsurancePNG} className="h-[25px] w-[25px] mr-4" alt="insurance information" />
        //                                 Insurance Information
        //                             </li>
        //                         </button>
        //                         <button onClick={() => handleClick(8)}>
        //                             <li className=" flex items-center mt-10">
        //                                 <img src={SystemInformationPNG} className="h-[25px] w-[25px] mr-4" alt="system information" />
        //                                 System Information
        //                             </li>
        //                         </button>
        //                         <li className=" flex items-center mt-10 mb-3">
        //                             <img src={ExportPNG} className="h-[25px] w-[25px] mr-2" alt="export" />
        //                             Report Builder
        //                         </li>

        //                     </ul>)
        //                 }
        //             </div>
        //         </div>
        //     </div>
        //     {/* <div className="flex justify-center items-center handle w-5 hover:cursor-ew-resize bg-white" onClick={handleResize}> */}
        //     <div className='w-5 hover:cursor-ew-resize justify-center items-center -ml-3' onClick={handleResize}>
        //         <img src={ResizePNG} className="h-[30px] w-[30px]" alt="resize-sidebar" />
        //     </div>
        // </div>
    );
}
 
export default Sidebar;