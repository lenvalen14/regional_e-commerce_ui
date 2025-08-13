"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Package, DollarSign, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data for the chart
const salesData = [
  { name: "1k", value: 20 },
  { name: "5k", value: 45 },
  { name: "10k", value: 35 },
  { name: "15k", value: 60 },
  { name: "20k", value: 85 },
  { name: "25k", value: 75 },
  { name: "30k", value: 90 },
  { name: "35k", value: 65 },
  { name: "40k", value: 80 },
  { name: "45k", value: 70 },
  { name: "50k", value: 85 },
  { name: "55k", value: 75 },
  { name: "60k", value: 80 },
]

// Sample deals data
const dealsData = [
  {
    id: 1,
    product: "Apple Watch",
    location: "6096 Marjolaine Landing",
    dateTime: "12.09.2019 - 12:53 PM",
    piece: 423,
    amount: "$34,295",
    status: "Delivered",
  },
  {
    id: 2,
    product: "Apple Watch",
    location: "6096 Marjolaine Landing",
    dateTime: "12.09.2019 - 12:53 PM",
    piece: 423,
    amount: "$34,295",
    status: "Pending",
  },
  {
    id: 3,
    product: "Apple Watch",
    location: "6096 Marjolaine Landing",
    dateTime: "12.09.2019 - 12:53 PM",
    piece: 423,
    amount: "$34,295",
    status: "Rejected",
  },
]

// Sample customers data
const customersData = [
  { name: "ByeWind", avatar: "BW", color: "bg-blue-500" },
  { name: "Natali Craig", avatar: "NC", color: "bg-green-500" },
  { name: "Drew Cano", avatar: "DC", color: "bg-purple-500" },
  { name: "Orlando Diggs", avatar: "OD", color: "bg-orange-500" },
  { name: "Andi Lane", avatar: "AL", color: "bg-pink-500" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total User</p>
                <p className="text-2xl font-bold text-blue-900 mt-2">40,689</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">8.5% Up from yesterday</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Total Order</p>
                <p className="text-2xl font-bold text-yellow-900 mt-2">10,293</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">1.3% Up from past week</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-500 rounded-full">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Sales</p>
                <p className="text-2xl font-bold text-green-900 mt-2">$89,000</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-600">4.3% Down from yesterday</span>
                </div>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Total Pending</p>
                <p className="text-2xl font-bold text-red-900 mt-2">2,040</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">1.8% Up from yesterday</span>
                </div>
              </div>
              <div className="p-3 bg-red-500 rounded-full">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Pending</p>
                <p className="text-2xl font-bold text-purple-900 mt-2">2,040</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">1.8% Up from yesterday</span>
                </div>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Customer List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Sales Details</CardTitle>
            <Button variant="outline" size="sm">
              October
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Khách Hàng Của Tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customersData.map((customer, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${customer.color} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-sm font-medium">{customer.avatar}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{customer.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deals Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Deals Details</CardTitle>
          <Button variant="outline" size="sm">
            October
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Product Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date - Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Piece</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {dealsData.map((deal) => (
                  <tr key={deal.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="font-medium">{deal.product}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{deal.location}</td>
                    <td className="py-3 px-4 text-gray-600">{deal.dateTime}</td>
                    <td className="py-3 px-4 text-gray-600">{deal.piece}</td>
                    <td className="py-3 px-4 font-medium">{deal.amount}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          deal.status === "Delivered"
                            ? "default"
                            : deal.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className={
                          deal.status === "Delivered"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : deal.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {deal.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
