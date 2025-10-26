// Technology Selector Component - Searchable tech stack picker

import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Plus,
  X,
  Star,
  TrendingUp,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Technology } from "@/types/project";

interface TechnologySelectorProps {
  selectedTechnologies: Technology[];
  onTechnologiesChange: (technologies: Technology[]) => void;
  onError?: (error: string) => void;
  className?: string;
}

// Mock technology data
const MOCK_TECHNOLOGIES: Technology[] = [
  // Frontend
  {
    id: "react",
    name: "React",
    category: "Frontend",
    proficiency: 85,
    experience: "3+ years",
    projects: 12,
    isRecommended: true,
    icon: "⚛️",
    color: "#61dafb",
  },
  {
    id: "vue",
    name: "Vue.js",
    category: "Frontend",
    proficiency: 70,
    experience: "2+ years",
    projects: 8,
    isRecommended: true,
    icon: "💚",
    color: "#4fc08d",
  },
  {
    id: "angular",
    name: "Angular",
    category: "Frontend",
    proficiency: 60,
    experience: "1+ years",
    projects: 5,
    isRecommended: false,
    icon: "🅰️",
    color: "#dd0031",
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "Frontend",
    proficiency: 80,
    experience: "2+ years",
    projects: 10,
    isRecommended: true,
    icon: "▲",
    color: "#000000",
  },
  {
    id: "nuxt",
    name: "Nuxt.js",
    category: "Frontend",
    proficiency: 65,
    experience: "1+ years",
    projects: 6,
    isRecommended: false,
    icon: "💚",
    color: "#00c58e",
  },

  // Backend
  {
    id: "nodejs",
    name: "Node.js",
    category: "Backend",
    proficiency: 90,
    experience: "4+ years",
    projects: 15,
    isRecommended: true,
    icon: "🟢",
    color: "#339933",
  },
  {
    id: "python",
    name: "Python",
    category: "Backend",
    proficiency: 75,
    experience: "3+ years",
    projects: 11,
    isRecommended: true,
    icon: "🐍",
    color: "#3776ab",
  },
  {
    id: "java",
    name: "Java",
    category: "Backend",
    proficiency: 70,
    experience: "2+ years",
    projects: 9,
    isRecommended: false,
    icon: "☕",
    color: "#007396",
  },
  {
    id: "go",
    name: "Go",
    category: "Backend",
    proficiency: 60,
    experience: "1+ years",
    projects: 4,
    isRecommended: false,
    icon: "🐹",
    color: "#00add8",
  },
  {
    id: "rust",
    name: "Rust",
    category: "Backend",
    proficiency: 45,
    experience: "< 1 year",
    projects: 2,
    isRecommended: false,
    icon: "🦀",
    color: "#000000",
  },

  // Database
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Database",
    proficiency: 85,
    experience: "3+ years",
    projects: 12,
    isRecommended: true,
    icon: "🐘",
    color: "#336791",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "Database",
    proficiency: 80,
    experience: "3+ years",
    projects: 10,
    isRecommended: true,
    icon: "🍃",
    color: "#47a248",
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "Database",
    proficiency: 70,
    experience: "2+ years",
    projects: 8,
    isRecommended: false,
    icon: "🐬",
    color: "#4479a1",
  },
  {
    id: "redis",
    name: "Redis",
    category: "Database",
    proficiency: 65,
    experience: "2+ years",
    projects: 6,
    isRecommended: false,
    icon: "🔴",
    color: "#dc382d",
  },

  // Cloud & DevOps
  {
    id: "aws",
    name: "AWS",
    category: "Cloud",
    proficiency: 75,
    experience: "2+ years",
    projects: 9,
    isRecommended: true,
    icon: "☁️",
    color: "#ff9900",
  },
  {
    id: "docker",
    name: "Docker",
    category: "DevOps",
    proficiency: 80,
    experience: "3+ years",
    projects: 11,
    isRecommended: true,
    icon: "🐳",
    color: "#2496ed",
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    category: "DevOps",
    proficiency: 60,
    experience: "1+ years",
    projects: 5,
    isRecommended: false,
    icon: "⚙️",
    color: "#326ce5",
  },
  {
    id: "terraform",
    name: "Terraform",
    category: "DevOps",
    proficiency: 55,
    experience: "1+ years",
    projects: 3,
    isRecommended: false,
    icon: "🏗️",
    color: "#623ce4",
  },

  // Mobile
  {
    id: "react-native",
    name: "React Native",
    category: "Mobile",
    proficiency: 70,
    experience: "2+ years",
    projects: 7,
    isRecommended: true,
    icon: "📱",
    color: "#61dafb",
  },
  {
    id: "flutter",
    name: "Flutter",
    category: "Mobile",
    proficiency: 60,
    experience: "1+ years",
    projects: 4,
    isRecommended: false,
    icon: "🦋",
    color: "#02569b",
  },
  {
    id: "swift",
    name: "Swift",
    category: "Mobile",
    proficiency: 50,
    experience: "< 1 year",
    projects: 2,
    isRecommended: false,
    icon: "🍎",
    color: "#fa7343",
  },
];

export default function TechnologySelector({
  selectedTechnologies,
  onTechnologiesChange,
  onError,
  className,
}: TechnologySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customTech, setCustomTech] = useState({
    name: "",
    category: "Other",
    proficiency: 50,
    experience: "1+ years",
  });

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(MOCK_TECHNOLOGIES.map((t) => t.category))];
    return cats;
  }, []);

  // Filter technologies based on search and category
  const filteredTechnologies = useMemo(() => {
    let filtered = MOCK_TECHNOLOGIES;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort by recommended first, then by name
    return filtered.sort((a, b) => {
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedCategory]);

  // Check if technology is selected
  const isSelected = useCallback(
    (tech: Technology) => {
      return selectedTechnologies.some((t) => t.id === tech.id);
    },
    [selectedTechnologies],
  );

  // Add technology
  const addTechnology = useCallback(
    (tech: Technology) => {
      if (isSelected(tech)) {
        onError?.("Technology already added");
        return;
      }

      onTechnologiesChange([...selectedTechnologies, tech]);
    },
    [selectedTechnologies, onTechnologiesChange, isSelected, onError],
  );

  // Remove technology
  const removeTechnology = useCallback(
    (techId: string) => {
      onTechnologiesChange(selectedTechnologies.filter((t) => t.id !== techId));
    },
    [selectedTechnologies, onTechnologiesChange],
  );

  // Add custom technology
  const addCustomTechnology = useCallback(() => {
    if (!customTech.name.trim()) {
      onError?.("Technology name is required");
      return;
    }

    const newTech: Technology = {
      id: `custom-${Date.now()}`,
      name: customTech.name.trim(),
      category: customTech.category,
      proficiency: customTech.proficiency,
      experience: customTech.experience,
      projects: 0,
      isRecommended: false,
    };

    addTechnology(newTech);
    setCustomTech({
      name: "",
      category: "Other",
      proficiency: 50,
      experience: "1+ years",
    });
    setShowCustomForm(false);
  }, [customTech, addTechnology, onError]);

  // Get proficiency color
  const getProficiencyColor = useCallback((proficiency: number) => {
    if (proficiency >= 80) return "text-green-600";
    if (proficiency >= 60) return "text-yellow-600";
    return "text-red-600";
  }, []);

  // Get proficiency background
  const getProficiencyBg = useCallback((proficiency: number) => {
    if (proficiency >= 80) return "bg-green-100";
    if (proficiency >= 60) return "bg-yellow-100";
    return "bg-red-100";
  }, []);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Selected Technologies */}
      {selectedTechnologies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Selected Technologies ({selectedTechnologies.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedTechnologies.map((tech) => (
                <div
                  key={tech.id}
                  className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
                >
                  <span className="text-sm font-medium">{tech.name}</span>
                  <Badge className={getProficiencyBg(tech.proficiency)}>
                    {tech.proficiency}%
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeTechnology(tech.id)}
                    className="h-5 w-5 p-0 text-gray-500 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Add Technologies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Add Custom Technology */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Custom Technology
            </Button>
          </div>

          {/* Custom Technology Form */}
          {showCustomForm && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Technology name"
                  value={customTech.name}
                  onChange={(e) =>
                    setCustomTech((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <select
                  value={customTech.category}
                  onChange={(e) =>
                    setCustomTech((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="Other">Other</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Cloud">Cloud</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Mobile">Mobile</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Proficiency
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={customTech.proficiency}
                    onChange={(e) =>
                      setCustomTech((prev) => ({
                        ...prev,
                        proficiency: parseInt(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">
                    {customTech.proficiency}%
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Experience
                  </label>
                  <select
                    value={customTech.experience}
                    onChange={(e) =>
                      setCustomTech((prev) => ({
                        ...prev,
                        experience: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="< 1 year">&lt; 1 year</option>
                    <option value="1+ years">1+ years</option>
                    <option value="2+ years">2+ years</option>
                    <option value="3+ years">3+ years</option>
                    <option value="4+ years">4+ years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" onClick={addCustomTechnology}>
                  Add Technology
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCustomForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Technology List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            {selectedCategory === "All"
              ? "All Technologies"
              : `${selectedCategory} Technologies`}
            {filteredTechnologies.length > 0 && (
              <span className="text-gray-500 font-normal ml-2">
                ({filteredTechnologies.length})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTechnologies.length === 0 ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No technologies found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search or category filter
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTechnologies.map((tech) => (
                <div
                  key={tech.id}
                  className={cn(
                    "flex items-center justify-between p-4 border rounded-lg transition-colors",
                    isSelected(tech)
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-gray-200 hover:border-gray-300",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{tech.icon}</div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          {tech.name}
                        </h4>
                        {tech.isRecommended && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Recommended
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500">
                          {tech.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {tech.experience}
                        </span>
                        <span className="text-sm text-gray-500">
                          {tech.projects} projects
                        </span>
                      </div>

                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">
                            Proficiency
                          </span>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              getProficiencyColor(tech.proficiency),
                            )}
                          >
                            {tech.proficiency}%
                          </span>
                        </div>
                        <Progress value={tech.proficiency} className="h-1" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected(tech) ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Added</span>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => addTechnology(tech)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
