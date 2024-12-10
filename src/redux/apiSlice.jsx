import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

export const baccheckerApi = createApi({
  reducerPath: "baccheckerApi",
  baseQuery: async (args, api, extraOptions) => {
    const token = JSON?.parse(secureLocalStorage?.getItem("userToken"))?.token;

    const result = await fetchBaseQuery({
      baseUrl: "https://backend.baccheck.online/api",
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
      query: ({ page }) => {
        let queryString = `/institution/departments?page=${page}`;
        return queryString;
      },
      providesTags: ["Department"],
    }),
    getInstitutionDocumentTypes: builder.query({
      query: () => "",
      providesTags: ["DocumentType"],
    }),

    getInstitutionDocumentTypes: builder.query({
      query: ({ page }) => {
        let queryString = `/institution/document-types?page=${page}`;
        return queryString;
      },
      providesTags: ["DocumentType"],
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
    updateDocumentType: builder.mutation({
      query: ({ id, body }) => ({
        url: `/institution/document-types/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["DocumentType"],
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
} = baccheckerApi;
