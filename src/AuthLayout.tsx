import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AuthenticationButton from "./AuthenticationButton.tsx";
import SignUpPage from "./components/SignUpForm/SignUpPage.tsx";
import BuoyIcon from "./assets/icons/icon-buoy.svg?react";

const AuthLayout = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen">
      <Card className="min-h-screen rounded-lg">
        <CardContent className="p-0">
          {/* Tab Navigation */}
          <div className="flex items-center px-4">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 rounded-t-lg p-4 text-center font-medium transition-colors ${
                activeTab === "login"
                  ? "border-b-2 border-blue-600 bg-blue-100 font-black text-blue-700 lg:-ml-4"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              Login
            </button>

            <Separator orientation="vertical" className="h-8" />

            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 rounded-t-lg p-4 text-center font-medium transition-all ${
                activeTab === "signup"
                  ? "border-b-2 border-blue-600 bg-blue-100 font-black text-blue-700 lg:-mr-4"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Horizontal Divider */}
          <Separator className="" />

          {/* Content Area */}
          <div className=" lg:p-6">
            {activeTab === "login" ? (
              <div className="flex h-full flex-col items-center justify-center rounded-lg py-4">
                <h1 className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                  Welcome Back
                </h1>
                <div className="w-64 lg:w-96">
                  {" "}
                  <AuthenticationButton variant="body" />
                </div>
                <BuoyIcon className="mt-16 h-24 w-24 animate-bounce fill-orange-050 stroke-indigo-600" />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg">
                <SignUpPage setActiveTab={setActiveTab} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;
