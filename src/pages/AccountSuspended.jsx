import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import secureLocalStorage from "react-secure-storage";
import { FaExclamationTriangle } from "react-icons/fa";

function AccountSuspended() {
  const user = JSON?.parse(secureLocalStorage?.getItem("user"));

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 p-4">
      <Card className="max-w-2xl">
        <CardBody className="flex flex-col items-center gap-6 p-8 text-center">
          <FaExclamationTriangle className="h-20 w-20 text-red-500" />
          
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
            Account Suspended
          </h1>

          <div className="space-y-4 text-gray-600">
            <p className="text-lg">
              Dear {user?.institution?.name},
            </p>
            <p>
              Your institution's account has been suspended. This may be due to:
            </p>
            <ul className="list-inside list-disc space-y-2 text-left">
              <li>Policy violations</li>
              <li>Security concerns</li>
              <li>Payment issues</li>
              <li>Other administrative actions</li>
            </ul>
            <p className="mt-4">
              If you believe this is a mistake or would like to discuss the suspension,
              please contact our support team for assistance.
            </p>
          </div>

          <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
            <p>
              <strong>Need help?</strong> Our support team is available to assist you.
              Please include your institution ID: <strong>{user?.institution?.id}</strong> in your communication.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default AccountSuspended;
