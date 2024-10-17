import React, { useEffect, useState } from "react";
import withRouter from "../components/withRouter";
import CustomTable from "../components/CustomTable";
import Drawer from "../components/Drawer";
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
import axios from "../axiosConfig";
import Elipsis from "../assets/icons/elipsis";
import DeleteModal from "../components/DeleteModal";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import useAuthStore from "../store/authStore";
import useSWR from "swr";

const PaymentRevenueSetup = () => {
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  const [processing, setProcessing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});
  const { isAuthenticated } = useAuthStore();

  const deleteDisclosure = useDisclosure();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("Add new Payment Account");

  const save = async () => {
    setProcessing(true);
    try {
      if (selectedData?.id) {
        const response = await axios.post(
          `/institution/payment-accounts/${selectedData?.id}`,
          selectedData
        );
        console.log(response?.data);
        // toast.success(response.data);
        // fetchPaymentAccounts();
        setProcessing(false);
        setOpenDrawer(false);
      } else {
        const response = await axios.post(
          "/institution/payment-accounts",
          selectedData
        );
        toast.success(response.data.message);
        // fetchPaymentAccounts();
        setProcessing(false);
        setOpenDrawer(false);
      }
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.message);
      setProcessing(false);
    }
  };

  // const fetcher =
  const { data, error } = useSWR("/institution/payment-accounts", (url) =>
    axios.get(url).then((res) => res.data)
  );

  useEffect(() => {
    setLoadingData(true);
    // fetchPaymentAccounts();
  }, []);

  useEffect(() => {
    if (!openDrawer) {
      setSelectedData({});
    }
  }, [openDrawer]);

  return (
    <AuthLayout title="Payment Setup" className="flex flex-col">
      <section className="md:px-3">
        <Card className="my-3 md:w-full w-[98vw] mx-auto dark:bg-slate-900 ">
          <CardBody className="overflow-x-auto justify-between flex-row">
            {/* <form method="get" className="flex flex-row gap-3 items-center">
              <Input
                name="search_query"
                placeholder="Search"
                defaultValue={filters.search_query}
                startContent={<IoSearch />}
                size="sm"
                className="max-w-xs min-w-[200px]"
              />

              <Button size="sm" type="submit" color="danger">
                Search
              </Button>
            </form> */}

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
          loadingState={data?.data?.accounts ? false : true}
          columns={[
            "Account Name",
            "Account No.",
            "Bank Name",
            "Bank Branch",
            "Currency",
            "",
          ]}
          page={1}
          setPage={
            (page) => console.log(page)

            // router.get(
            //   `?region=${filters.region || ""}&search_query=${
            //     filters.search_query || ""
            //   }&status=${filters.status || ""}&page=${page}`
            // )
          }
          totalPages={1}
          // totalPages={Math.ceil(institutions?.total / institutions?.per_page)}
        >
          {data?.data?.accounts?.map((account) => (
            <TableRow key={account?.id}>
              <TableCell className="flex flex-col justify-center">
                {account?.account_name}
              </TableCell>
              <TableCell>{account?.account_number}</TableCell>
              <TableCell>{account?.bank_name}</TableCell>
              <TableCell>{account?.bank_branch}</TableCell>
              <TableCell>{account?.currency}</TableCell>
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
