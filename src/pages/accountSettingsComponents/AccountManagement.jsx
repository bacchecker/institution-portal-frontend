import {
    Button,
    Input,
    useDisclosure,
  } from "@nextui-org/react";
  import React, { useState, useEffect } from "react";
  import axios from "@utils/axiosConfig";
  import Swal from "sweetalert2";
  import AuthLayout from "../../components/AuthLayout";
  import DeleteModal from "@components/DeleteModal";
  import { IoLockOpen } from "react-icons/io5";
  import toast from "react-hot-toast";
  
  function AccountManagement() {
    const suspendDisclosure = useDisclosure();
    const [isSuspending, setSuspending] = useState(false);
    const [password, setPassword] = useState("");
    
  
    
    return (
      <AuthLayout title="Account Management">
        <div className="w-full p-4">
            <div className="w-full bg-white rounded-lg p-4">
                <div className="text-bChkRed font-semibold text-xl mb-4">Account Deactivation Notice</div>
                <div className="">
                    <p>Deactivating your account will restrict access to all services and features associated with it. You will no longer be able to log in or use any institution-related services.

If you choose to proceed, your account can only be restored by contacting support. Please ensure you understand this action is irreversible unless reactivated by a BacChecker administrator.</p>
                </div>
                <div className="w-full flex justify-end mt-4">
                    <Button
                        className="bg-bChkRed text-white"
                        key="suspend"
                        onClick={() => {
                        suspendDisclosure.onOpen();
                        }}
                    >
                        Proceed to Deactivate
                    </Button>
                </div>
                
            </div>
          <DeleteModal
            disclosure={suspendDisclosure}
            title="Deactivate Institution Account"
            processing={isSuspending}
            onButtonClick={async () => {
              setSuspending(true);
              const payload = {
                password: password,
              };
              try {
                const response = await axios.post(
                  `/institution/deactivate-account`, payload
                );
                suspendDisclosure.onClose();
                Swal.fire({
                  title: "Success",
                  text: response.data.message,
                  icon: "success",
                  button: "OK",
                  confirmButtonColor: "#00b17d",
                }).then((isOkay) => {
                  if (isOkay) {
                    setSuspending(false);
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/login';
                  }
                });
              } catch (error) {
                console.log(error);
                toast.error(error.response.data.message);
                setSuspending(false);
              }
            }}
          >
            <form action="">
              <Input
                type="password"
                id="password"
                name="password"
                size="sm"
                value={password}
                label="Password"
                className="mt-1 block w-full"
                onChange={(e) => setPassword(e.target.value)}
                startContent={<IoLockOpen />}
              />
            </form>
            
          </DeleteModal>
        </div>
      </AuthLayout>
    );
  }
  
  export default AccountManagement;
  