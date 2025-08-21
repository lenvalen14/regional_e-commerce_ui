import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { setCredentials, logout } from "@/features/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

      // Skip setting Content-Type for endpoints that need to send FormData
      const skipContentTypeEndpoints = ['createNews', 'createProduct', 'updateProduct']
      if (!skipContentTypeEndpoints.includes(endpoint)) {
        headers.set("Content-Type", "application/json")
      }
      return headers
    },
  });

  const baseQueryWithReauth: typeof rawBaseQuery = async (
    args,
    api,
    extraOptions
  ) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      const refreshToken = (api.getState() as RootState).auth.refreshToken;

      if (refreshToken) {
        const refreshResult: any = await rawBaseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          api.dispatch(
            setCredentials({
              token: refreshResult.data.token,
              refreshToken: refreshResult.data.refreshToken ?? refreshToken,
              user: (api.getState() as RootState).auth.user,
            })
          );
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } else {
        api.dispatch(logout());
      }
    }

    return result;
  };

  export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: [
      "Product",
      "Cart",
      "Order",
      "Users",
      "Auth",
      "Address",
      "Notification",
      "Region",
      "Category",
    ],
    endpoints: (builder) => ({}),
  });
