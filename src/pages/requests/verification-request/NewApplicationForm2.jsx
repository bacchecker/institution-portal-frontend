import React from "react";
import Swal from "sweetalert2";

function NewApplicationForm2({
  setCurrentScreen,
  setOpenModal,
  openModal,
  setCurrentTab,
  setSelectedStatus,
}) {
  const handleLaterPayment = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to make payment?",
      text: "The institution will not receive this document unless payment is made.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#febf4c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I'm sure",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      setOpenModal(false);
      setCurrentTab(2);
      setSelectedStatus({ title: "Created", value: "created" });
    }
  };

  return (
    <div className="w-full flex flex-col gap-[1vw]">
      <div className="w-full flex justify-center mt-[2vw]">
        <img
          src="/assets/img/hand.svg"
          alt=""
          className="md:w-[8vw] w-[15vw]"
        />
      </div>
      <div className="px-[1vw]">
        <h4 className="md:text-[1vw] text-[3.5vw] text-center">
          Your verification request has been successfully{" "}
          <span className="text-[#ff0404] font-[400]">created</span>. You can
          continue with the payment to submit your application to the
          institution for processing, or choose to make the payment later.
          Please note that the institution will only process your request once
          the{" "}
          <span className="text-[#ff0404] font-[400]">
            payment is completed.
          </span>
        </h4>
      </div>
      <div className="px-[2vw] flex justify-between items-center">
        <button
          type="button"
          onClick={handleLaterPayment}
          className="bg-[#FF0404] md:my-[2vw!important] my-[4vw!important] w-[45%] flex justify-center items-center md:py-[0.7vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#fa6767]"
        >
          <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
            Make Payment Later
          </h4>
        </button>
        <button
          type="button"
          onClick={() => setCurrentScreen(3)}
          className="bg-[#000] md:my-[2vw!important] my-[4vw!important] w-[45%] flex justify-center items-center md:py-[0.7vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#202020] transition-all duration-300 disabled:bg-[#fa6767]"
        >
          <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
            Continue Payment
          </h4>
        </button>
      </div>
    </div>
  );
}

export default NewApplicationForm2;