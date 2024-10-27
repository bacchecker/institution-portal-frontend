import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  TableCell,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";
import axios from "@utils/axiosConfig";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import CustomTable from "@components/CustomTable";
import DeleteModal from "@components/DeleteModal";
import AddNewDepartment from "./departmentComponents/AddNewDepartment";
import EditDepartment from "./departmentComponents/EditDepartment";
import Elipsis from "../../assets/icons/elipsis";

function DepartmentsSetup({ setActiveStep }) {
  const [isSaving, setSaving] = useState(false);
  const deleteDisclosure = useDisclosure();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const institution = secureLocalStorage.getItem("institution");
  const setInstitution = (newInstitution) => {
    secureLocalStorage.setItem("institution", newInstitution);
  };

  const {
    data: institutionDepartments,
    error: institutionError,
    isLoading: institutionDocsLoading,
  } = useSWR("/institution/departments", (url) =>
    axios.get(url).then((res) => res.data)
  );

  const handleBackButton = () => {
    const updatedInstitution = {
      ...institution,
      current_step: "3",
    };

    setInstitution(updatedInstitution);
    secureLocalStorage.setItem("institution", updatedInstitution);
    setActiveStep(3);
  };
  const handleSubmit = async () => {
    if (institutionDepartments?.data?.length === 0) {
      toast.error("Add at least One Department", {
        position: "top-right",
        autoClose: 1202,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      setSaving(true);
      const data = {
        step: 5,
      };
      try {
        const response = await axios.post(
          "/institution/account-setup/next-step",
          data
        );
        toast.success("Account Setup Completed Successfully", {
          position: "top-right",
          autoClose: 1202,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        const updatedInstitution = {
          ...institution,
          current_step: "5",
        };
        setInstitution(updatedInstitution);
        secureLocalStorage.setItem("institution", updatedInstitution);
        navigate("/dashboard");
        setSaving(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        setSaving(false);
      } finally {
        setSaving(false);
        return true;
      }
    }
  };
  return (
    <div className="w-full px-5 pb-4">
      <div className="my-3 w-full flex justify-end mx-auto dark:bg-slate-900 mt-6">
        <button
          type="button"
          onClick={() => {
            setOpenDrawer(true);
          }}
          className="w-fit flex items-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
        >
          Add New Department
        </button>
      </div>
      <div>
        <AddNewDepartment
          setOpenDrawer={setOpenDrawer}
          openDrawer={openDrawer}
        />
        <EditDepartment
          setOpenDrawer={setOpenEditDrawer}
          openDrawer={openEditDrawer}
          selectedData={selectedData}
        />
      </div>
      <section className="md:w-full w-[98vw] min-h-[60vh] mx-auto">
        {institutionDocsLoading ? (
          <div className="w-full h-[5rem] flex justify-center items-center">
            <Spinner size="sm" color="danger" />
          </div>
        ) : (
          <>
            <CustomTable
              columns={["Name", "Role", "Description", ""]}
              // loadingState={resData ? false : true}
              // page={resData?.current_page}
              // setPage={(page) =>
              //   navigate({
              //     // pathname: "listing",
              //     search: createSearchParams({ ...filters, page }).toString(),
              //   })
              // }
              // totalPages={Math.ceil(resData?.total / resData?.per_page)}
            >
              {institutionDepartments?.data?.map((item) => (
                <TableRow key={item?.id}>
                  <TableCell>{item?.name}</TableCell>

                  <TableCell>{item?.role}</TableCell>
                  <TableCell>{item?.description}</TableCell>

                  <TableCell className="flex items-center h-16 gap-3">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="bordered" size="sm" isIconOnly>
                          <Elipsis />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Static Actions">
                        <DropdownItem
                          key="edit"
                          onClick={() => {
                            setSelectedData(item);
                            setOpenEditDrawer(true);
                          }}
                        >
                          Update
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          onClick={() => {
                            deleteDisclosure.onOpen();
                            setSelectedData(item);
                          }}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </CustomTable>
          </>
        )}
      </section>
      <DeleteModal
        disclosure={deleteDisclosure}
        title="Delete Department"
        processing={isDeleting}
        onButtonClick={async () => {
          setDeleting(true);
          try {
            const response = await axios.delete(
              `/institution/departments/${selectedData?.id}`
            );
            deleteDisclosure.onClose();
            toast.success(response.data.message);
            mutate("/institution/departments");
            setDeleting(false);
          } catch (error) {
            console.log(error);
            setErrors(error.response.data.message);
            setDeleting(false);
          }
        }}
      >
        <p className="font-quicksand">
          Are you sure you want to delete this department?{" "}
          <span className="font-semibold">
            {selectedData?.document_type?.name}
          </span>
        </p>
      </DeleteModal>
      <div className="flex justify-between w-full mt-[4rem!important]">
        <button
          type="button"
          onClick={handleBackButton}
          className="flex items-center bg-[#ffffff] border border-[#ff0404] hover:bg-[#ff0404] text-[#ff0404] hover:text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
        >
          <FaAnglesLeft className="mr-2" />
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className={`flex items-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 rounded-[0.3rem] font-medium ${
            isSaving && "cursor-not-allowed bg-[#f77f7f]"
          }`}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Spinner size="sm" color="white" />
              <span className="ml-2">Proceeding...</span>
            </>
          ) : (
            <>
              Proceed to dashboard
              <FaAnglesRight className="ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default DepartmentsSetup;
