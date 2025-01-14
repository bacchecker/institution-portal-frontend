import React, {useState, useEffect} from "react";
import { Tabs, Tab } from "@nextui-org/react";
import IncomingRequests from "../requests/verification-request/IncomingRequests"
import OutgoingRequests from "./verification-request/OutgoingRequests";
import Navbar from "@/components/Navbar";
import axios from "@/utils/axiosConfig";
import { FaCircleArrowDown } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";


export default function VerificationRequest() {

  const [receivedRequest, setReceivedRequest] = useState(0);
  const [sentRequest, setSentRequest] = useState(0);
  const [subscription, setSubscription] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDashboardStats = async () => {
        try {
            const response = await axios.get("/institution/updated-subscription");
            setReceivedRequest(response.data.received_requests || 0); // Fallback to 0 if undefined
            setSentRequest(response.data.sent_requests || 0);
            setSubscription(response.data.subscription || {});
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchDashboardStats();
  }, []);

  const handleNavigation = () => {
    navigate("/subscription-plans"); // Navigate to the desired page
  };
  return (
    <>
    <div className="bg-white text-sm w-full">
        <Navbar />
        
        <div className="flex w-full flex-col">
          <Tabs
            aria-label="Options"
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
                  <MdDashboard size={20}/>
                  <span>Dashboard</span>
                  {/* <Chip size="sm" variant="faded">
                    {docRequest}
                  </Chip> */}
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 px-4 pt-4">
                <div className="bg-black text-white rounded-lg p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-lg">E-Check Subscription</p>
                    <button
                      onClick={handleNavigation}
                      className="text-[11px] uppercase text-green-600 rounded-full px-2 bg-green-100 border border-green-600"
                    >
                      Upgrade
                    </button>
                  </div>
                  
                  <div className="flex justify-between">
                    <p>Balance</p>
                    <p>{subscription?.total_credit || 0}</p>
                  </div>
                  
                </div>
                <div className="bg-black text-white rounded-lg p-5">
                  <p className="text-lg">Verification Sent</p>
                  <div className="flex justify-between">
                    <p>Count</p>
                    <p>{sentRequest}</p>
                  </div>
                  
                </div>
                <div className="bg-black text-white rounded-lg p-5">
                  <p className="text-lg">Verification Received</p>
                  <div className="flex justify-between">
                    <p>Count</p>
                    <p>{receivedRequest}</p>
                  </div>
                  
                </div>
              </div>   
            </Tab>
            
            <Tab
              key="music"
              title={
                <div className="flex items-center space-x-2">
                  <FaCircleArrowDown style={{ transform: 'rotate(-135deg)' }} size={20}/>
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
                  <FaCircleArrowDown className="rotate-45" size={20}/>
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
