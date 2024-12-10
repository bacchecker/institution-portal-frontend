import React, { useEffect, useState } from "react";
import {
  useCreateNextScreenMutation,
  useDeleteDomentTypeMutation,
  useGetAllExistingDocumentTypesQuery,
  useGetAllPermissionsQuery,
  useGetInstitutionDepartmentsQuery,
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
import AddNewDepartment from "./institutionDepartmentComponents/AddNewDepartment";

function InstitutionDepartments({ setActiveStep }) {
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
    data: allPermissions,
    isLoading: isAllPermissionsLoading,
    isFetching: isAllPermissionsFetching,
  } = useGetAllPermissionsQuery();

  const {
    data: institutionDepartments,
    // isLoading,
    // isFetching,
  } = useGetInstitutionDepartmentsQuery({ page: pageNumber });

  console.log("instit", allPermissions);

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
      current_step: "2",
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
    setActiveStep(2);
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
              Institution Departments
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
                Add New Department
              </h4>
            </button>
          </div>
          <div className="content">
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
          <AddNewDepartment
            setOpenModal={setOpenModal}
            openModal={openModal}
            allPermissions={allPermissions}
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

export default InstitutionDepartments;
