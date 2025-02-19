import { useEffect, useState } from "react";
import SideModal from "@/components/SideModal";
import SelectInput from "@/components/SelectInput";
import Swal from "sweetalert2";
import { useUpdateUserMutation } from "../../../redux/apiSlice";
import LoadItems from "@/components/LoadItems";
import { toast } from "sonner";
import PropTypes from "prop-types";
import axios from "@/utils/axiosConfig";

function EditUser({
  setOpenModal,
  openModal,
  institutionDepartments,
  isDepartmentsFetching,
  isDepartmentsLoading,
  fetchUserData,
  selectedUser,
}) {
  const [userInput, setUserInput] = useState([]);
  const [userInitialInput, setUserInitialInput] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState("+233");

  useEffect(() => {
    // Fetch country codes
    axios
      .get("https://restcountries.com/v3.1/all?fields=cca2,idd,name")
      .then((res) => {
        const codes = res.data
          .map((country) => ({
            name: country.name.common,
            code: `+${country.idd?.root?.replace("+", "") || ""}${country.idd?.suffixes?.[0] || ""}`,
            cca2: country.cca2,
          }))
          .filter((c) => c.code !== "+") // Remove invalid entries
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
        setCountryCodes(codes);
          console.log(codes);
          
        if (selectedUser?.phone) {
          const foundCode = codes.find((c) => selectedUser.phone.startsWith(c.code));
          
          if (foundCode) {
            setSelectedCode(foundCode.code); // Set country code
            setUserInput((prev) => ({
              ...prev,
              phone: selectedUser.phone.replace(foundCode.code, ""), // Remove code from phone
            }));
          } else {
            setUserInput((prev) => ({
              ...prev,
              phone: selectedUser.phone, // Keep the original if no match
            }));
          }
        } else {
          // Default to Ghana if no existing user
          const ghana = codes.find((c) => c.cca2 === "GH");
          if (ghana) {
            setSelectedCode(ghana.code);
          }
        }
      })
      .catch((err) => console.error("Error fetching country codes:", err));
  }, [selectedUser]);
  

  useEffect(() => {

    if (selectedUser) {
      setUserInput(selectedUser);
      setUserInitialInput(selectedUser);
      const department = institutionDepartments?.departments?.data?.find(
        (item) => item?.id === selectedUser?.department_id
      );
      const perms = selectedUser?.permissions?.map((item) => item.id);
      setSelectedPermissions(perms);
      setSelectedDepartment(department);
    }
  }, [selectedUser]);

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
    setSelectedPermissions((prev) => {
      const prevArray = Array.isArray(prev) ? prev : [];
      return prevArray.includes(id)
        ? prevArray.filter((permId) => permId !== id)
        : [...prevArray, id];
    });
  };

  useEffect(() => {
    if (!openModal) {
      setUserInput(userInitialInput);
      const department = institutionDepartments?.departments?.data?.find(
        (item) => item?.id === userInitialInput?.department_id
      );
      const perms = institutionDepartments?.permissions?.map((item) => item.id);
      setSelectedPermissions(perms);
      setSelectedDepartment(department);
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
      const { first_name, last_name, other_name, email, phone, id, job_title } = userInput;
    
      if (!first_name || !last_name || !email || !phone || !job_title || !selectedDepartment?.id) {
        Swal.fire({
          title: "Error",
          text: "Fill All Required Fields",
          icon: "error",
          button: "OK",
        });
      } else if (selectedPermissions?.length === 0) {
        Swal.fire({
          title: "Error",
          text: "Select at least one permission",
          icon: "error",
          button: "OK",
        });
      } else {
        const result = await Swal.fire({
          title: "Are you sure you want to update this user?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#febf4c",
          cancelButtonColor: "#dd3333",
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
                phone: `${selectedCode}${phone}`, // ✅ Send full phone number
                job_title,
                department_id: selectedDepartment?.id,
                permissions: selectedPermissions,
              },
            });
          } catch (error) {
            toast.error("Failed to update user", {
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
      toast.success("User updated successfully");
      setOpenModal(false);
      fetchUserData();
    }
  }, [isSuccess, userData]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  EditUser.propTypes = {
    setOpenModal: PropTypes.func.isRequired,
    openModal: PropTypes.bool.isRequired,
    institutionDepartments: PropTypes.shape({
      departments: PropTypes.shape({
        data: PropTypes.array,
      }),
      permissions: PropTypes.array,
    }),
    isDepartmentsFetching: PropTypes.bool,
    isDepartmentsLoading: PropTypes.bool,
    selectedUser: PropTypes.shape({
      permissions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
        })
      ),
    }),
  };

  return (
    <SideModal
      title={"User Details"}
      setOpenModal={setOpenModal}
      openModal={openModal}
    >
      <form
        onSubmit={handleSubmit}
        className="md:px-[1vw] px-[5vw] w-full overflow-auto"
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
            <h4 className="md:text-[1vw] text-[4vw] mb-1">Job Title</h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="job_title"
                value={userInput?.job_title}
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
            <h6 className="text-[#2e2e2e] md:text-[0.7vw] text-[2.7vw] font-[600] mt-[0.3vw]">
              <span className="text-[#ff0404]">Note</span>: Email domian must be
              the same as the institution email domain
            </h6>
          </div>
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Phone<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] flex items-center border-[1.5px] border-[#E5E5E5] overflow-hidden bg-[#f7f7f7]">
              
              {/* Country Code Selector */}
              <select
                className="px-1 md:h-[2.7vw] h-[12vw] w-2/5 md:text-[1vw] text-[3.5vw] bg-white border-r border-gray-300 focus:outline-none"
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
              >
                {countryCodes.map((country) => (
                  <option key={country.cca2} value={country.code}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>

              {/* Phone Number Input (Without Code) */}
              <input
                type="text"
                name="phone"
                value={userInput.phone}
                onChange={(e) =>
                  setUserInput((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-transparent"
                placeholder="Enter phone number"
              />
            </div>
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
                      <div className="flex items-center gap-[0.5vw]">
                        <h2 className="text-[0.9vw] capitalize font-[600]">
                          {`Manage ${category.replace("-", " ") ===
                              "verification requests"
                              ? "E-Check"
                              : category.replace("-", " ")
                            }`}
                        </h2>
                        <input
                          type="checkbox"
                          className="checkbox-design1"
                          onChange={(e) => {
                            const ids = Object.values(subcategories)
                              .flat()
                              .filter((item) => typeof item === "object")
                              .map((item) => item.id);
                            if (e.target.checked) {
                              setSelectedPermissions((prev) => {
                                const prevArray = Array.isArray(prev)
                                  ? prev
                                  : [];
                                return [...new Set([...prevArray, ...ids])];
                              });
                            } else {
                              setSelectedPermissions((prev) => {
                                const prevArray = Array.isArray(prev)
                                  ? prev
                                  : [];
                                return prevArray.filter(
                                  (id) => !ids.includes(id)
                                );
                              });
                            }
                          }}
                          checked={Object.values(subcategories)
                            .flat()
                            .filter((item) => typeof item === "object")
                            .every((item) =>
                              selectedPermissions?.includes(item.id)
                            )}
                        />
                      </div>
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
          className="bg-[#FF0404] mt-6 w-full flex justify-center items-center md:py-[0.7vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#fa6767]"
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
