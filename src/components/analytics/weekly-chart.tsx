"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, PieChart as PieChartIcon } from "lucide-react";

interface DailyData {
  day: string;
  coding: number;
  study: number;
  total: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface AnalyticsChartsProps {
  dailyData: DailyData[];
  categoryData: CategoryData[];
}

export default function AnalyticsCharts({ dailyData, categoryData }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart - Daily Activity */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-500" />
            Daily Activity (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12, fill: '#888' }}
                  axisLine={{ stroke: 'rgba(128,128,128,0.2)' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#888' }}
                  axisLine={{ stroke: 'rgba(128,128,128,0.2)' }}
                  unit="h"
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 17, 17, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`${Number(value || 0).toFixed(1)}h`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="coding" name="Coding" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="study" name="Study" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart - Category Breakdown */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-purple-500" />
            Activity Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full flex items-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#888', strokeWidth: 1 }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 17, 17, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [`${Number(value || 0).toFixed(1)} hours`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full text-center text-gray-400 text-sm">
                No activity data to display yet. Start logging to see your breakdown.
              </div>
            )}
          </div>
          {/* Legend below */}
          {categoryData.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
