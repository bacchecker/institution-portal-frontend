import React, { useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";
import SunEditor from "suneditor-react";

function ValidationLetterTemplate({
  validationSuccessfulTemplate,
  setValidationSuccessfulTemplate,
  validationUnsuccessfulTemplate,
  setValidationUnsuccessfulTemplate,
  setCurrentTempTab,
  userInput,
}) {
  const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });
  const [defaultSuccessTemplate, setDefaultSuccessTemplate] = useState("");
  const [defaultUnsuccessTemplate, setDefaultUnsuccessTemplate] = useState("");

  const lineRef = useRef(null);
  const [currentTab, setCurrentTab] = useState(1);
  const institution = secureLocalStorage.getItem("institution");

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

  const handleDefaultUnSuccessTemplate = () => {
    setValidationUnsuccessfulTemplate(defaultUnsuccessTemplate);
  };

  useEffect(() => {
    const academicSuccessDefault = `<p><br>{institutionName}</p><p><br></p><p><strong>Address</strong>:&nbsp;</p><p>{institutionAddress}</p><p>{institutionRegion}</p><p><br></p><p><strong>Phone</strong>:&nbsp;{helplineContact}</p><p><strong>Email</strong>:&nbsp;{institutionEmail}</p><p><strong>Website</strong>:&nbsp;{institutionWebsiteURL}</p><p><br>{dateOfLetter}</p><p><br>To Whom It May Concern or who the letter is addressed:</p><p><br>Subject: Validation of&nbsp;{firstName}{otherName}{lastName}’s {documentTypeName}</p><p><br>This letter is issued to validate the authenticity of the {documentTypeName} provided by {firstName}{otherName}{lastName}, who was a student at {institutionName}.</p><p><br>Our validation process confirms that the {documentTypeName} is a true and accurate reflection of the academic performance of {firstName}{otherName}{lastName}, based on the following details:<br>	&nbsp;&nbsp;&nbsp;&nbsp;•	Full Name: {firstName}{otherName}{lastName}<br>	&nbsp;&nbsp;&nbsp;&nbsp;•	Student ID Number:&nbsp;{indexNumber}<br>	&nbsp;&nbsp;&nbsp;&nbsp;•	Program of Study:&nbsp;{programOfStudy}<br>	&nbsp;&nbsp;&nbsp;&nbsp;•	Period of Enrollment: {programStartYear} - {programEndYear}<br>	&nbsp;&nbsp;&nbsp;&nbsp;•	Graduation Date:&nbsp;{programEndYear}</p><p><br>This {documentTypeName}&nbsp;has been reviewed and validated by {institutionName}&nbsp;and confirms that {firstName}{otherName}{lastName} completed the requirements for the award of {programOfStudy}. All information provided is consistent with the original academic records in our database.</p><p><br>For any further inquiries or requests for additional documentation, please contact our office at {helplineContact}.<br>Sincerely,</p><p><br>{validatedBy}<br>{position}</p><p>{validatedByEmail}<br>{institutionName}<br>{institutionAddress}</p>`;

    const academicUnsuccessDefault = `<p><br></p><p><strong>{institutionName}</strong></p><p><strong><br></strong></p><p><strong>Address:</strong></p><p>{institutionAddress}</p><p>{institutionRegion}</p><p><br></p><p><strong>Phone:</strong> {helplineContact}</p><p><strong>Email:</strong> {institutionEmail}</p><p><strong>Website:</strong> {institutionWebsiteURL}</p><p><br></p><p><strong>{dateOfLetter}</strong></p><p><strong><br></strong></p><p>To Whom It May Concern or [specific recipient if known]:</p><p><br></p><p><strong>Subject: Validation Result for {firstName} {otherName} {lastName}’s {documentTypeName}</strong></p><p><strong><br></strong></p><p>This letter is issued regarding the validation request for the {documentTypeName} submitted by {firstName} {otherName} {lastName}, who was associated with {institutionName}.</p><p><br></p><p>After a thorough review of our records, we regret to inform you that we could not validate the authenticity of the {documentTypeName} for the following reasons:</p><ul><li><strong>Full Name:</strong> {firstName} {otherName} {lastName}</li><li><strong>Student ID Number:</strong> {indexNumber}</li><li><strong>Program of Study:</strong> {programOfStudy}</li><li><strong>Period of Enrollment:</strong> {programStartYear} - {programEndYear}</li></ul><p><br></p><p>Despite our efforts to locate the relevant records, we found discrepancies that prevent us from confirming the validity of the provided document. Specifically, {rejectedReason}.</p><p><br></p><p>We recommend that {firstName} {otherName} {lastName} contact our office directly for further assistance or clarification regarding this matter.</p><p><br></p><p>For any further inquiries, please reach out to our office at {helplineContact}.</p><p>Sincerely,</p><p><br></p><p>{validatedBy}<br>{position}<br>{validatedByEmail}<br>{institutionName}<br>{institutionAddress}</p>`;

    if (institution?.type === "bacchecker-academic") {
      setDefaultSuccessTemplate(academicSuccessDefault);
      setDefaultUnsuccessTemplate(academicUnsuccessDefault);
    } else {
      setDefaultSuccessTemplate(academicSuccessDefault);
    }
  }, [institution]);

  const handleProceedButton = () => {
    if (
      !userInput?.document_type_id ||
      !validationSuccessfulTemplate ||
      !validationUnsuccessfulTemplate
    ) {
      toast.error(
        "Select Document Type and design successful and unsuccessful validation templates",
        {
          position: "top-right",
          autoClose: 1202,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    } else {
      setCurrentTempTab(2);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <h4 className="text-[1rem] mt-[1rem]">
        This section is for setting templates for{" "}
        <span className="text-[#ff0404]">successful validation</span> and{" "}
        <span className="text-[#ff0404]">unsuccessful validation </span>{" "}
        templates. Toggle between "
        <span className="text-[#ff0404]">Successful Template</span>" and "
        <span className="text-[#ff0404]">Unsuccessful Template</span>" tabs to
        set templates for each institance. <br />
        <br /> <span className="text-[#ff0404]">Note</span>: use "
        <span className="text-[#ff0404]">
          Proceed to Verification Templates
        </span>
        " Button below the editor to set verification templates to complete
        process"
      </h4>
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
            onClick={handleDefaultUnSuccessTemplate}
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
            height="600"
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
        </div>
      )}
      {currentTab === 2 && (
        <div className="w-full min-h-[50vh] mt-4 content">
          <SunEditor
            height="600"
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
      <div className="w-full flex justify-end mt-4">
        <button
          type="button"
          onClick={handleProceedButton}
          className="w-fit flex items-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
        >
          Proceed to Verification Templates
        </button>
      </div>
    </>
  );
}

export default ValidationLetterTemplate;