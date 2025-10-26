import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Sparkles, Zap, Target, Users } from "lucide-react";

export default function ManualProjectShowcase() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "Gamified Experience",
      description:
        "Particle effects, progress animations, and auto-advance functionality make project creation engaging and fun.",
    },
    {
      icon: Target,
      title: "Step-by-Step Guidance",
      description:
        "Clear progression through 6 sections: Project Info, Media & Demo, Tech Stack, Features, Team, and SEO Settings.",
    },
    {
      icon: Zap,
      title: "Auto-Advance Logic",
      description:
        "Smart form completion that automatically moves to the next section when requirements are met.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Easy team member management with email-based invitations and role assignments.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/showcase")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Showcase
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Manual Project Form
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Experience the new gamified project creation flow
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Key Features
            </h2>
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                        <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Demo Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Try It Out
            </h2>
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Interactive Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-blue-100">
                  Experience the full gamified project creation flow with:
                </p>
                <ul className="space-y-2 text-blue-100">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    Particle effects on completion
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    Auto-advance between sections
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    Live preview updates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    Command palette shortcuts
                  </li>
                </ul>
                <Button
                  onClick={() => navigate("/showcase/manual-add")}
                  className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Launch Manual Project Form
                </Button>
              </CardContent>
            </Card>

            {/* Technical Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Technical Implementation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    React Components
                  </span>
                  <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    TypeScript
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Styling
                  </span>
                  <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    Tailwind CSS
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Animations
                  </span>
                  <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    CSS + React
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    State Management
                  </span>
                  <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    React Hooks
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Built with ❤️ using React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
