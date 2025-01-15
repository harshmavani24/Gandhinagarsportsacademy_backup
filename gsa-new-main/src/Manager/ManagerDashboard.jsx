// import React, { useState, useEffect } from "react";
// import AcademyManagement from "./AcademyManagement";
// import AttendanceManagement from "./AttendanceManagement";
// import AccountsOverview from "./AccountsOverview";
// import BoxCricketManagement from "./BoxCricketManagement";
// import ContactUsQueries from "./ContactUsQueries";
// import EventManagement from "./EventManagement";
// import EventParticipants from "./EventParticipants";
// import GalleryManagement from "./GalleryManagement";
// import GroundManagement from "./GroundManagement";
// import InventoryManagement from "./InventoryManagement";
// import StaffManagement from "./StaffManagement";
// import StaffAttendance from "./StaffAttendance";
// import ManagerHome from "./ManagerHome";

// import { GiHamburgerMenu } from "react-icons/gi";
// import { BiCross } from "react-icons/bi";

// function ManagerDashboard() {
//   // State for active component
//   const [activeComponent, setActiveComponent] = useState(() => {
//     return localStorage.getItem("activeComponent") || "Academy";
//   });

//   // State for sidebar toggle
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // Save activeComponent to localStorage
//   useEffect(() => {
//     localStorage.setItem("activeComponent", activeComponent);
//   }, [activeComponent]);

//   const renderComponent = () => {
//     switch (activeComponent) {
//       case "Academy":
//         return <AcademyManagement />;
//       case "Attendance":
//         return <AttendanceManagement />;
//       case "Accounts":
//         return <AccountsOverview />;
//       case "BoxCricket":
//         return <BoxCricketManagement />;
//       case "ContactUs":
//         return <ContactUsQueries />;
//       case "Events":
//         return <EventManagement />;
//       case "EventParticipants":
//         return <EventParticipants />;
//       case "Gallery":
//         return <GalleryManagement />;
//       case "Ground":
//         return <GroundManagement />;
//       case "Inventory":
//         return <InventoryManagement />;
//       case "Staff":
//         return <StaffManagement />;
//       case "StaffAttendance":
//         return <StaffAttendance />;
//       case "ManagerHome":
//         return <ManagerHome />;
//       default:
//         return <div className="text-gray-600">Select a module from the menu.</div>;
//     }
//   };

//   const menuItems = [
//     { label: "Home", key: "ManagerHome" },
//     { label: "Academy Management", key: "Academy" },
//     { label: "Attendance Management", key: "Attendance" },
//     { label: "Accounts Overview", key: "Accounts" },
//     { label: "Ground Management", key: "Ground" },
//   ];

//   return (
//     <div className="flex flex-col bg-gray-50 min-h-screen">
//       {/* Top Bar */}
//       <header className="flex justify-between items-center bg-blue-700 text-white px-4 py-3 shadow-md">
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="md:hidden px-3 py-2 bg-blue-600 rounded-md focus:outline-none"
//         >
//           {isSidebarOpen ? <BiCross/> : <GiHamburgerMenu/>}
//         </button>
//         <h1 className="text-xl font-bold">Manager Dashboard</h1>
//         <button
//           onClick={() => {
//             localStorage.clear();
//             window.location.reload();
//           }}
//           className="px-4 py-2 bg-red-600 rounded-md shadow hover:bg-red-700"
//         >
//           Logout
//         </button>
//       </header>

//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <aside
//           className={`fixed md:relative md:translate-x-0 top-0 left-0 bg-blue-700 text-white h-screen w-64 z-50 transition-transform transform ${
//             isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//         >
//           <div className="p-5 border-b border-blue-600">
//             {/* <h1 className="text-2xl font-bold">Manager Dashboard</h1> */}
//           </div>
//           <nav className="mt-6 px-3">
//             <ul>
//               {menuItems.map((item) => (
//                 <li key={item.key} className="my-2">
//                   <button
//                     onClick={() => {
//                       setActiveComponent(item.key);
//                       setIsSidebarOpen(false); // Close sidebar on selection
//                     }}
//                     className={`w-full px-4 py-3 text-left rounded-md transition-all ${
//                       activeComponent === item.key
//                         ? "bg-white text-blue-700 font-bold shadow-md"
//                         : "bg-blue-700 text-white hover:bg-blue-600"
//                     }`}
//                   >
//                     {item.label}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 md:p-4 p-0">
//           <div className="bg-white md:p-6 p-4 rounded-lg md:shadow-lg shadow-none border border-gray-200">
//             {renderComponent()}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default ManagerDashboard;






















import React, { useState, useEffect } from "react";
import AcademyManagement from "./AcademyManagement";
import AttendanceManagement from "./AttendanceManagement";
import AccountsOverview from "./AccountsOverview";
import BoxCricketManagement from "./BoxCricketManagement";
import ContactUsQueries from "./ContactUsQueries";
import EventManagement from "./EventManagement";
import EventParticipants from "./EventParticipants";
import GalleryManagement from "./GalleryManagement";
import GroundManagement from "./GroundManagement";
import InventoryManagement from "./InventoryManagement";
import StaffManagement from "./StaffManagement";
import StaffAttendance from "./StaffAttendance";
import ManagerHome from "./ManagerHome";

import { GiHamburgerMenu } from "react-icons/gi";
import { BiCross } from "react-icons/bi";

function ManagerDashboard() {
  const [activeComponent, setActiveComponent] = useState(() => {
    return localStorage.getItem("activeComponent") || "Academy";
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("activeComponent", activeComponent);
  }, [activeComponent]);

  const renderComponent = () => {
    switch (activeComponent) {
      case "Academy":
        return <AcademyManagement />;
      case "Attendance":
        return <AttendanceManagement />;
      case "Accounts":
        return <AccountsOverview />;
      case "BoxCricket":
        return <BoxCricketManagement />;
      case "ContactUs":
        return <ContactUsQueries />;
      case "Events":
        return <EventManagement />;
      case "EventParticipants":
        return <EventParticipants />;
      case "Gallery":
        return <GalleryManagement />;
      case "Ground":
        return <GroundManagement />;
      case "Inventory":
        return <InventoryManagement />;
      case "Staff":
        return <StaffManagement />;
      case "StaffAttendance":
        return <StaffAttendance />;
      case "ManagerHome":
        return <ManagerHome />;
      default:
        return <div className="text-gray-600">Select a module from the menu.</div>;
    }
  };

  const menuItems = [
    { label: "Home", key: "ManagerHome" },
    { label: "Academy Management", key: "Academy" },
    { label: "Attendance Management", key: "Attendance" },
    { label: "Accounts Overview", key: "Accounts" },
    { label: "Ground Management", key: "Ground" },
  ];

  return (
    <div className="flex flex-col bg-gray-50 h-screen overflow-y-auto">
      {/* Top Bar */}
      <header className="flex justify-between items-center bg-blue-700 text-white px-4 py-3 shadow-md fixed top-0 left-0 w-full z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden px-3 py-2 bg-blue-600 rounded-md focus:outline-none"
        >
          {isSidebarOpen ? <BiCross /> : <GiHamburgerMenu />}
        </button>
        <h1 className="text-xl font-bold">Manager Dashboard</h1>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="px-4 py-2 bg-red-600 rounded-md shadow hover:bg-red-700"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 bg-blue-700 text-white h-[calc(100vh-4rem)] w-64 z-50 transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="p-5 border-b border-blue-600">
            <h2 className="text-2xl font-bold">Manager Dashboard</h2>
          </div>
          <nav className="mt-6 px-3">
            <ul>
              {menuItems.map((item) => (
                <li key={item.key} className="my-2">
                  <button
                    onClick={() => {
                      setActiveComponent(item.key);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left rounded-md transition-all ${
                      activeComponent === item.key
                        ? "bg-white text-blue-700 font-bold shadow-md"
                        : "bg-blue-700 text-white hover:bg-blue-600"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100 ml-0 md:ml-64">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            {renderComponent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ManagerDashboard;
