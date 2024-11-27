import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

export const baccheckerApi = createApi({
  reducerPath: "baccheckerApi",
  baseQuery: async (args, api, extraOptions) => {
    const token = JSON?.parse(secureLocalStorage?.getItem("user"))?.token;

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
  tagTypes: ["User", "Log", "Institution", "Ticket"],
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
    createTicket: builder.mutation({
      query: (body) => ({
        url: "/tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Ticket"],
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
} = baccheckerApi;
