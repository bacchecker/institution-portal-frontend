import { Select, SelectItem } from "@nextui-org/react";
import React, { useRef, useState } from "react";
import SunEditor from "suneditor-react";

function VerificationLetterTemplate({ institutionDocuments }) {
  const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });
  const [verificationSuccessfulTemplate, setVerificationSuccessfulTemplate] =
    useState("");
  const [
    verificationUnsuccessfulTemplate,
    setVerificationUnsuccessfulTemplate,
  ] = useState("");
  const lineRef = useRef(null);
  const [currentTab, setCurrentTab] = useState(1);
  const handleTabClick = (e) => {
    const target = e.target;
    setLineStyle({
      width: target.offsetWidth,
      left: target.offsetLeft,
    });
  };
  return (
    <div className="w-[70%] border border-[#ff040459] rounded-[0.5rem] p-4 content">
      <Select
        size="sm"
        label={
          <>
            Document Type
            <span className="text-[#ff0404]">*</span>
          </>
        }
        className="w-full border border-[#ff040459] rounded-[0.3rem] overflow-hidden"
        name="document_type_id"
        // onChange={(e) => handleItemChange(e, i)}
      >
        {institutionDocuments?.data?.types?.map((item) => (
          <SelectItem key={item?.id}>{item?.document_type?.name}</SelectItem>
        ))}
      </Select>
      <div className="w-full flex justify-end mt-4">
        {currentTab === 1 && (
          <button
            type="button"
            className="w-fit flex items-center bg-[#000000] hover:bg-[#282727] text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
          >
            Import Default Template
          </button>
        )}
        {currentTab === 2 && (
          <button
            type="button"
            className="w-fit flex items-center bg-[#000000] hover:bg-[#282727] text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
          >
            Import Default Template
          </button>
        )}
      </div>
      <div className="w-full border-b border-[#d5d6d6] flex md:mt-[3vw] mt-[8vw] md:gap-[2vw] gap-[6vw] relative">
        <button
          className={`text-[1rem] py-[0.3rem] ${
            currentTab === 1 && "text-[#ff0404]"
          }`}
          onClick={(e) => {
            handleTabClick(e);
            setCurrentTab(1);
          }}
        >
          Successful Template
        </button>
        <button
          className={`text-[1rem] py-[0.3rem] ${
            currentTab === 2 && "text-[#ff0404]"
          }`}
          onClick={(e) => {
            handleTabClick(e);
            setCurrentTab(2);
          }}
        >
          Unsuccessful Template
        </button>
        <div
          className="line"
          ref={lineRef}
          style={{
            width: `${lineStyle.width}px`,
            left: `${lineStyle.left}px`,
            position: "absolute",
            bottom: 0,
            height: "2px",
            backgroundColor: "#ff0404",
            transition: "all 0.3s ease",
          }}
        ></div>
      </div>
      {currentTab === 1 && (
        <div className="w-full mt-4 content">
          <SunEditor
            setContents={verificationSuccessfulTemplate}
            height="400"
            setOptions={{
              buttonList: [
                ["undo", "redo"],
                ["bold", "underline", "italic", "list", "align"],
                ["font", "fontSize", "italic", "list", "fontColor"],
                ["table", "horizontalRule", "link", "indent", "image"],
                ["formatBlock", "paragraphStyle", "fullScreen"],
              ],
            }}
            onChange={(verificationSuccessfulTemplate) =>
              setVerificationSuccessfulTemplate(verificationSuccessfulTemplate)
            }
          />
        </div>
      )}
      {currentTab === 2 && (
        <div className="w-full mt-4 content">
          <SunEditor
            setContents={verificationUnsuccessfulTemplate}
            height="400"
            setOptions={{
              buttonList: [
                ["undo", "redo"],
                ["bold", "underline", "italic", "list", "align"],
                ["font", "fontSize", "italic", "list", "fontColor"],
                ["table", "horizontalRule", "link", "indent", "image"],
                ["formatBlock", "paragraphStyle", "fullScreen"],
              ],
            }}
            onChange={(verificationUnsuccessfulTemplate) =>
              setVerificationUnsuccessfulTemplate(
                verificationUnsuccessfulTemplate
              )
            }
          />
        </div>
      )}
    </div>
  );
}

export default VerificationLetterTemplate;
