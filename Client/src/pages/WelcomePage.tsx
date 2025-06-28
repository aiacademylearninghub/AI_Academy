import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  BookOpen,
  Users,
  ArrowRight,
  UserPlus,
  Mail,
  Lock,
  ChevronRight,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { useAuth } from "../contexts/useAuth";

const features = [
  {
    name: "Comprehensive Curriculum",
    description:
      "Access courses covering AI/ML fundamentals, RAG systems, agents, fine-tuning, evaluation, and more.",
    icon: BookOpen,
  },
  {
    name: "Expert Instructors",
    description:
      "Learn from industry experts with years of experience in AI development and implementation.",
    icon: Users,
  },
  {
    name: "Hands-on Projects",
    description:
      "Apply your knowledge through hands-on projects that simulate real-world AI challenges.",
    icon: Brain,
  },
];

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

// Feature Card Component with animations
function FeatureCard({ feature }: { feature: (typeof features)[0] }) {
  const Icon = feature.icon;

  return (
    <div className="group relative z-10 h-full">
      <Card className="h-full px-6 py-8 flex flex-col transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-xl bg-white dark:bg-gray-800">
        <div className="flex-1 flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40">
            <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            {feature.name}
          </h3>
          <p className="text-base text-gray-600 dark:text-gray-400 flex-grow">
            {feature.description}
          </p>
        </div>
        <div className="mt-6 h-0.5 w-0 bg-purple-500 transition-all duration-500 group-hover:w-full"></div>
      </Card>
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

    return () => clearTimeout(timer);
  }, []);

  // Show dashboard button for authenticated users
  const goToDashboard = () => {
    navigate("/static");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Content Section (Left Side) */}
        <div className="w-full lg:w-3/5 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-6">
          <div className="max-w-2xl mx-auto lg:mx-0 lg:max-w-none lg:pr-12">
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
                    href="#features"
                    className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#"
                    className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Courses
                  </a>
                </div>
              </div>{" "}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Master{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 animate-gradient bg-300%">
                  Artificial Intelligence
                </span>{" "}
                with Expert Guidance
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
                Your journey into the world of AI starts here. Learn from
                industry experts, build practical projects, and advance your
                career with our comprehensive curriculum.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {isAuthenticated ? (
                  <button
                    onClick={goToDashboard}
                    className="px-8 py-4 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center"
                  >
                    <Brain className="mr-2 h-5 w-5" />
                    Go to Dashboard
                  </button>
                ) : (
                  <a
                    href="#signup"
                    className="px-8 py-4 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("signup")
                        ?.scrollIntoView({ behavior: "smooth" });
                      // Set signup mode with a small delay to let the scroll finish
                      setTimeout(() => {
                        setAuthMode("signup");
                      }, 500);
                    }}
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Start for free
                  </a>
                )}
                <a
                  href="#features"
                  className="px-8 py-4 rounded-lg font-medium border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-purple-600 dark:hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transform transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                >
                  Learn more
                  <ChevronRight className="ml-2 h-5 w-5" />
                </a>
              </div>
              <div className="mt-12">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <img
                        key={i}
                        src={`https://randomuser.me/api/portraits/men/${
                          i + 20
                        }.jpg`}
                        alt={`User ${i}`}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900"
                      />
                    ))}
                  </div>
                  <span className="ml-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                    Joined by 5,000+ professionals & learners
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <Check className="mr-1 h-3 w-3" /> Industry-recognized
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    <Check className="mr-1 h-3 w-3" /> Self-paced learning
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    <Check className="mr-1 h-3 w-3" /> Certificate of completion
                  </span>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div
              id="features"
              className="mt-16 sm:mt-24 pt-6 sm:pt-0 scroll-mt-16"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Why Choose AI Academy?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                {features.map((feature, index) => (
                  <div
                    key={feature.name}
                    className={`transition-all duration-1000 transform ${
                      animateContent
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                    style={{ transitionDelay: `${200 + index * 200}ms` }}
                  >
                    <FeatureCard feature={feature} />
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 sm:mt-24 mb-12 lg:mb-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl transform transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl animate-gradient bg-300%">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                Ready to level up your AI skills?
              </h2>
              <p className="text-indigo-100 mb-6 sm:mb-8 text-sm sm:text-base">
                Join thousands of professionals who are already learning with us
                and transform your career.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {isAuthenticated ? (
                  <button
                    onClick={goToDashboard}
                    className="px-8 py-3 rounded-lg font-medium text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 shadow-md transform transition-all duration-300 flex items-center justify-center"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                ) : (
                  <a
                    href="#signup"
                    className="px-8 py-3 rounded-lg font-medium text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 shadow-md transform transition-all duration-300 flex items-center justify-center"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("signup")
                        ?.scrollIntoView({ behavior: "smooth" });
                      // Set signup mode with a small delay to let the scroll finish
                      setTimeout(() => {
                        setAuthMode("signup");
                      }, 500);
                    }}
                  >
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                )}
                <a
                  href="#"
                  className="px-8 py-3 rounded-lg font-medium text-white border-2 border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transform transition-all duration-300 flex items-center justify-center"
                >
                  Browse courses
                </a>
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
    </div>
  );
}
