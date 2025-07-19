
import React, { useState, useEffect } from "react";
import { 
  Home, 
  Map, 
  Route, 
  Settings, 
  Users, 
  CreditCard, 
  Hospital,
  Volume2,
  Menu,
  X,
  Navigation
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/entities/User";

// Import all page components
import HomePage from "@/pages/Home";
import TripPlannerPage from "@/pages/TripPlanner";
import LiveTrackingPage from "@/pages/LiveTracking";
import FamilyFriendsPage from "@/pages/FamilyFriends";
import PrestoBalancePage from "@/pages/PrestoBalance";
import MedicalFacilitiesPage from "@/pages/MedicalFacilities";
import AudioSettingsPage from "@/pages/AudioSettings";
import SettingsPage from "@/pages/Settings";

const navigationItems = [
  { title: "Home", page: "Home", icon: Home, color: "text-blue-600" },
  { title: "Trip Planner", page: "TripPlanner", icon: Route, color: "text-green-600" },
  { title: "Live Tracking", page: "LiveTracking", icon: Map, color: "text-purple-600" },
  { title: "Family & Friends", page: "FamilyFriends", icon: Users, color: "text-orange-600" },
  { title: "Presto Balance", page: "PrestoBalance", icon: CreditCard, color: "text-indigo-600" },
  { title: "Medical Facilities", page: "MedicalFacilities", icon: Hospital, color: "text-red-600" },
  { title: "Audio Settings", page: "AudioSettings", icon: Volume2, color: "text-teal-600" },
  { title: "Settings", page: "Settings", icon: Settings, color: "text-gray-600" }
];

export default function Layout({ children, currentPageName }) {
  const [activePage, setActivePage] = useState("Home");
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    loadUser();
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.log("User not authenticated");
    }
  };

  const renderActivePage = () => {
    switch (activePage) {
      case "Home":
        return <HomePage setActivePage={setActivePage} />;
      case "TripPlanner":
        return <TripPlannerPage />;
      case "LiveTracking":
        return <LiveTrackingPage />;
      case "FamilyFriends":
        return <FamilyFriendsPage />;
      case "PrestoBalance":
        return <PrestoBalancePage />;
      case "MedicalFacilities":
        return <MedicalFacilitiesPage />;
      case "AudioSettings":
        return <AudioSettingsPage />;
      case "Settings":
        return <SettingsPage />;
      default:
        return <HomePage setActivePage={setActivePage} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Sidebar className="border-r border-blue-100 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-blue-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/d821baf12_IMG_0005.PNG" 
                  alt="The Next Stop Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">The Next Stop</h2>
                <p className="text-sm text-gray-600">Accessible Transit</p>
              </div>
            </div>
            
            {!isOnline && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800 font-medium">Offline Mode</p>
                <p className="text-xs text-orange-600">Some features may be limited</p>
              </div>
            )}
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => setActivePage(item.page)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left ${
                      activePage === item.page
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${activePage === item.page ? 'text-blue-600' : item.color}`} />
                    <span className="font-medium text-lg">{item.title}</span>
                  </button>
              ))}
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-blue-100 p-6">
            {user && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm">
                      {user.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                
                {user.accessibility_needs && user.accessibility_needs.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-600">Active Supports:</p>
                    <div className="flex flex-wrap gap-1">
                      {user.accessibility_needs.slice(0, 2).map((need) => (
                        <Badge key={need} variant="secondary" className="text-xs">
                          {need.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                      {user.accessibility_needs.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.accessibility_needs.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-900">The Next Stop</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {renderActivePage()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
