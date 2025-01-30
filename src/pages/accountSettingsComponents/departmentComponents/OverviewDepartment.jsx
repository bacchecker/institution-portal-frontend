import React from "react";
import PropTypes from "prop-types";
import SideModal from "@/components/SideModal";
import { FaBuildingUser, FaUser } from "react-icons/fa6";
import { IoIosKey } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";

function OverviewDepartment({ setOpenModal, openModal, selectedDepartment }) {
  return (
    <SideModal title="Overview Department" setOpenModal={setOpenModal} openModal={openModal}>
      <div className="px-4 w-full overflow-auto pt-4">
        {/* Department Details */}

        
        <div className="w-full flex justify-between pb-2">
            <div className="">
                <p className="font-semibold text-base">Profile and Members</p>
                <p className="font-normal text-[13px]">Simplify user permissions, for secure and seamless access control.</p>
            </div>
            <div className="flex items-center">
                <div className="flex flex-col items-center justify-center border rounded-l-md px-2.5 py-2">
                    <FaUser size={16} className="text-bChkRed"/>
                    <p className="text-xs font-medium">Users</p>
                </div>
                <div className="flex flex-col items-center justify-center border rounded-r-md px-2 py-1.5">
                    <IoIosKey size={20} className="text-bChkRed"/>
                    <p className="text-xs font-medium">Permissions</p>
                </div>
            </div>
        </div>
        <div className="border rounded-md p-3 mt-1 flex space-x-2 mb-4">
            <div className="bg-bChkRed rounded-full w-12 h-12 flex items-center justify-center">
                <FaBuildingUser size={24} className="text-white"/>
            </div>
            <div className="">
                <p className="font-semibold text-base">{selectedDepartment?.name || "N/A"}</p>
                <p className="text-xs text-ellipsis">{selectedDepartment?.description || "N/A"}</p>
            </div>
            
        </div>
        <div className="relative overflow-x-auto mt-4 border rounded-md">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 border-b bg-gray-100">
                <tr>
                <th scope="col" className="pl-2 py-2">
                    NAME
                </th>
                <th scope="col" className="px-2 py-2">
                    EMAIL
                </th>
                <th scope="col" className="px-2 py-2">
                    JOB TITLE
                </th>
                </tr>
            </thead>
            <tbody>
                {selectedDepartment?.users?.length > 0 ? (
                    selectedDepartment.users.map((user) => (
                    <tr key={user?.id} className="bg-white text-xs border-b">
                        <td
                        scope="row"
                        className="px-1 py-4 flex items-center space-x-1 font-medium text-gray-900 whitespace-nowrap"
                        >
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md border border-gray-100">
                            {user?.photo ? (
                            <img
                                src={`https://admin-dev.baccheck.online/storage/${user?.photo}`}
                                alt="User Photo"
                                className="w-full h-full object-cover rounded-md"
                            />
                            ) : (
                            <span className="text-gray-500 text-xs">N/A</span> // Placeholder if no photo
                            )}
                        </div>
                        <p>{user?.first_name} {" "} {user?.last_name}</p>
                        </td>
                        <td className="px-2 py-4">
                        {user?.email.length > 15 ? `${user?.email.slice(0, 15)}...` : user?.email}
                        </td>
                        <td className="px-2 py-4">
                        <p>{user?.job_title || "No job title"}</p>
                        </td>
                    </tr>
                    ))
                ) : (
                    // Show "No users available" when the list is empty
                    <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                        No users available
                    </td>
                    </tr>
                )}
                </tbody>

            </table>
        </div>
        {/* Permissions */}
        <div className="mt-4">
                {/* <h4 className="text-lg font-semibold mb-2">Permissions</h4> */}
                {selectedDepartment?.permissions?.length ? (
                <div className="border rounded-md">
                    <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                        <th className="text-left p-3">Permissions</th>
                        <th className="text-center p-3">Assigned</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(
                        selectedDepartment.permissions.reduce((acc, permission) => {
                            const parts = permission.name.split(".");
                            const category = parts[0].replace("-", " ");
                            const action = parts[1].replace("-", " ");

                            if (!acc[category]) acc[category] = [];
                            acc[category].push({
                            id: permission.id,
                            name: `${action.charAt(0).toUpperCase() + action.slice(1)} ${category}`,
                            });

                            return acc;
                        }, {})
                        ).map(([category, actions]) => (
                        <React.Fragment key={category}>
                            {/* Category Header */}
                            <tr className="">
                            <td className="p-3 font-semibold" colSpan="2">
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </td>
                            </tr>

                            {/* Permissions List */}
                            {actions.map(({ id, name }) => (
                            <tr key={id} className="border-b">
                                <td className="p-3 text-gray-700">{name}</td>
                                <td className="p-3 flex items-center justify-center text-center">
                                <FaCheckCircle className="text-bChkRed" />
                                </td>
                            </tr>
                            ))}
                        </React.Fragment>
                        ))}
                    </tbody>
                    </table>
                </div>
                ) : (
                <p className="text-sm text-gray-500">No permissions assigned.</p>
                )}
            </div>

        {/* Users */}
        {/* <div className="mb-6">
          <h4 className="md:text-[1vw] text-[4vw] font-bold mb-2">Users in this Department</h4>
          {selectedDepartment?.users?.length ? (
            <ul className="list-disc ml-6">
              {selectedDepartment.users.map((user) => (
                <li key={user.id} className="text-sm text-gray-700">
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No users in this department.</p>
          )}
        </div> */}
      </div>
    </SideModal>
  );
}

OverviewDepartment.propTypes = {
  setOpenModal: PropTypes.func.isRequired,
  openModal: PropTypes.bool.isRequired,
  selectedDepartment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    permissions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default OverviewDepartment;
