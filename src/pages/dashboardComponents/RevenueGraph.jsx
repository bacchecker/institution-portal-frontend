import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Month names
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const RevenueGraph = ({ revenueGraph }) => {
  const data = revenueGraph?.data || [];

  // Prepare the data for the area chart
  const chartData = monthNames.map((month, index) => {
    const monthData = data.find((item) => item.month === index + 1);
    return {
      name: month,
      revenue: monthData ? parseFloat(monthData.total_revenue) : 0,
    };
  });

  return (
    <div>
      <div className="pt-[1vw] pb-[2vw] pl-[1vw]">
        <h2 className="text-[1.2vw] font-[600]">Monthly Revenue</h2>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ fontSize: "14px" }}/>
          <Legend />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#ff0404"
            fill="#ff0404"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueGraph;
