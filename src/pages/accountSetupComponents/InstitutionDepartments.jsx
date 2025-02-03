import React, { useEffect, useState } from "react";
import {
  useCreateNextScreenMutation,
  useDeleteDepartmentMutation,
  useDeleteDomentTypeMutation,
  useGetAllExistingDocumentTypesQuery,
  useGetAllPermissionsQuery,
  useGetInstitutionDepartmentsQuery,
  useGetInstitutionDocumentTypesQuery,
} from "../../redux/apiSlice";
import formatText from "@/components/FormatText";
import LoadItems from "@/components/LoadItems";
import AddNewDocumentType from "./institutionDocumentTypesComponents/AddNewDocumentType";
import secureLocalStorage from "react-secure-storage";
import Dropdown from "@/components/Dropdown";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/authSlice";
import Swal from "sweetalert2";
import LoadingPage from "@/components/LoadingPage";
import EditDocumentType from "./institutionDocumentTypesComponents/EditDocumentType";
import AddNewDepartment from "./institutionDepartmentComponents/AddNewDepartment";
import EditDepartment from "./institutionDepartmentComponents/EditDepartment";

function InstitutionDepartments({ setActiveStep }) {
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [deletingIndex, setDeletingIndex] = useState(null);

  const user = JSON.parse(secureLocalStorage.getItem("user"));

  const {
    data: allPermissions,
    isLoading: isAllPermissionsLoading,
    isFetching: isAllPermissionsFetching,
  } = useGetAllPermissionsQuery();

  const {
    data: institutionDepartments,
    isLoading,
    isFetching,
  } = useGetInstitutionDepartmentsQuery({ page: pageNumber });

  const handleDepartment = (department) => {
    setOpenEditModal(true);
    setSelectedDepartment(department);
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
    if (institutionDepartments?.departments?.data?.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Add at least One department",
        icon: "error",
        button: "OK",
      });
      return;
    }

    try {
      await createNextScreen({
        step: 4,
      });
    } catch (error) {
      console.error("Error moving to next page:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      Swal.fire({
        title: "Success",
        text: "Institution Department(s) created successfully",
        icon: "success",
        button: "OK",
        confirmButtonColor: "#00b17d",
      }).then((isOkay) => {
        if (isOkay) {
          const updatedInstitution = {
            ...user?.institution,
            current_step: "4",
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
          setActiveStep(4);
        }
      });
    }
  }, [isSuccess]);

  const [
    deleteDepartment,
    {
      data: departmentData,
      isSuccess: isDeleteDepartmentSuccess,
      isLoading: isDeleteDepartmentLoading,
    },
  ] = useDeleteDepartmentMutation();

  const handleClickDelete = async (department, i) => {
    setDeletingIndex(i);

    const result = await Swal.fire({
      title: "Are you sure you want to delete this department?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#febf4c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I'm sure",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      await deleteDepartment({ id: department?.id });
    }
  };

  useEffect(() => {
    if (isDeleteDepartmentSuccess) {
      Swal.fire({
        title: "Success",
        text: "Department deleted successfully",
        icon: "success",
        button: "OK",
      });
    }
  }, [isDeleteDepartmentSuccess]);

  console.log("err", institutionDepartments?.departments?.data?.length);


  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex w-full relative">
          <div className="w-[75%] px-[4vw] py-[2vw] mt-[3.5vw]">
            <h1 className="text-[1.5vw] font-[600] text-[#000]">
              Institution Departments
            </h1>
            <h4 className="text-[0.9vw] mt-[0.5vw]">
              On this page, you can create and manage departments within your
              institution. <br />
              Each department represents a distinct functional or academic
              division that oversees specific operations and resources.
            </h4>
            <h4 className="text-[0.9vw] mt-[0.5vw]"><span className="text-[#ff0404]">Note:</span> Only one department can be added at this stage</h4>
          </div>
        </div>
        <div className="w-[75%] px-[4vw] mt-[1vw] mb-[4vw]">
          {institutionDepartments?.departments?.data?.length < 1 && (
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
          )}

          <div className="content">
            {!isFetching && !isLoading ? (
              <>
                {institutionDepartments?.departments?.data?.length > 0 ? (
                  <>
                    <div className="flex flex-wrap w-full gap-[1vw]">
                      {institutionDepartments?.departments?.data?.map(
                        (department, i) => {
                          if (!department.permissions) return null;

                          const groupedPermissions =
                            department.permissions.reduce((acc, permission) => {
                              const parts = permission.name.split(".");
                              const category = parts[0];
                              const subcategory =
                                parts.length === 3 ? parts[1] : null;
                              const action =
                                parts.length === 3 ? parts[2] : parts[1];

                              if (!acc[category]) acc[category] = {};
                              if (subcategory) {
                                if (!acc[category][subcategory])
                                  acc[category][subcategory] = [];
                                acc[category][subcategory].push({
                                  id: permission.id,
                                  action,
                                });
                              } else {
                                if (!acc[category].actions)
                                  acc[category].actions = [];
                                acc[category].actions.push({
                                  id: permission.id,
                                  action,
                                });
                              }

                              return acc;
                            }, {});

                          return (
                            <div
                              key={i}
                              className="w-[49%] min-h-[20vw] border border-[#ff040449] p-[1vw] rounded-[0.3vw] relative pb-[6vw]"
                            >
                              <div className="text-[1vw] font-[400] mb-[1vw]">
                                Department:{" "}
                                <span className="font-[700]">
                                  {department.name}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-[2vw]">
                                {Object?.entries(groupedPermissions)?.map(
                                  ([category, subcategories]) => (
                                    <div key={category} className="mb-[0.2vw]">
                                      <h2 className="text-[0.9vw] capitalize font-[600]">{`Manage ${category.replace(
                                        "-",
                                        " "
                                      )}`}</h2>
                                      {Object?.entries(subcategories)?.map(
                                        ([subcategory, actions]) => (
                                          <div
                                            key={subcategory}
                                            className="ml-[0.5vw]"
                                          >
                                            <h3 className="text-[0.9vw] capitalize">
                                              {subcategory.replace("-", " ")}
                                            </h3>
                                            {actions.map(({ id, action }) => (
                                              <div
                                                key={id}
                                                className="ml-[0.5vw]"
                                              >
                                                <div className="flex items-center gap-[0.3vw] text-[0.9vw] cursor-pointer">
                                                  <div className="w-[0.4vw] h-[0.2vw] bg-[#ff0404]"></div>
                                                  {`Can ${action.replace(
                                                    "-",
                                                    " "
                                                  )}`}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                              <div className="absolute right-[1vw] bottom-[1vw] flex gap-[1vw] items-center">
                                <button
                                  type="button"
                                  onClick={() => handleDepartment(department)}
                                  className=" border border-[#D6D6D6] w-fit text-[0.8vw] flex justify-center items-center md:py-[0.3vw] py-[2vw] md:px-[1vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#D6D6D6] transition-all duration-300 disabled:bg-[#fa6767]"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  disabled={
                                    isDeleteDepartmentLoading &&
                                    deletingIndex === i
                                  }
                                  onClick={() =>
                                    handleClickDelete(department, i)
                                  }
                                  className=" border bg-[#D6D6D6] w-fit text-[0.8vw] flex justify-center items-center md:py-[0.3vw] py-[2vw] md:px-[1vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#D6D6D6] transition-all duration-300 disabled:bg-[#9b9a9a]"
                                >
                                  {isDeleteDepartmentLoading &&
                                    deletingIndex === i ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <LoadItems color={"#3f4254"} size={12} />
                                      <h4 className="text-[0.8vw]">
                                        Deleting...
                                      </h4>
                                    </div>
                                  ) : (
                                    <h4 className="text-[0.8vw]">Delete</h4>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-[30vw] flex flex-col justify-center items-center">
                    <img
                      src="/assets/img/no-data.svg"
                      alt=""
                      className="w-[10vw]"
                    />
                    <h4 className="md:text-[1vw] text-[3.5vw] font-[600]">
                      No Department Available
                    </h4>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-[25vw] flex items-center justify-center">
                <LoadItems color={"#000000"} />
              </div>
            )}
            <div className="w-full flex justify-end items-center md:gap-[1vw] gap-[3vw] md:mt-[1vw] mt-[4vw]">
              <h4 className="md:text-[1vw] text-[3.5vw]">
                Page <span>{pageNumber}</span> of{" "}
                <span>{institutionDepartments?.departments?.last_page}</span>
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
                        institutionDepartments?.departments?.last_page
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
          <EditDepartment
            setOpenModal={setOpenEditModal}
            openModal={openEditModal}
            selectedDepartment={selectedDepartment}
            allPermissions={allPermissions}
          />
        </div>
      </div>
    </>
  );
}

export default InstitutionDepartments;
