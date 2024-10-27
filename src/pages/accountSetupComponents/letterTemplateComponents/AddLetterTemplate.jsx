import React, { useState } from "react";
import { FaAnglesLeft } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage";
import axios from "@utils/axiosConfig";
import ValidationLetterTemplate from "./addLetterTemplateComponents/ValidationLetterTemplate";
import VerificationLetterTemplate from "./addLetterTemplateComponents/VerificationLetterTemplate";
import { Select, SelectItem } from "@nextui-org/react";
import useSWR from "swr";

function AddLetterTemplate({ setCurrentScreen }) {
  const initialUserInput = {
    document_type_id: "",
  };
  const [userInput, setUserInput] = useState(initialUserInput);
  const [currentTempTab, setCurrentTempTab] = useState(1);
  const [validationSuccessfulTemplate, setValidationSuccessfulTemplate] =
    useState("");
  const [validationUnsuccessfulTemplate, setValidationUnsuccessfulTemplate] =
    useState("");

  const [verificationSuccessfulTemplate, setVerificationSuccessfulTemplate] =
    useState("");
  const [
    verificationUnsuccessfulTemplate,
    setVerificationUnsuccessfulTemplate,
  ] = useState("");

  const institution = secureLocalStorage.getItem("institution");

  const handleBackButton = () => {
    secureLocalStorage.setItem("letterTemplateScreen", 1);
    setCurrentScreen(1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleUserInput = (e) => {
    setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDragStart = (value) => {
    return (event) => {
      event.dataTransfer.setData("text/plain", value);
    };
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const value = event.dataTransfer.getData("text/plain");
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  console.log("hamm", verificationSuccessfulTemplate);

  const {
    data: institutionDocuments,
    error: institutionError,
    isLoading: institutionDocsLoading,
  } = useSWR("/institution/document-types", (url) =>
    axios.get(url).then((res) => res.data)
  );

  return (
    <>
      <div className="flex justify-end w-full">
        <button
          type="button"
          onClick={handleBackButton}
          className="flex items-center bg-[#ffffff] border border-[#ff0404] hover:bg-[#ff0404] text-[#ff0404] hover:text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
        >
          <FaAnglesLeft className="mr-2" />
          Back
        </button>
      </div>
      <div className="w-full flex justify-between mt-4">
        <div className="w-[28%] flex flex-col gap-4">
          <div className="w-full flex flex-col gap-2 h-fit border border-[#ff040459] rounded-[0.5rem] p-4">
            <div
              className={`w-full flex items-center justify-center h-fit py-2 rounded-[0.3rem] text-[1rem] ${
                currentTempTab === 1 && "text-white bg-[#ff0404]"
              }`}
            >
              Validation Letter Template
            </div>
            <div
              className={`w-full flex items-center justify-center h-fit py-2 rounded-[0.3rem] text-[1rem] ${
                currentTempTab === 2 && "text-white bg-[#ff0404]"
              }`}
            >
              Verification Letter Template
            </div>
          </div>
          <div
            className="w-full flex flex-col  gap-2 border border-[#ff040459] rounded-[0.5rem] p-2"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <h4 className="text-[0.9rem] font-[600] underline">
              Placeholders Definition
            </h4>
            {/* <div className="border border-[#ff040459] rounded-[0.3rem] p-1"> */}
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{documentTypeName}")}
              >
                {"{documentTypeName}"}
              </span>{" "}
              - document type's name
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{firstName}")}
              >
                {"{firstName}"}
              </span>{" "}
              - applicant's first name
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{lastName}")}
              >
                {"{lastName}"}
              </span>{" "}
              - applicant's last name
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{otherName}")}
              >
                {"{otherName}"}
              </span>{" "}
              - applicant's other name
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{email}")}
              >
                {"{email}"}
              </span>{" "}
              - applicant's email
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{phone}")}
              >
                {"{phone}"}
              </span>{" "}
              - applicant's phone
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{address}")}
              >
                {"{address}"}
              </span>{" "}
              - applicant's residential address
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{dateOfRequest}")}
              >
                {"{dateOfRequest}"}
              </span>{" "}
              - applicant's document requested date
            </h4>
            {institution?.type !== "bacchecker-academic" && (
              <>
                <h4 className="text-[0.8rem]">
                  <span
                    className="text-[#ff0404]"
                    draggable
                    onDragStart={handleDragStart("{employeeID}")}
                  >
                    {"{employeeID}"}
                  </span>{" "}
                  - applicant's employee id
                </h4>
                <h4 className="text-[0.8rem]">
                  <span
                    className="text-[#ff0404]"
                    draggable
                    onDragStart={handleDragStart("{programStartYear}")}
                  >
                    {"{programStartYear}"}
                  </span>{" "}
                  - year of employment
                </h4>
              </>
            )}
            {institution?.type === "bacchecker-academic" && (
              <>
                <h4 className="text-[0.8rem]">
                  <span
                    className="text-[#ff0404]"
                    draggable
                    onDragStart={handleDragStart("{indexNumber}")}
                  >
                    {"{indexNumber}"}
                  </span>{" "}
                  - applicant's index number
                </h4>
                <h4 className="text-[0.8rem]">
                  <span
                    className="text-[#ff0404]"
                    draggable
                    onDragStart={handleDragStart("{programOfStudy}")}
                  >
                    {"{programOfStudy}"}
                  </span>{" "}
                  - applicant's program of study
                </h4>
                <h4 className="text-[0.8rem]">
                  <span
                    className="text-[#ff0404]"
                    draggable
                    onDragStart={handleDragStart("{programStartYear}")}
                  >
                    {"{programStartYear}"}
                  </span>{" "}
                  - year of admission
                </h4>
                <h4 className="text-[0.8rem]">
                  <span
                    className="text-[#ff0404]"
                    draggable
                    onDragStart={handleDragStart("{programEndYear}")}
                  >
                    {"{programEndYear}"}
                  </span>{" "}
                  - applicant's year of graduation
                </h4>
              </>
            )}

            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{dateOfLetter}")}
              >
                {"{dateOfLetter}"}
              </span>{" "}
              - date of letter
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{validatedBy}")}
              >
                {"{validatedBy}"}
              </span>{" "}
              - Validator's name
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{validatedByEmail}")}
              >
                {"{validatedByEmail}"}
              </span>{" "}
              - Validator's email
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{rejectionBy}")}
              >
                {"{rejectionBy}"}
              </span>{" "}
              - Rejector's name
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{rejectionByEmail}")}
              >
                {"{rejectionByEmail}"}
              </span>{" "}
              - Rejector's email
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{position}")}
              >
                {"{position}"}
              </span>{" "}
              - position of validator or rejector
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{institutionName}")}
              >
                {"{institutionName}"}
              </span>{" "}
              - institution's name
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{institutionEmail}")}
              >
                {"{institutionEmail}"}
              </span>{" "}
              - institution's email
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{institutionMailbox}")}
              >
                {"{institutionMailbox}"}
              </span>{" "}
              - institution's mailing email
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{institutionPhone}")}
              >
                {"{institutionPhone}"}
              </span>{" "}
              - institution's phone
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{institutionAddress}")}
              >
                {"{institutionAddress}"}
              </span>{" "}
              - institution's address
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{institutionRegion}")}
              >
                {"{institutionRegion}"}
              </span>{" "}
              - region of institution
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{helplineContact}")}
              >
                {"{helplineContact}"}
              </span>{" "}
              - institution's helpline contact
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{institutionWebsiteURL}")}
              >
                {"{institutionWebsiteURL}"}
              </span>{" "}
              - institution's website url
            </h4>
            <h4 className="text-[0.8rem]">
              <span
                className="text-[#ff0404]"
                draggable
                onDragStart={handleDragStart("{rejectedReason}")}
              >
                {"{rejectedReason}"}
              </span>{" "}
              - reason(s) for rejecting document
            </h4>

            {/* </div> */}
          </div>
          <h4 className="text-[0.9rem]">
            <span className="text-[#ff0404]">Note</span>: Placeholders can be{" "}
            <span className="text-[#ff0404] font-[600]">dragged</span> and{" "}
            <span className="text-[#ff0404] font-[600]">drop</span> in the
            editor
          </h4>
        </div>
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
            onChange={handleUserInput}
          >
            {institutionDocuments?.data?.types?.map((item) => (
              <SelectItem key={item?.id}>
                {item?.document_type?.name}
              </SelectItem>
            ))}
          </Select>
          {currentTempTab === 1 && (
            <ValidationLetterTemplate
              institutionDocuments={institutionDocuments}
              validationSuccessfulTemplate={validationSuccessfulTemplate}
              setValidationSuccessfulTemplate={setValidationSuccessfulTemplate}
              validationUnsuccessfulTemplate={validationUnsuccessfulTemplate}
              setValidationUnsuccessfulTemplate={
                setValidationUnsuccessfulTemplate
              }
              setCurrentTempTab={setCurrentTempTab}
              userInput={userInput}
            />
          )}
          {currentTempTab === 2 && (
            <VerificationLetterTemplate
              institutionDocuments={institutionDocuments}
              verificationSuccessfulTemplate={verificationSuccessfulTemplate}
              setVerificationSuccessfulTemplate={
                setVerificationSuccessfulTemplate
              }
              verificationUnsuccessfulTemplate={
                verificationUnsuccessfulTemplate
              }
              setVerificationUnsuccessfulTemplate={
                setVerificationUnsuccessfulTemplate
              }
              userInput={userInput}
              validationSuccessfulTemplate={validationSuccessfulTemplate}
              validationUnsuccessfulTemplate={validationUnsuccessfulTemplate}
              setCurrentTempTab={setCurrentTempTab}
              setCurrentScreen={setCurrentScreen}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default AddLetterTemplate;
