import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

export const baccheckerApi = createApi({
  reducerPath: "baccheckerApi",
  baseQuery: async (args, api, extraOptions) => {
    const token = JSON?.parse(secureLocalStorage?.getItem("userToken"))?.token;

    const result = await fetchBaseQuery({
      baseUrl: "http://admin-dev.baccheck.online/api",
      // baseUrl: "http://aw8kkg8ck48040oc4cgo44so.67.205.158.15.sslip.io/api",

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
  refetchOnFocus: true,
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
    getInstitutionDetails: builder.query({
      query: () => "/institution/institution-data",
      providesTags: ["Institution"],
    }),
    getAllPermissions: builder.query({
      query: () => "/institution/institution-permissions",
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
    changePassword: builder.mutation({
      query: (body) => ({
        url: "/change-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Log"],
    }),
    mfaSwitch: builder.mutation({
      query: (body) => ({
        url: "/mfa-switch",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Log"],
    }),
    sendOTPForPasswordChange: builder.mutation({
      query: (body) => ({
        url: "/send-password-otp",
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
      // invalidatesTags: ["User", "Log"],
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
      invalidatesTags: ["Ticket"],
    }),
    createInstitutionSetup: builder.mutation({
      query: (body) => ({
        url: "/institution/account-setup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Institution"],
    }),
    createInstitutionDocumentType: builder.mutation({
      query: (body) => ({
        url: "/institution/document-types",
        method: "POST",
        body,
      }),
      invalidatesTags: ["DocumentType"],
    }),
    deleteDomentType: builder.mutation({
      query: ({ id }) => ({
        url: `/institution/document-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DocumentType"],
    }),
    deleteDepartment: builder.mutation({
      query: ({ id }) => ({
        url: `/institution/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department"],
    }),
    deleteInstitutionUser: builder.mutation({
      query: ({ id }) => ({
        url: `/institution/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InstitutionUser"],
    }),

    updateDocumentType: builder.mutation({
      query: ({ id, body }) => ({
        url: `/institution/document-types/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["DocumentType"],
    }),
    updateDepartment: builder.mutation({
      query: ({ id, body }) => ({
        url: `/institution/departments/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Department"],
    }),

    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `/institution/update-user/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["InstitutionUser"],
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
} = baccheckerApi;
