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
    userRole: '',
    constRole: ''
  };

  componentDidMount() {
    this.fetchInstitution();
    
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

  toggleUserRole = () => {
    // Toggle the user role and refetch dashboard analytics
    this.setState(
      (prevState) => ({
        userRole: prevState.userRole === "Admin" ? "Finance" : "Admin",
      }),
      () => {
        // Refetch dashboard analytics after user role is toggled
        this.fetchDashboardAnalytics();
      }
    );
  };

  fetchInstitution = async () => {
    try {
      this.setState({ isLoading: true });

      const response = await axios.get("/institution/institution-data");
      const institutionData = response.data.institutionData;

      if (institutionData) {
        // Set institution details and user role
        this.setState(
          {
            name: institutionData.institution.name,
            address: institutionData.institution.address,
            prefix: institutionData.institution.prefix,
            description: institutionData.institution.description,
            digital_address: institutionData.institution.digital_address,
            region: institutionData.institution.region,
            academic_level: institutionData.institution.academic_level,
            logo: institutionData.institution.logo,
            status: institutionData.institution.status,
            loggedInUser: institutionData.user,
            userRole: response.data.userRole,
            constRole: response.data.userRole,
          },
          () => {
            // Fetch dashboard analytics after state is properly updated
            this.fetchDashboardAnalytics();
          }
        );
      } else {
        this.setState({ isLoading: false });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching institution data."
      );
      this.setState({ isLoading: false });
    }
  };

  fetchDashboardAnalytics = async () => {
    try {
      this.setState({ isLoading: true });

      const response = await axios.get("/institution/dashboard-analytics");
      const { documentRequests, documentValidations, monthlyData } =
        response.data;
      const { monthlyDocumentRequests, monthlyDocumentValidations, monthlyValRequestPayment, monthlyDocRequestPayment } =
        monthlyData;

      const requestData = Array(12).fill(0);
      const validationData = Array(12).fill(0);

      if (this.state.userRole === "Finance") {
        // Populate request and validation data for Finance role
        monthlyDocRequestPayment.forEach((item) => {
          requestData[item.month - 1] = item.total_payment;
        });

        monthlyValRequestPayment.forEach((item) => {
          validationData[item.month - 1] = item.total_payment;
        });
        // State update for Finance role
        this.setState({
          requestData,
          validationData,
          totalRequests: documentRequests.total_payment,
          totalValidations: documentValidations.total_payment,
          recentDocumentRequests: documentRequests.recent_payment,
          recentDocumentValidations: documentValidations.recent_payment,
          isLoading: false,
        });
      } else {
        // State update for non-Finance role
        // Populate request and validation data
        monthlyDocumentRequests.forEach((item) => {
          requestData[item.month - 1] = item.count;
        });

        monthlyDocumentValidations.forEach((item) => {
          validationData[item.month - 1] = item.count;
        });
        this.setState({
          requestData,
          validationData,
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
          isLoading: false,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching dashboard analytics."
      );
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
      userRole,
      constRole
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
            <div className="col-span-2 lg:col-span-3 flex items-center">
              <div className="">
                <div className="flex items-center space-x-2 font-semibold text-lg">
                <img
                  className="w-12 h-12"
                  src={
                    timeOfDay === 'Good Morning'
                      ? "/images/morning.png"
                      : timeOfDay === 'Good Afternoon'
                      ? "/images/afternoon.png"
                      : "/images/evening.png"
                  }
                  alt={timeOfDay}
                />
                <div className="">
                  <div className="flex space-x-1">
                    <p>{timeOfDay}</p>
                    <p>{loggedInUser.first_name}</p>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Let's do something great today!
                  </p>
                </div>
                </div>
                
              </div>
            </div>
            {constRole === "Admin" &&
              <div className="inline-flex items-center justify-center cursor-pointer bg-white shadow-md shadow-gray-300 rounded-2xl py-1.5">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  onChange={this.toggleUserRole}
                />
                <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-bChkRed"></div>
                <span className="ms-3 text-sm font-medium text-bChkRed ">Switch Dashboard</span>
              </div>
            }
            
          </div>
          

          <div className="m-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="border border-[#ff04043f] rounded-2xl p-4 bg-white">
                {isLoading ? (
                <div className="w-full max-w-sm p-4 mx-auto bg-white border border-gray-200 rounded-lg shadow-md animate-pulse">
                  <div className="h-12 bg-gray-300 rounded-md"></div>
                  <div className="mt-4 space-y-3">
                    <div className="h-3 bg-gray-300 rounded w-3/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
                
                ):(
                <div className="">
                  <div className="flex justify-between ">
                    <div className="">
                      <div className="my-2">
                      <p>
                        {userRole === "Finance" ? (
                          <>
                            GH¢ <span className="font-bold text-3xl">{parseFloat(totalRequests).toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="font-bold text-3xl">{(totalRequests)}</span>
                        )}
                      </p>

                        <div className="font-medium text-base text-gray-600">
                          <p>{userRole == "Finance" ? 'Document Request Payments' : 'Document Requests'}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          <p>{userRole == "Finance" ? 'Total payment for document requests.' : 'Overview of all document requests.'}</p>
                        </div>
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
                    to={userRole === "Finance" ? `/reports/revenue-overview` : `/requests/document-requests`}
                    className="w-1/2 flex items-center space-x-2 py-0.5 border rounded-lg text-sm text-gray-600 px-4 bg-gray-100 mt-2"
                  >
                    <p>View Details</p> <FaArrowRight size={12} />
                  </NavLink>
                </div>
                )}
                
                
              </div>
              <div className="border border-[#ff04043f] rounded-2xl p-4 bg-white">
              {isLoading ? (
                <div className="w-full max-w-sm p-4 mx-auto bg-white border border-gray-200 rounded-lg shadow-md animate-pulse">
                  <div className="h-12 bg-gray-300 rounded-md"></div>
                  <div className="mt-4 space-y-3">
                    <div className="h-3 bg-gray-300 rounded w-3/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
                
                ):(
                <div className="">
                  <div className="flex justify-between ">
                    <div className="">
                      <div className="my-2">
                      <p>
                        {userRole === "Finance" ? (
                          <>
                            GH¢ <span className="font-bold text-3xl">{parseFloat(totalValidations).toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="font-bold text-3xl">{(totalValidations)}</span>
                        )}
                      </p>
                        <div className="font-medium text-base text-gray-600">
                          <p>{userRole == "Finance" ? 'Validation Payments' : 'Validation Requests'}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          <p>{userRole == "Finance" ? 'Total payment for validations.' : 'Overview of all validation requests.'}</p>
                        </div>
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
                    to={
                      userRole === "Finance"
                        ? `/reports/revenue-overview`
                        : userRole === "Customer Service"
                        ? `/requests/validation-requests`
                        : `/requests/validation-requests`
                    }
                    className="w-1/2 flex items-center space-x-2 py-0.5 border rounded-lg text-sm text-gray-600 px-4 bg-gray-100 mt-2"
                  >
                    <p>View Details</p> <FaArrowRight size={12} />
                  </NavLink>
                </div>
                )}
              </div>
              <div className="border border-[#ff04043f] rounded-2xl p-4 bg-white">
              {isLoading ? (
                <div className="w-full max-w-sm p-4 mx-auto bg-white border border-gray-200 rounded-lg shadow-md animate-pulse">
                  <div className="h-12 bg-gray-300 rounded-md"></div>
                  <div className="mt-4 space-y-3">
                    <div className="h-3 bg-gray-300 rounded w-3/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
                
                ):(
                <div className="">
                  <div className="flex justify-between ">
                    <div className="">
                      <div className="my-2">
                      <p>
                        {userRole === "Finance" ? (
                          <>
                            GH¢ <span className="font-bold text-3xl">{parseFloat(0).toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="font-bold text-3xl">{(0)}</span>
                        )}
                      </p>
                        <div className="font-medium text-base text-gray-600">
                          <p>{userRole == "Finance" ? 'Verification Request Payments' : 'Verification Requests'}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          <p>{userRole == "Finance" ? 'Total payment for verification requests.' : 'Overview of all verification requests.'}</p>
                        </div>
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
              )}
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
                         {userRole == "Finance" ? 'Recent Payment' : 'Recent Applications'}
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
                                  <p>
                                    {userRole === "Finance" ? (
                                      <div className="flex space-x-2">
                                        <p>{request?.payment_method}</p>
                                        <p className="font-semibold">GH¢{request?.amount}</p>
                                      </div>
                                    ) : (
                                      request?.document_type?.name
                                    )}
                                  </p>

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
                              recentDocumentValidations?.map(
                                (validation, index) => (
                                  <li
                                    key={index}
                                    className="flex justify-between text-gray-600 text-sm py-2 border-b"
                                  >
                                  <p>
                                    {userRole === "Finance" ? (
                                      <div className="flex space-x-2">
                                        <p>{validation?.payment_method}</p>
                                        <p className="font-semibold">GH¢{validation?.amount}</p>
                                      </div>
                                    ) : (
                                      validation?.document_type?.name
                                    )}
                                  </p>

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
