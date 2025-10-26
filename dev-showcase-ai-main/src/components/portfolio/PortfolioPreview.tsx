import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Eye,
  Download,
  Share2,
  Edit,
  Globe,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";
import { UserPortfolio } from "../../types/portfolio";

interface PortfolioPreviewProps {
  portfolio: UserPortfolio;
  onEdit?: () => void;
  onPublish?: () => void;
}

export const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({
  portfolio,
  onEdit,
  onPublish,
}) => {
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getDeviceStyles = () => {
    switch (deviceView) {
      case "mobile":
        return { width: "375px", height: "667px" };
      case "tablet":
        return { width: "768px", height: "1024px" };
      default:
        return { width: "100%", height: "100vh" };
    }
  };

  const renderPortfolioContent = () => {
    return (
      <div className="bg-white min-h-screen" style={getDeviceStyles()}>
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">John Doe</h1>
            <p className="text-xl mb-6">Full Stack Developer</p>
            <p className="text-lg opacity-90">
              Passionate developer with 5 years of experience building scalable
              web applications
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                React
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Node.js
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                TypeScript
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Python
              </Badge>
            </div>
          </div>
        </header>

        {/* About Section */}
        <section className="py-16 px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">About Me</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              I'm a passionate full-stack developer with 5 years of experience
              building scalable web applications. I specialize in React,
              Node.js, and modern JavaScript frameworks. I love creating
              user-friendly interfaces and robust backend systems that solve
              real-world problems.
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-16 px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>E-commerce Platform</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Full-stack e-commerce solution built with React and Node.js.
                    Features include user authentication, payment processing,
                    and inventory management.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">Node.js</Badge>
                    <Badge variant="outline">MongoDB</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Task Management App</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Collaborative task management tool with real-time updates.
                    Built with React, Socket.io, and Express for seamless team
                    collaboration.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">Socket.io</Badge>
                    <Badge variant="outline">Express</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-16 px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Skills & Technologies</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="text-xl font-semibold mb-4">Frontend</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>React</span>
                    <span className="text-gray-500">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between">
                    <span>TypeScript</span>
                    <span className="text-gray-500">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Backend</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Node.js</span>
                    <span className="text-gray-500">88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "88%" }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between">
                    <span>Python</span>
                    <span className="text-gray-500">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Tools</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Git</span>
                    <span className="text-gray-500">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between">
                    <span>Docker</span>
                    <span className="text-gray-500">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
            <p className="text-lg text-gray-700 mb-8">
              I'm always interested in new opportunities and exciting projects.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" variant="outline">
                <Mail className="h-5 w-5 mr-2" />
                john@example.com
              </Button>
              <Button size="lg" variant="outline">
                <Linkedin className="h-5 w-5 mr-2" />
                LinkedIn
              </Button>
              <Button size="lg" variant="outline">
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Portfolio Preview
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button size="sm" onClick={onPublish}>
                <Share2 className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Device Preview:</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={deviceView === "desktop" ? "default" : "outline"}
                  onClick={() => setDeviceView("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={deviceView === "tablet" ? "default" : "outline"}
                  onClick={() => setDeviceView("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={deviceView === "mobile" ? "default" : "outline"}
                  onClick={() => setDeviceView("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Preview */}
      <div
        className={`border rounded-lg overflow-hidden ${isFullscreen ? "fixed inset-0 z-50 bg-white" : ""}`}
      >
        <div className="bg-gray-100 p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-4 text-sm text-gray-600">
              Portfolio Preview
            </span>
          </div>
        </div>
        <div className="bg-gray-50 p-4">
          <div
            className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${isFullscreen ? "" : "max-h-[80vh] overflow-y-auto"}`}
          >
            {renderPortfolioContent()}
          </div>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">95%</div>
            <div className="text-sm text-gray-600">ATS Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">4.8/5</div>
            <div className="text-sm text-gray-600">User Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">2.1s</div>
            <div className="text-sm text-gray-600">Load Time</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
