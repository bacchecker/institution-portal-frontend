import { Select, SelectItem } from "@nextui-org/react";
import React, { useRef, useState } from "react";
import SunEditor from "suneditor-react";

function ValidationLetterTemplate({
  institutionDocuments,
  validationSuccessfulTemplate,
  setValidationSuccessfulTemplate,
  validationUnsuccessfulTemplate,
  setValidationUnsuccessfulTemplate,
}) {
  const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });
  const [defaultSuccessTemplate, setDefaultSuccessTemplate] = useState(
    `<p><br></p><p>[Institution Letterhead]<br>[Date]</p><p>[Recipient Name]<br>[Recipient Address]<br>[City, State, Zip Code]</p><p>Dear [Recipient Name],</p><p>Subject: Successful Validation</p><p>We are pleased to confirm that your validation request on ${institutionDocuments} has been successfully completed. All criteria have been met, and we appreciate your diligence in this process.</p><p>Should you have any further questions or need assistance, please feel free to reach out.</p><p>Best regards,</p><p>[Your Name]<br>[Your Title]<br>[Institution Name]<br>[Contact Information]</p>`
  );
  const [defaultUnsuccessTemplate, setDefaultUnsuccessTemplate] = useState(
    `<p><br></p><p>[Institution Letterhead]<br>[Date]</p><p>[Recipient Name]<br>[Recipient Address]<br>[City, State, Zip Code]</p><p>Dear [Recipient Name],</p><p>Subject: Unsuccessful Validation</p><p>We regret to inform you that your validation request has not been successful. The submission did not fulfill the necessary requirements.</p><p>We encourage you to review the criteria and resubmit your documentation. For any questions, please do not hesitate to contact us.</p><p>Thank you for your attention to this matter.</p><p>Sincerely,</p><p>[Your Name]<br>[Your Title]<br>[Institution Name]<br>[Contact Information]</p>`
  );

  const lineRef = useRef(null);
  const [currentTab, setCurrentTab] = useState(1);
  const handleTabClick = (e) => {
    const target = e.target;
    setLineStyle({
      width: target.offsetWidth,
      left: target.offsetLeft,
    });
  };
  const handleDefaultSuccessTemplate = () => {
    setValidationSuccessfulTemplate(defaultSuccessTemplate);
  };

  console.log("ffff", validationUnsuccessfulTemplate);

  return (
    <>
      <div className="w-full flex justify-end mt-4">
        {currentTab === 1 && (
          <button
            type="button"
            onClick={handleDefaultSuccessTemplate}
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
        <div className="w-full min-h-[50vh] mt-4 content">
          <SunEditor
            height="400"
            setContents={validationSuccessfulTemplate}
            setOptions={{
              buttonList: [
                ["undo", "redo"],
                ["bold", "underline", "italic", "list", "align"],
                ["font", "fontSize", "italic", "list", "fontColor"],
                ["table", "horizontalRule", "link", "indent", "image"],
                ["formatBlock", "paragraphStyle", "fullScreen"],
              ],
            }}
            onChange={(validationSuccessfulTemplate) =>
              setValidationSuccessfulTemplate(validationSuccessfulTemplate)
            }
          />
          <button
            type="button"
            className="w-fit flex mt-2 items-center bg-[#000000] hover:bg-[#282727] text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
          >
            Preview Template
          </button>
          <div
            dangerouslySetInnerHTML={{ __html: validationSuccessfulTemplate }}
          />
        </div>
      )}
      {currentTab === 2 && (
        <div className="w-full min-h-[50vh] mt-4 content">
          <SunEditor
            height="400"
            setContents={validationUnsuccessfulTemplate}
            setOptions={{
              buttonList: [
                ["undo", "redo"],
                ["bold", "underline", "italic", "list", "align"],
                ["font", "fontSize", "italic", "list", "fontColor"],
                ["table", "horizontalRule", "link", "indent", "image"],
                ["formatBlock", "paragraphStyle", "fullScreen"],
              ],
            }}
            onChange={(validationUnsuccessfulTemplate) =>
              setValidationUnsuccessfulTemplate(validationUnsuccessfulTemplate)
            }
          />
        </div>
      )}
    </>
  );
}

export default ValidationLetterTemplate;
