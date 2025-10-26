import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UnifiedSidebar } from "../components/UnifiedSidebar";
import { Plug, Github, Linkedin, Twitter, Settings } from "lucide-react";

export default function Integrations() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedSidebar currentPage="integrations" />

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Integrations
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Connect your accounts and services
              </p>
            </div>
          </div>

          {/* Integration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">GitHub</h3>
                      <p className="text-sm text-gray-600">
                        Connect your repositories
                      </p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Automatically sync your GitHub projects and contributions
                </p>
                <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                  Configure
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">LinkedIn</h3>
                      <p className="text-sm text-gray-600">
                        Share your projects
                      </p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Connect your LinkedIn account to share content
                </p>
                <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Connect
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                      <Twitter className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Twitter</h3>
                      <p className="text-sm text-gray-600">
                        Tweet your updates
                      </p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Share your projects and updates on Twitter
                </p>
                <button className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Connect
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Custom API</h3>
                      <p className="text-sm text-gray-600">
                        Add your own integrations
                      </p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Connect custom APIs and webhooks
                </p>
                <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                  Configure
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
