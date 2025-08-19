import { apiSlice } from '@/lib/api/apiSlice'

export interface AddressRequest {
  userId: string
  addressLine: string
  province: string
  phone: string
  isDefault?: boolean
}

export interface AddressResponse {
  addressId: string
  addressLine: string
  province: string
  phone: string
  isDefault: boolean
}

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
     getUserAddresses: builder.query<AddressResponse[], string>({
      query: (userId) => `/addresses/user/${userId}`,
    
      transformResponse: (response: { data: any[] }) => {
        if (response && Array.isArray(response.data)) {

          return response.data.map(address => ({
            ...address,
            isDefault: address.default
          }));
        }
        return [];
      },
      
      providesTags: (result = []) => 
        [
          ...result.map(({ addressId }) => ({ type: 'Address' as const, id: addressId })),
          { type: 'Address' as const, id: 'LIST' },
        ],
    }),

    // Create a new address
    createAddress: builder.mutation<AddressResponse, AddressRequest>({
      query: (body) => ({
        url: '/addresses',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Address', id: 'LIST' }],
    }),

    // Update address
    updateAddress: builder.mutation<AddressResponse, { addressId: string; data: Omit<AddressRequest, 'userId'> }>({
      query: ({ addressId, data }) => ({
        url: `/addresses/${addressId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Address', id: arg.addressId },
        { type: 'Address', id: 'LIST' },
      ],
    }),

    // Delete address
    deleteAddress: builder.mutation<{ success: boolean }, string>({
      query: (addressId) => ({
        url: `/addresses/${addressId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, addressId) => [
        { type: 'Address', id: addressId },
        { type: 'Address', id: 'LIST' },
      ],
    }),

    // Set default address
    setDefaultAddress: builder.mutation<{ success: boolean }, string>({
      query: (addressId) => ({
        url: `/addresses/${addressId}/default`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Address', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetUserAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = addressApi
