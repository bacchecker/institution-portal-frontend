import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { setUser } from "./authSlice";

export const baccheckerApi = createApi({
  reducerPath: "baccheckerApi",
  baseQuery: async (args, api, extraOptions) => {
    const token = JSON?.parse(secureLocalStorage?.getItem("userToken"))?.token;

    const result = await fetchBaseQuery({
      baseUrl:
        import.meta.env.VITE_BACCHECKER_API_URL || "http://127.0.0.1:8000/api",

      prepareHeaders: (headers) => {
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Accept", "application/json");
        return headers;
      },
    })(args, api, extraOptions);

    if (result.error) {
      if (
        result.error.status === 401 &&
        result.error.data?.message === "Unauthorized"
      ) {
        const navigate = useNavigate();
        navigate("/");
      }
    }

    return result;
  },
  keepUnusedDataFor: 5,
  // refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: [
    "User",
    "Log",
    "Institution",
    "Ticket",
    "DocumentType",
    "Department",
    "InstitutionUser",
    "DocumentRequest",
    "Analytics",
    "Log",
    "Payment",
    "Validation",
    "Affiliation",
    "Notification",
  ],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Log"],
    }),
    getNotifications: builder.query({
      query: () => "/institution/notifications",
      refetchOnFocus: true,
      providesTags: ["Notification"],
    }),
    getInstitutionDetails: builder.query({
      query: () => "/institution/institution-data",
      providesTags: ["Institution"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.institutionData) {
            const user = JSON.parse(secureLocalStorage.getItem("user"));
            if (user) {
              const updatedUser = {
                ...user,
                institution: data.institutionData.institution,
                user: data.institutionData.user,
              };

              // Update local storage
              secureLocalStorage.setItem("user", JSON.stringify(updatedUser));
              // Update Redux store
              dispatch(setUser(updatedUser));
            }
          }
        } catch (err) {
          console.error("Failed to update user data:", err);
        }
      },
    }),
    getInstitutionRevenueGraph: builder.query({
      query: () => "/institution/revenue",
      providesTags: ["DocumentRequest"],
    }),
    getInstitutionVerificationData: builder.query({
      query: () => "/institution/verification/dashboard-data",
      providesTags: ["DocumentRequest"],
    }),
    getAllPermissions: builder.query({
      query: () => "/institution/institution-permissions",
    }),

    getUserSystemLogs: builder.query({
      query: ({ page, searchValue, selectedFrom, selectedTo }) => {
        let queryString = `institution/system-logs?page=${page}`;
        if (searchValue) {
          queryString += `&search_query=${searchValue}`;
        }
        if (selectedFrom) {
          queryString += `&start_date=${selectedFrom}`;
        }
        if (selectedTo) {
          queryString += `&end_date=${selectedTo}`;
        }
        return queryString;
      },
      providesTags: ["Log"],
    }),

    getInstitutionDepartments: builder.query({
      query: ({ page, perPage }) => {
        let queryString = `/institution/departments?page=${page}`;
        if (perPage) {
          queryString += `&per_page=${perPage}`;
        }

        return queryString;
      },
      providesTags: ["Department"],
    }),
    getInstitutionVericationRequestsReceived: builder.query({
      query: ({
        page,
        searchValue,
        selectedFrom,
        selectedTo,
        selectedDocumentType,
        sortBy,
        sortOrder,
        selectedStatus,
      }) => {
        let queryString = `/institution/requests/verification-in-requests?page=${page}`;
        if (searchValue) {
          queryString += `&search_query=${searchValue}`;
        }
        if (selectedFrom) {
          queryString += `&start_date=${selectedFrom}`;
        }
        if (selectedTo) {
          queryString += `&end_date=${selectedTo}`;
        }
        if (selectedDocumentType) {
          queryString += `&document_type=${selectedDocumentType}`;
        }
        if (sortBy) {
          queryString += `&sort_by=${sortBy}`;
        }
        if (sortOrder) {
          queryString += `&sort_order=${sortOrder}`;
        }
        if (selectedStatus) {
          queryString += `&status=${selectedStatus}`;
        }

        return queryString;
      },
      // providesTags: ["DocumentRequest"],
    }),
    getInstitutionVericationRequestsSent: builder.query({
      query: ({
        page,
        searchValue,
        selectedFrom,
        selectedTo,
        selectedDocumentType,
        sortBy,
        sortOrder,
        selectedStatus,
      }) => {
        let queryString = `/institution/requests/verification-out-requests?page=${page}`;
        if (searchValue) {
          queryString += `&search_query=${searchValue}`;
        }
        if (selectedFrom) {
          queryString += `&start_date=${selectedFrom}`;
        }
        if (selectedTo) {
          queryString += `&end_date=${selectedTo}`;
        }
        if (selectedDocumentType) {
          queryString += `&document_type=${selectedDocumentType}`;
        }
        if (sortBy) {
          queryString += `&sort_by=${sortBy}`;
        }
        if (sortOrder) {
          queryString += `&sort_order=${sortOrder}`;
        }
        if (selectedStatus) {
          queryString += `&status=${selectedStatus}`;
        }

        return queryString;
      },
      // providesTags: ["DocumentRequest"],
    }),
    getInstitutionDocumentRequests: builder.query({
      query: ({
        page,
        searchValue,
        selectedFrom,
        selectedTo,
        selectedDocumentType,
        sortBy,
        sortOrder,
        selectedStatus,
      }) => {
        let queryString = `/institution/requests/document-requests?page=${page}`;
        if (searchValue) {
          queryString += `&search_query=${searchValue}`;
        }
        if (selectedFrom) {
          queryString += `&start_date=${selectedFrom}`;
        }
        if (selectedTo) {
          queryString += `&end_date=${selectedTo}`;
        }
        if (selectedDocumentType) {
          queryString += `&document_type=${selectedDocumentType}`;
        }
        if (sortBy) {
          queryString += `&sort_by=${sortBy}`;
        }
        if (sortOrder) {
          queryString += `&sort_order=${sortOrder}`;
        }
        if (selectedStatus) {
          queryString += `&status=${selectedStatus}`;
        }

        return queryString;
      },
      providesTags: ["DocumentRequest"],
    }),

    getInstitutionValidationRequests: builder.query({
      query: ({
        page,
        searchValue,
        selectedFrom,
        selectedTo,
        selectedDocumentType,
        sortBy,
        sortOrder,
        selectedStatus,
      }) => {
        let queryString = `/institution/requests/validation-requests?page=${page}`;
        if (searchValue) {
          queryString += `&search_query=${searchValue}`;
        }
        if (selectedFrom) {
          queryString += `&start_date=${selectedFrom}`;
        }
        if (selectedTo) {
          queryString += `&end_date=${selectedTo}`;
        }
        if (selectedDocumentType) {
          queryString += `&document_type=${selectedDocumentType}`;
        }
        if (sortBy) {
          queryString += `&sort_by=${sortBy}`;
        }
        if (sortOrder) {
          queryString += `&sort_order=${sortOrder}`;
        }
        if (selectedStatus) {
          queryString += `&status=${selectedStatus}`;
        }

        return queryString;
      },
      providesTags: ["Validation"],
    }),

    getInstitutionDocumentTypes: builder.query({
      query: ({ page, perPage }) => {
        let queryString = `/institution/document-types?page=${page}`;
        if (perPage) {
          queryString += `&per_page=${perPage}`;
        }
        return queryString;
      },
      providesTags: ["DocumentType"],
    }),
    getInstitutionUsers: builder.query({
      query: ({ page }) => {
        let queryString = `/institution/users?page=${page}`;
        return queryString;
      },
      providesTags: ["InstitutionUser"],
    }),

    getInstitutionRevenue: builder.query({
      query: ({ institutionID }) => {
        let queryString = `/institution/reports/institution-income?institution_id=${institutionID}`;
        return queryString;
      },
      providesTags: ["DocumentRequest"],
    }),

    getInstitutionReports: builder.query({
      query: ({
        page,
        selectedStatus,
        selectedDateRange,
        sortBy,
        sortOrder,
        selectedFrom,
        selectedTo,
      }) => {
        let queryString = `/institution/reports/institution-requests?page=${page}`;
        if (selectedStatus) {
          queryString += `&status=${selectedStatus}`;
        }
        if (selectedDateRange) {
          queryString += `&date_range=${selectedDateRange}`;
        }
        if (sortBy) {
          queryString += `&sort_by=${sortBy}`;
        }
        if (sortOrder) {
          queryString += `&sort_order=${sortOrder}`;
        }
        if (selectedFrom) {
          queryString += `&start_date=${selectedFrom}`;
        }
        if (selectedTo) {
          queryString += `&end_date=${selectedTo}`;
        }
        return queryString;
      },
      providesTags: ["DocumentRequest"],
    }),

    getInstitutionValidationReports: builder.query({
      query: ({
        page,
        selectedStatus,
        selectedDateRange,
        sortBy,
        sortOrder,
        selectedFrom,
        selectedTo,
      }) => {
        let queryString = `/institution/reports/institution-validations?page=${page}`;
        if (selectedStatus) {
          queryString += `&status=${selectedStatus}`;
        }
        if (selectedDateRange) {
          queryString += `&date_range=${selectedDateRange}`;
        }
        if (sortBy) {
          queryString += `&sort_by=${sortBy}`;
        }
        if (sortOrder) {
          queryString += `&sort_order=${sortOrder}`;
        }
        if (selectedFrom) {
          queryString += `&start_date=${selectedFrom}`;
        }
        if (selectedTo) {
          queryString += `&end_date=${selectedTo}`;
        }
        return queryString;
      },
      providesTags: ["DocumentRequest"],
    }),

    getDashboardAnalytics: builder.query({
      query: () => "/institution/dashboard-analytics",
      providesTags: ["DocumentRequest"],
    }),

    getAllTickets: builder.query({
      query: ({ selectedStatus, searchValue, sortBy, sortOrder, page }) => {
        let queryString = `/tickets?page=${page}`;

        if (
          selectedStatus !== undefined &&
          selectedStatus !== "" &&
          selectedStatus !== null
        ) {
          queryString += `&status=${selectedStatus}`;
        }
        if (
          searchValue !== undefined &&
          searchValue !== "" &&
          searchValue !== null
        ) {
          queryString += `&search=${searchValue}`;
        }
        if (sortBy) {
          queryString += `&sort_by=${sortBy}`;
        }
        if (sortOrder) {
          queryString += `&sort_order=${sortOrder}`;
        }
        return queryString;
      },
      providesTags: ["Ticket"],
    }),
    getRevenuePercentage: builder.query({
      query: () => "/institution/requests/monthly-percentage",
      providesTags: ["DocumentRequest"],
    }),
    getInstitutionDocuments: builder.query({
      query: ({ selectedAcademicLevel }) => {
        let queryString = `/institutions/document-types`;

        if (
          selectedAcademicLevel !== undefined &&
          selectedAcademicLevel !== "" &&
          selectedAcademicLevel !== null
        ) {
          queryString += `?academic_level=${selectedAcademicLevel}`;
        }
        return queryString;
      },
      providesTags: ["InstitutionType"],
    }),
    getFilteredInstitutions: builder.query({
      query: ({
        selectedAcademicLevel,
        selectedInstitutionType,
        selectedNonInstitutionType,
      }) => {
        let queryString = `/institution?type=${selectedInstitutionType}`;

        if (
          selectedAcademicLevel !== undefined &&
          selectedAcademicLevel !== "" &&
          selectedAcademicLevel !== null
        ) {
          queryString += `&academic_level=${selectedAcademicLevel}`;
        }
        if (
          selectedNonInstitutionType !== undefined &&
          selectedNonInstitutionType !== "" &&
          selectedNonInstitutionType !== null
        ) {
          queryString += `&institution_type=${selectedNonInstitutionType}`;
        }
        return queryString;
      },
      providesTags: ["Institution"],
    }),
    getNonAcademicInstitutionTypes: builder.query({
      query: () => "/institution/institution-types",
      providesTags: ["InstitutionType"],
    }),

    getUserAffiliation: builder.query({
      query: ({ institutionType, academicLevel }) => {
        let queryString = `/profile/affiliations?institution_type=${institutionType}`;
        if (academicLevel) {
          queryString += `&academic_level=${academicLevel}`;
        }
        return queryString;
      },
      providesTags: ["Affiliation"],
    }),

    getAllExistingDocumentTypes: builder.query({
      query: ({ selectedAcademicLevel, selectedInstitutionType }) => {
        let queryString = `/institutions/document-types`;

        let params = [];

        if (selectedAcademicLevel) {
          params.push(`academic_level=${selectedAcademicLevel}`);
        }
        if (selectedInstitutionType) {
          params.push(`institution_type=${selectedInstitutionType}`);
        }

        if (params.length > 0) {
          queryString += `?${params.join("&")}`;
        }

        return queryString;
      },
    }),

    verifyOTP: builder.mutation({
      query: (body) => ({
        url: "/otp/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Log"],
    }),
    resendOTP: builder.mutation({
      query: (body) => ({
        url: "/otp/resend",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Log"],
    }),
    updateNotification: builder.mutation({
      query: ({ id }) => ({
        url: `/institution/notifications/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Log"],
    }),
    mfaSwitch: builder.mutation({
      query: (body) => ({
        url: "/profile/mfa",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Log"],
    }),
    sendOTPForPasswordChange: builder.mutation({
      query: (body) => ({
        url: "/auth/send-password-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Log"],
    }),
    logoutUser: builder.mutation({
      query: (body) => ({
        url: "/auth/logout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Log"],
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Log"],
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Log"],
    }),
    createNextScreen: builder.mutation({
      query: (body) => ({
        url: "/institution/account-setup/next-step",
        method: "POST",
        body,
      }),
    }),
    createInstitutionUser: builder.mutation({
      query: (body) => ({
        url: "/institution/store-users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["InstitutionUser"],
    }),

    createDepartment: builder.mutation({
      query: (body) => ({
        url: "/institution/departments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Department"],
    }),

    createTicket: builder.mutation({
      query: (body) => ({
        url: "/tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Ticket", "Log"],
    }),

    createInstitutionSetup: builder.mutation({
      query: (body) => ({
        url: "/institution/account-setup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Institution", "Log"],
    }),
    createInstitutionDocumentType: builder.mutation({
      query: (body) => ({
        url: "/institution/document-types",
        method: "POST",
        body,
      }),
      invalidatesTags: ["DocumentType", "Log"],
    }),

    customizeDashboard: builder.mutation({
      query: (body) => ({
        url: "/institution/dashboard",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Log"],
    }),
    deleteDomentType: builder.mutation({
      query: ({ id }) => ({
        url: `/institution/document-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DocumentType", "Log"],
    }),
    deleteDepartment: builder.mutation({
      query: ({ id }) => ({
        url: `/institution/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department", "Log"],
    }),
    deleteInstitutionUser: builder.mutation({
      query: ({ id }) => ({
        url: `/institution/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InstitutionUser", "Log"],
    }),

    updateDocumentType: builder.mutation({
      query: ({ id, body }) => ({
        url: `/institution/document-types/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["DocumentType", "Log"],
    }),
    updateDepartment: builder.mutation({
      query: ({ id, body }) => ({
        url: `/institution/departments/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Department", "Log"],
    }),
    initiatePayment: builder.mutation({
      query: (body) => ({
        url: "/payments/initiate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payment", "Document", "Log"],
    }),

    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `/institution/update-user/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["InstitutionUser", "Log"],
    }),

    updateTicket: builder.mutation({
      query: ({ id, body }) => ({
        url: `/tickets/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Ticket", "Log"],
    }),

    changeRequestStatus: builder.mutation({
      query: ({ id, body }) => ({
        url: `/institution/requests/document-requests/${id}/status`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["DocumentRequest", "Log"],
    }),
    validateDocument: builder.mutation({
      query: (body) => ({
        url: "/institution/requests/verifications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Log"],
    }),
    completeAccountSetup: builder.mutation({
      query: () => ({
        url: "/institution/complete-setup",
        method: "POST",
      }),
      invalidatesTags: ["Institution"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          const user = JSON.parse(secureLocalStorage.getItem("user"));
          if (user) {
            const updatedUser = {
              ...user,
              institution: {
                ...user.institution,
                setup_done: true,
                current_step: "5",
              },
            };
            // Update local storage
            secureLocalStorage.setItem("user", JSON.stringify(updatedUser));
            // Update Redux store
            dispatch(setUser(updatedUser));
          }
        } catch (err) {
          console.error("Failed to complete account setup:", err);
        }
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useLogoutUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendOTPForPasswordChangeMutation,
  useChangePasswordMutation,
  useMfaSwitchMutation,
  useGetInstitutionDetailsQuery,
  useCreateTicketMutation,
  useCreateInstitutionSetupMutation,
  useGetInstitutionDocumentTypesQuery,
  useGetAllExistingDocumentTypesQuery,
  useCreateInstitutionDocumentTypeMutation,
  useCreateNextScreenMutation,
  useDeleteDomentTypeMutation,
  useUpdateDocumentTypeMutation,
  useGetInstitutionDepartmentsQuery,
  useGetAllPermissionsQuery,
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useUpdateDepartmentMutation,
  useGetInstitutionUsersQuery,
  useCreateInstitutionUserMutation,
  useDeleteInstitutionUserMutation,
  useUpdateUserMutation,
  useGetInstitutionDocumentRequestsQuery,
  useChangeRequestStatusMutation,
  useGetAllTicketsQuery,
  useUpdateTicketMutation,
  useGetDashboardAnalyticsQuery,
  useGetInstitutionRevenueQuery,
  useGetInstitutionReportsQuery,
  useGetInstitutionValidationReportsQuery,
  useGetInstitutionRevenueGraphQuery,
  useGetUserSystemLogsQuery,
  useGetRevenuePercentageQuery,
  useGetUserAffiliationQuery,
  useGetNonAcademicInstitutionTypesQuery,
  useGetFilteredInstitutionsQuery,
  useGetInstitutionDocumentsQuery,
  useInitiatePaymentMutation,
  useValidateDocumentMutation,
  useCustomizeDashboardMutation,
  useGetInstitutionValidationRequestsQuery,
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
  useGetInstitutionVerificationDataQuery,
  useGetInstitutionVericationRequestsSentQuery,
  useGetInstitutionVericationRequestsReceivedQuery,
  useCompleteAccountSetupMutation,
} = baccheckerApi;
