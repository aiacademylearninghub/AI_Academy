import React from "react";
import { Card } from "../components/ui/Card";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Bell,
  Lock,
  Globe,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Settings
        </h1>

        <div className="space-y-6">
          {/* Appearance Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Sun className="w-6 h-6 text-gray-700 dark:text-gray-300 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Appearance
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 dark:text-gray-300">Dark Mode</p>
                  <p className="text-sm text-gray-500">
                    Toggle between light and dark themes
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-300 dark:bg-gray-600 focus:outline-none"
                >
                  <span
                    className={`${
                      theme === "dark" ? "translate-x-6" : "translate-x-1"
                    } inline-block w-4 h-4 transform bg-white dark:bg-purple-500 rounded-full transition-transform`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Notifications Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Email Notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Receive notifications about new courses
                  </p>
                </div>
                <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-purple-500 focus:outline-none">
                  <span className="inline-block w-4 h-4 transform bg-white rounded-full translate-x-6 transition-transform" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Push Notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Receive browser notifications
                  </p>
                </div>
                <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-300 dark:bg-gray-600 focus:outline-none">
                  <span className="inline-block w-4 h-4 transform bg-white rounded-full translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </Card>

          {/* Security Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Lock className="w-6 h-6 text-gray-700 dark:text-gray-300 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Security
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security
                  </p>
                </div>
                <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-300 dark:bg-gray-600 focus:outline-none">
                  <span className="inline-block w-4 h-4 transform bg-white rounded-full translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="mt-6">
                <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          </Card>

          {/* Language Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Globe className="w-6 h-6 text-gray-700 dark:text-gray-300 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Language
                </h2>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Language
              </label>
              <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
