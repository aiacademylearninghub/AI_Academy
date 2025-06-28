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
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { useAuth } from "../contexts/useAuth";

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
      // Use demo credentials for dummy login
      // In a real app this would be more secure
      if (email === "user@example.com" && password === "password123") {
        await login(email, password);
        navigate("/static"); // Navigate to dashboard
      } else {
        // For demonstration - show error but with helpful hint
        setFormError("Invalid credentials. Try user@example.com / password123");
      }
    } catch {
      setFormError("Login error. Try user@example.com / password123");
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md mx-auto transform transition-all duration-500 hover:shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          {isLogin && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strengthClass} rounded-full`}
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
      className="cursor-pointer group h-full transition-transform duration-300 hover:scale-105"
    >
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
        <div className="px-6 py-6 flex-1 flex flex-col">
          <div
            className={`w-12 h-12 rounded-lg ${platform.iconBgClass} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400 transition-transform duration-300 group-hover:rotate-12" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {platform.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">
            {platform.description}
          </p>
        </div>
        <div
          className={`py-4 px-6 bg-gradient-to-r ${platform.bgClass} group-hover:bg-opacity-90 transition-all duration-300`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-white/90">
              {platform.tagline}
            </span>
            <ExternalLink className="h-4 w-4 text-white/80 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </div>
  );
}

// Animated background component
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-900/20 dark:to-indigo-900/20"></div>

      {/* Desktop blobs */}
      <div className="hidden md:block absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="hidden md:block absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="hidden md:block absolute top-60 right-60 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Mobile optimized blobs - smaller and repositioned */}
      <div className="md:hidden absolute -top-20 -right-20 w-56 h-56 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="md:hidden absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="md:hidden absolute top-40 right-20 w-48 h-48 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>
  );
}

// Platform data for connected applications
const platforms = [
  {
    name: "AI Knowledge Base",
    description:
      "Document and share AI learnings, best practices, and reusable assets to build GenAI solutions efficiently.",
    icon: Database,
    url: "https://ai-knowledge-base.onrender.com",
    tagline: "Explore Learnings & Best Practices",
    bgClass: "from-blue-600 to-cyan-600",
    iconBgClass: "bg-blue-100 dark:bg-blue-900/30",
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
    name: "AI Solution Builder",
    description:
      "Design AI application architectures with guided workflows and generate tailored architecture diagrams.",
    icon: Cpu,
    url: "https://solutionbuilder.onrender.com",
    tagline: "Design AI Architectures",
    bgClass: "from-purple-600 to-indigo-600",
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
    name: "AI Notebook",
    description:
      "Collaborative discussion and Q&A platform for uploading documents and saving notes anchored in the Knowledge Base.",
    icon: BookMarked,
    url: "https://ai-notebook.onrender.com/",
    tagline: "Collaborative Notes & Q&A",
    bgClass: "from-emerald-600 to-teal-600",
    iconBgClass: "bg-emerald-100 dark:bg-emerald-900/30",
    detailedDescription: `The AI Notebook provides a collaborative environment for discussions and Q&A related to AI projects. 
    It allows seamless document uploading and integration with the Knowledge Base for contextual reference.
    
    Key features include:
    • Real-time collaborative editing
    • AI-powered document analysis and annotation
    • Integrated Q&A with context-aware responses
    • Version history and change tracking
    • Support for code snippets with syntax highlighting and execution`,
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
    <div id={`platform-${index}`} className="py-16 scroll-mt-16">
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
    <div id="about" className="py-16 scroll-mt-16">
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
    <div id="team" className="py-16 scroll-mt-16">
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
  const navigate = useNavigate();
  const [animateContent, setAnimateContent] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    // Trigger animations after component mount
    const timer = setTimeout(() => {
      setAnimateContent(true);
    }, 100);

    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      clearTimeout(timer);
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  // Show dashboard button for authenticated users
  const goToDashboard = () => {
    navigate("/static");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen">
        <div className="flex flex-col lg:flex-row">
          {/* Content Section (Left Side) */}
          <div className="w-full lg:w-3/5 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-6">
            <div className="max-w-2xl mx-auto lg:mx-0 lg:max-w-none lg:pr-12">
              {/* Header */}
              <div
                className={`transition-all duration-1000 transform ${
                  animateContent
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600 mr-2 sm:mr-3" />
                    <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      AI Academy
                    </span>
                  </div>
                  <div className="flex space-x-2 sm:space-x-4">
                    <a
                      href="#platforms"
                      className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      AI Platforms
                    </a>
                    <a
                      href="#about"
                      className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      About
                    </a>
                    <a
                      href="#team"
                      className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      Team
                    </a>
                  </div>
                </div>
              </div>

              {/* Connected Platforms Section - Teaser Cards */}
              <div id="platforms" className="mb-16 scroll-mt-16">
                <div
                  className={`transition-all duration-1000 transform ${
                    animateContent
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      AI Academy Ecosystem
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      Explore our integrated AI platforms designed to accelerate
                      your learning and development
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {platforms.map((platform, index) => (
                    <div
                      key={platform.name}
                      className={`transition-all duration-1000 transform ${
                        animateContent
                          ? "translate-y-0 opacity-100"
                          : "translate-y-10 opacity-0"
                      }`}
                      style={{ transitionDelay: `${200 + index * 200}ms` }}
                    >
                      <PlatformCard platform={platform} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Login Form Section (Right Side) */}
          <div
            id="signup"
            className="w-full lg:w-2/5 bg-gray-100 dark:bg-gray-800/50 backdrop-blur-lg flex items-center justify-center p-6 lg:p-12 sticky top-0 lg:h-screen"
          >
            <div
              className={`w-full transition-all duration-1000 transform ${
                animateContent
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              {!isAuthenticated ? (
                <AuthForm authMode={authMode} setAuthMode={setAuthMode} />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md mx-auto transform transition-all duration-500 hover:shadow-2xl">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                      <Brain className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      Welcome Back!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      You're already signed in to AI Academy. Continue your
                      learning journey from where you left off!
                    </p>

                    {/* Show platforms after login too */}
                    <div className="mb-6 w-full">
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Access AI Academy Platforms
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {platforms.map((platform) => (
                          <a
                            key={platform.name}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center p-3 rounded-lg bg-gradient-to-r ${platform.bgClass} hover:opacity-90 transition-all`}
                          >
                            <div
                              className={`w-8 h-8 rounded-md ${platform.iconBgClass} flex items-center justify-center mr-3`}
                            >
                              <platform.icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-white">
                                {platform.name}
                              </div>
                              <div className="text-xs text-white/80">
                                {platform.tagline}
                              </div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-white/80" />
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6 w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
                        <Check className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Last Course
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          AI Fundamentals - 60% Complete
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={goToDashboard}
                      className="w-full px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 shadow-lg transform transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                    >
                      Continue Learning
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
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

        <footer className="bg-gray-100 dark:bg-gray-800 py-12 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-8 md:mb-0">
                <div className="flex items-center mb-4">
                  <Brain className="h-8 w-8 text-purple-600 mr-2" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    AI Academy
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
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
                          className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
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
                          className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
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
                            className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
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
