"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Package, DollarSign, Clock, TrendingUp, TrendingDown, Download, Calendar } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Order, useGetOverviewStatsQuery, useGetRevenueStatsQuery } from "@/features/stats/statsApi"

export default function DashboardPage() {
  const { data: overview, isLoading: loadingOverview, isError: errorOverview } = useGetOverviewStatsQuery()
  const { data: revenueStats, isLoading: loadingRevenue, isError: errorRevenue } = useGetRevenueStatsQuery()

  if (loadingOverview || loadingRevenue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-slate-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    )
  }

  if (errorOverview || errorRevenue || !overview || !revenueStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-6xl text-red-300 mb-4">⚠️</div>
            <p className="text-lg font-medium text-slate-700">Không thể tải dữ liệu</p>
            <p className="text-slate-500 mt-2">Vui lòng thử lại sau</p>
          </div>
        </div>
      </div>
    )
  }

  const stats = overview
  const revenues = revenueStats.revenues || []
  const recentOrders = revenueStats.recentOrders || []

  // Chuyển đổi revenue sang data cho chart với gradient colors
  const chartData = revenues.map((r: any) => ({
    name: `T${r.month}/${r.year}`,
    value: r.total,
    month: r.month,
    year: r.year
  }))

  // Custom tooltip cho chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-lg backdrop-blur-sm">
          <p className="font-semibold text-slate-700">{`Tháng ${label}`}</p>
          <p className="text-emerald-600 font-bold">
            {`Doanh thu: ₫${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      )
    }
    return null
  }

  // Tính toán tổng doanh thu và xu hướng
  const totalChartRevenue = chartData.reduce((sum, item) => sum + item.value, 0)
  const avgMonthlyRevenue = chartData.length > 0 ? totalChartRevenue / chartData.length : 0

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Enhanced Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                </div>
                <p className="text-lg text-slate-600 font-medium">
                  Tổng quan hoạt động kinh doanh hôm nay
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tổng người dùng */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">Tổng người dùng</CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 mb-2">
                {stats.totalUsers.value.toLocaleString()}
              </div>
              <div className="flex items-center text-sm">
                {stats.totalUsers.change >= 0 ? (
                  <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{stats.totalUsers.change} {stats.totalUsers.unit}
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {stats.totalUsers.change} {stats.totalUsers.unit}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tổng sản phẩm */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">Tổng sản phẩm</CardTitle>
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Package className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 mb-2">
                {stats.totalProducts.value.toLocaleString()}
              </div>
              <div className="flex items-center text-sm">
                {stats.totalProducts.change >= 0 ? (
                  <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{stats.totalProducts.change} {stats.totalProducts.unit}
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {stats.totalProducts.change} {stats.totalProducts.unit}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Doanh thu */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">Doanh thu tháng</CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 mb-2">
                ₫{stats.totalRevenue.value.toLocaleString()}
              </div>
              <div className="flex items-center text-sm">
                {stats.totalRevenue.change >= 0 ? (
                  <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{stats.totalRevenue.change} {stats.totalRevenue.unit}
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {stats.totalRevenue.change} {stats.totalRevenue.unit}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Đơn hàng chờ */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">Đơn hàng chờ</CardTitle>
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 mb-2">
                {stats.pendingOrders.value}
              </div>
              <div className="flex items-center text-sm">
                {stats.pendingOrders.change >= 0 ? (
                  <div className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{stats.pendingOrders.change} {stats.pendingOrders.unit}
                  </div>
                ) : (
                  <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {stats.pendingOrders.change} {stats.pendingOrders.unit}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Charts and Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Sales Chart */}
          <Card className="xl:col-span-2 bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800">Doanh thu theo thời gian</CardTitle>
                  <p className="text-slate-500 mt-1">Biểu đồ phân tích xu hướng doanh thu</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-700">
                    ₫{avgMonthlyRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-500">TB/tháng</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="50%" stopColor="#10b981" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `₫${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2, fill: "#fff" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Enhanced Recent Orders */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800">Đơn hàng gần đây</CardTitle>
              <p className="text-slate-500">Hoạt động mới nhất</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl text-slate-300 mb-4">📦</div>
                    <p className="text-slate-500 font-medium">Không có đơn hàng gần đây</p>
                    <p className="text-sm text-slate-400 mt-1">Dữ liệu sẽ xuất hiện khi có đơn hàng mới</p>
                  </div>
                ) : (
                  recentOrders.map((order: Order, index: number) => (
                    <div 
                      key={order.orderId} 
                      className="group flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/50 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">#{order.orderId}</div>
                          <div className="text-sm text-slate-600 font-medium">{order.user.userName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-slate-800 mb-1">
                          ₫{order.totalAmount.toLocaleString()}
                        </div>
                        <Badge
                          variant={
                            order.status === "COMPLETED"
                              ? "default"
                              : order.status === "PROCESSING"
                              ? "secondary"
                              : "outline"
                          }
                          className={`
                            font-medium transition-colors
                            ${order.status === "COMPLETED" 
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                              : order.status === "PROCESSING"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-300"
                            }
                          `}
                        >
                          {order.status === "COMPLETED"
                            ? "✅ Hoàn thành"
                            : order.status === "PROCESSING"
                            ? "⚡ Đang xử lý"
                            : "⏳ Chờ xử lý"}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}