import React, { useEffect, useState } from "react";
import SideModal from "@/components/SideModal";
import SelectInput from "@/components/SelectInput";
import Swal from "sweetalert2";
import {
  useUpdateUserMutation,
} from "../../../redux/apiSlice";
import LoadItems from "@/components/LoadItems";
import { toast } from "sonner";

function EditUser({
  setOpenModal,
  openModal,
  institutionDepartments,
  isDepartmentsFetching,
  isDepartmentsLoading,
  selectedUser,
}) {
  const [userInput, setUserInput] = useState([]);
  const [userInitialInput, setUserInitialInput] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const data = [
    { title: "Male", value: "male" },
    { title: "Female", value: "female" },
  ];

  useEffect(() => {
    if (selectedUser) {
      setUserInput(selectedUser);
      setUserInitialInput(selectedUser);
      const gender = data?.find((item) => item?.value === selectedUser?.gender);
      const department = institutionDepartments?.departments?.data?.find(
        (item) => item?.id === selectedUser?.department_id
      );
      const perms = selectedUser?.permissions?.map((item) => item.id);
      setSelectedPermissions(perms);
      setSelectedGender(gender);
      setSelectedDepartment(department);
    }
  }, [selectedUser]);

  const handleSeletedGender = (item) => {
    setSelectedGender(item);
  };

  const handleSeletedDepartment = (item) => {
    setSelectedDepartment(item);
  };

  const handleUserInput = (e) => {
    setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((permId) => permId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (!openModal) {
      setUserInput(userInitialInput);
      const gender = data?.find(
        (item) => item?.value === userInitialInput?.gender
      );

      const department = institutionDepartments?.departments?.data?.find(
        (item) => item?.id === userInitialInput?.department_id
      );
      const perms = institutionDepartments?.permissions?.map((item) => item.id);
      setSelectedPermissions(perms);
      setSelectedDepartment(department);
      setSelectedGender(gender);
    }
  }, [openModal]);

  useEffect(() => {
    if (selectedDepartment?.permissions) {
      const groups = selectedDepartment?.permissions?.reduce(
        (acc, permission) => {
          const parts = permission.name.split(".");

          const category = parts[0];
          const subcategory = parts.length === 3 ? parts[1] : null;
          const action = parts.length === 3 ? parts[2] : parts[1];

          if (!acc[category]) acc[category] = {};
          if (subcategory) {
            if (!acc[category][subcategory]) acc[category][subcategory] = [];
            acc[category][subcategory].push({ id: permission.id, action });
          } else {
            if (!acc[category].actions) acc[category].actions = [];
            acc[category].actions.push({ id: permission.id, action });
          }

          return acc;
        },
        {}
      );

      setGroupedPermissions(groups);
    }
  }, [selectedDepartment]);

  const [updateUser, { data: userData, isSuccess, isLoading, isError, error }] =
    useUpdateUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { first_name, last_name, other_name, email, phone, address, id } =
      userInput;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !address ||
      !selectedGender?.value ||
      !selectedDepartment?.id
    ) {
      Swal.fire({
        title: "Error",
        text: "Fill All Required Fields",
        icon: "error",
        button: "OK",
      });
    } else if (selectedPermissions?.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Select at least one permssion",
        icon: "error",
        button: "OK",
      });
    } else {
      const result = await Swal.fire({
        title: "Are you sure you want to update this user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#febf4c",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, I'm sure",
        cancelButtonText: "No, cancel",
      });

      if (result.isConfirmed) {
        try {
          await updateUser({
            id,
            body: {
              first_name,
              last_name,
              other_name,
              email,
              phone,
              address,
              department_id: selectedDepartment?.id,
              gender: selectedGender?.value,
              permissions: selectedPermissions,
            },
          });
        } catch (error) {
          toast.error("Failed to create user", {
            position: "top-right",
            autoClose: 1202,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
    }
  };

  useEffect(() => {
    if (isSuccess && userData) {
      Swal.fire({
        title: "Success",
        text: "User Updated successfully",
        icon: "success",
        button: "OK",
        confirmButtonColor: "#00b17d",
      }).then((isOkay) => {
        if (isOkay) {
          setOpenModal(!openModal);
        }
      });
    }
  }, [isSuccess, userData]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);
  return (
    <SideModal
      title={"User Details"}
      setOpenModal={setOpenModal}
      openModal={openModal}
    >
      <form
        onSubmit={handleSubmit}
        className="md:px-[1vw] px-[5vw] w-full overflow-auto pt-[1vw]"
      >
        <div className="flex flex-col">
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              First Name<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="first_name"
                value={userInput.first_name}
                onChange={handleUserInput}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Last Name<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="last_name"
                value={userInput.last_name}
                onChange={handleUserInput}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">Other Name</h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="other_name"
                value={userInput.other_name}
                onChange={handleUserInput}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Email<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="email"
                value={userInput.email}
                onChange={handleUserInput}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Phone<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="phone"
                value={userInput.phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                    handleUserInput(e);
                  }
                }}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Residential Address<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="address"
                value={userInput.address}
                onChange={handleUserInput}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Gender<span className="text-[#f1416c]">*</span>
            </h4>
            <SelectInput
              placeholder={"Select Option"}
              data={data}
              inputValue={selectedGender?.title}
              onItemSelect={handleSeletedGender}
              className="custom-dropdown-class display-md-none"
            />
          </div>
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Department<span className="text-[#f1416c]">*</span>
            </h4>
            <SelectInput
              placeholder={"Select Option"}
              data={institutionDepartments?.departments?.data}
              inputValue={selectedDepartment?.name}
              onItemSelect={handleSeletedDepartment}
              isLoading={isDepartmentsFetching || isDepartmentsLoading}
              className="custom-dropdown-class display-md-none"
            />
          </div>
          {selectedDepartment?.permissions && (
            <div className="mt-4">
              <h4 className="md:text-[1vw] text-[4vw] mb-1">
                Permissions<span className="text-[#f1416c]">*</span>
              </h4>
              <div className="flex gap-[3vw] flex-wrap">
                {Object?.entries(groupedPermissions)?.map(
                  ([category, subcategories]) => (
                    <div key={category} className="mb-[0.2vw]">
                      <h2 className="text-[0.9vw] capitalize font-[600]">{`Manage ${category.replace(
                        "-",
                        " "
                      )}`}</h2>
                      {Object?.entries(subcategories)?.map(
                        ([subcategory, actions]) => (
                          <div key={subcategory} className="ml-[0.5vw]">
                            <h3 className="text-[0.9vw] capitalize">
                              {subcategory.replace("-", " ")}
                            </h3>
                            {actions.map(({ id, action }) => (
                              <div key={id} className="ml-[0.5vw]">
                                <label className="flex items-center gap-[0.3vw] text-[0.9vw] cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="checkbox-design1"
                                    checked={selectedPermissions?.includes(id)}
                                    onChange={() => handleCheckboxChange(id)}
                                  />
                                  {`Can ${action.replace("-", " ")}`}
                                </label>
                              </div>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#FF0404] md:my-[2vw!important] my-[4vw!important] w-full flex justify-center items-center md:py-[0.7vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#fa6767]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadItems color={"#ffffff"} size={15} />
              <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                Updating...
              </h4>
            </div>
          ) : (
            <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
              Update
            </h4>
          )}
        </button>
      </form>
    </SideModal>
  );
}

export default EditUser;
