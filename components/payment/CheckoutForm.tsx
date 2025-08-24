'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { CreditCard, MapPin, User, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useGetUserAddressesQuery, useCreateAddressMutation } from "@/features/address/addressApi";
import { useCreateOrderMutation } from "@/features/order/orderApi";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AddAddressModal from "../../components/profile/AddAddressModal";
import { AddressResponse } from "../../features/address/addressApi";

export function CheckoutForm() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { state, clearCart } = useCart();
  const router = useRouter();

  // API hooks
  const { data: addressesData, isLoading: addressesLoading, refetch } =
    useGetUserAddressesQuery(user?.userId || "", { skip: !user?.userId });
  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();
  const [createAddress] = useCreateAddressMutation();

  const [formData, setFormData] = useState({
    addressId: "",
    paymentMethod: "CASH" as "CASH" | "VNPAY",
    note: "",
  });

  const [showAddressForm, setShowAddressForm] = useState(false);

  // Set default address khi load xong
  useEffect(() => {
    if (addressesData && addressesData.length > 0) {
      const defaultAddress = addressesData.find((addr) => addr.isDefault);
      if (defaultAddress && !formData.addressId) {
        setFormData((prev) => ({
          ...prev,
          addressId: defaultAddress.addressId,
        }));
      }
    }
  }, [addressesData, formData.addressId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm thêm địa chỉ mới
  const handleAddAddress = async (
    payload: Omit<AddressResponse, "addressId">
  ) => {
    if (!user?.userId) return;
    try {
      await createAddress({ ...payload, userId: user.userId }).unwrap();
      setShowAddressForm(false);
      toast.success("Thêm địa chỉ thành công!");
      await refetch();
    } catch (e) {
      console.error(e);
      toast.error("Không thể thêm địa chỉ");
    }
  };

  // Submit đơn hàng
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.addressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    const cartItemsId = state.items
      .map((item) => item.cartItemId)
      .filter((id) => id) as string[];

    if (cartItemsId.length === 0) {
      toast.error("Không tìm thấy cartItemId. Vui lòng thử lại!");
      return;
    }

    try {
      const result = await createOrder({
        addressId: formData.addressId,
        method: formData.paymentMethod,
        cartItemsId: cartItemsId,
      }).unwrap();

      // Nếu VNPAY thì gọi API lấy link thanh toán
      if (formData.paymentMethod === "VNPAY") {
        const orderId = result.data.orderId;
        const amount = result.data.totalAmount;

        const paymentApi = `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1"
        }/payment/vn-pay?amount=${amount}&bankCode=NCB&method=VNPAY&orderId=${orderId}`;

        // 👉 Lấy token từ Redux store hoặc localStorage
        const token = localStorage.getItem("token");

        const paymentRes = await axios.get(paymentApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const paymentUrl = paymentRes?.data?.data?.paymentUrl;

        if (paymentUrl) {
          clearCart();
          window.location.href = paymentUrl;
          return;
        } else {
          toast.error("Không lấy được link thanh toán VNPAY. Vui lòng thử lại!");
          return;
        }
      }

      // Nếu là CASH
      clearCart();
      router.push(`/orders/${result.data.orderId}`);
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Thông tin người nhận */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-[#8FBC8F]" />
            <h2 className="text-xl font-beaululo text-[#2F3E34] tracking-wider">
              THÔNG TIN NGƯỜI NHẬN
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-nitti mb-2">Họ và tên</label>
              <input
                type="text"
                value={user?.userName || ""}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-nitti mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value=""
                disabled
                placeholder="Chưa cập nhật"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-nitti mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Địa chỉ giao hàng */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#8FBC8F]" />
              <h2 className="text-xl font-beaululo text-[#2F3E34] tracking-wider">
                ĐỊA CHỈ GIAO HÀNG
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowAddressForm(true)}
              className="flex items-center gap-2 text-[#8FBC8F] hover:text-[#7CA87C] font-nitti text-sm"
            >
              <Plus className="w-4 h-4" />
              Thêm địa chỉ mới
            </button>
          </div>

          {addressesLoading ? (
            <p className="text-center text-gray-600">Đang tải địa chỉ...</p>
          ) : (
            <div className="space-y-3">
              {addressesData && addressesData.length > 0 ? (
                addressesData.map((address) => (
                  <label
                    key={address.addressId}
                    className="flex items-start p-4 border rounded-md cursor-pointer hover:border-[#8FBC8F]"
                  >
                    <input
                      type="radio"
                      name="addressId"
                      value={address.addressId}
                      checked={formData.addressId === address.addressId}
                      onChange={handleInputChange}
                      className="mr-3 mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-nitti font-medium">
                        {address.addressLine}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {address.province}
                      </div>
                      <div className="text-sm text-gray-600">
                        SĐT: {address.phone}
                      </div>
                      {address.isDefault && (
                        <span className="inline-block mt-2 px-2 py-1 bg-[#8FBC8F] text-white text-xs rounded">
                          Mặc định
                        </span>
                      )}
                    </div>
                  </label>
                ))
              ) : (
                <div className="text-center">
                  <p className="mb-4 text-gray-600">
                    Bạn chưa có địa chỉ giao hàng nào
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="bg-[#8FBC8F] hover:bg-[#7CA87C] text-white px-4 py-2 rounded-md"
                  >
                    Thêm địa chỉ
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Ghi chú */}
          <div className="mt-6">
            <label className="block text-sm font-nitti mb-2">
              Ghi chú đơn hàng
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#8FBC8F]"
              placeholder="Ghi chú cho người giao hàng (không bắt buộc)"
            />
          </div>
        </div>

        {/* Thanh toán */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-5 h-5 text-[#8FBC8F]" />
            <h2 className="text-xl font-beaululo text-[#2F3E34] tracking-wider">
              PHƯƠNG THỨC THANH TOÁN
            </h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center p-4 border rounded-md cursor-pointer hover:border-[#8FBC8F]">
              <input
                type="radio"
                name="paymentMethod"
                value="CASH"
                checked={formData.paymentMethod === "CASH"}
                onChange={handleInputChange}
                className="mr-3"
              />
              <div>
                <div className="font-nitti font-medium">
                  Thanh toán khi nhận hàng (COD)
                </div>
                <div className="text-sm text-gray-600">
                  Thanh toán bằng tiền mặt khi nhận hàng
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border rounded-md cursor-pointer hover:border-[#8FBC8F]">
              <input
                type="radio"
                name="paymentMethod"
                value="VNPAY"
                checked={formData.paymentMethod === "VNPAY"}
                onChange={handleInputChange}
                className="mr-3"
              />
              <div>
                <div className="font-nitti font-medium">Thanh toán qua VNPay</div>
                <div className="text-sm text-gray-600">
                  Thanh toán trực tuyến qua VNPay
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <button
            type="submit"
            disabled={creatingOrder || !formData.addressId}
            className="w-full bg-[#8FBC8F] hover:bg-[#7CA87C] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-full font-bold text-lg"
          >
            {creatingOrder ? "ĐANG ĐẶT HÀNG..." : "ĐẶT HÀNG NGAY"}
          </button>
        </div>
      </form>

      {/* Modal thêm địa chỉ */}
      <AddAddressModal
        isOpen={showAddressForm}
        onClose={() => setShowAddressForm(false)}
        onSubmit={handleAddAddress}
        loading={false}
      />
    </>
  );
}
