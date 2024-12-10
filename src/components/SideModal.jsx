import React, { useEffect } from "react";

const SideModal = ({ title, children, setOpenModal, openModal }) => {
  const onClose = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    openModal
      ? (document.body.style.overflowY = "hidden")
      : (document.body.style.overflowY = "auto");
  }, [openModal]);
  return (
    <div
      className={`fixed right-[-100%] top-0 bottom-0 md:w-[34vw] w-full bg-white overflow-auto add-div pb-[2vw] z-[1001]  ${
        openModal && "open"
      }`}
    >
      <div className="tab-container">
        <div className="flex flex-col sticky top-0 z-[44]">
          <div className="flex border-b-2 border-[#DADADA] items-center justify-between md:px-[1vw] px-[5vw] py-[4%] bg-white">
            <h4 className="font-[600] md:text-[1.2vw] text-[5vw]">{title}</h4>
            <button
              onClick={onClose}
              className="new-btn md:w-[2vw] md:h-[2vw] h-[10vw] w-[10vw] rounded-[50%] flex justify-center items-center border-2 border-[#000] sticky top-0"
            >
              <i className="bx bx-x text-[#000] md:text-[1.5vw] text-[5vw]"></i>
            </button>
          </div>
        </div>
        {children}
      </div>
      <div className={`overlay ${openModal && "open"}`}></div>
    </div>
  );
};

export default SideModal;
