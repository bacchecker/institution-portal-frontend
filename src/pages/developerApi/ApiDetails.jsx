import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import axios from "@/utils/axiosConfig";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
  Input,
} from "@heroui/react";
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
} from "react-icons/fa";

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

  useEffect(() => {
    fetchApiKeyDetails();
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

      const response = await axios.put(
        `/v1/institution/api-keys/${id}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* API Key Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">API Key Information</h2>
              </CardHeader>
              <Divider />
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      API Key
                    </label>
                    <div className="mt-1 p-3 bg-gray-100 rounded-md font-mono text-sm">
                      {apiKey.api_key}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Environment
                    </label>
                    <div className="mt-1">
                      <Chip
                        color={
                          apiKey.environment === "live" ? "success" : "default"
                        }
                        variant="flat"
                      >
                        {apiKey.environment}
                      </Chip>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Created
                    </label>
                    <div className="mt-1 text-sm text-gray-800">
                      {moment(apiKey.created_at).format(
                        "MMM D, YYYY [at] h:mm A"
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Last Used
                    </label>
                    <div className="mt-1 text-sm text-gray-800">
                      {apiKey.last_used_at
                        ? moment(apiKey.last_used_at).format(
                            "MMM D, YYYY [at] h:mm A"
                          )
                        : "Never"}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Scopes
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {apiKey.scopes?.map((scope, index) => (
                      <Chip
                        key={index}
                        size="sm"
                        variant="flat"
                        color="primary"
                      >
                        {scope}
                      </Chip>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Rate Limits */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Rate Limits</h2>
              </CardHeader>
              <Divider />
              <CardBody className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Per Minute
                  </label>
                  <div className="mt-1 text-lg font-semibold">
                    {apiKey.rate_limit_per_minute}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Per Hour
                  </label>
                  <div className="mt-1 text-lg font-semibold">
                    {apiKey.rate_limit_per_hour}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Per Day
                  </label>
                  <div className="mt-1 text-lg font-semibold">
                    {apiKey.rate_limit_per_day}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* IP Whitelisting */}
        <div className="mt-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaNetworkWired className="text-blue-500" />
                <h2 className="text-xl font-semibold">IP Whitelisting</h2>
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
            </CardHeader>
            <Divider />
            <CardBody>
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
            </CardBody>
          </Card>
        </div>

        {/* Domain Whitelisting */}
        <div className="mt-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaGlobe className="text-green-500" />
                <h2 className="text-xl font-semibold">Domain Whitelisting</h2>
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
            </CardHeader>
            <Divider />
            <CardBody>
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
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApiDetails;
