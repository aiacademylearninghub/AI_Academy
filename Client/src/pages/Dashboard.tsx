import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import {
  Brain,
  Cloud,
  Cog,
  Database,
  Cpu,
  BookMarked,
  ExternalLink,
} from "lucide-react";
import Dashboard1 from "./Dashboard1";

const hubs = [
  {
    title: "AI HUB",
    icon: Brain,
    description: "Explore AI/ML fundamentals, RAG systems, agents, and more.",
    color: "from-purple-400 to-indigo-500",
    path: "/ai-hub",
  },
  {
    title: "Azure HUB",
    icon: Cloud,
    description: "Master cloud computing with Microsoft Azure services.",
    color: "from-blue-400 to-cyan-500",
    path: "/azure-hub",
  },
  {
    title: "DevOps HUB",
    icon: Cog,
    description: "Learn modern DevOps practices and tools.",
    color: "from-green-400 to-emerald-500",
    path: "/devops-hub",
  },
];

// Add platform data for connected applications
const platforms = [
  {
    name: "AI Knowledge Base",
    description:
      "Document and share AI learnings, best practices, and reusable assets to build GenAI solutions efficiently.",
    icon: Database,
    url: "https://ai-knowledge-base.onrender.com",
    tagline: "Explore Learnings & Best Practices",
    bgClass: "from-blue-500 to-blue-600",
    iconBgClass: "bg-white/20",
    textColor: "text-gray-700 dark:text-gray-200",
    buttonBgClass:
      "bg-blue-50 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-gray-600",
    buttonTextClass: "text-blue-600 dark:text-white",
  },
  {
    name: "AI Solution Builder",
    description:
      "Design AI application architectures with guided workflows and generate tailored architecture diagrams.",
    icon: Cpu,
    url: "https://solutionbuilder.onrender.com",
    tagline: "Design AI Architectures",
    bgClass: "from-purple-500 to-indigo-600",
    iconBgClass: "bg-white/20",
    textColor: "text-gray-700 dark:text-gray-200",
    buttonBgClass:
      "bg-purple-50 hover:bg-purple-100 dark:bg-gray-700 dark:hover:bg-gray-600",
    buttonTextClass: "text-purple-600 dark:text-white",
  },
  {
    name: "AI Notebook",
    description:
      "Collaborative discussion and Q&A platform for uploading documents and saving notes anchored in the Knowledge Base.",
    icon: BookMarked,
    url: "https://ai-notebook.onrender.com/",
    tagline: "Collaborative Notes & Q&A",
    bgClass: "from-emerald-500 to-teal-600",
    iconBgClass: "bg-white/20",
    textColor: "text-gray-700 dark:text-gray-200",
    buttonBgClass:
      "bg-emerald-50 hover:bg-emerald-100 dark:bg-gray-700 dark:hover:bg-gray-600",
    buttonTextClass: "text-emerald-600 dark:text-white",
  },
];

// Platform Card Component
function PlatformCard({ platform }: { platform: (typeof platforms)[0] }) {
  const Icon = platform.icon;

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow border-0">
      {/* Gradient header */}
      <div className={`bg-gradient-to-r ${platform.bgClass} p-6`}>
        <div
          className={`w-12 h-12 rounded-xl ${platform.iconBgClass} flex items-center justify-center mb-3`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{platform.name}</h3>
        <p className="text-sm text-white/90">{platform.tagline}</p>
      </div>

      {/* Card body */}
      <div className="p-6 bg-white dark:bg-gray-800">
        <p className={`text-sm ${platform.textColor} mb-4`}>
          {platform.description}
        </p>
        <a
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-lg ${platform.buttonBgClass} ${platform.buttonTextClass} transition-all duration-300`}
        >
          Open Platform
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </Card>
  );
}

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to AI Academy
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Choose a learning path to begin your journey
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hubs.map((hub) => {
          const Icon = hub.icon;
          return (
            <Card
              key={hub.title}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`h-2 bg-gradient-to-r ${hub.color}`} />
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r ${hub.color} bg-opacity-10`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {hub.title}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {hub.description}
                </p>
                <Link
                  to={hub.path}
                  className="block w-full px-4 py-2 text-center bg-gray-900 dark:bg-gray-800 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* AI Platform Ecosystem Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          AI Academy Ecosystem
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => (
            <PlatformCard key={platform.name} platform={platform} />
          ))}
        </div>
      </div>

      {/* Recent Progress */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Recent Progress
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Current Learning Path
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  AI/ML Basics
                </span>
                <span className="text-sm text-purple-500">60% Complete</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: "60%" }}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Next Recommended
            </h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Brain className="w-5 h-5 mr-2" />
                <span>Introduction to RAG Systems</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Cloud className="w-5 h-5 mr-2" />
                <span>Azure AI Services Overview</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div>
        <Dashboard1 />
      </div>
    </div>
  );
}
