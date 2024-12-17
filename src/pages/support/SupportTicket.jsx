import React, { useState } from "react";
import CreateTicket from "./CreateTicket";
import TicketTable from "./TicketTable";

function SupportTicket() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="bg-white pt-[2vw] px-[1vw]">
      <div className="flex justify-between application-flex">
        <div>
          <div className="flex md:items-center gap-[1.5vw]">
            <h4 className="md:text-[1.5vw] text-[5vw] font-[600]">
              Support Ticket
            </h4>
            <div className="display-no-sm w-[5vw] h-[2.2vw] border border-[#353535] rounded-[4vw] flex items-center px-[0.3vw] gap-[0.5vw] cursor-pointer">
              <div className="w-[1.5vw] h-[1.5vw] rounded-[50%] border border-[#353535] flex items-center justify-center">
                <i className="bx bx-question-mark text-[1vw]"></i>
              </div>
              <h4 className="text-[1vw]">Help</h4>
            </div>
          </div>
          <h4 className="md:mt-[1vw] mt-[2vw] md:text-[1.1vw] text-[3.5vw] text-[#5A5A5A]">
            Create a formal report of a service when they need
            <br />
            help or encounter a problem.
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="new-btn bg-[#FF0404] md:w-[13vw] w-[50vw] md:mt-0 mt-[3vw] flex justify-center items-center md:py-[0.7vw] py-[2vw] h-[fit-content] md:rounded-[0.5vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300"
        >
          <i className="bx bx-plus text-[#fff] md:text-[1.2vw] text-[5vw]"></i>
          <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
            Create Ticket
          </h4>
        </button>
      </div>

      <TicketTable />

      <CreateTicket setOpenModal={setOpenModal} openModal={openModal} />
    </div>
  );
}

export default SupportTicket;
