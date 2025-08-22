"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Package, DollarSign, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Order, useGetOverviewStatsQuery, useGetRevenueStatsQuery } from "@/features/stats/statsApi"

export default function DashboardPage() {
  const { data: overview, isLoading: loadingOverview, isError: errorOverview } = useGetOverviewStatsQuery()
  const { data: revenueStats, isLoading: loadingRevenue, isError: errorRevenue } = useGetRevenueStatsQuery()

  if (loadingOverview || loadingRevenue) {
    return <div className="p-6">Đang tải dữ liệu...</div>
  }

  if (errorOverview || errorRevenue || !overview || !revenueStats) {
    return <div className="p-6">Không thể tải dữ liệu</div>
  }

  const stats = overview
  const revenues = revenueStats.revenues || []
  const recentOrders = revenueStats.recentOrders || []

  // Chuyển đổi revenue sang data cho chart
  const chartData = revenues.map((r: any) => ({
    name: `${r.month}/${r.year}`,
    value: r.total
  }))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hoạt động kinh doanh</p>
        </div>
        <Button>Xuất báo cáo</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tổng người dùng */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.value.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.totalUsers.change >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {stats.totalUsers.change} {stats.totalUsers.unit}
            </div>
          </CardContent>
        </Card>

        {/* Tổng sản phẩm */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts.value.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.totalProducts.change >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {stats.totalProducts.change} {stats.totalProducts.unit}
            </div>
          </CardContent>
        </Card>

        {/* Doanh thu */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₫{stats.totalRevenue.value.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.totalRevenue.change >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {stats.totalRevenue.change} {stats.totalRevenue.unit}
            </div>
          </CardContent>
        </Card>

        {/* Đơn hàng chờ */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng chờ</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.pendingOrders.change >= 0 ? (
                <TrendingUp className="h-3 w-3 text-orange-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {stats.pendingOrders.change} {stats.pendingOrders.unit}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo thời gian</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500">Không có đơn hàng gần đây</p>
              ) : (
                recentOrders.map((order: Order) => (
                  <div key={order.orderId} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">#{order.orderId}</div>
                      <div className="text-sm text-gray-600">{order.user.userName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₫{order.totalAmount.toLocaleString()}</div>
                      <Badge
                        variant={
                          order.status === "COMPLETED"
                            ? "default"
                            : order.status === "PROCESSING"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {order.status === "COMPLETED"
                          ? "Hoàn thành"
                          : order.status === "PROCESSING"
                          ? "Đang xử lý"
                          : "Chờ xử lý"}
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
  )
}
