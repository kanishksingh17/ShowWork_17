import React from "react";
import { useNavigate } from "react-router-dom";
import QuickAddProject from "@/app/showcase/QuickAddProject";

const QuickAdd: React.FC = () => {
  const navigate = useNavigate();

  const handleSave = (project: any) => {
    // Save to localStorage
    const existingProjects = JSON.parse(
      localStorage.getItem("showcase-projects") || "[]",
    );
    const updatedProjects = [...existingProjects, project];
    localStorage.setItem("showcase-projects", JSON.stringify(updatedProjects));

    // Show success message
    console.log("Project saved as draft");
  };

  const handlePublish = (project: any) => {
    // Save to localStorage
    const existingProjects = JSON.parse(
      localStorage.getItem("showcase-projects") || "[]",
    );
    const updatedProjects = [...existingProjects, project];
    localStorage.setItem("showcase-projects", JSON.stringify(updatedProjects));

    // Navigate to project view
    navigate(`/showcase/view/${project.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <QuickAddProject onSave={handleSave} onPublish={handlePublish} />
    </div>
  );
};

export default QuickAdd;
