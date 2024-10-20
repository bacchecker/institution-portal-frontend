import React, { Component } from "react";
import Stepper from "@components/Stepper";
import AuthLayout from "@components/AuthLayout";
import { Card, CardBody } from "@nextui-org/react";

class CompleteProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: [],
    };
  }

  toggleSidebar = () => {
    this.setState((prevState) => ({
      isCollapsed: !prevState.isCollapsed,
    }));
  };
  render() {
    const { isCollapsed } = this.state;
    return (
      <AuthLayout title="Account Setup">
        <section className="p-3">
          <Card className="dark:bg-slate-900">
            <CardBody className=" ">
              <div className="flex justify-between px-10 pt-4 pb-2 ">
                <div className="">
                  <p className="font-bold text-2xl text-uewBlue mb-1">
                    Institution Account Setup
                  </p>
                  <p className="text-sm text-gray-700 font-normal">
                    Please provide all required details and manage your document
                    types efficiently to activate your institution's account
                  </p>
                </div>
              </div>
              <div className="mx-2 py-2 lg:mx-5 ">
                <Stepper />
              </div>
            </CardBody>
          </Card>
        </section>
      </AuthLayout>
    );
  }
}

export default CompleteProfile;
