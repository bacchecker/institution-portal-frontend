import { Spinner } from "@nextui-org/react";
import React, { useState } from "react";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage";
import useSWR from "swr";
import axios from "@utils/axiosConfig";
import Swal from "sweetalert2";
import AddLetterTemplate from "./letterTemplatesComponents/AddLetterTemplate";
import EditLetterTemplate from "./letterTemplatesComponents/EditLetterTemplate";
import LetterTemplatesTable from "./letterTemplatesComponents/LetterTemplatesTable";
import AuthLayout from "../../components/AuthLayout";

function LetterTemplates() {
  const [isSaving, setSaving] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState({});
  const {
    data: letterTemplates,
    error: letterTemplatesError,
    isLoading: letterTemplatesLoading,
  } = useSWR("/institution/letter-templates", (url) =>
    axios.get(url).then((res) => res.data)
  );

  const fetchInstitutionDocuments = async () => {
    setDocLoading(true)
    try {
      const response = await axios.get("/institution/document-types", {
        params: {
          search,
          page: currentPage,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      });

      const docTypes = response.data.document_types;

    // Update the states with the received data
    setInstitutionDocuments(docTypes.data); // Array of document types
    setCurrentPage(docTypes.current_page); // Current page number
    setLastPage(docTypes.last_page); // Last page number
    setTotal(docTypes.total); // Total number of document types
    setDocLoading(false); // Set loading state to false

    } catch (error) {
      console.error("Error fetching institution documents:", error);
      throw error;
    }
  };
  const handleCreateLetterTemplates = () => {
    setCurrentScreen(2);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AuthLayout title="Department Management">
      <div className="w-full px-5 pb-4">
        {currentScreen === 1 && (
          <>
            <div className="border-b border-[#ff0404] py-4">
              <h4 className="text-[1rem] font-[600] mb-4">
                Institutions utilize specific{" "}
                <span className="text-[#ff0404]">letter templates</span> for{" "}
                <span className="text-[#ff0404]">verification</span> and{" "}
                <span className="text-[#ff0404]">validation</span> processes.
                Each template is designed to clearly communicate the outcome,
                with distinct letters issued for{" "}
                <span className="text-[#ff0404]">successful</span> and{" "}
                <span className="text-[#ff0404]">unsuccessful</span> results.
                This approach ensures clarity and professionalism in
                communications across various contexts. <br />
                <br /> Please use the "
                <span className="text-[#ff0404]">Create Letter Template</span>"
                button to generate the appropriate template for each scenario.
              </h4>
            </div>
            <div className="my-3 w-full flex justify-end mx-auto dark:bg-slate-900 mt-6">
              <div className="flex gap-4 items-center">
                <button
                  type="button"
                  onClick={handleCreateLetterTemplates}
                  className="w-fit flex items-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
                >
                  Create Letter Template
                </button>
              </div>
            </div>
            <LetterTemplatesTable
              letterTemplates={letterTemplates}
              letterTemplatesLoading={letterTemplatesLoading}
              setCurrentScreen={setCurrentScreen}
              setSelectedTemplate={setSelectedTemplate}
            />
          </>
        )}
        {currentScreen === 2 && (
          <AddLetterTemplate setCurrentScreen={setCurrentScreen} />
        )}
        {currentScreen === 3 && (
          <EditLetterTemplate
            setCurrentScreen={setCurrentScreen}
            selectedTemplate={selectedTemplate}
          />
        )}
      </div>
    </AuthLayout>
  );
}

export default LetterTemplates;
