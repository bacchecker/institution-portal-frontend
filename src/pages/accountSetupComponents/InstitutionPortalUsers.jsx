import React, { useEffect, useState } from "react";
import {
  useCreateNextScreenMutation,
  useDeleteDomentTypeMutation,
  useDeleteInstitutionUserMutation,
  useGetAllExistingDocumentTypesQuery,
  useGetInstitutionDepartmentsQuery,
  useGetInstitutionDocumentTypesQuery,
  useGetInstitutionUsersQuery,
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
import AddNewUser from "./institutionPortalUsersComponents/AddNewUser";
import EditUser from "./institutionPortalUsersComponents/EditUser";

function InstitutionPortalUsers({ setActiveStep }) {
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const user = JSON.parse(secureLocalStorage.getItem("user"));

  const {
    data: institutionUsers,
    isLoading,
    isFetching,
  } = useGetInstitutionUsersQuery({ page: pageNumber });

  const {
    data: institutionDepartments,
    isLoading: isDepartmentsLoading,
    isFetching: isDepartmentsFetching,
  } = useGetInstitutionDepartmentsQuery({ page: 1, perPage: 100 });

  const handleSelectedUser = (user) => {
    setOpenEditModal(true);
    setSelectedUser(user);
  };

  const handleBackButton = () => {
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
  };

  const [
    createNextScreen,
    { data, isSuccess, isLoading: isCreateNextScreenLoading, isError, error },
  ] = useCreateNextScreenMutation();

  const handleSubmit = async () => {
    if (institutionUsers?.institutionUsers?.data?.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Add at least One user",
        icon: "error",
        button: "OK",
      });
      return;
    }

    try {
      await createNextScreen({
        step: 5,
      });
    } catch (error) {
      console.error("Error moving to next page:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const updatedInstitution = {
        ...user?.institution,
        current_step: "5",
        setup_done: 1,
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
      setActiveStep(5);
    }
  }, [isSuccess]);

  const [
    deleteInstitutionUser,
    {
      data: institutionUserData,
      isSuccess: isDeleteInstitutionUserSuccess,
      isLoading: isDeleteInstitutionUserLoading,
    },
  ] = useDeleteInstitutionUserMutation();

  const handleClickDelete = async (user) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#febf4c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I'm sure",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      await deleteInstitutionUser({ id: user?.id });
    }
  };

  useEffect(() => {
    if (isDeleteInstitutionUserSuccess) {
      Swal.fire({
        title: "Success",
        text: "User deleted successfully",
        icon: "success",
        button: "OK",
      });
    }
  }, [isDeleteInstitutionUserSuccess]);

  return (
    <>
      {isDeleteInstitutionUserLoading && <LoadingPage />}
      <div className="flex flex-col w-full">
        <div className="flex w-full relative">
          <div className="w-[75%] px-[4vw] py-[2vw] mt-[3.5vw]">
            <h1 className="text-[1.5vw] font-[600] text-[#000]">
              Institution Portal Users
            </h1>
            <h4 className="text-[0.9vw] mt-[0.5vw]">
              Use this page to create and manage user accounts within your
              institution portal. <br /> Assign each user to a department and customize
              their roles, permissions, and access levels based on their
              responsibilities.
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
                Add New User
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
                        <h4 className="md:text-[0.9vw] text-[3.5vw]">Email</h4>
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
                        <h4 className="md:text-[0.9vw] text-[3.5vw]">Phone</h4>
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
                          Department
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
                          Residential Address
                        </h4>
                      </div>
                    </th>
                    <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[10%]"></th>
                  </tr>
                </thead>
                <tbody className="">
                  {!isFetching && !isLoading ? (
                    <>
                      {institutionUsers?.institutionUsers?.data?.length ===
                      0 ? (
                        <tr>
                          <td colSpan={7} rowSpan={5}>
                            <div className="w-full h-[35vw] flex flex-col justify-center items-center">
                              <img
                                src="/assets/img/no-data.svg"
                                alt=""
                                className="w-[10vw]"
                              />
                              <h4 className="md:text-[1vw] text-[3.5vw] font-[600]">
                                No User Available
                              </h4>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <>
                          {institutionUsers?.institutionUsers?.data?.map(
                            (user, i) => {
                              return (
                                <tr key={i}>
                                  <td className="py-[1vw] px-[1vw] border-b max-w-[15%]">
                                    {user?.first_name} {user?.other_name}{" "}
                                    {user?.last_name}
                                  </td>
                                  <td className="py-[1vw] px-[1vw] border-b max-w-[15%]">
                                    {user?.email}
                                  </td>
                                  <td className="py-[1vw] px-[1vw] border-b max-w-[15%]">
                                    {user?.phone}
                                  </td>
                                  <td className="py-[1vw] px-[1vw] border-b max-w-[15%]">
                                    {user?.department?.name}
                                  </td>
                                  <td className="py-[1vw] px-[1vw] border-b max-w-[15%]">
                                    {user?.address}
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
                                            handleSelectedUser(user)
                                          }
                                          className="dropdown-item flex justify-between disabled:cursor-not-allowed"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleClickDelete(user)
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
                <span>{institutionUsers?.institutionUsers?.last_page}</span>
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
                        institutionUsers?.institutionUsers?.last_page
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
          <AddNewUser
            setOpenModal={setOpenModal}
            openModal={openModal}
            institutionDepartments={institutionDepartments}
            isDepartmentsFetching={isDepartmentsFetching}
            isDepartmentsLoading={isDepartmentsLoading}
          />
          <EditUser
            setOpenModal={setOpenEditModal}
            openModal={openEditModal}
            selectedUser={selectedUser}
            institutionDepartments={institutionDepartments}
            isDepartmentsFetching={isDepartmentsFetching}
            isDepartmentsLoading={isDepartmentsLoading}
          />
        </div>
      </div>
    </>
  );
}

export default InstitutionPortalUsers;
