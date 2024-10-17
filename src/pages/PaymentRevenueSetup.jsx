import React, { useState } from "react";
import withRouter from "../components/withRouter";
import CustomTable from "../components/CustomTable";
import Drawer from "../components/Drawer";
import {
  Button,
  Card,
  CardBody,
  Input,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import axios from "../axiosConfig";

const PaymentRevenueSetup = () => {
  const [data, setData] = useState({});
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [filters, setFilters] = useState({
    region: "",
    search_query: "",
    status: "",
  });

  const disclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("Add new Payment Account");

  console.log(data);

  const save = async () => {
    setProcessing(true);
    try {
      const response = await axios.post("/institution/payment-account", data);
      // toast.success(response.data.message);
      setProcessing(false);
      setOpenDrawer(false);
      reset();
    } catch (error) {
      console.log(error);
      // setErrors(error.response.data.errors);
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col">
      <section className="md:px-3">
        <Card className="my-3 md:w-full w-[98vw] mx-auto dark:bg-slate-900 ">
          <CardBody className="overflow-x-auto justify-between flex-row">
            <form method="get" className="flex flex-row gap-3 items-center">
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
            </form>

            <Button
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
          columns={["Name", "Email", "Phone", "Digital Address", ""]}
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
          {[].map((institution) => (
            <TableRow key={institution?.id}>
              <TableCell className="flex flex-col justify-center">
                {institution?.name}
              </TableCell>
              <TableCell>{institution?.email}</TableCell>
              <TableCell>{institution?.phone}</TableCell>
              <TableCell>{institution?.digital_address}</TableCell>
              <TableCell className="flex items-center h-16 gap-3">
                <Button
                  size="sm"
                  color="success"
                  onClick={() => {
                    setOpenDrawer(true);
                    setData(institution);
                  }}
                >
                  View
                </Button>
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
              value={data.account_name}
              id="name"
              onChange={(e) =>
                setData((prev) => ({ ...prev, account_name: e.target.value }))
              }
              errorMessage={errors.account_name}
              isInvalid={!!errors.account_name}
            />

            <Input
              size="sm"
              label="Account Number"
              type="text"
              name="account_number"
              value={data.account_number}
              id="name"
              onChange={(e) =>
                setData((prev) => ({ ...prev, account_number: e.target.value }))
              }
              errorMessage={errors.account_number}
              isInvalid={!!errors.account_number}
            />

            <Input
              size="sm"
              label="Bank Name"
              type="text"
              name="bank_name"
              value={data.bank_name}
              id="name"
              onChange={(e) =>
                setData((prev) => ({ ...prev, bank_name: e.target.value }))
              }
              errorMessage={errors.bank_name}
              isInvalid={!!errors.bank_name}
            />

            <Input
              size="sm"
              label="Bank Branch"
              type="text"
              name="bank_branch"
              value={data.bank_branch}
              id="name"
              onChange={(e) =>
                setData((prev) => ({ ...prev, bank_branch: e.target.value }))
              }
              errorMessage={errors.bank_branch}
              isInvalid={!!errors.bank_branch}
            />

            <Input
              size="sm"
              label="Swift Code"
              type="text"
              name="swift_code"
              value={data.swift_code}
              onChange={(e) =>
                setData((prev) => ({ ...prev, swift_code: e.target.value }))
              }
              errorMessage={errors.swift_code}
              isInvalid={!!errors.swift_code}
            />

            <Input
              size="sm"
              label="Currency"
              type="text"
              name="currency"
              value={data.currency}
              id="name"
              onChange={(e) =>
                setData((prev) => ({ ...prev, currency: e.target.value }))
              }
              errorMessage={errors.currency}
              isInvalid={!!errors.currency}
            />

            <Switch
              size="sm"
              name="is_default"
              checked={data.is_default}
              onValueChange={(value) =>
                setData((prev) => ({ ...prev, is_default: value }))
              }
              errorMessage={errors.is_default}
              isInvalid={!!errors.is_default}
            >
              Default Account
            </Switch>

            {/* 
                        <Select
                            size="sm"
                            label="Institution Type"
                            name="institution_type"
                            // value={data.institution_type}
                            defaultSelectedKeys={[data.institution_type]}
                            onChange={(e) =>
                                setData("institution_type", e.target.value)
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
    </div>
  );
};

export default withRouter(PaymentRevenueSetup);
