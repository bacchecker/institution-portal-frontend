import { Spinner } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";
import SunEditor from "suneditor-react";
import useSWR, { mutate } from "swr";
import axios from "@utils/axiosConfig";

function VerificationLetterTemplate({
  verificationSuccessfulTemplate,
  setVerificationSuccessfulTemplate,
  verificationUnsuccessfulTemplate,
  setVerificationUnsuccessfulTemplate,
  userInput,
  validationSuccessfulTemplate,
  validationUnsuccessfulTemplate,
  setCurrentTempTab,
  setCurrentScreen,
}) {
  const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });
  const [defaultSuccessTemplate, setDefaultSuccessTemplate] = useState("");
  const [defaultUnsuccessTemplate, setDefaultUnsuccessTemplate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
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
    setVerificationSuccessfulTemplate(defaultSuccessTemplate);
  };

  const handleDefaultUnSuccessTemplate = () => {
    setVerificationUnsuccessfulTemplate(defaultUnsuccessTemplate);
  };

  useEffect(() => {
    const academicSuccessDefault = `<p><br></p><p><br>{institutionName}</p><p><br></p><p><strong>Address</strong>:&nbsp;</p><p>{institutionAddress}</p><p>{institutionRegion}</p><p><br></p><p><strong>Phone</strong>:&nbsp;{helplineContact}</p><p><strong>Email</strong>:&nbsp;{institutionEmail}</p><p><strong>Website</strong>:&nbsp;{institutionWebsiteURL}</p><p><br>{dateOfLetter}</p><p><br></p><p>To Whom It May Concern or who the letter is addressed:<br><br>Subject: Verification of {firstName} {otherName} {lastName}’s {documentTypeName}<br><br>This letter serves to confirm that {firstName}{otherName}{lastName} was a student at {institutionName}, and we have completed the verification process of their {documentTypeName}.<br><br>Based on our records, we verify that the following details are accurate:<br><br>• Full Name:&nbsp;{firstName}{otherName}{lastName}<br>• Student ID Number: {indexNumber}<br>• Degree Awarded: {programOfStudy}<br>• Graduation Date: {programEndYear}<br><br>The transcript presented for verification matches the official records held by {institutionName}. This document has been confirmed to meet all the specified criteria required by our institution for verification.<br><br>Should you require any additional information or further confirmation, please do not hesitate to contact our office at {helplineContact}.<br><br>Sincerely,&nbsp;</p><p><br></p><p>{validatedBy}<br>{position}</p><p>{validatedByEmail}<br>{institutionName}<br>{institutionAddress}</p>`;

    const nonacademicSuccessDefault = `<p><strong>{institutionName}</strong></p><p><strong><br></strong></p><p><strong>Address:</strong><br>{institutionAddress}<br>{institutionRegion}</p><p><br></p><p><strong>Phone:</strong> {helplineContact}<br><strong>Email:</strong> {institutionEmail}<br><strong>Website:</strong> {institutionWebsiteURL}</p><p><br></p><p><strong>{dateOfLetter}</strong></p><p><strong><br></strong></p><p>To Whom It May Concern or who the letter is addressed:</p><p><br></p><p><strong>Subject:</strong> Verification of {firstName} {otherName} {lastName}’s {documentTypeName}</p><p><br></p><p>This letter serves to confirm that {firstName} {otherName} {lastName} was associated with {institutionName}, and we have completed the verification process of their {documentTypeName}.</p><p><br></p><p>Based on our records, we verify that the following details are accurate:</p><ul><li><strong>Full Name:</strong> {firstName} {otherName} {lastName}</li><li><strong>Employee ID Number:</strong> {employeeID}<br></li><li><strong>Start Year:</strong> {programStartYear}</li></ul><p>The document presented for verification matches the official records held by {institutionName}. This document has been confirmed to meet all the specified criteria required by our institution for verification.</p><p><br></p><p>Should you require any additional information or further confirmation, please do not hesitate to contact our office at {helplineContact}.</p><p><br></p><p>Sincerely,</p><p>{validatedBy}<br>{position}<br>{validatedByEmail}<br>{institutionName}<br>{institutionAddress}</p>`;

    const academicUnsuccessDefault = `<p><br></p><p>{institutionName}</p><p><br></p><p><strong>Address</strong>:&nbsp;</p><p>{institutionAddress}</p><p>{institutionRegion}</p><p><br></p><p><strong>Phone</strong>:&nbsp;{helplineContact}</p><p><strong>Email</strong>:&nbsp;{institutionEmail}</p><p><strong>Website</strong>:&nbsp;{institutionWebsiteURL}</p><p><br>{dateOfLetter}</p><p><br></p><p>Subject: Discrepancy Found in the Verification of {firstName} {otherName} {lastName}’s {documentTypeName}<br><br>Dear Sir/Madam,<br><br>This letter is to inform you that during our verification process for the academic transcript submitted by [Applicant Name], we have identified significant discrepancies that prevent us from confirming the authenticity of the document.<br><br>The following issues were found:<br><br>	•	Applicant Name: {firstName} {otherName} {lastName}<br>	•	Student ID Number: {indexNumber}<br>	•	Document Submitted: {documentTypeName}<br>	•	Reason for Rejection: {rejectedReason}<br><br>After a thorough review of our official records, we were unable to validate the transcript provided as an accurate representation of the individual’s academic achievements at {institutionName}. This document does not match the official records maintained by our institution.<br><br>Furthermore, our investigation has raised concerns that the document may have been tampered with or fraudulently altered. As a result, we are unable to verify the legitimacy of the submitted credential.<br><br>We take such matters very seriously and have made a formal note of this discrepancy in our records. Please contact us directly if you require further clarification or wish to discuss the findings.<br><br>Should you have any questions, or if [Applicant Name] would like to provide additional information for further review, please feel free to reach out to our office at {helplineContact}.<br><br>Sincerely,<br></p><p><br></p><p>{validatedBy}<br>{position}</p><p>{validatedByEmail}<br>{institutionName}<br>{institutionAddress}</p><p><br></p><p><br></p><p><br></p>`;

    const nonacademicUnsuccessDefault = `<p><strong>{institutionName}</strong></p><p><strong><br></strong></p><p><strong>Address:</strong><br>{institutionAddress}<br>{institutionRegion}</p><p><br></p><p><strong>Phone:</strong> {helplineContact}<br><strong>Email:</strong> {institutionEmail}<br><strong>Website:</strong> {institutionWebsiteURL}</p><p><br></p><p><strong>{dateOfLetter}</strong></p><p><strong><br></strong></p><p><strong>Subject:</strong> Discrepancy Found in the Verification of {firstName} {otherName} {lastName}’s {documentTypeName}</p><p><br></p><p>Dear Sir/Madam,</p><p><br></p><p>This letter is to inform you that during our verification process for the document submitted by {firstName} {otherName} {lastName}, we have identified significant discrepancies that prevent us from confirming the authenticity of the document.</p><p><br></p><p>The following issues were found:</p><ul><li><strong>Applicant Name:</strong> {firstName} {otherName} {lastName}</li><li><strong>Employee ID Number:</strong> {employeeID}</li><li><strong>Document Submitted:</strong> {documentTypeName}</li><li><strong>Reason for Rejection:</strong> {rejectedReason}</li></ul><p>After a thorough review of our official records, we were unable to validate the document provided as an accurate representation of the individual’s professional qualifications at {institutionName}. This document does not match the official records maintained by our institution.</p><p><br></p><p>Furthermore, our investigation has raised concerns that the document may have been tampered with or fraudulently altered. As a result, we are unable to verify the legitimacy of the submitted credential.</p><p><br></p><p>We take such matters very seriously and have made a formal note of this discrepancy in our records. Please contact us directly if you require further clarification or wish to discuss the findings.</p><p><br></p><p>Should you have any questions, or if {firstName} {otherName} {lastName} would like to provide additional information for further review, please feel free to reach out to our office at {helplineContact}.</p><p><br></p><p>Sincerely,</p><p>{validatedBy}<br>{position}<br>{validatedByEmail}<br>{institutionName}<br>{institutionAddress}</p>`;

    if (institution?.type === "bacchecker-academic") {
      setDefaultSuccessTemplate(academicSuccessDefault);
      setDefaultUnsuccessTemplate(academicUnsuccessDefault);
    } else {
      setDefaultSuccessTemplate(nonacademicSuccessDefault);
      setDefaultUnsuccessTemplate(nonacademicUnsuccessDefault);
    }
  }, [institution]);

  const handleBackButton = () => {
    setCurrentTempTab(1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { document_type_id } = userInput;

    if (
      !validationSuccessfulTemplate ||
      !validationUnsuccessfulTemplate ||
      !verificationSuccessfulTemplate ||
      !verificationUnsuccessfulTemplate ||
      !document_type_id
    ) {
      toast.error("Set successful and unsuccessful verification templates", {
        position: "top-right",
        autoClose: 1202,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      setIsSaving(true);

      const data = {
        document_type_id: document_type_id,
        positive_validation_response: validationSuccessfulTemplate,
        negative_validation_response: validationUnsuccessfulTemplate,
        positive_verification_response: verificationSuccessfulTemplate,
        negative_verification_response: verificationUnsuccessfulTemplate,
      };
      try {
        const response = await axios.post(
          "/institution/letter-templates",
          data
        );
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1202,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        mutate("/institution/letter-templates");
        secureLocalStorage.setItem("letterTemplateScreen", 1);
        setCurrentScreen(1);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        setIsSaving(false);
      } finally {
        setIsSaving(false);
        return true;
      }
    }
  };

  return (
    <>
      <h4 className="text-[1rem] mt-[1rem]">
        This section is for setting templates for{" "}
        <span className="text-[#ff0404]">successful verification</span> and{" "}
        <span className="text-[#ff0404]">unsuccessful verification</span>{" "}
        templates. Toggle between "
        <span className="text-[#ff0404]">Successful Template</span>" and "
        <span className="text-[#ff0404]">Unsuccessful Template</span>" tabs to
        set templates for each institance.
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
        <div className="w-full mt-4 content">
          <SunEditor
            setContents={verificationSuccessfulTemplate}
            height="600"
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
            height="600"
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
      <div className="flex w-full justify-between mt-4">
        <button
          type="button"
          onClick={handleBackButton}
          className="flex items-center bg-[#ffffff] border border-[#ff0404] hover:bg-[#ff0404] text-[#ff0404] hover:text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
        >
          <FaAnglesLeft className="mr-2" />
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className={`flex items-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 rounded-[0.3rem] font-medium ${
            isSaving && "cursor-not-allowed bg-[#f77f7f]"
          }`}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Spinner size="sm" color="white" />
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            <>
              Save Template
              <FaAnglesRight className="ml-2" />
            </>
          )}
        </button>
      </div>
    </>
  );
}

export default VerificationLetterTemplate;
