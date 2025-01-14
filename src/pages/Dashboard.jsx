import React, { useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

function Dashboard() {
  const isAdmin = JSON.parse(secureLocalStorage.getItem("userRole"))?.isAdmin;



  return (
    <>
      {isAdmin ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}
    </>
  );
}

export default Dashboard;
