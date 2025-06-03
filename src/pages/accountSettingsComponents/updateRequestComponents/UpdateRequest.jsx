import { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { MdOutlineEditNote } from "react-icons/md";
import { BsFillTrash3Fill } from "react-icons/bs";
import LoadItems from "../../../components/LoadItems";

const UpdateRequest = () => {
  const [institution, setInstitution] = useState({});
  const [updates, setUpdates] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [disabledFields, setDisabledFields] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [pendingRequest, setPendingRequest] = useState(null);
  const [isSaving, setIsSaving] = useState(null);

  useEffect(() => {
    const fetchInstitutionData = async () => {
      setIsLoading(true);
      try {
        const [institutionResponse, pendingRequestResponse] = await Promise.all([
          axios.get("/institution/institution-data"),
          axios.get("/institution/pending-update-request")
        ]);

        const institutionData = institutionResponse.data.institutionData;
        setInstitution(institutionData.institution);
        
        if (pendingRequestResponse.data.data) {
          setPendingRequest(pendingRequestResponse.data.data);
          setUpdates(pendingRequestResponse.data.data.requested_changes);
          // Enable editing for fields that have pending changes
          const pendingFields = Object.keys(pendingRequestResponse.data.data.requested_changes);
          const disabledFieldsObj = pendingFields.reduce((acc, field) => {
            acc[field] = true;
            return acc;
          }, {});
          setDisabledFields(disabledFieldsObj);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchInstitutionData();
  }, []);

  const handleUpdateRequest = (field) => {
    setUpdates((prev) => ({ ...prev, [field]: institution[field] }));
    setDisabledFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleCancelUpdate = (field) => {
    setUpdates((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
    setDisabledFields((prev) => ({ ...prev, [field]: false }));
  };

  const handleInputChange = (field, value) => {
    setUpdates((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file) => {
    setSelectedFiles((prev) => ({ ...prev, [field]: file }));
    setUpdates((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    const formData = new FormData();

    Object.entries(updates).forEach(([key, value]) => {
      if (selectedFiles[key]) {
        formData.append(key, selectedFiles[key]);
      } else {
        formData.append(key, value);
      }
    });

    if (pendingRequest) {
      formData.append('update_request_id', pendingRequest.id);
    }

    try {
      const response = await axios.post(
        "/institution/request-update",
        formData
      );
      toast.success(response.data.message);
      setIsSaving(false)
      // Refresh pending request data
      const pendingRequestResponse = await axios.get("/institution/pending-update-request");
      if (pendingRequestResponse.data.data) {
        setPendingRequest(pendingRequestResponse.data.data);
        setUpdates(pendingRequestResponse.data.data.requested_changes);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting update request");
      setIsSaving(false)
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row items-start gap-3 p-2">
        <div className="w-full lg:w-1/2 shadow-md bg-white">
          <h2 className="text-lg font-semibold bg-black px-4 py-3 text-white">
            Current Institution Profile
          </h2>
          {isLoading ? (
            <div
              role="status"
              className="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded-sm shadow-sm animate-pulse md:p-6"
            >
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between pt-4">
                  <div>
                    <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-2.5 bg-gray-300 rounded-full w-12"></div>
                </div>
              ))}
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <div className="space-y-3 px-4 pb-4">
              {Object.entries(institution).map(([key, value]) => {
                // Exclude certain fields that should not be updated
                const excludedFields = [
                  "id",
                  "user_id",
                  "user",
                  "current_step",
                  "activated_at",
                  "activated_by",
                  "sector",
                  "sector_id",
                  "is_verified",
                  "verified_at",
                  "verified_by",
                  "status",
                  "created_at",
                  "updated_at",
                  "setup_done",
                  "setup_completed_at",
                  "terms",
                  "template_screens",
                  "dashboard_screens",
                  "deleted_at",
                  "has_pending_update_request",
                ];
                if (excludedFields.includes(key)) return null;

                return (
                  <div key={key} className="mt-4">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1 capitalize">
                      {key.replace(/_/g, " ")}
                      <span className="text-[#f1416c]">*</span>
                    </h4>
                    <div className="relative w-full md:h-[2.7vw] h-[12vw] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                      <input
                        type="text"
                        readOnly
                        value={value || ""}
                        className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                      />
                      <button
                        onClick={() => handleUpdateRequest(key)}
                        disabled={disabledFields[key]}
                        className="absolute right-2 top-1/2 text-black transform -translate-y-1/2 text-sm"
                      >
                        <MdOutlineEditNote size={28} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Panel: Requested Updates */}
        <div className="w-full lg:w-1/2 shadow-md border bg-white min-h-60">
          <h2 className="text-lg font-semibold bg-black text-white px-4 py-3">
            Requested Updates
          </h2>
          {pendingRequest && (
            <div className="p-4 mb-4 text-sm text-blue-800 bg-blue-50">
              <p>You have a pending update request submitted on {new Date(pendingRequest.created_at).toLocaleDateString()}</p>
              <p>You can modify the existing request or add more fields to update.</p>
            </div>
          )}
          {Object.keys(updates).length == 0 ? (
            <div className="md:!h-[35vh] h-[30vh] flex flex-col gap-8 items-center justify-center">
              <img
                src="/assets/img/no-data.svg"
                alt="No data"
                className="w-1/4 h-auto"
              />
              <p className="text-center text-slate-500 font-montserrat font-medium text-base -mt-6">
                No requests available
              </p>
            </div>
          ) : (
            <div className="relative space-y-3 p-4">
              {Object.entries(updates).map(([key, value]) => {
                if (key === "logo" || key === "operation_certificate" || key === "business_registration_document") {
                  return (
                    <div key={key} className="w-full mt-4 flex space-x-2">
                      <div className="w-full">
                        <h4 className="text-sm mb-1 font-medium capitalize">
                          {key.replace(/_/g, " ")}
                        </h4>
                        <div className="relative w-full flex items-center overflow-hidden border border-blue-200 text-gray-900 text-sm rounded-sm bg-gray-50 py-2.5">
                          <input
                            type="file"
                            id={key}
                            accept={
                              key === "logo" ? ".png, .jpg, .jpeg" : ".pdf"
                            }
                            onChange={(e) =>
                              handleFileChange(key, e.target.files[0])
                            }
                            className="hidden"
                          />
                          <label
                            htmlFor={key}
                            className="absolute right-2 cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 32 32"
                              className="text-black w-6 h-6"
                            >
                              <path
                                d="M16 13l-5 5l1.41 1.41L15 16.83V28H6v2h9a2 2 0 0 0 2-2V16.83l2.59 2.58L21 18z"
                                fill="currentColor"
                              ></path>
                              <path
                                d="M23.5 22H23v-2h.5a4.497 4.497 0 0 0 .356-8.981l-.815-.064l-.099-.812a6.994 6.994 0 0 0-13.883 0l-.1.812l-.815.064A4.497 4.497 0 0 0 8.5 20H9v2h-.5A6.497 6.497 0 0 1 7.2 9.136a8.994 8.994 0 0 1 17.6 0A6.497 6.497 0 0 1 23.5 22z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </label>
                          <h4 className="pl-2 text-sm overflow-hidden">
                            {selectedFiles[key]
                              ? selectedFiles[key].name
                              : "Browse to upload file"}
                          </h4>
                        </div>
                        <h4 className="text-[0.7rem] text-right">
                          <span className="text-[#ff0404]">
                            Accepted Formats
                          </span>{" "}
                          {key === "logo" ? "jpg, jpeg, png" : "pdf"}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleCancelUpdate(key)}
                        variant="destructive"
                        className="text-bChkRed"
                      >
                        <BsFillTrash3Fill size={20} />
                      </button>
                    </div>
                  );
                }

                return (
                  <div key={key} className="mt-4">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1 capitalize">
                      {key.replace(/_/g, " ")}
                      <span className="text-[#f1416c]">*</span>
                    </h4>
                    <div className="relative w-full md:h-[2.7vw] h-[12vw] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                      />
                      <button
                        onClick={() => handleCancelUpdate(key)}
                        className="absolute right-2 top-1/2 text-bChkRed transform -translate-y-1/2 text-sm"
                      >
                        <BsFillTrash3Fill size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {/* Submit Button */}
              <div className="w-full flex justify-end bottom-4 right-4">
                {Object.keys(updates).length > 0 && (
                  <button
                    onClick={handleSubmit}
                    className="bg-bChkRed text-white rounded-md py-2 px-4 text-sm"
                  >
                    {isSaving ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoadItems color={"#ffffff"} size={15} />
                        <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                          Submitting...
                        </h4>
                      </div>
                    ) : (
                      <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                        Submit Updates
                      </h4>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateRequest;
