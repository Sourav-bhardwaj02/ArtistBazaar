import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Overview from "@/components/Admin/Overview";
// Import icons from lucide-react
import { BarChart3, Users, Database, Shield } from "lucide-react";

const AdminPanel = () => {
  const [searchSellers, setSearchSellers] = useState("");
  const [searchCustomers, setSearchCustomers] = useState("");

  const [overview, setOverview] = useState({
    totalSellers: 0,
    totalServices: 0,
    totalProducts: 0,
    anomaliesDetected: 0,
  });
  const [sellers, setSellers] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const API_URL = import.meta.env.VITE_URL;
        const token = localStorage.getItem("auth-token") || "";
        const [ovRes, sellersRes, customersRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/overview`, {
            headers: { "auth-token": token },
          }),
          fetch(`${API_URL}/api/admin/sellers`, {
            headers: { "auth-token": token },
          }),
          fetch(`${API_URL}/api/admin/customers`, {
            headers: { "auth-token": token },
          }),
        ]);
        const [ov, s, c] = await Promise.all([
          ovRes.json(),
          sellersRes.json(),
          customersRes.json(),
        ]);
        if (ovRes.ok) setOverview(ov);
        if (sellersRes.ok) setSellers(s.sellers || []);
        if (customersRes.ok) setCustomers(c.customers || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const filterTable = (data, searchTerm) =>
    data.filter((item) =>
      Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  return (
    <AdminLayout/>
  );
};

export default AdminPanel;
