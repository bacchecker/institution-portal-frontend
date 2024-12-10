import React, { useEffect, useState } from "react";
import {
  useCreateNextScreenMutation,
  useDeleteDomentTypeMutation,
  useGetAllExistingDocumentTypesQuery,
  useGetInstitutionDocumentTypesQuery,
} from "../../redux/apiSlice";
import formatText from "../../components/FormatText";
import LoadItems from "../../components/LoadItems";
import AddNewDocumentType from "./institutionDocumentTypesComponents/AddNewDocumentType";
import secureLocalStorage from "react-secure-storage";
import Dropdown from "../../components/Dropdown";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/authSlice";
import Swal from "sweetalert2";
import LoadingPage from "../../components/LoadingPage";
import EditDocumentType from "./institutionDocumentTypesComponents/EditDocumentType";

function InstitutionDocumentTypes({ setActiveStep }) {
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState({});

  const user = JSON.parse(secureLocalStorage.getItem("user"));

  const {
    data: institutionDocumentTypes,
    isLoading,
    isFetching,
  } = useGetInstitutionDocumentTypesQuery({ page: pageNumber });

  const {
    data: existingDocumentTypes,
    isLoading: isExistingDocTypesLoading,
    isFetching: isExistingDocTypesFetching,
  } = useGetAllExistingDocumentTypesQuery({
    ...(user?.institution?.type === "bacchecker-academic" && {
      selectedAcademicLevel: user?.institution?.academic_level,
    }),
    ...(user?.institution?.type !== "bacchecker-academic" && {
      institution_type: "non-academic",
    }),
  });

  const handleDocumentType = (documentType) => {
    setOpenEditModal(true);
    setSelectedDocumentType(documentType);
  };

  const handleBackButton = () => {
    const updatedInstitution = {
      ...user?.institution,
      current_step: "1",
    };
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    dispatch(
      setUser({
        user: user?.user,
        two_factor: user.two_factor,
        institution: updatedInstitution,
        selectedTemplate: user.selectedTemplate,
      })
    );
    setActiveStep(1);
  };

  const [
    createNextScreen,
    { data, isSuccess, isLoading: isCreateNextScreenLoading, isError, error },
  ] = useCreateNextScreenMutation();

  const handleSubmit = async () => {
    if (institutionDocumentTypes?.document_types?.data?.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Add at least One document type",
        icon: "error",
        button: "OK",
      });
      return;
    }

    try {
      await createNextScreen({
        step: 3,
      });
    } catch (error) {
      console.error("Error moving to next page:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      Swal.fire({
        title: "Success",
        text: "Institution Document Type(s) created successfully",
        icon: "success",
        button: "OK",
        confirmButtonColor: "#00b17d",
      }).then((isOkay) => {
        if (isOkay) {
          const updatedInstitution = {
            ...user?.institution,
            current_step: "3",
          };
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          dispatch(
            setUser({
              user: user?.user,
              two_factor: user.two_factor,
              institution: updatedInstitution,
              selectedTemplate: user.selectedTemplate,
            })
          );
          setActiveStep(3);
        }
      });
    }
  }, [isSuccess]);

  const [
    deleteDomentType,
    {
      data: documentTypeData,
      isSuccess: isDeleteDomentTypeSuccess,
      isLoading: isDeleteDomentTypeLoading,
    },
  ] = useDeleteDomentTypeMutation();

  const handleClickDelete = async (documentType) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this document type?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#febf4c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I'm sure",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      await deleteDomentType({ id: documentType?.id });
    }
  };

  useEffect(() => {
    if (isDeleteDomentTypeSuccess) {
      Swal.fire({
        title: "Success",
        text: "Document Type deleted successfully",
        icon: "success",
        button: "OK",
      });
    }
  }, [isDeleteDomentTypeSuccess]);

  return (
    <>
      {isDeleteDomentTypeLoading && <LoadingPage />}
      <div className="flex flex-col w-full">
        <div className="flex w-full relative">
          <div className="w-[75%] px-[4vw] py-[2vw] mt-[3.5vw]">
            <h1 className="text-[1.5vw] font-[600] text-[#000]">
              Institution Document Types
            </h1>
            <h4 className="text-[0.9vw] mt-[0.5vw]">
              To set up your account, add the document types accepted by your
              school.
              <br /> Choose from the list of common tertiary documents
            </h4>
          </div>
        </div>
        <div className="w-[75%] px-[4vw] mt-[1vw] mb-[4vw]">
          <div className="w-full flex justify-end">
            <button
              type="button"
              onClick={() => setOpenModal(true)}
              className="bg-[#000000] md:my-[2vw!important] my-[4vw!important] w-fit flex justify-center items-center md:py-[0.7vw] py-[2vw] md:px-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#282727] transition-all duration-300 disabled:bg-[#282727]"
            >
              <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                Add Doucment Type
              </h4>
            </button>
          </div>
          <div className="content">
            <div className="w-full border border-[#D6D6D6] md:min-h-[40vw] min-h-[100vw] md:rounded-[0.7vw] rounded-[2vw] gap-[3vw] overflow-auto bg-white table-cover md:mt-[1vw] mt-[6vw] scroll-width">
              <table className="md:w-full w-[230vw] border-collapse md:text-[0.8vw] text-[3.5vw] rounded-[0.7vw] relative">
                <thead className="bg-[#f0efef] sticky top-0 z-[20]">
                  <tr className="text-left">
                    <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[15%]">
                      <div className="flex gap-[1vw]">
                        <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                          <img
                            src="/assets/img/top-arr.svg"
                            alt=""
                            className="md:w-[0.5vw] w-[2vw]"
                          />
                          <img
                            src="/assets/img/down-arr.svg"
                            alt=""
                            className="md:w-[0.5vw] w-[2vw]"
                          />
                        </div>
                        <h4 className="md:text-[0.9vw] text-[3.5vw]">Name</h4>
                      </div>
                    </th>
                    <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[15%]">
                      <div className="flex gap-[1vw]">
                        <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                          <img
                            src="/assets/img/top-arr.svg"
                            alt=""
                            className="md:w-[0.5vw] w-[2vw]"
                          />
                          <img
                            src="/assets/img/down-arr.svg"
                            alt=""
                            className="md:w-[0.5vw] w-[2vw]"
                          />
                        </div>
                        <h4 className="md:text-[0.9vw] text-[3.5vw]">
                          Document Format(s)
                        </h4>
                      </div>
                    </th>
                    <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[13%]">
                      <div className="flex gap-[1vw]">
                        <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                          <img
                            src="/assets/img/top-arr.svg"
                            alt=""
                            className="md:w-[0.5vw] w-[2vw]"
                          />
                          <img
                            src="/assets/img/down-arr.svg"
                            alt=""
                            className="md:w-[0.5vw] w-[2vw]"
                          />
                        </div>
                        <h4 className="md:text-[0.9vw] text-[3.5vw]">
                          Document Fee
                        </h4>
                      </div>
                    </th>
                    <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[15%]">
                      <div className="flex gap-[1vw]">
                        <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                          <img
                            src="/assets/img/top-arr.svg"
                            alt=""
                            className="md:w-[0.5vw] w-[2vw]"
                          />
                          <img
                            src="/assets/img/down-arr.svg"
                            alt=""
                            className="md:w-[0.5vw] w-[2vw]"
                          />
                        </div>
                        <h4 className="md:text-[0.9vw] text-[3.5vw]">
                          Printing Fee
                        </h4>
                      </div>
                    </th>
                    <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[15%]">
                      <div className="flex gap-[1vw]">
                        <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                          <img
                            src="/assets/img/top-arr.svg"
                            alt=""
                            className="md:w-[0.5vw] w-[2vw]"
                          />
                          <img
                            src="/assets/img/down-arr.svg"
                            alt=""
                            className="md:w-[0.5vw] w-[2vw]"
                          />
                        </div>
                        <h4 className="md:text-[0.9vw] text-[3.5vw]">
                          Validation Fee
                        </h4>
                      </div>
                    </th>
                    <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[10%]">
                      <div className="flex gap-[1vw]">
                        <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                          <img
                            src="/assets/img/top-arr.svg"
                            alt=""
                            className="md:w-[0.5vw] w-[2vw]"
                          />
                          <img
                            src="/assets/img/down-arr.svg"
                            alt=""
                            className="md:w-[0.5vw] w-[2vw]"
                          />
                        </div>
                        <h4 className="md:text-[0.9vw] text-[3.5vw]">
                          Verification Fee
                        </h4>
                      </div>
                    </th>
                    <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[10%]"></th>
                  </tr>
                </thead>
                <tbody className="">
                  {!isFetching && !isLoading ? (
                    <>
                      {institutionDocumentTypes?.document_types?.data
                        ?.length === 0 ? (
                        <tr>
                          <td colSpan={7} rowSpan={5}>
                            <div className="w-full h-[35vw] flex flex-col justify-center items-center">
                              <img
                                src="/assets/img/no-data.svg"
                                alt=""
                                className="w-[10vw]"
                              />
                              <h4 className="md:text-[1vw] text-[3.5vw] font-[600]">
                                No DocumentType Available
                              </h4>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <>
                          {institutionDocumentTypes?.document_types?.data?.map(
                            (documentType, i) => {
                              return (
                                <tr key={i}>
                                  <td className="py-[1vw] px-[1vw] border-b max-w-[15%]">
                                    {documentType?.document_type?.name}
                                  </td>
                                  <td className="py-[1vw] px-[2.5vw] border-b max-w-[13%]">
                                    {documentType?.soft_copy &&
                                    documentType?.hard_copy ? (
                                      <>
                                        <span className="text-[#FFA52D]">
                                          soft copy
                                        </span>
                                        <span className="text-[#000000]">
                                          , hard copy
                                        </span>
                                      </>
                                    ) : documentType?.soft_copy ? (
                                      <span className="text-[#FFA52D]">
                                        soft copy
                                      </span>
                                    ) : documentType?.hard_copy ? (
                                      <span className="text-[#000000]">
                                        hard copy
                                      </span>
                                    ) : null}
                                  </td>

                                  <td className="py-[1vw] px-[1vw] border-b max-w-[15%]">
                                    GH¢ {documentType?.base_fee}
                                  </td>
                                  <td className="py-[1vw] px-[1vw] border-b max-w-[15%]">
                                    GH¢ {documentType?.printing_fee}
                                  </td>
                                  <td className="py-[1vw] px-[1vw] border-b max-w-[15%]">
                                    GH¢ {documentType?.validation_fee}
                                  </td>
                                  <td className="py-[1vw] px-[1vw] border-b max-w-[15%]">
                                    GH¢ {documentType?.verification_fee}
                                  </td>
                                  <td className="text-end border-b">
                                    <Dropdown
                                      buttonContent={
                                        <>
                                          <i class="bx bx-dots-vertical-rounded text-[1.2vw]"></i>
                                        </>
                                      }
                                      buttonClass="action-button-class"
                                      dropdownClass="action-dropdown-class"
                                    >
                                      <div className="action-dropdown-content">
                                        <button
                                          onClick={() =>
                                            handleDocumentType(documentType)
                                          }
                                          className="dropdown-item flex justify-between disabled:cursor-not-allowed"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleClickDelete(documentType)
                                          }
                                          className="dropdown-item flex justify-between disabled:cursor-not-allowed"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </Dropdown>
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={7} rowSpan={5}>
                        <div className="w-full h-[35vw] flex items-center justify-center">
                          <LoadItems color={"#000000"} />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="w-full flex justify-end items-center md:gap-[1vw] gap-[3vw] md:mt-[1vw] mt-[4vw]">
              <h4 className="md:text-[1vw] text-[3.5vw]">
                Page <span>{pageNumber}</span> of{" "}
                <span>
                  {institutionDocumentTypes?.document_types?.last_page}
                </span>
              </h4>
              <div className="flex md:gap-[1vw] gap-[3vw]">
                <button
                  type="button"
                  onClick={() => {
                    setPageNumber((prev) => Math.max(prev - 1, 1));
                  }}
                  className="md:w-[2.5vw] md:h-[2.5vw] w-[10vw] h-[10vw] rounded-[50%] bg-[#d0d0d0] flex justify-center items-center"
                >
                  <img
                    src="/assets/img/arr-b.svg"
                    alt=""
                    className="md:w-[1.1vw] w-[4vw]"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPageNumber((prev) =>
                      Math.min(
                        prev + 1,
                        institutionDocumentTypes?.document_types?.last_page
                      )
                    );
                  }}
                  className="md:w-[2.5vw] md:h-[2.5vw] w-[10vw] h-[10vw] rounded-[50%] bg-[#d0d0d0] flex justify-center items-center"
                >
                  <img
                    src="/assets/img/arr-f.svg"
                    alt=""
                    className="md:w-[1.1vw] w-[4vw]"
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-between items-center mt-[2vw] border-t">
            <button
              type="button"
              onClick={handleBackButton}
              className=" border border-[#D6D6D6] md:my-[2vw!important] my-[4vw!important] w-fit flex justify-center items-center md:py-[0.7vw] py-[2vw] md:px-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#D6D6D6] transition-all duration-300 disabled:bg-[#fa6767]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isCreateNextScreenLoading}
              className="bg-[#FF0404] md:my-[2vw!important] my-[4vw!important] w-fit flex justify-center items-center md:py-[0.7vw] py-[2vw] md:px-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#fa6767]"
            >
              {isCreateNextScreenLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadItems color={"#ffffff"} size={15} />
                  <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                    Saving...
                  </h4>
                </div>
              ) : (
                <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                  Save & Contitnue
                </h4>
              )}
            </button>
          </div>
          <AddNewDocumentType
            setOpenModal={setOpenModal}
            openModal={openModal}
            existingDocumentTypes={existingDocumentTypes}
            isExistingDocTypesFetching={isExistingDocTypesFetching}
            isExistingDocTypesLoading={isExistingDocTypesLoading}
          />
          <EditDocumentType
            setOpenModal={setOpenEditModal}
            openModal={openEditModal}
            selectedDocumentType={selectedDocumentType}
          />
        </div>
      </div>
    </>
  );
}

export default InstitutionDocumentTypes;
