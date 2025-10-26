import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Search,
  Plus,
  X,
  Lightbulb,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  Package,
  BarChart3,
  Users,
  FolderOpen,
  Zap,
  Settings,
  CheckCircle,
  AlertCircle,
  Star,
  ExternalLink,
  Download,
  Share2,
  Eye,
  Edit3,
} from "lucide-react";

interface Technology {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  experience: string;
  projects: number;
  isRecommended: boolean;
}

interface TechnologyStackProps {
  onBackToDashboard?: () => void;
}

const TechnologyStack = ({ onBackToDashboard }: TechnologyStackProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTechnologies, setSelectedTechnologies] = useState<
    Technology[]
  >([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: "all", name: "All Technologies", icon: Code },
    { id: "frontend", name: "Frontend", icon: Code },
    { id: "backend", name: "Backend", icon: Code },
    { id: "database", name: "Database", icon: Code },
    { id: "mobile", name: "Mobile", icon: Code },
    { id: "devops", name: "DevOps", icon: Code },
    { id: "ai-ml", name: "AI/ML", icon: Code },
    { id: "tools", name: "Tools", icon: Code },
  ];

  const popularTechnologies: Technology[] = [
    {
      id: "1",
      name: "React",
      category: "frontend",
      proficiency: 90,
      experience: "3+ years",
      projects: 15,
      isRecommended: true,
    },
    {
      id: "2",
      name: "TypeScript",
      category: "frontend",
      proficiency: 85,
      experience: "2+ years",
      projects: 12,
      isRecommended: true,
    },
    {
      id: "3",
      name: "Node.js",
      category: "backend",
      proficiency: 80,
      experience: "2+ years",
      projects: 10,
      isRecommended: true,
    },
    {
      id: "4",
      name: "Python",
      category: "backend",
      proficiency: 75,
      experience: "1+ years",
      projects: 8,
      isRecommended: false,
    },
    {
      id: "5",
      name: "MongoDB",
      category: "database",
      proficiency: 70,
      experience: "1+ years",
      projects: 6,
      isRecommended: false,
    },
    {
      id: "6",
      name: "PostgreSQL",
      category: "database",
      proficiency: 65,
      experience: "1+ years",
      projects: 4,
      isRecommended: false,
    },
    {
      id: "7",
      name: "Docker",
      category: "devops",
      proficiency: 60,
      experience: "1+ years",
      projects: 3,
      isRecommended: false,
    },
    {
      id: "8",
      name: "AWS",
      category: "devops",
      proficiency: 55,
      experience: "6+ months",
      projects: 2,
      isRecommended: false,
    },
    {
      id: "9",
      name: "React Native",
      category: "mobile",
      proficiency: 70,
      experience: "1+ years",
      projects: 5,
      isRecommended: false,
    },
    {
      id: "10",
      name: "TensorFlow",
      category: "ai-ml",
      proficiency: 40,
      experience: "6+ months",
      projects: 1,
      isRecommended: false,
    },
  ];

  useEffect(() => {
    setTechnologies(popularTechnologies);
  }, []);

  const filteredTechnologies = technologies.filter((tech) => {
    const matchesSearch = tech.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || tech.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addTechnology = (tech: Technology) => {
    if (!selectedTechnologies.find((t) => t.id === tech.id)) {
      setSelectedTechnologies([...selectedTechnologies, tech]);
    }
  };

  const removeTechnology = (techId: string) => {
    setSelectedTechnologies(
      selectedTechnologies.filter((t) => t.id !== techId),
    );
  };

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 80) return "text-green-600";
    if (proficiency >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProficiencyBg = (proficiency: number) => {
    if (proficiency >= 80) return "bg-green-100";
    if (proficiency >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white flex flex-col rounded-xl shadow-lg m-4">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#1E3A8A] rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-mono text-sm font-bold">
              &lt;/&gt;
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white">ShowWork</h1>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </div>
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate("/showcase")}
          >
            <Package className="w-5 h-5 mr-3" />
            Showcase
          </div>
          <div className="flex items-center px-4 py-3 text-sm font-medium bg-[#1E3A8A] text-white rounded-lg shadow-sm">
            <Code className="w-5 h-5 mr-3" />
            Technology Stack
          </div>
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate("/analytics")}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </div>
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate("/community")}
          >
            <Users className="w-5 h-5 mr-3" />
            Community
          </div>
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate("/portfolio")}
          >
            <FolderOpen className="w-5 h-5 mr-3" />
            Portfolio
          </div>
          <div className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200">
            <Zap className="w-5 h-5 mr-3" />
            Integrations
          </div>
        </nav>

        <div className="px-4 py-2 border-t border-white/10">
          <div className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <nav className="text-sm text-gray-500 mb-1">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="hover:text-gray-700"
                >
                  Dashboard
                </button>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Technology Stack</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">
                Technology Stack
              </h1>
              <p className="text-sm text-gray-500">
                Manage your technology skills and expertise
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Stack
              </Button>
              <Button className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Search and Filter */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Technologies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search technologies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Selected Technologies */}
            {selectedTechnologies.length > 0 && (
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Selected Technologies ({selectedTechnologies.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedTechnologies.map((tech) => (
                      <Badge
                        key={tech.id}
                        variant="secondary"
                        className="flex items-center gap-2 px-3 py-2"
                      >
                        <span className="font-medium">{tech.name}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getProficiencyBg(tech.proficiency)} ${getProficiencyColor(tech.proficiency)}`}
                        >
                          {tech.proficiency}%
                        </span>
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => removeTechnology(tech.id)}
                        />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommended Technologies */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Recommended Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800 mb-4">
                  Based on your profile and current trends, here are some
                  technologies you might want to explore:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {technologies
                    .filter((tech) => tech.isRecommended)
                    .map((tech) => (
                      <div
                        key={tech.id}
                        className="bg-white rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {tech.name}
                          </h4>
                          <Star className="w-4 h-4 text-yellow-500" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Proficiency</span>
                            <span
                              className={`font-medium ${getProficiencyColor(tech.proficiency)}`}
                            >
                              {tech.proficiency}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${tech.proficiency >= 80 ? "bg-green-500" : tech.proficiency >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                              style={{ width: `${tech.proficiency}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{tech.experience}</span>
                            <span>{tech.projects} projects</span>
                          </div>
                          <Button
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => addTechnology(tech)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add to Stack
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* All Technologies */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  All Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTechnologies.map((tech) => (
                    <div
                      key={tech.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {tech.name}
                        </h4>
                        {tech.isRecommended && (
                          <Star className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Proficiency</span>
                          <span
                            className={`font-medium ${getProficiencyColor(tech.proficiency)}`}
                          >
                            {tech.proficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${tech.proficiency >= 80 ? "bg-green-500" : tech.proficiency >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ width: `${tech.proficiency}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{tech.experience}</span>
                          <span>{tech.projects} projects</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => addTechnology(tech)}
                          disabled={selectedTechnologies.some(
                            (t) => t.id === tech.id,
                          )}
                        >
                          {selectedTechnologies.some(
                            (t) => t.id === tech.id,
                          ) ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 mr-1" />
                              Add to Stack
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technology Categories */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Technology Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.slice(1).map((category) => {
                    const Icon = category.icon;
                    const categoryTechs = technologies.filter(
                      (tech) => tech.category === category.id,
                    );
                    const selectedCategoryTechs = selectedTechnologies.filter(
                      (tech) => tech.category === category.id,
                    );

                    return (
                      <div
                        key={category.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <h4 className="font-medium text-gray-900">
                            {category.name}
                          </h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Selected</span>
                            <span className="font-medium text-[#1E3A8A]">
                              {selectedCategoryTechs.length}/
                              {categoryTechs.length}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#1E3A8A] h-2 rounded-full"
                              style={{
                                width: `${(selectedCategoryTechs.length / categoryTechs.length) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {selectedCategoryTechs.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {selectedCategoryTechs.map((tech) => (
                                  <span
                                    key={tech.id}
                                    className="bg-[#1E3A8A] text-white px-2 py-1 rounded text-xs"
                                  >
                                    {tech.name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              "No technologies selected"
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project Info
            </Button>
            <div className="flex gap-3">
              <Button variant="outline">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Stack
              </Button>
              <Button className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TechnologyStack;
