import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Trip } from "@/entities/Trip";
import { BusStatus } from "@/entities/BusStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Route, 
  Map, 
  Clock, 
  Heart, 
  Navigation,
  Volume2,
  Users,
  CreditCard,
  Bell,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home({ setActivePage }) {
  const [user, setUser] = useState(null);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [busAlerts, setBusAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      const trips = await Trip.filter({ status: "planned" }, "-scheduled_time", 3);
      setUpcomingTrips(trips);
      
      // Simulate bus alerts
      setBusAlerts([
        { id: 1, type: "info", message: "Route 32 running 5 minutes late", route: "32" },
        { id: 2, type: "success", message: "Your usual Route 15 is quiet today", route: "15" }
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const quickActions = [
    {
      title: "Plan New Trip",
      description: "Find accessible routes",
      icon: Route,
      color: "bg-blue-500",
      page: "TripPlanner"
    },
    {
      title: "Track Live Bus",
      description: "See real-time info",
      icon: Map,
      color: "bg-green-500",
      page: "LiveTracking"
    },
    {
      title: "Audio Settings",
      description: "Manage notifications",
      icon: Volume2,
      color: "bg-purple-500",
      page: "AudioSettings"
    },
    {
      title: "Family Location",
      description: "Share your journey",
      icon: Users,
      color: "bg-orange-500",
      page: "FamilyFriends"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Navigation className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name || 'Friend'}!
          </h1>
          <p className="text-lg text-gray-600">
            Your accessible transit companion is ready to help
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => (
            <div 
              key={action.title}
              onClick={() => setActivePage(action.page)}
              className="cursor-pointer"
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center shadow-sm`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Alerts Section */}
        {busAlerts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-6 h-6" />
              Transit Updates
            </h2>
            <div className="space-y-3">
              {busAlerts.map((alert) => (
                <Alert key={alert.id} className={`border-l-4 ${
                  alert.type === 'success' ? 'border-green-500 bg-green-50' : 
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' : 
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-center gap-2">
                    {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                    {alert.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                    <Badge variant="outline" className="text-xs">Route {alert.route}</Badge>
                  </div>
                  <AlertDescription className="mt-2 text-sm font-medium">
                    {alert.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Trips */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Upcoming Trips
          </h2>
          
          {upcomingTrips.length === 0 ? (
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Route className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No upcoming trips planned</p>
                <Button 
                  onClick={() => setActivePage('TripPlanner')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Plan Your First Trip
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingTrips.map((trip) => (
                <Card key={trip.id} className="border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-blue-100 text-blue-800">Route {trip.route_number}</Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(trip.scheduled_time).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {trip.origin} → {trip.destination}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setActivePage('TripPlanner')}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Support Section */}
        <Card className="border-0 bg-gradient-to-r from-blue-500 to-green-500 text-white">
          <CardContent className="p-8 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">We're Here to Help</h3>
            <p className="mb-4 opacity-90">
              Your comfort and independence are our priority. Need assistance?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20" onClick={() => setActivePage('FamilyFriends')}>
                Emergency Contact
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Support Center
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}