import { useState } from "react";
import {Tabs, Tab,} from "@nextui-org/react";
import { IoDocuments, IoShieldCheckmark } from "react-icons/io5";
import Navbar from "@/components/Navbar";
import secureLocalStorage from "react-secure-storage";
import PaymentSplits from "./PaymentSplits";
import Payouts from "./Payouts";
import { FaAmazonPay } from "react-icons/fa6";
import { TbMoneybag } from "react-icons/tb";

export default function Payment() {

const [splitTotal, setSplitTotal] = useState(0);
const [payoutTotal, setPayoutTotal] = useState(0);
const [institutionBalance, setInstitutionBalance] = useState(0);

  return (
    <div className="bg-white text-sm w-full">
      <Navbar />
      <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-[1vw] md:gap-[0.5vw] p-2">
        <div className="w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
                <div className="md:w-[2.5vw] md:h-[2.5vw] w-[9vw] h-[9vw] bg-[#ff0404] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                    <TbMoneybag size={22} className="text-white"/>
                </div>
                <div className="flex flex-col">
                  <h4 className="md:text-[1.3vw] text-[4vw] font-[600]">
                    <span className="md:text-[1.0vw] text-[3.9vw]">GH₵ </span>
                    {parseFloat(splitTotal ?? 0).toFixed(2)}
                  </h4>
                </div>
            </div>
            <h4 className="md:text-[1vw] text-[3vw] md:mt-[0.5vw] mt-[1vw] mb-[0.3vw] ml-2 font-bold">
                Total Revenue
            </h4>
        </div>
        <div className="w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
                <div className="md:w-[2.5vw] md:h-[2.5vw] w-[9vw] h-[9vw] bg-[#EC7AFF] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                    <FaAmazonPay size={26} className="text-white"/>
                </div>
                <div className="flex flex-col">
                    <h4 className="md:text-[1.3vw] text-[4vw] font-[600]">
                        <span className="md:text-[1.0vw] text-[3.9vw]">GH₵ </span>
                        {parseFloat(payoutTotal ?? 0).toFixed(2)}
                    </h4>
                </div>
            </div>
            <h4 className="md:text-[1vw] text-[3vw] md:mt-[0.5vw] mt-[1vw] mb-[0.3vw] ml-2 font-bold">
                Total Payouts
            </h4>
        </div>
        <div className="w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
                <div className="md:w-[2.5vw] md:h-[2.5vw] w-[9vw] h-[9vw] bg-[#FFC130] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                    <img src="/assets/img/docx.svg" alt="" className="md:w-[1.5vw] w-[5vw]" />
                </div>
                <div className="flex flex-col">
                    <h4 className="md:text-[1.3vw] text-[4vw] font-[600]">
                      <span className="md:text-[1.0vw] text-[3.9vw]">GH₵ </span>
                        {parseFloat(institutionBalance ?? 0).toFixed(2)}
                    </h4>
                    
                </div>
            </div>
            <h4 className="md:text-[1vw] text-[3vw] md:mt-[0.5vw] mt-[1vw] mb-[0.3vw] ml-2 font-bold">
               Institution Balance
            </h4>
        </div>
      </div>
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-bChkRed",
            tab: "max-w-fit px-2 h-[52px]",
            tabContent: "group-data-[selected=true]:text-bChkRed",
          }}
          color="danger"
          variant="underlined"
        >
          {(secureLocalStorage.getItem('userPermissions')?.includes('institution.payments.view') || 
            JSON.parse(secureLocalStorage.getItem('userRole'))?.isAdmin) && (
            <Tab
              key="document"
              title={
                <div className="flex items-center space-x-2">
                  {/* <IoDocuments size={20} /> */}
                  <span>Payment Records</span>
                </div>
              }
            >
              <PaymentSplits onTotalChange={setSplitTotal} onInstitutionBalance={setInstitutionBalance}/>
            </Tab>
          )}

          {(secureLocalStorage.getItem('userPermissions')?.includes('institution.payments.view') || 
            JSON.parse(secureLocalStorage.getItem('userRole'))?.isAdmin) && (
              <Tab
                key="validation"
                title={
                  <div className="flex items-center space-x-2">
                    {/* <IoShieldCheckmark size={20} /> */}
                    <span>Institution Payouts</span>
                  </div>
                }
              >
                <Payouts onTotalChange={setPayoutTotal} />

              </Tab>
          )}

        </Tabs>

      </div>
    </div>
  );
}
