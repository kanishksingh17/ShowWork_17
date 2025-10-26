import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import * as d3 from "d3";
import {
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  Globe,
  Zap,
  Activity,
  Target,
  Brain,
  Sparkles,
} from "lucide-react";

interface AdvancedVisualizationsProps {
  data: any;
}

// D3.js Interactive Bar Chart
const InteractiveBarChart: React.FC<{ data: any[] }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(data.map((d) => d.name));

    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, (d) => d.value) || 0]);

    // Add bars with animation
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name) || 0)
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value));

    // Add value labels
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text((d) => d.value);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    g.append("g").call(d3.axisLeft(y));
  }, [data]);

  return (
    <div className="w-full">
      <svg ref={svgRef} width={400} height={300}></svg>
    </div>
  );
};

// D3.js Interactive Line Chart
const InteractiveLineChart: React.FC<{ data: any[] }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .range([0, width])
      .domain(d3.extent(data, (d) => new Date(d.date)) as [Date, Date]);

    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain(d3.extent(data, (d) => d.value) as [number, number]);

    const line = d3
      .line<{ date: string; value: number }>()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    // Add line with animation
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3B82F6")
      .attr("stroke-width", 3)
      .attr("d", line)
      .style("stroke-dasharray", "1000")
      .style("stroke-dashoffset", "1000")
      .transition()
      .duration(2000)
      .style("stroke-dashoffset", "0");

    // Add dots
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(new Date(d.date)))
      .attr("cy", (d) => y(d.value))
      .attr("r", 0)
      .attr("fill", "#3B82F6")
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr("r", 5);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g").call(d3.axisLeft(y));
  }, [data]);

  return (
    <div className="w-full">
      <svg ref={svgRef} width={400} height={300}></svg>
    </div>
  );
};

// D3.js Interactive Pie Chart
const InteractivePieChart: React.FC<{ data: any[] }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3
      .pie<any>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3.arc<any>().innerRadius(0).outerRadius(radius);

    const arcs = g
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i.toString()))
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200)
      .style("opacity", 1);

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .style("opacity", 0)
      .text((d) => `${d.data.value}%`)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200 + 500)
      .style("opacity", 1);
  }, [data]);

  return (
    <div className="w-full">
      <svg ref={svgRef} width={300} height={300}></svg>
    </div>
  );
};

// Animated Globe Component (simplified version)
const AnimatedGlobe: React.FC = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-64 h-64 mx-auto">
      <motion.div
        className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"
        animate={{ rotate: rotation }}
        transition={{ duration: 0.1, ease: "linear" }}
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%),
            conic-gradient(from 0deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B, #10B981, #3B82F6)
          `,
        }}
      >
        <div className="absolute inset-0 rounded-full bg-black/20" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
      </motion.div>

      {/* Floating data points */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-blue-400 rounded-full"
          style={{
            top: `${20 + Math.sin(i * 0.785) * 100}px`,
            left: `${20 + Math.cos(i * 0.785) * 100}px`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

// Particle System
const ParticleSystem: React.FC = () => {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; vx: number; vy: number }>
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 400,
      y: Math.random() * 300,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }));
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x: (particle.x + particle.vx + 400) % 400,
          y: (particle.y + particle.vy + 300) % 300,
        })),
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-80 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          animate={{
            x: particle.x,
            y: particle.y,
          }}
          transition={{ duration: 0.05 }}
        />
      ))}

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        {particles.map((particle, i) =>
          particles.slice(i + 1).map((other, j) => {
            const distance = Math.sqrt(
              Math.pow(particle.x - other.x, 2) +
                Math.pow(particle.y - other.y, 2),
            );
            if (distance < 100) {
              return (
                <line
                  key={`${i}-${j}`}
                  x1={particle.x}
                  y1={particle.y}
                  x2={other.x}
                  y2={other.y}
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="1"
                />
              );
            }
            return null;
          }),
        )}
      </svg>
    </div>
  );
};

export const AdvancedVisualizations: React.FC<AdvancedVisualizationsProps> = ({
  data,
}) => {
  const [activeVisualization, setActiveVisualization] = useState<string>("bar");

  const barData = [
    { name: "Views", value: 1250 },
    { name: "Likes", value: 89 },
    { name: "Shares", value: 23 },
    { name: "Comments", value: 45 },
    { name: "Downloads", value: 67 },
  ];

  const lineData = [
    { date: "2024-01-01", value: 100 },
    { date: "2024-01-02", value: 120 },
    { date: "2024-01-03", value: 110 },
    { date: "2024-01-04", value: 140 },
    { date: "2024-01-05", value: 130 },
    { date: "2024-01-06", value: 160 },
    { date: "2024-01-07", value: 150 },
  ];

  const pieData = [
    { name: "Desktop", value: 45 },
    { name: "Mobile", value: 35 },
    { name: "Tablet", value: 20 },
  ];

  const visualizations = [
    { id: "bar", label: "Bar Chart", icon: BarChart3 },
    { id: "line", label: "Line Chart", icon: LineChart },
    { id: "pie", label: "Pie Chart", icon: PieChart },
    { id: "globe", label: "Globe", icon: Globe },
    { id: "particles", label: "Particles", icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          Advanced Visualizations
        </h2>
        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          Interactive Charts
        </Badge>
      </div>

      {/* Visualization Selector */}
      <div className="flex space-x-1 bg-slate-100 rounded-lg p-1 overflow-x-auto">
        {visualizations.map((viz) => {
          const Icon = viz.icon;
          return (
            <button
              key={viz.id}
              onClick={() => setActiveVisualization(viz.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all whitespace-nowrap ${
                activeVisualization === viz.id
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{viz.label}</span>
            </button>
          );
        })}
      </div>

      {/* Visualization Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeVisualization}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center">
                {React.createElement(
                  visualizations.find((v) => v.id === activeVisualization)
                    ?.icon || BarChart3,
                  { className: "w-5 h-5 mr-2 text-blue-600" },
                )}
                {
                  visualizations.find((v) => v.id === activeVisualization)
                    ?.label
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                {activeVisualization === "bar" && (
                  <InteractiveBarChart data={barData} />
                )}
                {activeVisualization === "line" && (
                  <InteractiveLineChart data={lineData} />
                )}
                {activeVisualization === "pie" && (
                  <InteractivePieChart data={pieData} />
                )}
                {activeVisualization === "globe" && <AnimatedGlobe />}
                {activeVisualization === "particles" && <ParticleSystem />}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Visualization Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center text-lg">
              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
              Interactive Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Hover effects and tooltips</li>
              <li>• Smooth animations and transitions</li>
              <li>• Real-time data updates</li>
              <li>• Responsive design</li>
              <li>• Custom color schemes</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center text-lg">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              Advanced Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• D3.js powered visualizations</li>
              <li>• Custom chart types</li>
              <li>• Data filtering and sorting</li>
              <li>• Export capabilities</li>
              <li>• Performance optimized</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center text-lg">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Customization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Custom themes and colors</li>
              <li>• Configurable animations</li>
              <li>• Multiple chart types</li>
              <li>• Data source integration</li>
              <li>• Mobile-friendly design</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
