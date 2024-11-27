import React from "react";

function LeftDivLoginSignup() {
  return (
    <div className="w-[50%] h-full rounded-tr-[0.7vw] rounded-br-[0.7vw] overflow-hidden display-sm-none sticky top-0">
      <img
        src="/assets/img/j.png"
        alt=""
        className="w-full h-full object-cover"
      />
      <div className="absolute w-[80%] top-[14%] left-[50%] translate-x-[-50%] flex gap-[8vw] h-[fit-content] flex-col">
        <div className="text-center w-full">
          <h1 className="text-white text-[2.3vw] font-[700!important] leading-[3.5vw] mb-[1vw]">
            “Secure and Efficient Document <br />
            Verification”
          </h1>
          <h4 className="text-[1vw] text-white">
            Enjoy digital verification convenience. Submit documents, <br />
            track in real time, and receive results effortlessly.
          </h4>
        </div>
        <div className="animated-div">
          <div className="flex flex-col gap-[1vw] animated-inner-div">
            <div className="px-[4vw] flex relative">
              <img
                src="/assets/img/leftquote.svg"
                alt=""
                className="mt-[-14%] w-[2vw]"
              />
              <h4 className="text-[1.1vw] text-white font-[500!important]">
                Thanks to Bacchecker, we can trust the authenticity of our
                candidates' credentials. It has been a game-changer for our
                recruitment.
              </h4>
              <img
                src="/assets/img/rightquote.svg"
                alt=""
                className="mt-[10%] bottom-[-0.3vw] right-[16.5vw] w-[2vw] absolute"
              />
            </div>
            <div className="flex items-center px-[5.5vw] gap-[0.5vw]">
              <img src="/assets/img/hr.svg" alt="" className="w-[3vw]" />
              <h4 className="text-[1vw] text-white font-[700!important]">
                John D., HR Manager
              </h4>
            </div>
          </div>
          <div className="flex flex-col gap-[1vw] animated-inner-div">
            <div className="px-[4vw] flex relative">
              <img
                src="/assets/img/leftquote.svg"
                alt=""
                className="mt-[-14%] w-[2vw]"
              />
              <h4 className="text-[1.1vw] text-white font-[500!important]">
                Thanks to Bacchecker, we can trust the authenticity of our
                candidates' credentials. It has been a game-changer for our
                recruitment.
              </h4>
              <img
                src="/assets/img/rightquote.svg"
                alt=""
                className="mt-[10%] bottom-[-0.3vw] right-[16.5vw] w-[2vw] absolute"
              />
            </div>
            <div className="flex items-center px-[5.5vw] gap-[0.5vw]">
              <img src="/assets/img/hr.svg" alt="" className="w-[3vw]" />
              <h4 className="text-[1vw] text-white font-[700!important]">
                John D., HR Manager
              </h4>
            </div>
          </div>
          <div className="flex flex-col gap-[1vw] animated-inner-div">
            <div className="px-[4vw] flex relative">
              <img
                src="/assets/img/leftquote.svg"
                alt=""
                className="mt-[-14%] w-[2vw]"
              />
              <h4 className="text-[1.1vw] text-white font-[500!important]">
                Thanks to Bacchecker, we can trust the authenticity of our
                candidates' credentials. It has been a game-changer for our
                recruitment.
              </h4>
              <img
                src="/assets/img/rightquote.svg"
                alt=""
                className="mt-[10%] bottom-[-0.3vw] right-[16.5vw] w-[2vw] absolute"
              />
            </div>
            <div className="flex items-center px-[5.5vw] gap-[0.5vw]">
              <img src="/assets/img/hr.svg" alt="" className="w-[3vw]" />
              <h4 className="text-[1vw] text-white font-[700!important]">
                John D., HR Manager
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftDivLoginSignup;
