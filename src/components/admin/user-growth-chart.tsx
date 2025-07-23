"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", users: 400 },
  { month: "Feb", users: 300 },
  { month: "Mar", users: 500 },
  { month: "Apr", users: 450 },
  { month: "May", users: 600 },
  { month: "Jun", users: 550 },
  { month: "Jul", users: 700 },
];

export function UserGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month" 
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey="users" 
          stroke="#82ca9d" 
          fill="#82ca9d"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}