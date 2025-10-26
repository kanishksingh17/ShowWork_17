// Test version of AnalyticsDashboard to isolate 404 issues
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AnalyticsDashboardTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Analytics Dashboard Test
            </h1>
            <p className="text-gray-600">Testing basic functionality</p>
          </div>
        </div>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This is a test to see if the basic components are working.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboardTest;
