import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import axios from "@/utils/axiosConfig";
import { Button, Chip, Input } from "@heroui/react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import moment from "moment";
import {
  FaArrowLeft,
  FaKey,
  FaGlobe,
  FaNetworkWired,
  FaPlus,
  FaEdit,
  FaSave,
  FaTimes,
  FaChartLine,
  FaClock,
} from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoTimerOutline, IoWarningOutline } from "react-icons/io5";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const ApiDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIps, setEditingIps] = useState(false);
  const [editingDomains, setEditingDomains] = useState(false);
  const [newIp, setNewIp] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [allowedIps, setAllowedIps] = useState([]);
  const [allowedDomains, setAllowedDomains] = useState([]);
  const [apiStats, setApiStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchApiKeyDetails();
    fetchApiStats();
  }, [id]);

  const fetchApiKeyDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/v1/institution/api-keys/${id}`);
      setApiKey(response.data.data);
      setAllowedIps(response.data.data.allowed_ips || []);
      setAllowedDomains(response.data.data.allowed_domains || []);
    } catch (error) {
      console.error("Error fetching API key details:", error);
      toast.error("Failed to fetch API key details");
    } finally {
      setLoading(false);
    }
  };

  const fetchApiStats = async () => {
    try {
      setStatsLoading(true);
      const response = await axios.get(`/v1/institution/api-keys/${id}/stats`);
      setApiStats(response.data.data);
    } catch (error) {
      console.error("Error fetching API stats:", error);
      toast.error("Failed to fetch API statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleShowSecret = async () => {
    try {
      const result = await Swal.fire({
        title: "Generate New Secret?",
        text: "This will generate a new API secret and invalidate the old one. Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#febf4c",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, generate new secret",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await axios.post(
          `/v1/institution/api-keys/${id}/show-secret`
        );

        await Swal.fire({
          title: "New API Secret Generated",
          html: `<div style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin: 10px 0;">
            <strong>New Secret:</strong><br>
            <code style="word-break: break-all;">${response.data.data.api_secret}</code>
          </div>
          <p><strong>Warning:</strong> This secret will not be shown again. Save it securely!</p>`,
          icon: "success",
          confirmButtonText: "I've saved it securely",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate new secret."
      );
    }
  };

  const handleUpdateWhitelist = async () => {
    try {
      setSaving(true);

      // Include required fields from the current API key data
      const updateData = {
        name: apiKey.name,
        scopes: apiKey.scopes || [],
        allowed_ips: allowedIps,
        allowed_domains: allowedDomains,
      };

      // Debug: Log the data being sent
      console.log("Sending whitelist update:", {
        ...updateData,
        allowedIps_type: typeof allowedIps,
        allowedDomains_type: typeof allowedDomains,
        allowedIps_isArray: Array.isArray(allowedIps),
        allowedDomains_isArray: Array.isArray(allowedDomains),
      });

      await axios.put(`/v1/institution/api-keys/${id}`, updateData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Whitelist updated successfully");
      setEditingIps(false);
      setEditingDomains(false);
      fetchApiKeyDetails();
    } catch (error) {
      console.error("Whitelist update error:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to update whitelist"
      );
    } finally {
      setSaving(false);
    }
  };

  const addIp = () => {
    if (newIp.trim() && !allowedIps.includes(newIp.trim())) {
      setAllowedIps([...allowedIps, newIp.trim()]);
      setNewIp("");
    }
  };

  const removeIp = (ipToRemove) => {
    setAllowedIps(allowedIps.filter((ip) => ip !== ipToRemove));
  };

  const addDomain = () => {
    if (newDomain.trim() && !allowedDomains.includes(newDomain.trim())) {
      setAllowedDomains([...allowedDomains, newDomain.trim()]);
      setNewDomain("");
    }
  };

  const removeDomain = (domainToRemove) => {
    setAllowedDomains(
      allowedDomains.filter((domain) => domain !== domainToRemove)
    );
  };

  const getRateLimitColor = (percentage) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const getRateLimitStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "danger";
      case "warning":
        return "warning";
      case "notice":
        return "primary";
      default:
        return "success";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              API Key Not Found
            </h2>
            <Button
              startContent={<FaArrowLeft />}
              onClick={() => navigate("/developers-api")}
              className="bg-red-500 text-white rounded-sm"
            >
              Back to API Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              startContent={<FaArrowLeft />}
              onClick={() => navigate("/developers-api")}
              variant="light"
              className="rounded-sm"
            >
              Back to API Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">{apiKey.name}</h1>
            <Chip
              color={apiKey.environment === "live" ? "success" : "default"}
              variant="flat"
            >
              {apiKey.environment}
            </Chip>
          </div>
          <Button
            startContent={<FaKey />}
            onClick={handleShowSecret}
            className="bg-red-500 text-white rounded-sm"
          >
            Generate New Secret
          </Button>
        </div>

        {/* Basic Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* API Key Information */}
          <div className="w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
              <div className="md:w-[3vw] md:h-[3vw] w-[10vw] h-[10vw] bg-[#50199d] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                <FaKey size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <h4 className="md:text-[1vw] text-[3vw] font-[600]">API Key</h4>
                <h4 className="md:text-[0.8vw] text-[3.5vw] text-gray-500">
                  {apiKey.api_key}
                </h4>
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-lg font-semibold text-gray-800">
                Environment
              </span>
              <Chip
                color={apiKey.environment === "live" ? "success" : "default"}
                variant="flat"
                size="sm"
              >
                {apiKey.environment}
              </Chip>
            </div>
          </div>

          {/* Created Date */}
          <div className="w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
              <div className="md:w-[3vw] md:h-[3vw] w-[10vw] h-[10vw] bg-[#1ec43c] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                <FaRegCircleCheck size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <h4 className="md:text-[1vw] text-[3vw] font-[600]">Created</h4>
                <h4 className="md:text-[0.8vw] text-[3.5vw] text-gray-500">
                  {moment(apiKey.created_at).format("MMM D, YYYY")}
                </h4>
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-lg font-semibold text-gray-800">
                {moment(apiKey.created_at).format("h:mm A")}
              </span>
            </div>
          </div>

          {/* Last Used */}
          <div className="w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
              <div className="md:w-[3vw] md:h-[3vw] w-[10vw] h-[10vw] bg-[#ff0404] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                <IoWarningOutline size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <h4 className="md:text-[1vw] text-[3vw] font-[600]">
                  Last Used
                </h4>
                <h4 className="md:text-[0.8vw] text-[3.5vw] text-gray-500">
                  {apiKey.last_used_at
                    ? moment(apiKey.last_used_at).format("MMM D, YYYY")
                    : "Never"}
                </h4>
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-lg font-semibold text-gray-800">
                {apiKey.last_used_at
                  ? moment(apiKey.last_used_at).format("h:mm A")
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Rate Limits */}
          <div className="w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
              <div className="md:w-[3vw] md:h-[3vw] w-[10vw] h-[10vw] bg-[#818712] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                <IoTimerOutline size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <h4 className="md:text-[1vw] text-[3vw] font-[600]">
                  Rate Limits
                </h4>
                <h4 className="md:text-[0.8vw] text-[3.5vw] text-gray-500">
                  Per minute: {apiKey.rate_limit_per_minute}
                </h4>
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-lg font-semibold text-gray-800">
                {apiKey.rate_limit_per_hour}
                <span className="md:text-[0.9vw] text-[3.5vw] text-gray-500">
                  /hour
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Rate Limiting Statistics */}
        {!statsLoading && apiStats?.rate_limit_data && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaChartLine className="text-blue-500" />
              Rate Limiting Statistics
            </h2>

            {/* Rate Limit Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {apiStats.rate_limit_data.threshold_alerts &&
                Object.entries(apiStats.rate_limit_data.threshold_alerts).map(
                  ([type, alert]) => (
                    <div
                      key={type}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize flex items-center gap-2">
                          <FaClock className="text-gray-500" />
                          {type} Limit
                        </h4>
                        <Chip
                          size="sm"
                          color={getRateLimitStatusColor(alert.status)}
                          variant="flat"
                        >
                          {alert.status.toUpperCase()}
                        </Chip>
                      </div>
                      <p
                        className={`text-2xl font-bold mb-2 ${getRateLimitColor(
                          alert.current_percentage
                        )}`}
                      >
                        {alert.current_percentage}%
                      </p>
                      <div className="space-y-1 text-xs">
                        <div
                          className={`flex items-center gap-1 ${
                            alert.threshold_75
                              ? "text-yellow-600"
                              : "text-gray-400"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              alert.threshold_75
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          75% Threshold
                        </div>
                        <div
                          className={`flex items-center gap-1 ${
                            alert.threshold_90
                              ? "text-orange-600"
                              : "text-gray-400"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              alert.threshold_90
                                ? "bg-orange-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          90% Threshold
                        </div>
                        <div
                          className={`flex items-center gap-1 ${
                            alert.threshold_95
                              ? "text-red-600"
                              : "text-gray-400"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              alert.threshold_95 ? "bg-red-500" : "bg-gray-300"
                            }`}
                          ></div>
                          95% Threshold
                        </div>
                      </div>
                    </div>
                  )
                )}
            </div>

            {/* Rate Limit Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Daily Rate Limit Usage */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Daily Rate Limit Usage (Last 7 Days)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={apiStats.rate_limit_data.daily_usage || []}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => moment(value).format("MM/DD")}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) =>
                          moment(value).format("MMM DD, YYYY")
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="total_requests"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        name="Total Requests"
                      />
                      <Line
                        type="monotone"
                        dataKey="day_limit"
                        stroke="#EF4444"
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        name="Daily Limit"
                      />
                      <Line
                        type="monotone"
                        dataKey="blocked_requests"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        name="Blocked Requests"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Hourly Rate Limit Usage */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Hourly Rate Limit Usage (Last 24 Hours)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={apiStats.rate_limit_data.hourly_usage || []}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="hour"
                        tickFormatter={(value) => moment(value).format("HH:mm")}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) =>
                          moment(value).format("MMM DD, HH:mm")
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="total_requests"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Total Requests"
                      />
                      <Line
                        type="monotone"
                        dataKey="hour_limit"
                        stroke="#EF4444"
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        name="Hourly Limit"
                      />
                      <Line
                        type="monotone"
                        dataKey="blocked_requests"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        name="Blocked Requests"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Blocked Requests Analysis */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Blocked Requests Analysis
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={apiStats.rate_limit_data.daily_usage || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => moment(value).format("MM/DD")}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) =>
                        moment(value).format("MMM DD, YYYY")
                      }
                    />
                    <Bar
                      dataKey="total_requests"
                      fill="#3B82F6"
                      name="Total Requests"
                    />
                    <Bar
                      dataKey="blocked_requests"
                      fill="#EF4444"
                      name="Blocked Requests"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Scopes Section */}
        <div className="mb-4">
          <div className="w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] md:p-[0.5vw] p-[2vw]">
              <h4 className="md:text-[1vw] text-[3vw] font-[600] mb-2">
                API Scopes
              </h4>
              <div className="flex flex-wrap gap-2">
                {apiKey.scopes?.map((scope, index) => (
                  <Chip key={index} size="sm" variant="flat" color="primary">
                    {scope}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* IP Whitelisting */}
        <div className="mt-6">
          <div className="w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] md:p-[0.5vw] p-[2vw]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <FaNetworkWired className="text-blue-500" />
                  <h2 className="md:text-[1vw] text-[3vw] font-[600]">
                    IP Whitelisting
                  </h2>
                </div>
                <Button
                  startContent={editingIps ? <FaSave /> : <FaEdit />}
                  onClick={() =>
                    editingIps ? handleUpdateWhitelist() : setEditingIps(true)
                  }
                  isLoading={saving}
                  className={
                    editingIps
                      ? "bg-green-500 text-white rounded-sm"
                      : "bg-blue-500 text-white rounded-sm"
                  }
                >
                  {editingIps ? "Save Changes" : "Edit"}
                </Button>
              </div>

              {editingIps ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter IP address (e.g., 192.168.1.1)"
                      value={newIp}
                      onChange={(e) => setNewIp(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addIp()}
                    />
                    <Button
                      startContent={<FaPlus />}
                      onClick={addIp}
                      className="bg-green-500 text-white rounded-sm"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allowedIps.map((ip, index) => (
                      <Chip
                        key={index}
                        onClose={() => removeIp(ip)}
                        variant="flat"
                        color="primary"
                      >
                        {ip}
                      </Chip>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      startContent={<FaTimes />}
                      onClick={() => {
                        setEditingIps(false);
                        setAllowedIps(apiKey.allowed_ips || []);
                        setNewIp("");
                      }}
                      variant="light"
                      className="rounded-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {allowedIps.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {allowedIps.map((ip, index) => (
                        <Chip key={index} variant="flat" color="primary">
                          {ip}
                        </Chip>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No IP restrictions (all IPs allowed)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Domain Whitelisting */}
        <div className="mt-6">
          <div className="w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] md:p-[0.5vw] p-[2vw]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <FaGlobe className="text-green-500" />
                  <h2 className="md:text-[1vw] text-[3vw] font-[600]">
                    Domain Whitelisting
                  </h2>
                </div>
                <Button
                  startContent={editingDomains ? <FaSave /> : <FaEdit />}
                  onClick={() =>
                    editingDomains
                      ? handleUpdateWhitelist()
                      : setEditingDomains(true)
                  }
                  isLoading={saving}
                  className={
                    editingDomains
                      ? "bg-green-500 text-white rounded-sm"
                      : "bg-blue-500 text-white rounded-sm"
                  }
                >
                  {editingDomains ? "Save Changes" : "Edit"}
                </Button>
              </div>

              {editingDomains ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter domain (e.g., example.com or *.example.com)"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addDomain()}
                    />
                    <Button
                      startContent={<FaPlus />}
                      onClick={addDomain}
                      className="bg-green-500 text-white rounded-sm"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allowedDomains.map((domain, index) => (
                      <Chip
                        key={index}
                        onClose={() => removeDomain(domain)}
                        variant="flat"
                        color="success"
                      >
                        {domain}
                      </Chip>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      • Use exact domains like <code>example.com</code>
                    </p>
                    <p>
                      • Use wildcards like <code>*.example.com</code> for
                      subdomains
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      startContent={<FaTimes />}
                      onClick={() => {
                        setEditingDomains(false);
                        setAllowedDomains(apiKey.allowed_domains || []);
                        setNewDomain("");
                      }}
                      variant="light"
                      className="rounded-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {allowedDomains.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {allowedDomains.map((domain, index) => (
                        <Chip key={index} variant="flat" color="success">
                          {domain}
                        </Chip>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No domain restrictions (all domains allowed)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDetails;
