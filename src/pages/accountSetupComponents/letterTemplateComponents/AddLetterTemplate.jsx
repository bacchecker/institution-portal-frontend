import React, { useRef, useState } from "react";
import { FaAnglesLeft } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage";
import useSWR from "swr";
import axios from "@utils/axiosConfig";
import ValidationLetterTemplate from "./addLetterTemplateComponents/ValidationLetterTemplate";
import VerificationLetterTemplate from "./addLetterTemplateComponents/VerificationLetterTemplate";

function AddLetterTemplate({ setCurrentScreen }) {
  const [currentTempTab, setCurrentTempTab] = useState(1);
  const institution = secureLocalStorage.getItem("institution");
  const handleBackButton = () => {
    secureLocalStorage.setItem("letterTemplateScreen", 1);
    setCurrentScreen(1);
  };
  const editorRef = useRef(null);

  const handleDragStart = (value) => {
    return (event) => {
      event.dataTransfer.setData("text/plain", value);
    };
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const value = event.dataTransfer.getData("text/plain");
    if (editorRef.current) {
      editorRef.current.editor.insertHTML(value);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const {
    data: institutionDocuments,
    error: institutionError,
    isLoading: institutionDocsLoading,
  } = useSWR("/institution/document-types", (url) =>
    axios.get(url).then((res) => res.data)
  );
  console.log("inst", institutionDocuments);

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
            <button
              onClick={() => setCurrentTempTab(1)}
              className={`w-full h-fit py-2 rounded-[0.3rem] text-[1rem] ${
                currentTempTab === 1 && "text-white bg-[#ff0404]"
              }`}
            >
              Validation Letter Template
            </button>
            <button
              onClick={() => setCurrentTempTab(2)}
              className={`w-full h-fit py-2 rounded-[0.3rem] text-[1rem] ${
                currentTempTab === 2 && "text-white bg-[#ff0404]"
              }`}
            >
              Verification Letter Template
            </button>
          </div>
          <div
            className="w-full flex flex-col  gap-2 border border-[#ff040459] rounded-[0.5rem] p-2"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <h4 className="text-[0.9rem] font-[600] underline">
              Placeholders Definition
            </h4>
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
            )}
            {institution?.type === "bacchecker-academic" && (
              <>
                <h4 className="text-[0.8rem]">
                  <span
                    className="text-[#ff0404]"
                    draggable
                    onDragStart={handleDragStart("{graduationDate}")}
                  >
                    {"{graduationDate}"}
                  </span>{" "}
                  - applicant's year of graduation
                </h4>
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
          </div>
        </div>
        {currentTempTab === 1 && (
          <ValidationLetterTemplate
            institutionDocuments={institutionDocuments}
            editorRef={editorRef}
          />
        )}
        {currentTempTab === 2 && (
          <VerificationLetterTemplate
            institutionDocuments={institutionDocuments}
          />
        )}
      </div>
      <div className="w-full flex justify-end">
        <button
          type="button"
          className="w-fit flex items-center bg-[#000000] hover:bg-[#282727] text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
        >
          Import Default Template
        </button>
      </div>
    </>
  );
}

export default AddLetterTemplate;
