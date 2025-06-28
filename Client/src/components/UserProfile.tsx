import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../contexts/useAuth";

export function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Generate menu items based on authentication state
  const userMenu = isAuthenticated
    ? [
        {
          label: "Profile",
          icon: User,
          onClick: () => {
            navigate("/profile");
            setIsOpen(false);
          },
        },
        {
          label: "Settings",
          icon: Settings,
          onClick: () => {
            navigate("/settings");
            setIsOpen(false);
          },
        },
        {
          label: "Sign out",
          icon: LogOut,
          onClick: () => {
            logout();
            navigate("/static/welcome");
            setIsOpen(false);
          },
        },
      ]
    : [
        {
          label: "Sign in",
          icon: LogIn,
          onClick: () => {
            navigate("/login");
            setIsOpen(false);
          },
        },
        {
          label: "Sign up",
          icon: UserPlus,
          onClick: () => {
            navigate("/signup");
            setIsOpen(false);
          },
        },
      ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {isAuthenticated && user ? (
          <img
            src={
              user.profileImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name
              )}&background=6366F1&color=fff`
            }
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <User className="w-6 h-6" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-xl z-50 border border-gray-200 dark:border-gray-700">
          {isAuthenticated && user && (
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          )}

          {userMenu.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-500 dark:hover:text-white"
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
