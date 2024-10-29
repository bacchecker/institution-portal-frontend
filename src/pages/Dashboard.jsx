import React, { Component } from "react";
import { IoDocuments } from "react-icons/io5";
import withRouter from "@components/withRouter";
import axios from "@utils/axiosConfig";
import AuthLayout from "@components/AuthLayout";
import { toast } from "sonner";
import moment from "moment";
import { FaArrowRight, FaFileShield } from "react-icons/fa6";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { NavLink } from "react-router-dom";

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    name: "",
    description: "",
    prefix: "",
    institutionStatus: this.props.institutionStatus,
    profileComplete: this.props.profileComplete,
    showTicketModal: false,
    title: "",
    type: "",
    category: "",
    isSaving: false,
    documentRequests: [],
    documentValidations: [],
    documentVerifications: [],
    timeOfDay: "",
    loggedInUser: "",
    isLoading: false,
    requestData: [],
    validationData: [],
    verificationData: [],
    xLabels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    totalRequests: 0,
    submittedRequests: 0,
    completedRequests: 0,
    pendingRequests: 0,
    totalValidations: 0,
    submittedValidations: 0,
    completedValidations: 0,
    pendingValidations: 0,
    totalVerifications: 0,
    submittedVerifications: 0,
    completedVerifications: 0,
    pendingVerifications: 0,
    openSection: null,
    recentDocumentRequests: [],
    recentDocumentValidations: [],
  };

  componentDidMount() {
    this.fetchInstitution();
    this.fetchDashboardAnalytics();
    this.getTimeOfDay();
    this.intervalId = setInterval(this.getTimeOfDay.bind(this), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  getTimeOfDay = () => {
    const currentHour = moment().hour();

    let timeOfDay = "";

    if (currentHour >= 5 && currentHour < 12) {
      timeOfDay = "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      timeOfDay = "Good Afternoon";
    } else {
      timeOfDay = "Good Evening";
    }

    this.setState({ timeOfDay });
  };

  handleToggle = (section) => {
    this.setState((prevState) => ({
      openSection: prevState.openSection === section ? null : section, // Close if it's already open, otherwise open
    }));
  };

  fetchDashboardAnalytics = async () => {
    try {
      this.setState({ isLoading: true });

      const response = await axios.get("/institution/dashboard-analytics");
      const { documentRequests, documentValidations, monthlyData } =
        response.data;
      const { monthlyDocumentRequests, monthlyDocumentValidations } =
        monthlyData;

      const requestData = Array(12).fill(0);
      const validationData = Array(12).fill(0);
      const verificationData = Array(12).fill(0);

      monthlyDocumentRequests.forEach((item) => {
        requestData[item.month - 1] = item.count;
      });

      monthlyDocumentValidations.forEach((item) => {
        validationData[item.month - 1] = item.count;
      });

      this.setState({
        requestData,
        validationData,
        verificationData,
        totalRequests: documentRequests.total,
        submittedRequests: documentRequests.submitted,
        completedRequests: documentRequests.completed,
        pendingRequests: documentRequests.pending,
        totalValidations: documentValidations.total,
        submittedValidations: documentValidations.submitted,
        completedValidations: documentValidations.completed,
        pendingValidations: documentValidations.pending,
        recentDocumentRequests: documentRequests.recent,
        recentDocumentValidations: documentValidations.recent,
      });
      this.setState({ isLoading: false });
    } catch (error) {
      toast.error(error.response.data.message);
      this.setState({ isLoading: false });
    }
  };

  fetchInstitution = async () => {
    try {
      this.setState({ isLoading: true });

      const response = await axios.get("/institution/institution-data");
      const institutionData = response.data.institutionData;

      if (institutionData) {
        this.setState({
          name: institutionData.name,
          address: institutionData.address,
          prefix: institutionData.prefix,
          description: institutionData.description,
          digital_address: institutionData.digital_address,
          region: institutionData.region,
          academic_level: institutionData.academic_level,
          logo: institutionData.logo,
          status: institutionData.status,
          loggedInUser: institutionData.user,
        });
      }
      this.setState({ isLoading: false });
    } catch (error) {
      toast.error(error.response.data.message);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const {
      timeOfDay,
      loggedInUser,
      isLoading,
      requestData,
      validationData,
      totalRequests,
      totalValidations,
      recentDocumentRequests,
      recentDocumentValidations,
      openSection,
    } = this.state;

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = monthNames.map((month, index) => ({
      name: month,
      requests: requestData[index] || 0,
      validations: validationData[index] || 0,
    }));

    return (
      <AuthLayout title="Dashboard">
        <div className="w-full p-3">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-8">
            <div className="col-span-3 flex items-center xl:space-x-8 space-x-4">
              <div className="">
                <p className="font-semibold text-lg">
                  {timeOfDay} {loggedInUser.first_name}!
                </p>
                <p className="text-gray-500 text-sm">
                  Let's do something great today!
                </p>
              </div>
            </div>
          </div>
          <div className="my-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="border border-[#ff04043f] rounded-2xl p-4 bg-white">
                <div className="flex justify-between ">
                  <div className="">
                    <div className="my-2">
                      <p className="font-bold text-3xl">{totalRequests}</p>
                      <p className="font-medium text-base ">
                        Document Requests
                      </p>
                      <p className="text-xs text-gray-400">
                        Overview of all document requests.
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 mr-2">
                    <p className="bg-[#ff0404] h-4 text-white text-[11px] text-center uppercase">
                      Requests
                    </p>
                    <div className="flex flex-col items-center h-10 w-[70px] justify-center bg-white rounded-b-md shadow-md">
                      <img
                        src="/images/request.jpg"
                        className="w-8 h-8"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <NavLink
                  to={`/requests/document-requests`}
                  className="w-1/2 flex items-center space-x-2 py-0.5 border rounded-lg text-sm text-gray-600 px-4 bg-gray-100 mt-2"
                >
                  <p>View Details</p> <FaArrowRight size={12} />
                </NavLink>
              </div>
              <div className="border border-[#ff04043f] rounded-2xl p-4 bg-white">
                <div className="flex justify-between ">
                  <div className="">
                    <div className="my-2">
                      <p className="font-bold text-3xl">{totalValidations}</p>
                      <p className="font-medium text-base ">
                        Validation Requests
                      </p>
                      <p className="text-xs text-gray-400">
                        Overview of all validation requests.
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 mr-2">
                    <p className="bg-[#ff0404] h-4 text-white text-[11px] text-center uppercase">
                      Validation
                    </p>
                    <div className="flex flex-col items-center h-10 w-[73px] justify-center bg-white rounded-b-md shadow-md">
                      <img
                        src="/images/validate.jpg"
                        className="w-8 h-8"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <NavLink
                  to={`/requests/validation-requests`}
                  className="w-1/2 flex items-center space-x-2 py-0.5 border rounded-lg text-sm text-gray-600 px-4 bg-gray-100 mt-2"
                >
                  <p>View Details</p> <FaArrowRight size={12} />
                </NavLink>{" "}
              </div>
              <div className="border border-[#ff04043f] rounded-2xl p-4 bg-white">
                <div className="flex justify-between ">
                  <div className="">
                    <div className="my-2">
                      <p className="font-bold text-3xl">0</p>
                      <p className="font-medium text-base ">
                        Verification Requests
                      </p>
                      <p className="text-xs text-gray-400">
                        Overview of all verification requests.
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 mr-2">
                    <p className="bg-[#ff0404] h-4 text-white text-[11px] text-center uppercase">
                      verification
                    </p>
                    <div className="flex flex-col items-center h-10 w-[79px] justify-center bg-white rounded-b-md shadow-md">
                      <img
                        src="/images/verification.png"
                        className="w-8 h-8"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <button className="flex items-center space-x-2 py-0.5 border rounded-lg text-sm text-gray-600 px-4 bg-gray-100 mt-2">
                  <p>View Details</p> <FaArrowRight size={12} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 my-4 ">
              <div className="h-64 md:h-96 col-span-2 w-full bg-white rounded-2xl justify-center pt-6 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="requests"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="validations"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="xl:col-span-1 col-span-2 justify-center rounded-2xl bg-white p-4 max-h-96">
                {isLoading ? (
                  <div
                    role="status"
                    className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-center h-32 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                      <svg
                        className="w-10 h-10 text-gray-200 dark:text-gray-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 20"
                      >
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                      </svg>
                    </div>
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-32 dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-32 dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-32 dark:bg-gray-700"></div>
                    <div className="flex items-center mt-4">
                      <svg
                        className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                      </svg>
                      <div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                        <div className="w-40 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                      </div>
                    </div>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <div className="col-span-2 xl:col-span-1 flex flex-col">
                    <div className="col-span-4 rounded-md bg-white">
                      <p className="font-bold text-xl mb-4">
                        Recent Applications
                      </p>
                      <div className="space-y-2">
                        {/* Document Requests Section */}
                        <div
                          className="grid grid-cols-4 gap-4 border rounded-lg px-4 py-1.5 hover:bg-gray-100 cursor-pointer"
                          onClick={() => this.handleToggle("requests")}
                        >
                          <div className="flex items-center justify-center bg-red-200 rounded-full w-10 h-10">
                            <IoDocuments className="text-gray-900" size={18} />
                          </div>
                          <div className="col-span-3 flex items-center">
                            <p className="text-base text-gray-700 font-medium">
                              Document Requests
                            </p>
                          </div>
                        </div>

                        <div
                          className={`transition-all overflow-hidden shadow px-2 ${
                            openSection === "requests" ? "max-h-96" : "max-h-0"
                          } duration-700 ease-in-out`}
                        >
                          <ul className="list-disc ml-4 mt-1 pb-2">
                            {recentDocumentRequests &&
                            recentDocumentRequests.length > 0 ? (
                              recentDocumentRequests.map((request, index) => (
                                <li
                                  key={index}
                                  className="flex justify-between text-gray-600 text-sm py-2 border-b"
                                >
                                  <p>{request.document_type.name}</p>
                                  <p className="text-xs self-end">
                                    {moment(request.created_at).format(
                                      "MMM D, YYYY"
                                    )}
                                  </p>
                                </li>
                              ))
                            ) : (
                              <li className="text-gray-500 text-sm py-1">
                                No request available
                              </li>
                            )}
                          </ul>
                        </div>
                        <div
                          className="grid grid-cols-4 gap-4 border rounded-lg px-4 py-1.5 cursor-pointer"
                          onClick={() => this.handleToggle("validations")}
                        >
                          <div className="flex items-center justify-center bg-red-200 rounded-full w-10 h-10">
                            <FaFileShield className="text-gray-900" size={18} />
                          </div>
                          <div className="col-span-3 flex items-center">
                            <p className="text-base text-gray-700 font-medium">
                              Document Validations
                            </p>
                            {/* <button className="border rounded-md text-xs font-medium px-4 xl:px-6 text-gray-700 h-8 self-center hover:bg-red-200">
                            View Validations
                          </button> */}
                          </div>
                        </div>

                        {/* Display validations list if openSection is 'validations' */}
                        <div
                          className={`transition-all overflow-hidden shadow px-2 ${
                            openSection === "validations"
                              ? "max-h-96"
                              : "max-h-0"
                          } duration-700 ease-in-out`}
                        >
                          <ul className="list-disc ml-4 mt-1 pb-2">
                            {recentDocumentValidations &&
                            recentDocumentValidations.length > 0 ? (
                              recentDocumentValidations.map(
                                (validation, index) => (
                                  <li
                                    key={index}
                                    className="flex justify-between text-gray-600 text-sm py-2 border-b"
                                  >
                                    <p>{validation.document_type.name}</p>
                                    <p className="text-xs self-end">
                                      {moment(validation.created_at).format(
                                        "MMM D, YYYY"
                                      )}
                                    </p>
                                  </li>
                                )
                              )
                            ) : (
                              <li className="text-gray-500 text-sm py-1">
                                No validations available
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {/* <div className="flex items-center justify-center w-44 h-44 border-2 border-gray-600 rounded-full mx-auto">
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}/storage/app/public/${
                          this.state.logo
                        }`}
                        alt="Institution Logo"
                        style={{ width: "170px", height: "170px" }}
                        className="rounded-full"
                      />
                    </div>
                    <MdOutlineVerifiedUser
                      className="text-green-600 self-center mt-1"
                      size={18}
                    />
                    <div className="text-center font-bold mt-2">
                      <div className="flex space-x-2 justify-center">
                        <p className="text-gray-800">{this.state.name}</p>
                      </div>
                      <p className="text-gray-600 text-sm my-4">
                        ({this.state.prefix})
                      </p>

                      <p className="text-xs font-light text-gray-800">
                        {this.state.description}
                      </p>
                    </div> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }
}

export default withRouter(Dashboard);
