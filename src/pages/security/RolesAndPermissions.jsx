import React, { useEffect, useState } from "react";
import AuthLayout from "@components/AuthLayout";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import StatusChip from "../../components/status-chip";
import Drawer from "../../components/Drawer";
import useSWR from "swr";
import axios from "@utils/axiosConfig";
import toast from "react-hot-toast";
import DeleteModal from "../../components/DeleteModal";

export default function RolesAndPermissions() {
  const [data, setData] = useState({
    name: "",
    permissions: [],
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [roles, setRoles] = useState([]);

  const deleteDisclosure = useDisclosure();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("Create New Role");

  const { data: resData, error } = useSWR(
    "/institution/roles-permissions",
    (url) => axios.get(url).then((res) => res.data)
  );


  const handlePermission = (permission) => {
    if (data.permissions.includes(permission)) {
      setData(
        "permissions",
        data.permissions.filter((p) => p !== permission)
      );
    } else {
      setData("permissions", [...data.permissions, permission]);
      //       setData((prev) => ({
      //         ...prev,
      //         permissions: [...prev.permissions, permission],
      //       }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (data?.id) {
        const response = await axios.post(
          `/institution/payment-accounts/${data?.id}`,
          data
        );
        // toast.success(response.data);
        // fetchPaymentAccounts();
        setProcessing(false);
        setOpenDrawer(false);
      } else {
        const response = await axios.post(
          "/institution/payment-accounts",
          data
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

  useEffect(() => {
    if (!openDrawer) {
      setData({
        uuid: "",
        name: "",
        permissions: [],
      });
    }
  }, [openDrawer]);

  return (
    <AuthLayout>
      <section className="md:px-3">
        <Card className="my-3 md:w-full w-[98vw] mx-auto dark:bg-slate-900">
          <CardBody className="overflow-x-auto flex-row justify-end">
            <Button
              size="sm"
              color="danger"
              onClick={() => setOpenDrawer(true)}
            >
              Add New Role
            </Button>
          </CardBody>
        </Card>
      </section>

      <section className="md:px-3 flex mx-auto md:w-full gap-3 w-[98vw] pb-11 flex-col">
        {[].map((role) => (
          <Card key={role.name} className="dark:bg-slate-900">
            <CardBody>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{role.name}</h4>

                {role.name.toLowerCase() !== "superadmin" && (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered" size="sm" isIconOnly>
                        <Elipsis />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                      <DropdownItem
                        key="new"
                        color="success"
                        onClick={() => {
                          setData({
                            uuid: role.uuid,
                            name: role.name,
                            permissions: role?.permissions.map(
                              (permission) => permission.name
                            ),
                          });
                          setDrawerTitle("Edit Role");
                          setOpenDrawer(true);
                        }}
                      >
                        Edit Role
                      </DropdownItem>
                      <DropdownItem
                        key="copy"
                        color="danger"
                        onClick={() => {
                          deleteDisclosure.onOpen();
                          setData("uuid", role.uuid);
                        }}
                      >
                        Delete Role
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {role?.permissions?.map((permission) => (
                  <StatusChip key={permission.name} status={permission.name} />
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </section>

      {/* <Drawer title={drawerTitle} isOpen={openDrawer} setIsOpen={setOpenDrawer}>
        <form
          onSubmit={submit}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col gap-6 mb-6">
            <Input
              size="sm"
              label="Role Name"
              type="text"
              name="name"
              value={data.name}
              id="name"
              onChange={(e) => setData("name", e.target.value)}
              errorMessage={errors.name}
              isInvalid={!!errors.name}
            />

            <div className="flex gap-2 flex-wrap">
              {permissions?.map((permission) => (
                <Chip
                  onClick={() => handlePermission(permission?.name)}
                  startContent={
                    data?.permissions.includes(permission?.name) && (
                      <CheckIconRounded />
                    )
                  }
                  className="capitalize font-semibold cursor-pointer"
                  size="sm"
                  variant={
                    data?.permissions.includes(permission?.name)
                      ? "solid"
                      : "flat"
                  }
                  key={permission.uuid}
                  color={
                    permission.name.includes("create")
                      ? "success"
                      : permission.name.includes("read")
                      ? "primary"
                      : permission.name.includes("update")
                      ? "warning"
                      : permission.name.includes("delete")
                      ? "danger"
                      : "default"
                  }
                >
                  {permission.name}
                </Chip>
              ))}
            </div>
            <InputError message={errors.permissions} />
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="w-1/2"
              size="sm"
              color="default"
              onClick={() => {
                setOpenDrawer(false);
                setData(null);
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
            >
              Save
            </Button>
          </div>
        </form>
      </Drawer>

      */}

      <DeleteModal
        disclosure={deleteDisclosure}
        title="Delete Payment Account"
        onButtonClick={async () => {
          try {
            const response = await axios.delete(
              `/institution/payment-accounts/${data?.id}`
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
          <span className="font-semibold">{data?.account_name}</span>
        </p>
      </DeleteModal>
    </AuthLayout>
  );
}
