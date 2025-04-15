import React, { useEffect, useState } from "react";
import SideModal from "@/components/SideModal";
import secureLocalStorage from "react-secure-storage";
import SelectInput from "@/components/SelectInput";
import {
  useGetFilteredInstitutionsQuery,
  useGetInstitutionDocumentsQuery,
  useGetUserAffiliationQuery,
  useValidateDocumentMutation,
} from "@/redux/apiSlice";
import SearchSelectInput from "@/components/SearchSelectInput";
import { toast } from "sonner";
import LoadItems from "@/components/LoadItems";
import NewApplicationForm2 from "./NewApplicationForm2";
import NewApplicationForm3 from "./NewApplicationForm3";
import axios from "@/utils/axiosConfig";

function NewApplicationForm({
  setOpenModal,
  openModal,
  setCurrentTab,
  setSelectedStatus,
  fetchVerificationRequests,
}) {
  const initialUserInput = {
    otherInstitution: "",
    otherInstitutionAddress: "",
    otherInstitutionEmail: "",
    otherInstitutionPostalAddress: "",
    reason: "",
    purpose: "",
    doc_owner_full_name: "",
    doc_owner_email: "",
    doc_owner_phone: "",
    doc_owner_institution: "",
    doc_owner_dob: "",
    security_question: "",
    security_answer: "",
  };
  const [userInput, setUserInput] = useState(initialUserInput);
  const institutionName = JSON?.parse(
    secureLocalStorage?.getItem("user")
  )?.institution;
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState("");
  const [currentScreen, setCurrentScreen] = useState(1);
  const [allDocuments, setAllDocuments] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState([]);
  const [totalApplicationAmount, setTotalApplicationAmount] = useState(null);
  const [uniqueRequestedCode, setUniqueRequestedCode] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState({});
  const [selectedInstitutionType, setSelectedInstitutionType] = useState({});
  const [allInstitutions, setAllInstitutions] = useState([]);
  const [selectedCredentialType, setSelectedCredentialType] = useState({});
  const [selectedNonInstitutionType, setSelectedNonInstitutionType] = useState(
    {}
  );
  const [items, setItems] = useState([
    {
      document_type_id: "",
      institution_document_type_id: "",
      file: null,
    },
  ]);
  const credentialTypes = [
    { title: "Academic Credentials", value: "academic" },
    { title: "Non-Academic Credentials", value: "non-academic" },
  ];

  const academicLevels = [
    { title: "tertiary" },
    { title: "secondary" },
    { title: "basic" },
  ];

  const academicinstitutions = [
    { title: "BacChecker Academic", value: "bacchecker-academic" },
  ];

  const allNonAcademicInstitutions = [
    { title: "BacChecker Business", value: "bacchecker-business" },
    { title: "BacChecker Government", value: "bacchecker-government" },
  ];

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setUserInput((prev) => ({
      ...prev,
      purpose: selectedValue,
      reason: selectedValue !== "Others" ? selectedValue : "",
    }));
  };

  useEffect(() => {
    if (!openModal) {
      fetchSubscription();
      setCurrentScreen(1);
      setUserInput(initialUserInput);
      setIsChecked(false);
      setSelectedCredentialType({});
      const defaultItem = {
        document_type_id: "",
        institution_document_type_id: "",
        file: null,
      };
      setItems([defaultItem]);
    }
  }, [openModal]);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "/institution/verification/dashboard-data"
      );

      setSubscription(response.data.subscription);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setLoading(false);
    }
  };
  const {
    data: userAffiliations,
    isLoading: isUserAffiliationsLoading,
    isFetching: isUserAffiliationsFetching,
  } = useGetUserAffiliationQuery(
    {
      ...(selectedAcademicLevel !== undefined &&
        selectedAcademicLevel !== "" && {
          academicLevel: selectedAcademicLevel,
        }),
      ...(selectedInstitutionType?.value !== undefined &&
        selectedInstitutionType?.value !== "" && {
          institutionType: selectedInstitutionType?.value,
        }),
    },
    {
      skip:
        (selectedInstitutionType === "bacchecker-academic" &&
          !selectedAcademicLevel) ||
        !selectedInstitutionType?.value,
    }
  );

  const {
    data: institutionDocuments,
    isLoading: isInstitutionDocumentsLoading,
    isFetching: isInstitutionDocumentsFetching,
  } = useGetInstitutionDocumentsQuery(
    {
      ...(selectedAcademicLevel !== undefined &&
        selectedAcademicLevel !== "" && { selectedAcademicLevel }),
    },
    {
      skip: !selectedAcademicLevel,
    }
  );

  const {
    data: institutions,
    isLoading: isInstitutionLoading,
    isFetching: isInstitutionFetching,
  } = useGetFilteredInstitutionsQuery(
    {
      ...(selectedAcademicLevel !== undefined &&
        selectedAcademicLevel !== "" && { selectedAcademicLevel }),
      ...(selectedInstitutionType?.value !== undefined &&
        selectedInstitutionType?.value !== "" && {
          selectedInstitutionType: selectedInstitutionType?.value,
        }),
    },
    {
      skip:
        (selectedInstitutionType === "bacchecker-academic" &&
          !selectedAcademicLevel) ||
        !selectedInstitutionType?.value,
    }
  );

  useEffect(() => {
    if (userAffiliations && institutions) {
      let filteredInstitutions = institutions?.data?.institutions;

      // Debugging purpose

      // Exclude the logged-in user's institution
      if (institutionName?.id) {
        filteredInstitutions = filteredInstitutions?.filter(
          (institution) => String(institution.id) !== String(institutionName.id)
        );
      }

      if (userAffiliations?.affiliations?.length > 0) {
        const institutionIds = userAffiliations?.affiliations?.map(
          (item) => item?.institution_id
        );

        const insAffiliations = filteredInstitutions
          ?.filter((item) => institutionIds.includes(item?.id))
          .map((institution) => ({
            ...institution,
          }));

        setAllInstitutions(insAffiliations);
      } else {
        console.log(filteredInstitutions);

        setAllInstitutions(filteredInstitutions);
      }
    }
  }, [institutions, userAffiliations, institutionName?.id]);

  useEffect(() => {
    if (selectedCredentialType?.value === "academic") {
      const institutionType = academicinstitutions?.find(
        (item) => item.value === "bacchecker-academic"
      );
      setSelectedInstitutionType(institutionType);
    } else {
      setSelectedInstitutionType(selectedNonInstitutionType);
    }
  }, [selectedCredentialType?.value, selectedNonInstitutionType]);

  const getDocumentVerificationFee = (value) => {
    const type = allDocuments?.find(
      (type) => type?.id === value || type?.document_type?.id === value
    );
    return type?.verification_fee || 0;
  };

  const getDocumentName = (value) => {
    const type = allDocuments?.find((type) => type?.id === value);
    return type?.document_type?.name || type?.name || "";
  };

  const handleSelectedDocument = (item, index) => {
    const updatedItems = [...items];
    updatedItems[index].institution_document_type_id = item?.id;
    updatedItems[index].document_type_id = item?.document_type.id;

    setItems(updatedItems);
  };

  useEffect(() => {
    if (isChecked && institutionDocuments) {
      setSelectedInstitution({});
      setAllDocuments(institutionDocuments?.data?.types);
    }
    if (!isChecked || selectedInstitution?.name) {
      setUserInput((prevInput) => ({
        ...prevInput,
        otherInstitution: "",
        otherInstitutionAddress: "",
        otherInstitutionEmail: "",
        otherInstitutionPostalAddress: "",
        doc_owner_full_name: "",
        doc_owner_email: "",
        doc_owner_phone: "",
        doc_owner_institution: "",
        doc_owner_dob: "",
        security_question: "",
        security_answer: "",
        reason: "",
      }));
      setAllDocuments(selectedInstitution?.document_types);
    } else if (!isChecked && !selectedInstitution?.name) {
      setAllDocuments([]);
    }
  }, [isChecked, institutionDocuments, selectedInstitution?.name]);

  const handleUserInput = (e) => {
    setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectedNonInstitutiontype = (item) => {
    setSelectedNonInstitutionType(item);
  };

  useEffect(() => {
    if (userAffiliations?.affiliations?.length === 1) {
      setSelectedInstitution(allInstitutions[0]);
    }
  }, [allInstitutions, userAffiliations]);

  const handleSeletedCredentialType = (item) => {
    setSelectedCredentialType(item);
    setSelectedAcademicLevel("");
    setSelectedInstitution({});
    setSelectedInstitutionType({});
    setSelectedNonInstitutionType({});
    const defaultItem = {
      document_type_id: "",
      institution_document_type_id: "",
      file: null,
    };
    setItems([defaultItem]);
  };

  const handleSeletedAcademicLevel = (item) => {
    setSelectedAcademicLevel(item?.title);
    setSelectedInstitution({});
    const defaultItem = {
      document_type_id: "",
      institution_document_type_id: "",
      file: null,
    };
    setItems([defaultItem]);
  };

  const handleSeletedInstitution = (item) => {
    setSelectedInstitution(item);
    const defaultItem = {
      document_type_id: "",
      institution_document_type_id: "",
      file: null,
    };
    setItems([defaultItem]);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    const defaultItem = {
      document_type_id: "",
      institution_document_type_id: "",
      file: null,
    };
    setItems([defaultItem]);
  };

  const handleFileChange = (e, i) => {
    const file = e.target.files[0];
    const newItems = [...items];
    newItems[i].file = file;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        document_type_id: "",
        institution_document_type_id: "",
        file: null,
      },
    ]);
  };

  const handleItemDelete = (i) => {
    const list = [...items];
    list.splice(i, 1);
    setItems(list);
  };

  const [validateDocument, { data, isSuccess, isLoading, isError, error }] =
    useValidateDocumentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const hasErrors = items.some((item) => {
      if (item.document_type_id === "") {
        toast.error("Document is missing", {
          position: "top-right",
          autoClose: 1202,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setIsSaving(false);
        return true;
      }

      if (!item.file) {
        toast.error("Document file is missing", {
          position: "top-right",
          autoClose: 1202,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setIsSaving(false);
        return true;
      }

      return false;
    });

    if (hasErrors) return;

    if (
      selectedCredentialType.value === "academic" &&
      (selectedAcademicLevel === "" || (!isChecked && !selectedInstitution.id))
    ) {
      toast.error("Fill All Required Fields", {
        position: "top-right",
        autoClose: 1202,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsSaving(false);
      return;
    }

    const formData = new FormData();

    formData.append("institution_id", selectedInstitution?.id || "");
    formData.append(
      "other_institution_name",
      userInput?.otherInstitution || ""
    );
    formData.append(
      "other_institution_digital_address",
      userInput?.otherInstitutionAddress || ""
    );
    formData.append(
      "other_institution_email",
      userInput?.otherInstitutionEmail || ""
    );
    formData.append(
      "other_institution_postal_address",
      userInput?.otherInstitutionPostalAddress || ""
    );
    formData.append("reason", userInput?.reason);
    items.forEach((item, index) => {
      if (item.file) {
        formData.append(
          `documents[${index}][document_type_id]`,
          item.document_type_id
        );
        formData.append(
          `documents[${index}][institution_document_type_id]`,
          item.institution_document_type_id
        );
        formData.append(`documents[${index}][file]`, item.file);
      }
      formData.append(
        `documents[${index}][doc_owner_email]`,
        userInput[`doc_owner_email_${index}`]
      );
      formData.append(
        `documents[${index}][doc_owner_phone]`,
        userInput[`doc_owner_phone_${index}`]
      );
      formData.append(
        `documents[${index}][doc_owner_institution]`,
        userInput[`doc_owner_institution_${index}`]
      );
      formData.append(
        `documents[${index}][doc_owner_dob]`,
        userInput[`doc_owner_dob_${index}`]
      );
      formData.append(
        `documents[${index}][doc_owner_full_name]`,
        userInput[`doc_owner_full_name_${index}`]
      );
      /* formData.append(`documents[${index}][security_question]`, userInput[`security_question_${index}`] || "");
      formData.append(`documents[${index}][security_answer]`, userInput[`security_answer_${index}`] || ""); */
    });

    try {
      const response = await axios.post(
        "/institution/requests/verifications",
        formData
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
      setOpenModal(!openModal);
      fetchVerificationRequests();
      setIsSaving(false);
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 1202,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!openModal && (currentScreen === 2 || currentScreen === 3)) {
      setCurrentTab(2);
      setSelectedStatus({ title: "Created", value: "created" });
    }
  }, [openModal, currentScreen]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  return (
    <SideModal
      title={"New Application"}
      setOpenModal={setOpenModal}
      openModal={openModal}
    >
      {currentScreen === 1 && (
        <form
          onSubmit={handleSubmit}
          className="md:px-[1vw] px-[5vw] w-full overflow-auto"
        >
          <div className="md:mt-[2vw] mt-[10vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">Name</h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                readOnly
                value={`${institutionName.name || ""}`}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0 read-only:bg-[#d8d8d8]"
              />
            </div>
          </div>
          <div className="md:mt-[2vw] mt-[10vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Subscription Plan (Credits)
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                readOnly
                value={`${subscription?.credit_balance || 0}`}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0 read-only:bg-[#d8d8d8]"
              />
            </div>
          </div>
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Credential Type<span className="text-[#f1416c]">*</span>
            </h4>
            <SelectInput
              placeholder={"Select Option"}
              data={credentialTypes}
              inputValue={selectedCredentialType?.title}
              onItemSelect={handleSeletedCredentialType}
              className="custom-dropdown-class display-md-none"
            />
          </div>

          {selectedCredentialType?.value === "non-academic" && (
            <div className="md:mt-[2vw] mt-[8vw]">
              <h4 className="md:text-[1vw] text-[4vw] mb-1">
                Choose Institution Type<span className="text-[#f1416c]">*</span>
              </h4>
              <SelectInput
                placeholder={"Select Option"}
                data={allNonAcademicInstitutions}
                inputValue={selectedNonInstitutionType?.title}
                onItemSelect={handleSelectedNonInstitutiontype}
                className="custom-dropdown-class display-md-none"
              />
            </div>
          )}
          {selectedCredentialType?.value === "academic" && (
            <>
              <div className="md:mt-[2vw] mt-[8vw]">
                <h4 className="md:text-[1vw] text-[4vw] mb-1">
                  Academic Level<span className="text-[#f1416c]">*</span>
                </h4>
                <SelectInput
                  placeholder={"Select Option"}
                  data={academicLevels}
                  inputValue={selectedAcademicLevel}
                  onItemSelect={handleSeletedAcademicLevel}
                  className="custom-dropdown-class display-md-none"
                />
              </div>
              {selectedAcademicLevel && (
                <>
                  {!isChecked && (
                    <>
                      {userAffiliations?.affiliations &&
                      userAffiliations?.affiliations?.length === 1 ? (
                        <div className="md:mt-[1vw] mt-[5vw]">
                          <h4 className="md:text-[1vw] text-[4vw] mb-1">
                            Institution
                            <span className="text-[#f1416c]">*</span>
                          </h4>
                          <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                            <input
                              type="text"
                              value={allInstitutions[0]?.name}
                              readOnly
                              className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0 read-only:bg-[#d8d8d8]"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="md:mt-[2vw] mt-[8vw]">
                            <h4 className="md:text-[1vw] text-[4vw] mb-1">
                              Institution
                              <span className="text-[#f1416c]">*</span>
                            </h4>
                            <SearchSelectInput
                              placeholder={"Select Option"}
                              data={allInstitutions}
                              isLoading={
                                isInstitutionLoading || isInstitutionFetching
                              }
                              inputValue={selectedInstitution?.name}
                              onItemSelect={handleSeletedInstitution}
                              className="custom-dropdown-class display-md-none"
                            />
                          </div>
                          {userAffiliations?.affiliations?.length === 0 && (
                            <h6 className="text-[#2e2e2e] md:text-[0.7vw] text-[2.7vw] font-[600]">
                              <span className="text-[#ff0404]">Note</span>:
                              Check "Other Institution" if institution is not
                              found
                            </h6>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {userAffiliations?.affiliations?.length === 0 && (
                    <div className="w-full flex justify-end md:mt-[2vw] mt-[10vw]">
                      <label
                        htmlFor="other"
                        className="flex items-center gap-[0.5vw]"
                      >
                        <input
                          type="checkbox"
                          className="checkbox-design"
                          id="other"
                          onChange={handleCheckboxChange}
                        />
                        <h4 className="md:text-[1vw] text-[3.5vw]">
                          Other Institution
                        </h4>
                      </label>
                    </div>
                  )}
                  {isChecked && (
                    <>
                      <div className="md:mt-[1vw] mt-[5vw]">
                        <h4 className="md:text-[1vw] text-[4vw] mb-1">
                          Institution Name
                          <span className="text-[#f1416c]">*</span>
                        </h4>
                        <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                          <input
                            type="text"
                            name="otherInstitution"
                            value={userInput.otherInstitution}
                            onChange={handleUserInput}
                            required
                            className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                          />
                        </div>
                      </div>
                      <div className="md:mt-[1vw] mt-[5vw]">
                        <h4 className="md:text-[1vw] text-[4vw] mb-1">
                          Institution Email
                          <span className="text-[#f1416c]">*</span>
                        </h4>
                        <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                          <input
                            type="email"
                            name="otherInstitutionEmail"
                            value={userInput.otherInstitutionEmail}
                            onChange={handleUserInput}
                            required
                            className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                          />
                        </div>
                      </div>
                      <div className="md:mt-[1vw] mt-[5vw]">
                        <h4 className="md:text-[1vw] text-[4vw] mb-1">
                          Institution Digital Address
                          <span className="text-[#f1416c]">*</span>
                        </h4>
                        <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                          <input
                            type="text"
                            name="otherInstitutionAddress"
                            required
                            value={userInput.otherInstitutionAddress}
                            onChange={handleUserInput}
                            className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                          />
                        </div>
                      </div>
                      <div className="md:mt-[1vw] mt-[5vw]">
                        <h4 className="md:text-[1vw] text-[4vw] mb-1">
                          Institution Postal Address
                        </h4>
                        <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                          <input
                            type="text"
                            name="otherInstitutionPostalAddress"
                            value={userInput.otherInstitutionPostalAddress}
                            onChange={handleUserInput}
                            className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
          {selectedNonInstitutionType?.title && (
            <>
              {!isChecked && (
                <>
                  {userAffiliations?.affiliations &&
                  userAffiliations?.affiliations?.length === 1 ? (
                    <div className="md:mt-[1vw] mt-[5vw]">
                      <h4 className="md:text-[1vw] text-[4vw] mb-1">
                        Institution
                        <span className="text-[#f1416c]">*</span>
                      </h4>
                      <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                        <input
                          type="text"
                          value={allInstitutions[0]?.name}
                          readOnly
                          className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0 read-only:bg-[#d8d8d8]"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="md:mt-[2vw] mt-[8vw]">
                        <h4 className="md:text-[1vw] text-[4vw] mb-1">
                          Institution<span className="text-[#f1416c]">*</span>
                        </h4>
                        <SearchSelectInput
                          placeholder={"Select Option"}
                          data={allInstitutions}
                          isLoading={
                            isInstitutionLoading || isInstitutionFetching
                          }
                          inputValue={selectedInstitution?.name}
                          onItemSelect={handleSeletedInstitution}
                          className="custom-dropdown-class display-md-none"
                        />
                      </div>
                      {userAffiliations?.affiliations?.length === 0 && (
                        <h6 className="text-[#2e2e2e] md:text-[0.7vw] text-[2.7vw] font-[600]">
                          <span className="text-[#ff0404]">Note</span>: Check
                          "Other Institution" if institution is not found
                        </h6>
                      )}
                    </>
                  )}
                </>
              )}
              {userAffiliations?.affiliations?.length === 0 && (
                <div className="w-full flex justify-end md:mt-[2vw] mt-[10vw]">
                  <label
                    htmlFor="other1"
                    className="flex items-center gap-[0.5vw]"
                  >
                    <input
                      type="checkbox"
                      className="checkbox-design"
                      id="other1"
                      onChange={handleCheckboxChange}
                    />
                    <h4 className="md:text-[1vw] text-[3.5vw]">
                      Other Institution
                    </h4>
                  </label>
                </div>
              )}
              {isChecked && (
                <>
                  <div className="md:mt-[1vw] mt-[5vw]">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1">
                      Institution Name<span className="text-[#f1416c]">*</span>
                    </h4>
                    <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                      <input
                        type="text"
                        name="otherInstitution"
                        required
                        value={userInput.otherInstitution}
                        onChange={handleUserInput}
                        className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                      />
                    </div>
                  </div>
                  <div className="md:mt-[1vw] mt-[5vw]">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1">
                      Institution Email
                      <span className="text-[#f1416c]">*</span>
                    </h4>
                    <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                      <input
                        type="email"
                        name="otherInstitutionEmail"
                        value={userInput.otherInstitutionEmail}
                        onChange={handleUserInput}
                        required
                        className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                      />
                    </div>
                  </div>
                  <div className="md:mt-[1vw] mt-[5vw]">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1">
                      Institution Digital Address
                    </h4>
                    <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                      <input
                        type="text"
                        name="otherInstitutionAddress"
                        required
                        value={userInput.otherInstitutionAddress}
                        onChange={handleUserInput}
                        className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                      />
                    </div>
                  </div>
                  <div className="md:mt-[1vw] mt-[5vw]">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1">
                      Institution Postal Address
                    </h4>
                    <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                      <input
                        type="text"
                        name="otherInstitutionPostalAddress"
                        value={userInput.otherInstitutionPostalAddress}
                        onChange={handleUserInput}
                        className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {items?.map((item, i) => (
            <>
              <div
                className="p-[1vw] border border-[#E5E5E5] md:mt-[1vw] mt-[6vw] md:rounded-[0.3vw] rounded-[1vw]"
                key={i}
              >
                <div>
                  <h4 className="md:text-[1vw] text-[4vw] mb-1">
                    Choose Document
                    <span className="text-[#f1416c]">*</span>
                  </h4>
                  <SelectInput
                    placeholder={"Select Option"}
                    data={allDocuments}
                    inputValue={getDocumentName(
                      item?.institution_document_type_id
                        ? item?.institution_document_type_id
                        : item?.document_type_id
                    )}
                    onItemSelect={(selectedItem) =>
                      handleSelectedDocument(selectedItem, i)
                    }
                    className="custom-dropdown-class display-md-none"
                  />
                </div>
                {/* {item?.document_type_id && (
                  <div className="md:mt-[2vw] mt-[10vw]">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1">
                      Verification Fee
                    </h4>
                    <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                      <input
                        type="text"
                        value={(
                          getDocumentVerificationFee(item?.document_type_id) * 1
                        ).toFixed(2)}
                        readOnly
                        className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0 read-only:bg-[#d8d8d8]"
                      />
                    </div>
                  </div>
                )} */}
                <div className="md:mt-[2vw] mt-[8vw]">
                  <h4 className="md:text-[1vw] text-[4vw] mb-1">
                    Upload Document File
                    <span className="text-[#f1416c]">*</span>
                  </h4>
                  <div className="relative w-full md:h-[10vw] h-[40vw] flex flex-col md:gap-[0.5vw] gap-[2vw] px-[3vw] justify-center items-center md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[2px] bg-[#f7f7f7] border-[#E5E5E5]">
                    <label
                      htmlFor={`img-${i}`}
                      className="md:text-[0.9vw] text-[3vw] flex-col flex justify-center items-center cursor-pointer text-center"
                    >
                      {item.file ? (
                        <>
                          {item?.file?.type === "application/pdf" ? (
                            <div className="w-fit md:h-[4vw] h-[15vw] flex items-center flex-col">
                              <i className="bx bxs-file-pdf md:text-[3vw] text-[10vw]"></i>
                              <h6 className="text-nowrap md:text-[0.7vw] text-[3.5vw] text-[#ff0404] md:w-[10vw] w-[35vw] overflow-hidden text-ellipsis">
                                {item?.file?.name}
                              </h6>
                            </div>
                          ) : (
                            <div className="md:w-[4vw] w-[15vw] md:h-[4vw] h-[15vw]">
                              <img
                                src={URL.createObjectURL(item.file)}
                                alt="uploaded-file"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <i className="bx bxs-cloud-upload md:text-[4vw] text-[12vw]"></i>
                      )}
                      <input
                        type="file"
                        id={`img-${i}`}
                        className="display-none"
                        accept=".jpg, .jpeg, .pdf, .png"
                        onChange={(e) => handleFileChange(e, i)}
                      />
                      Select File to upload. (e.g., Certificate, Student ID card
                      optional)
                    </label>
                  </div>
                  <h6 className="text-[#2e2e2e] md:text-[0.7vw] text-[2.7vw] font-[600]">
                    <span className="text-[#ff0404]">Supported formats</span>:
                    .jpg, .jpeg, .pdf, .png
                  </h6>
                </div>
              </div>
              <div className="border rounded-md p-4 mt-4">
                <p className="text-sm font-medium">
                  Document Owner Information
                </p>
                <div className="md:mt-[1vw] mt-[5vw]">
                  <h4 className="md:text-[1vw] text-[4vw] mb-1">
                    Full Name
                    <span className="text-[#f1416c]">*</span>
                  </h4>
                  <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                    <input
                      type="text"
                      name={`doc_owner_full_name_${i}`}
                      value={userInput[`doc_owner_full_name_${i}`] || ""}
                      onChange={handleUserInput}
                      required
                      className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                    />
                  </div>
                  <p className="text-[10px] text-bChkRed font-medium">
                    Note:{" "}
                    <span className="text-black">
                      Please input surname first
                    </span>
                  </p>
                </div>
                <div className="md:mt-[1vw] mt-[5vw]">
                  <h4 className="md:text-[1vw] text-[4vw] mb-1">
                    Date of Birth
                    <span className="text-[#f1416c]">*</span>
                  </h4>
                  <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                    <input
                      type="date"
                      name={`doc_owner_dob_${i}`}
                      value={userInput[`doc_owner_dob_${i}`] || ""}
                      onChange={handleUserInput}
                      required
                      className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                    />
                  </div>
                </div>
                <div className="md:mt-[1vw] mt-[5vw]">
                  <h4 className="md:text-[1vw] text-[4vw] mb-1">
                    Email Address
                    <span className="text-[#f1416c]">*</span>
                  </h4>
                  <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                    <input
                      type="email"
                      name={`doc_owner_email_${i}`}
                      value={userInput[`doc_owner_email_${i}`] || ""}
                      onChange={handleUserInput}
                      required
                      className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                    />
                  </div>
                </div>
                <div className="md:mt-[1vw] mt-[5vw]">
                  <h4 className="md:text-[1vw] text-[4vw] mb-1">
                    Phone Number
                    <span className="text-[#f1416c]">*</span>
                  </h4>
                  <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                    <input
                      type="text"
                      name={`doc_owner_phone_${i}`}
                      value={userInput[`doc_owner_phone_${i}`] || ""}
                      onChange={handleUserInput}
                      required
                      className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                    />
                  </div>
                </div>
                <div className="md:mt-[1vw] mt-[5vw]">
                  <h4 className="md:text-[1vw] text-[4vw] mb-1">
                    Institution Attended
                    <span className="text-[#f1416c]">*</span>
                  </h4>
                  <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                    <input
                      type="text"
                      name={`doc_owner_institution_${i}`}
                      value={userInput[`doc_owner_institution_${i}`] || ""}
                      onChange={handleUserInput}
                      required
                      className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                    />
                  </div>
                </div>
                {/* <p className="text-sm font-medium mt-[2vw]">Security Question & Answer</p>
                <div className="md:mt-[1vw] mt-[5vw]">
                  <h4 className="md:text-[1vw] text-[4vw] mb-1">
                    Question
                    <span className="text-[#f1416c]">*</span>
                  </h4>
                  <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                    <input
                      type="text"
                      name={`security_question_${i}`}
                      value={userInput[`security_question_${i}`] || ""}
                      onChange={handleUserInput}
                      required
                      className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                    />
                  </div>
                </div>
                <div className="md:mt-[1vw] mt-[5vw]">
                  <h4 className="md:text-[1vw] text-[4vw] mb-1">
                    Answer
                    <span className="text-[#f1416c]">*</span>
                  </h4>
                  <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                    <input
                      type="text"
                      name={`security_answer_${i}`}
                      value={userInput[`security_answer_${i}`] || ""}
                      onChange={handleUserInput}
                      required
                      className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                    />
                  </div>
                </div>
                <h6 className="text-[#2e2e2e] md:text-[0.7vw] text-[2.7vw] font-[600] mt-[0.3vw]">
                  Document owner must answer this question before proceeding with approval or denial.
                </h6> */}
              </div>
              {items.length === 1 && (
                <h6 className="text-[#2e2e2e] md:text-[0.7vw] text-[2.7vw] font-[600] mt-[0.3vw]">
                  <span className="text-[#ff0404]">Note</span>: You can request
                  for multiple document by clicking on "Add" button
                </h6>
              )}

              <div className="flex justify-end gap-[0.5vw]">
                {items.length - 1 === i && (
                  <button
                    type="button"
                    onClick={(e) => handleAddItem(e, i)}
                    // disabled={}
                    className="bg-[#000] md:my-[1vw!important] my-[2vw!important] text-white md:w-[4vw] w-[17vw] md:text-[0.8vw] text-[2.5vw] flex justify-center items-center md:py-[0.5vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[1vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#4b4b4b]"
                  >
                    Add
                  </button>
                )}
                {items.length !== 1 && (
                  <button
                    type="button"
                    onClick={() => handleItemDelete(i)}
                    className="bg-[#FF0404] md:my-[1vw!important] my-[2vw!important] text-white md:w-[6vw] w-[17vw] md:text-[0.8vw] text-[2.5vw] flex justify-center items-center md:py-[0.5vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[1vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            </>
          ))}

          <div className="md:mt-[2vw] mt-[10vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Purpose
              <span className="text-[#f1416c]">*</span>
            </h4>

            {/* Select Input */}
            <select
              name="purpose"
              value={userInput.purpose}
              onChange={handleSelectChange}
              className="w-full md:p-[0.8vw] p-[2vw] md:text-[1vw] text-[3.5vw] border-[1.5px] border-[#E5E5E5] bg-[#f7f7f7] focus:outline-none"
            >
              <option value="">Select Purpose</option>
              <option value="Educational">Educational</option>
              <option value="Employment">Employment</option>
              <option value="Others">Others</option>
            </select>

            {/* Conditionally render textarea */}
            {userInput.purpose === "Others" && (
              <div className="relative w-full md:h-[7vw] h-[30vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5] mt-2">
                <textarea
                  placeholder="Enter your reason for the document verification"
                  value={userInput.reason}
                  name="reason"
                  required
                  onChange={handleUserInput}
                  className="w-full h-full md:p-[0.8vw] p-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                ></textarea>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#FF0404] md:my-[2vw!important] my-[4vw!important] w-full flex justify-center items-center md:py-[0.7vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#fa6767]"
          >
            {isSaving ? (
              <div className="flex items-center justify-center gap-2">
                <LoadItems color={"#ffffff"} size={15} />
                <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                  Creating...
                </h4>
              </div>
            ) : (
              <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                Create Application
              </h4>
            )}
          </button>
        </form>
      )}
      {currentScreen === 2 && (
        <NewApplicationForm2
          setCurrentScreen={setCurrentScreen}
          setOpenModal={(e) => setOpenModal(e)}
          setCurrentTab={setCurrentTab}
          setSelectedStatus={(e) => setSelectedStatus(e)}
        />
      )}
      {currentScreen === 3 && (
        <NewApplicationForm3
          totalApplicationAmount={totalApplicationAmount}
          uniqueRequestedCode={uniqueRequestedCode}
        />
      )}
    </SideModal>
  );
}

export default NewApplicationForm;
