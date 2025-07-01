import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  ArrowRight,
  Mail,
  Lock,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Database,
  Cpu,
  BookMarked,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
// Card component removed as we're using custom card styling
import { useAuth } from "../contexts/useAuth";
import "./WelcomePage.css";

// Auth Form Component with toggle between login and signup
interface AuthFormProps {
  authMode: "login" | "signup";
  setAuthMode: React.Dispatch<React.SetStateAction<"login" | "signup">>;
}

function AuthForm({ authMode, setAuthMode }: AuthFormProps) {
  const isLogin = authMode === "login";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const toggleForm = () => {
    setAuthMode(isLogin ? "signup" : "login");
    setFormError("");
  };

  // Password strength check from SignupPage
  const passwordStrength = (
    password: string
  ): { score: number; feedback: string } => {
    if (!password) return { score: 0, feedback: "Password is required" };
    if (password.length < 6)
      return { score: 1, feedback: "Password is too short" };
    if (password.length < 8)
      return { score: 2, feedback: "Password could be stronger" };

    let score = 3;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let feedback = "Password is strong";
    if (score >= 6) feedback = "Password is very strong";

    return { score: Math.min(score, 6), feedback };
  };

  const strength = passwordStrength(password);
  const strengthClass = [
    "bg-gray-200 dark:bg-gray-700",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-400",
    "bg-green-500",
    "bg-green-600",
  ][strength.score];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");

    try {
      // Pass the credentials to the login function
      await login(email, password);
      navigate("/static"); // Navigate to dashboard
    } catch (error) {
      // Show a more helpful error message
      setFormError(
        error instanceof Error
          ? error.message
          : "Invalid credentials. Try user@example.com / password123"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const { score } = passwordStrength(password);
    if (score < 3) {
      setFormError("Please choose a stronger password");
      setIsLoading(false);
      return;
    }

    try {
      await signup(name, email, password);
      navigate("/static"); // Navigate to dashboard
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl rounded-lg shadow-xl p-8 w-full max-w-md mx-auto transform transition-all duration-500 hover:shadow-2xl border border-white/20 dark:border-gray-700/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          {isLogin && (
            <p className="text-sm text-gray-300 mt-1">
              Demo: user@example.com / password123
            </p>
          )}
        </div>
        <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <Brain className="h-6 w-6 text-purple-600" />
        </div>
      </div>

      {formError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-3 text-red-600 flex-shrink-0" />
          <span className="text-sm">{formError}</span>
        </div>
      )}

      <form
        onSubmit={isLogin ? handleLogin : handleSignup}
        className="space-y-6"
      >
        {/* Name field - only for signup */}
        {!isLogin && (
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Your name"
              />
            </div>
          </div>
        )}

        {/* Email field - for both login and signup */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder={isLogin ? "user@example.com" : "your@email.com"}
            />
          </div>
        </div>

        {/* Password field - for both login and signup */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              )}
            </button>
          </div>
          {/* Password strength indicator - only for signup */}
          {!isLogin && password && (
            <div className="mt-2">
              <div className="strength-meter bg-gray-200 dark:bg-gray-700">
                <div
                  className={`strength-bar ${strengthClass}`}
                  style={{ width: `${(strength.score / 6) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {strength.feedback}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password - only for signup */}
        {!isLogin && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`pl-10 block w-full px-3 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all duration-300 ${
                  confirmPassword && password === confirmPassword
                    ? "border-green-500"
                    : confirmPassword
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                )}
              </button>
              {confirmPassword && password === confirmPassword && (
                <span className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <Check className="h-5 w-5 text-green-500" />
                </span>
              )}
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>
        )}

        {/* Remember me and forgot password - only for login */}
        {isLogin && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Forgot password?
              </a>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <>{isLogin ? "Sign in" : "Create Account"}</>
          )}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleForm}
              className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </form>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          By {isLogin ? "signing in" : "creating an account"}, you agree to our{" "}
          <a href="#" className="text-purple-600 hover:text-purple-500">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-purple-600 hover:text-purple-500">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

// Platform Card Component
function PlatformCard({ platform }: { platform: (typeof platforms)[0] }) {
  const Icon = platform.icon;

  const handleClick = () => {
    window.open(platform.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleClick}
      className="enhanced-card group h-full"
      style={{ animationDelay: `${platforms.indexOf(platform) * 100}ms` }}
    >
      <div className="enhanced-card-border"></div>
      <div className="enhanced-card-content flex flex-col h-full">
        <div
          className={`enhanced-card-icon bg-gradient-to-r ${platform.bgClass} sm:w-12 sm:h-12 md:w-16 md:h-16`}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-cyan-300 group-hover:bg-clip-text group-hover:text-transparent transition-colors">
          {platform.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 flex-grow mb-4 line-clamp-3">
          {platform.description}
        </p>
        <div className="flex justify-between items-center mt-auto pt-2">
          <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
            {platform.tagline}
          </span>
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-white/90" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Animated background component
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

function AnimatedBackground() {
  // For animated particles
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles for background animation
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setParticles(newParticles);

    // Animate particles
    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          y: particle.y > 100 ? -5 : particle.y + particle.speed * 0.1,
          x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.1,
        }))
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animated-background">
      <div className="background-gradient light-gradient dark:dark-gradient"></div>

      {/* Floating Geometric Shapes */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      {/* Neural Network Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient
            id="lineGradientLight"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <g className="neural-lines">
          <line
            x1="10%"
            y1="20%"
            x2="90%"
            y2="80%"
            stroke="url(#lineGradient)"
            strokeWidth="1"
          />
          <line
            x1="20%"
            y1="80%"
            x2="80%"
            y2="20%"
            stroke="url(#lineGradient)"
            strokeWidth="1"
          />
          <line
            x1="5%"
            y1="50%"
            x2="95%"
            y2="60%"
            stroke="url(#lineGradient)"
            strokeWidth="1"
          />
        </g>
      </svg>

      {/* Animated Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
          }}
        />
      ))}

      {/* Legacy blobs for compatibility */}
      <div className="hidden md:block blob blob-desktop-1 animate-blob"></div>
      <div className="hidden md:block blob blob-desktop-2 animate-blob animation-delay-2000"></div>
      <div className="hidden md:block blob blob-desktop-3 animate-blob animation-delay-4000"></div>
      <div className="md:hidden blob blob-mobile-1 animate-blob"></div>
      <div className="md:hidden blob blob-mobile-2 animate-blob animation-delay-2000"></div>
      <div className="md:hidden blob blob-mobile-3 animate-blob animation-delay-4000"></div>
    </div>
  );
}

// Platform data for connected applications
const platforms = [
  {
    name: "AI Academy",
    description:
      "A online platform offering interactive courses, real-world projects, and mentorship to empower developers in harnessing AI's potential.",
    icon: BookMarked,
    url: "https://ai-academy.onrender.com",
    tagline: "Learn AI Development",
    bgClass: "from-blue-500 via-purple-500 to-cyan-500",
    iconBgClass: "bg-blue-100 dark:bg-blue-900/30",
    detailedDescription: `AI Academy is a comprehensive learning platform designed to help developers master artificial intelligence concepts and implementation.
    
    Key features include:
    • Interactive tutorials and coding exercises
    • Real-world projects with industry applications
    • Personalized learning paths based on skill level
    • Expert mentorship from AI practitioners
    • Certification programs recognized by industry leaders`,
    videoUrl: "https://youtu.be/yTHUoOTOLdE?si=usM2-DCb8hguSJhM", // Placeholder video URL
  },
  {
    name: "AI Solution Builder",
    description:
      "Design AI application architectures with guided workflows and generate tailored architecture diagrams to serve as a reference for building applications.",
    icon: Cpu,
    url: "https://solutionbuilder.onrender.com",
    tagline: "Design AI Architectures",
    bgClass: "from-purple-500 via-pink-500 to-indigo-500",
    iconBgClass: "bg-purple-100 dark:bg-purple-900/30",
    detailedDescription: `The AI Solution Builder enables users to design sophisticated AI application architectures through intuitive guided workflows. 
    This platform streamlines the process of creating tailored architecture diagrams for AI systems.
    
    Key features include:
    • Drag-and-drop component library for AI architectures
    • Intelligent recommendations based on use case requirements
    • Automated validation of architecture designs
    • Export to multiple formats (PNG, SVG, PDF)
    • Integration with deployment tools and CI/CD pipelines`,
    videoUrl: "https://youtu.be/yTHUoOTOLdE?si=usM2-DCb8hguSJhM", // Placeholder video URL
  },
  {
    name: "AI Knowledge Base",
    description:
      "Document and share AI learnings, best practices, and reusable assets to build GenAI solutions efficiently and collaboratively.",
    icon: Database,
    url: "https://ai-knowledge-base.onrender.com",
    tagline: "Share AI Knowledge",
    bgClass: "from-emerald-500 via-teal-500 to-green-500",
    iconBgClass: "bg-emerald-100 dark:bg-emerald-900/30",
    detailedDescription: `The AI Knowledge Base serves as a comprehensive repository of AI-related information, allowing teams to document and share valuable learnings. 
    It offers a structured approach to organizing AI best practices, techniques, and reusable assets.
    
    Key features include:
    • Searchable documentation repository
    • Categorized AI patterns and solutions
    • Version-controlled knowledge articles
    • Integration with popular AI tools and frameworks
    • Collaborative editing and feedback system`,
    videoUrl: "https://youtu.be/yTHUoOTOLdE?si=usM2-DCb8hguSJhM", // Placeholder video URL
  },
  {
    name: "AI Notebook Base",
    description:
      "Document and share AI learnings, best practices, and reusable assets to build GenAI solutions efficiently and collaboratively.",
    icon: Database,
    url: "https://ai-knowledge-base.onrender.com",
    tagline: "Share AI Knowledge",
    bgClass: "from-emerald-500 via-teal-500 to-green-500",
    iconBgClass: "bg-emerald-100 dark:bg-emerald-900/30",
    detailedDescription: `The AI Knowledge Base serves as a comprehensive repository of AI-related information, allowing teams to document and share valuable learnings. 
    It offers a structured approach to organizing AI best practices, techniques, and reusable assets.
    
    Key features include:
    • Searchable documentation repository
    • Categorized AI patterns and solutions
    • Version-controlled knowledge articles
    • Integration with popular AI tools and frameworks
    • Collaborative editing and feedback system`,
    videoUrl: "https://youtu.be/yTHUoOTOLdE?si=usM2-DCb8hguSJhM", // Placeholder video URL
  },
];

// Team member data
const teamMembers = [
  {
    name: "Sudeep Aryan ",
    role: "Senior AI Engineer",
    description: "",
    imageUrl: "",
  },
  {
    name: "Vignesh ",
    role: "Senior AI Engineer",
    description: "",
    imageUrl: "",
  },
  {
    name: "Vijay",
    role: "Frontend Developer",
    description: "",
    imageUrl: "",
  },
  {
    name: "Suvardhan DIleep",
    role: "AI Ethics Specialist",
    description: "",
    imageUrl: "",
  },
];

// Platform Detail Section Component
function PlatformDetail({
  platform,
  index,
}: {
  platform: (typeof platforms)[0];
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <div id={`platform-${index}`} className="section-container">
      <div
        className={`flex flex-col ${
          isEven ? "lg:flex-row" : "lg:flex-row-reverse"
        } gap-8 items-center`}
      >
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-lg ${platform.iconBgClass} flex items-center justify-center`}
            >
              <platform.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {platform.name}
            </h3>
          </div>
          <div className="prose prose-purple dark:prose-invert max-w-none">
            {platform.detailedDescription.split("\n").map((paragraph, i) => (
              <p key={i} className="text-gray-600 dark:text-gray-300">
                {paragraph}
              </p>
            ))}
          </div>
          <div>
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
            >
              Explore Platform
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg aspect-video">
          <iframe
            className="w-full h-full"
            src={platform.videoUrl}
            title={`${platform.name} Demo Video`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

// About AI Academy Section Component
function AboutSection() {
  return (
    <div id="about" className="section-container">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        About AI Academy
      </h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/5 space-y-6">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            AI Academy is a comprehensive educational platform designed to
            empower individuals and organizations with the knowledge and skills
            needed to harness the power of artificial intelligence.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Founded in 2022, our mission is to democratize AI education and make
            cutting-edge techniques accessible to everyone, regardless of their
            technical background. Our curriculum is designed by industry experts
            and constantly updated to reflect the rapidly evolving AI landscape.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                Our Vision
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                To create a world where AI is understood, accessible, and
                responsibly deployed to solve humanity's greatest challenges.
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                Our Approach
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Hands-on learning with real-world applications, guided by AI
                practitioners with industry experience.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/5">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                Why Choose AI Academy?
              </h3>
              <ul className="space-y-3">
                {[
                  "Industry-relevant curriculum updated quarterly",
                  "Learn from AI practitioners with real-world experience",
                  "Build a portfolio of practical AI projects",
                  "Flexible learning paths tailored to your goals",
                  "Join a community of AI enthusiasts and professionals",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-300 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Team Section Component
function TeamSection() {
  return (
    <div id="team" className="section-container">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Our Team
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Meet the experts behind AI Academy's curriculum and platform development
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-full h-full object-cover object-center transform hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                {member.name}
              </h3>
              <div className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-2">
                {member.role}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {member.description}
              </p>
              <div className="mt-4 flex space-x-3">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md group"
                  aria-label="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md group"
                  aria-label="Twitter/X"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="text-sky-500 dark:text-sky-400 group-hover:text-sky-600"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md group"
                  aria-label="GitHub"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="text-gray-800 dark:text-white group-hover:text-black dark:group-hover:text-gray-200"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WelcomePage() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [animateContent, setAnimateContent] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  // Function to open auth modal with specified mode
  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  // Function to close auth modal
  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setNavbarScrolled(true);
      } else {
        setNavbarScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  useEffect(() => {
    // Apply theme class to body
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(theme === "dark" ? "dark-mode" : "light-mode");

    // Trigger animations after component mount
    const timer = setTimeout(() => {
      setAnimateContent(true);
    }, 100);

    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = "smooth";

    // Disable custom cursor on form elements
    const disableCustomCursor = () => {
      // Add a class to disable custom cursor effects on all form elements
      const formElements = document.querySelectorAll(
        'input, textarea, select, button[type="submit"], button[type="button"], label'
      );

      formElements.forEach((el) => {
        el.classList.add("default-cursor");
        // Cast element to HTMLElement to access style property
        (el as HTMLElement).style.pointerEvents = "auto";
        (el as HTMLElement).style.cursor = "auto";
      });
    };

    // Call the function after a small delay to ensure the form is mounted
    setTimeout(disableCustomCursor, 500);

    return () => {
      clearTimeout(timer);
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, [theme]);

  // Show dashboard button for authenticated users
  const goToDashboard = () => {
    navigate("/static");
  };

  return (
    <div className="welcome-page">
      <AnimatedBackground />

      {/* Navbar */}
      <nav className={`navbar ${navbarScrolled ? "scrolled" : ""}`}>
        <div className="navbar-brand">
          <div className="animated-logo">
            <div className="logo-glow"></div>
            <div className="logo-bg">
              <Brain className="h-5 w-5 text-white" />
            </div>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-300 to-cyan-300 text-transparent bg-clip-text">
            AI Academy
          </span>
        </div>
        <div className="navbar-menu">
          <div className="navbar-links">
            <a href="#platforms" className="nav-link">
              AI Platforms
            </a>
            <a href="#about" className="nav-link">
              About
            </a>
            <a href="#team" className="nav-link">
              Team
            </a>
          </div>
          <div className="navbar-actions">
            {!isAuthenticated ? (
              <button
                className="auth-button"
                onClick={() => openAuthModal("login")}
              >
                <Mail className="h-4 w-4" />
                <span className="auth-button-text">Sign In</span>
              </button>
            ) : (
              <button className="auth-button" onClick={goToDashboard}>
                <ArrowRight className="h-4 w-4" />
                <span className="auth-button-text">Dashboard</span>
              </button>
            )}
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <div
        className={`auth-modal-overlay ${showAuthModal ? "active" : ""}`}
        onClick={(e) => {
          // Close modal when clicking on overlay but not on the modal itself
          if (e.target === e.currentTarget) closeAuthModal();
        }}
      >
        <div className="auth-modal">
          <button
            className="auth-modal-close"
            onClick={closeAuthModal}
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="p-8">
            <AuthForm authMode={authMode} setAuthMode={setAuthMode} />
          </div>
        </div>
      </div>

      <div className="welcome-content" onMouseMove={handleMouseMove}>
        <div className="welcome-layout">
          {/* Content Section (Left Side) */}
          <div className="content-section">
            <div className="content-container">
              {/* Header */}
              <div
                className={`${
                  animateContent ? "fade-in-up" : "fade-out-down"
                } mt-2`}
              >
                <div className="mb-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-700 via-purple-500 to-cyan-600 dark:from-white dark:via-purple-200 dark:to-cyan-200 bg-clip-text text-transparent mb-6">
                    AI Ecosystem
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    Explore our integrated AI platforms designed to accelerate
                    your learning and development
                  </p>
                </div>
              </div>

              {/* Connected Platforms Section - Teaser Cards */}
              <div id="platforms" className="mb-16 section-container">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                  {platforms.map((platform, index) => (
                    <div
                      key={platform.name}
                      className={`${
                        animateContent ? "fade-in-up" : "fade-out-down"
                      }`}
                      style={{
                        transitionDelay: `${200 + index * 200}ms`,
                        transform: mousePosition.x
                          ? `translateY(${
                              (mousePosition.y - 0.5) * -10
                            }px) translateX(${(mousePosition.x - 0.5) * -10}px)`
                          : "none",
                        transition: "transform 0.3s ease-out",
                      }}
                    >
                      <PlatformCard platform={platform} />
                    </div>
                  ))}
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                  <div
                    className="inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-white font-medium hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => openAuthModal("signup")}
                  >
                    <span className="text-lg">Join the AI Revolution</span>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed platform sections */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <div className="text-center max-w-3xl mx-auto py-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Discover Our AI Platform Suite
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Each platform in our ecosystem is designed to enhance different
                aspects of AI learning and development. Explore detailed
                information about each platform below.
              </p>
            </div>
          </div>

          {platforms.map((platform, index) => (
            <PlatformDetail
              key={platform.name}
              platform={platform}
              index={index}
            />
          ))}

          <AboutSection />
          <TeamSection />
        </div>

        <footer className="footer bg-white dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-8 md:mb-0">
                <div className="flex items-center mb-4">
                  <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    AI Academy
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 max-w-md">
                  Empowering the next generation of AI innovators with
                  cutting-edge education and tools.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                    Platform
                  </h3>
                  <ul className="space-y-3">
                    {platforms.map((platform) => (
                      <li key={platform.name}>
                        <a
                          href={platform.url}
                          className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                        >
                          {platform.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                    Company
                  </h3>
                  <ul className="space-y-3">
                    {["About", "Team", "Careers", "Contact"].map((item) => (
                      <li key={item}>
                        <a
                          href={`#${item.toLowerCase()}`}
                          className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                    Resources
                  </h3>
                  <ul className="space-y-3">
                    {["Documentation", "Tutorials", "Blog", "Community"].map(
                      (item) => (
                        <li key={item}>
                          <a
                            href="#"
                            className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                          >
                            {item}
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} AI Academy. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
