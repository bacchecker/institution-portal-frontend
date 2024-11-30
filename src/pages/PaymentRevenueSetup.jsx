import React, { useEffect, useState } from "react";
import CustomTable from "@components/CustomTable";
import Drawer from "@components/Drawer";
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Select,
  SelectItem,
  Switch,
  TableCell,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import axios from "@utils/axiosConfig";
import Elipsis from "@assets/icons/elipsis";
import DeleteModal from "@components/DeleteModal";
import AuthLayout from "@components/AuthLayout";
import useAuthStore from "@store/authStore";
import useSWR from "swr";
import { toast } from "sonner";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const PaymentRevenueSetup = () => {
  const [selectedData, setSelectedData] = useState({});
  const [processing, setProcessing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});
  const { isAuthenticated } = useAuthStore();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const deleteDisclosure = useDisclosure();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("Add New Payment Account");
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const save = async () => {
    setProcessing(true);
    try {
      if (selectedData?.id) {
        const response = await axios.post(
          `/institution/payment-accounts/${selectedData?.id}`,
          selectedData
        );
        toast.success(response.data.message);
        fetchPaymentAccounts();
        setProcessing(false);
        setOpenDrawer(false);
      } else {
        const response = await axios.post(
          "/institution/payment-accounts",
          selectedData
        );
        toast.success(response.data.message);
        fetchPaymentAccounts();
        setProcessing(false);
        setOpenDrawer(false);
      }
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.message);
      setProcessing(false);
    }
  };

  const fetchPaymentAccounts = async () => {
    setIsLoading(true); // Set loading state
    try {
      const response = await axios.get("/institution/payment-accounts", {
        params: {
          search,
          page: currentPage,
          ...(sortBy && { sort_by: sortBy }),
          ...(sortOrder && { sort_order: sortOrder }),
        },
      });
  
      const accountData = response.data.accounts;
  
      setPaymentAccounts(accountData.data);
      setCurrentPage(accountData.current_page);
      setLastPage(accountData.last_page);
      setTotal(accountData.total);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    fetchPaymentAccounts();
  }, [search, currentPage, sortBy, sortOrder]);

  useEffect(() => {
    if (!openDrawer) {
      setSelectedData({});
    }
  }, [openDrawer]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= lastPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`py-2 px-2.5 border rounded-lg ${
            currentPage === i ? "bg-bChkRed text-white" : "bg-white text-gray-800"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <AuthLayout title="Payment Setup" className="flex flex-col">
      <section className="md:px-3">
        <Card className="my-3 md:w-full w-[98vw] mx-auto dark:bg-slate-900 ">
          <CardBody className="overflow-x-auto justify-between flex-row">
            <div className="relative w-2/3">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="search" onChange={(e) => setSearch(e.target.value)} value={search} id="default-search" className="block w-full focus:outline-0 px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search by account name, number, bank name or branch" required />
            </div>

            <Button
              className="ml-auto"
              size="sm"
              color="danger"
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              New Payment Account
            </Button>
          </CardBody>
        </Card>
      </section>

      <section className="md:px-3 md:w-full w-[98vw] mx-auto">
        <CustomTable
          loadingState={isLoading}
          columns={[
            "Account Name",
            "Account No.",
            "Bank Name",
            "Bank Branch",
            "Currency",
            "Actions",
          ]}
          columnSortKeys={{
            "Account Name": "account_name",
            "Account No.": "account_number",
            "Bank Name": "bank_name",
            "Bank Branch": "bank_branch",
            Currency: "currency",
          }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
         
        >
          {paymentAccounts?.map((account) => (
            <TableRow key={account?.id} className="odd:bg-gray-100 even:bg-white border-b dark:text-slate-700">
              <TableCell className="flex flex-col justify-center">
                {account?.account_name}
              </TableCell>
              <TableCell>{account?.account_number}</TableCell>
              <TableCell>{account?.bank_name}</TableCell>
              <TableCell>{account?.bank_branch}</TableCell>
              <TableCell>{account?.currency}</TableCell>
              <TableCell className="flex items-center h-12 gap-3">
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" size="sm" isIconOnly className="dark:border-slate-400 dark:text-slate-600">
                      <Elipsis />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    <DropdownItem
                      key="edit"
                      color="success"
                      onClick={() => {
                        setDrawerTitle("Edit Account Details");
                        setSelectedData(account);
                        setOpenDrawer(true);
                      }}
                    >
                      Update
                    </DropdownItem>
                    <DropdownItem
                      key="edit"
                      color="danger"
                      onClick={() => {
                        deleteDisclosure.onOpen();
                        setSelectedData(account);
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
        <section>
            <div className="flex justify-between items-center mt-4">
              <div>
                <span className="text-gray-600 font-medium text-sm">
                  Page {currentPage} of {lastPage} - ({total} entries)
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 bg-white text-gray-800 border rounded-lg disabled:bg-gray-300 disabled:text-white"
                >
                  <FaChevronLeft size={12} />
                </button>

                {renderPageNumbers()}

                <button
                  disabled={currentPage === lastPage}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-2 bg-white text-gray-800 border rounded-lg disabled:bg-gray-300 disabled:text-white disabled:border-0"
                >
                  <FaChevronRight size={12} />
                </button>
              </div>
            </div>
          </section>
      </section>

      <Drawer title={drawerTitle} isOpen={openDrawer} setIsOpen={setOpenDrawer}>
        <form className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-6 mb-6">
            <Input
              size="sm"
              label="Account Name"
              type="text"
              name="account_name"
              value={selectedData.account_name}
              onChange={(e) =>
                setSelectedData((prev) => ({
                  ...prev,
                  account_name: e.target.value,
                }))
              }
              errorMessage={errors.account_name}
              isInvalid={!!errors.account_name}
            />

            <Input
              size="sm"
              label="Account Number"
              type="text"
              name="account_number"
              value={selectedData.account_number}
              id="name"
              onChange={(e) =>
                setSelectedData((prev) => ({
                  ...prev,
                  account_number: e.target.value,
                }))
              }
              errorMessage={errors.account_number}
              isInvalid={!!errors.account_number}
            />

            <Input
              size="sm"
              label="Bank Name"
              type="text"
              name="bank_name"
              value={selectedData.bank_name}
              onChange={(e) =>
                setSelectedData((prev) => ({
                  ...prev,
                  bank_name: e.target.value,
                }))
              }
              errorMessage={errors.bank_name}
              isInvalid={!!errors.bank_name}
            />

            <Input
              size="sm"
              label="Bank Branch"
              type="text"
              name="bank_branch"
              value={selectedData.bank_branch}
              onChange={(e) =>
                setSelectedData((prev) => ({
                  ...prev,
                  bank_branch: e.target.value,
                }))
              }
              errorMessage={errors.bank_branch}
              isInvalid={!!errors.bank_branch}
            />

            <Select
              size="sm"
              label="Account Type"
              className="w-full"
              name="account_type"
              defaultSelectedKeys={[selectedData?.account_type]}
              onChange={(e) =>
                setSelectedData((prev) => ({
                  ...prev,
                  account_type: e.target.value,
                }))
              }
            >
              {[
                {
                  key: "savings",
                  label: "Savings",
                },
                {
                  key: "current",
                  label: "Current",
                },
                {
                  key: "domiciliary",
                  label: "Domiciliary",
                },
              ].map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>

            <Input
              size="sm"
              label="Swift Code"
              type="text"
              name="swift_code"
              value={selectedData.swift_code}
              onChange={(e) =>
                setSelectedData((prev) => ({
                  ...prev,
                  swift_code: e.target.value,
                }))
              }
              errorMessage={errors.swift_code}
              isInvalid={!!errors.swift_code}
            />

            <Input
              size="sm"
              label="Currency"
              type="text"
              name="currency"
              value={selectedData.currency}
              maxLength={3}
              onChange={(e) =>
                setSelectedData((prev) => ({
                  ...prev,
                  currency: e.target.value,
                }))
              }
              errorMessage={errors.currency}
              isInvalid={!!errors.currency}
            />
            {/* 
            <Switch
              size="sm"
              name="is_default"
              checked={selectedData.is_default}
              onValueChange={(value) =>
                setSelectedData((prev) => ({ ...prev, is_default: value }))
              }
              errorMessage={errors.is_default}
              isInvalid={!!errors.is_default}
            >
              Default Account
            </Switch> */}

            {/* 
                        <Select
                            size="sm"
                            label="Institution Type"
                            name="institution_type"
                            // value={selectedData.institution_type}
                            defaultSelectedKeys={[selectedData.institution_type]}
                            onChange={(e) =>
                                setSelectedData("institution_type", e.target.value)
                            }
                            errorMessage={errors.institution_type}
                            isInvalid={!!errors.institution_type}
                        >
                            {[
                                {
                                    label: "Academic",
                                    key: "academic",
                                },
                                {
                                    label: "Non-academic",
                                    key: "non-academic",
                                },
                            ].map((role) => (
                                <SelectItem key={role.key}>
                                    {role.label}
                                </SelectItem>
                            ))}
                        </Select> */}
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="w-1/2"
              size="sm"
              color="default"
              onClick={() => {
                setOpenDrawer(false);
                reset();
              }}
            >
              Close
            </Button>

            <Button
              color="danger"
              className="font-montserrat font-semibold w-1/2"
              isLoading={processing}
              type="submit"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                save();
              }}
            >
              Save
            </Button>
          </div>
        </form>
      </Drawer>

      <DeleteModal
        disclosure={deleteDisclosure}
        title="Delete Payment Account"
        onButtonClick={async () => {
          try {
            const response = await axios.delete(
              `/institution/payment-accounts/${selectedData?.id}`
            );
            deleteDisclosure.onClose();
            toast.success(response.data.message);
            // fetchPaymentAccounts();
          } catch (error) {
            console.log(error);
            setErrors(error.response.data.message);
          }
        }}
      >
        <p className="font-quicksand">
          Are you sure you want to delete this payment account?{" "}
          <span className="font-semibold">{selectedData?.account_name}</span>
        </p>
      </DeleteModal>
    </AuthLayout>
  );
};

export default PaymentRevenueSetup;
