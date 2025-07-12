"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Navbar from "./Navbar/Navbar";
import UserNav from "./userNav/UserNav";

export default function NavbarVisibilityWrapper() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const userRole = Cookies.get("role");
    if (token && userRole) {
      setRole(userRole);
    }
  }, []);

  if (role === "user") {
    return <UserNav />;
  } else if (role === "admin") {
    return <h1>Admin page</h1>;
  } else {
    return <Navbar/>; 
  }
}
