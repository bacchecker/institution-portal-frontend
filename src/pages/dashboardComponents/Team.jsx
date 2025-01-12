import React, { useEffect, useState } from "react";
import {
  useCreateNextScreenMutation,
  useDeleteInstitutionUserMutation,
  useGetInstitutionDepartmentsQuery,
  useGetInstitutionUsersQuery,
} from "../../redux/apiSlice";
import formatText from "../../components/FormatText";
import LoadItems from "../../components/LoadItems";
import secureLocalStorage from "react-secure-storage";
import Dropdown from "../../components/Dropdown";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/authSlice";
import Swal from "sweetalert2";
import LoadingPage from "../../components/LoadingPage";
import EditUser from "../accountSetupComponents/institutionPortalUsersComponents/EditUser";
// import EditUser from "./institutionPortalUsersComponents/EditUser";

function Team({ setActiveStep }) {
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const user = JSON.parse(secureLocalStorage.getItem("user"));
  let permissions = secureLocalStorage.getItem('userPermissions') || [];
  const isAdmin = JSON.parse(secureLocalStorage.getItem("userRole"))?.isAdmin;
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

      <>
        <div className="w-full h-full gap-[3vw] overflow-auto bg-white table-cover  scroll-width">
          <table className="md:w-full w-[160vw] border-collapse md:text-[0.8vw] text-[3.5vw] rounded-[0.7vw] relative">
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
                    <h4 className="md:text-[0.9vw] text-[3.5vw]">Department</h4>
                  </div>
                </th>
                <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[10%]"></th>
              </tr>
            </thead>
            <tbody className="">
              {!isFetching && !isLoading ? (
                <>
                  {institutionUsers?.institutionUsers?.data?.length === 0 ? (
                    <tr>
                      <td colSpan={7} rowSpan={5}>
                        <div className="w-full h-[20vw] flex flex-col justify-center items-center">
                          <img
                            src="/assets/img/no-data.svg"
                            alt=""
                            className="w-[6vw]"
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
                                {user?.phone}
                              </td>
                              <td className="py-[1vw] px-[1vw] border-b max-w-[15%]">
                                {user?.department?.name}
                              </td>
                              {(permissions?.includes("institution.users.update") || permissions?.includes("institution.users.delete") || isAdmin)}
                              <td className="text-end border-b">
                                <Dropdown
                                  buttonContent={
                                    <>
                                      <i className="bx bx-dots-vertical-rounded md:text-[1.2vw] text-[3.5vw]"></i>
                                    </>
                                  }
                                  buttonclassName="action-button-class"
                                  dropdownclassName="action-dropdown-class"
                                >
                                  <div className="action-dropdown-content">
                                    {(permissions?.includes("institution.users.update") || isAdmin) && (
                                      <button
                                        onClick={() => handleSelectedUser(user)}
                                        className="dropdown-item flex justify-between disabled:cursor-not-allowed"
                                      >
                                        Edit
                                      </button>
                                    )}
                                    {(permissions?.includes("institution.users.delete") || isAdmin) && (
                                      <button
                                        onClick={() => handleClickDelete(user)}
                                        className="dropdown-item flex justify-between disabled:cursor-not-allowed"
                                      >
                                        Delete
                                      </button>
                                    )}
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
                    <div className="w-full h-[20vw] flex items-center justify-center">
                      <LoadItems color={"#000000"} />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <EditUser
          setOpenModal={setOpenEditModal}
          openModal={openEditModal}
          selectedUser={selectedUser}
          institutionDepartments={institutionDepartments}
          isDepartmentsFetching={isDepartmentsFetching}
          isDepartmentsLoading={isDepartmentsLoading}
        />
      </>
    </>
  );
}

export default Team;
