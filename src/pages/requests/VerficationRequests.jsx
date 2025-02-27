import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import IncomingRequests from "../requests/verification-request/IncomingRequests"
import OutgoingRequests from "./verification-request/OutgoingRequests";
import Navbar from "@/components/Navbar";
import axios from "@/utils/axiosConfig";
import { FaCircleArrowDown, FaCreditCard } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { HiMiniUsers } from "react-icons/hi2";
import { IoMdTrendingUp } from "react-icons/io";
import Dashboard from "./verification-request/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTab } from "../../redux/baccheckerSlice";

export default function VerificationRequest() {
  const dispatch = useDispatch()
  const [receivedRequest, setReceivedRequest] = useState(0);
  const [sentRequest, setSentRequest] = useState(0);
  const [subscription, setSubscription] = useState("");
  const [selectedCurrentTab, setSelectedCurrentTab] = useState("");
  const navigate = useNavigate();

  let selectedTab = useSelector((state) => state.bacchecker.selectedTab);


  useEffect(() => {
    if (selectedTab) {
      setSelectedCurrentTab(selectedTab)
    }
  }, [selectedTab])


  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get("/institution/verification/dashboard-data");
        setReceivedRequest(response.data.received_requests || 0);
        setSentRequest(response.data.sent_requests || 0);
        setSubscription(response.data.subscription || {});
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleTabSelect = (key) => {
    dispatch(setSelectedTab(key))
    setSelectedCurrentTab(key);
  };

  const handleNavigation = () => {
    navigate("/subscription-plans");
  };
  return (
    <>
      <div className="bg-white text-sm w-full">
        <Navbar />

        <div className="flex w-full flex-col">
          <Tabs
            aria-label="Options"
            defaultSelectedKey={selectedTab}
            onSelectionChange={handleTabSelect}
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-bChkRed",
              tab: "max-w-fit px-2 h-[50px]",
              tabContent: "group-data-[selected=true]:text-bChkRed",
            }}
            color="danger"
            variant="underlined"
          >
            <Tab
              key="dashboard"
              title={
                <div className="flex items-center space-x-2">
                  <MdDashboard size={20} />
                  <span>Dashboard</span>
                  {/* <Chip size="sm" variant="faded">
                    {docRequest}
                  </Chip> */}
                </div>
              }
            >
              <Dashboard />
            </Tab>

            <Tab
              key="music"
              title={
                <div className="flex items-center space-x-2">
                  <FaCircleArrowDown style={{ transform: 'rotate(-135deg)' }} size={20} />
                  <span>Verification Request Sent</span>
                  {/* <Chip size="sm" variant="faded">
                    {docRequest}
                  </Chip> */}
                </div>
              }
            >
              <OutgoingRequests />
            </Tab>
            <Tab
              key="document"
              title={
                <div className="flex items-center space-x-2">
                  <FaCircleArrowDown className="rotate-45" size={20} />
                  <span>Verification Request Received</span>
                  {/* <Chip size="sm" variant="faded">
                    {docRequest}
                  </Chip> */}
                </div>
              }
            >
              <IncomingRequests />
            </Tab>
          </Tabs>
        </div>

      </div>

    </>
  );
}
