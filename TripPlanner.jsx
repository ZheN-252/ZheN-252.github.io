import React, { useState, useEffect } from "react";
import { Trip } from "@/entities/Trip";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Clock, 
  Route,
  Volume2,
  Users,
  Eye,
  Shield,
  Navigation,
  Calendar,
  Search,
  Star,
  Bus,
  ArrowRight
} from "lucide-react";
import StreetViewTour from "../components/streetview/StreetViewTour";

export default function TripPlanner() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    preferences: []
  });
  const [routeOptions, setRouteOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showStreetView, setShowStreetView] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const searchRoutes = async () => {
    if (!formData.origin || !formData.destination) return;
    
    setIsSearching(true);
    
    // Simulate route search with Toronto locations
    setTimeout(() => {
      setRouteOptions([
        {
          id: 1,
          routeNumber: "504 King",
          duration: "28 minutes",
          transfers: 0,
          noiseLevel: "quiet",
          crowdingLevel: "comfortable",
          accessibilityFeatures: ["wheelchair_accessible", "audio_announcements", "low_floor"],
          steps: [
            { stop: "Union Station", time: "2:15 PM", type: "departure" },
            { stop: "King & Bay", time: "2:18 PM", type: "stop" },
            { stop: "King & Yonge", time: "2:25 PM", type: "stop" },
            { stop: "King & Church", time: "2:32 PM", type: "stop" },
            { stop: "Distillery District", time: "2:43 PM", type: "arrival" }
          ]
        },
        {
          id: 2,
          routeNumber: "Line 1 + 506",
          duration: "35 minutes",
          transfers: 1,
          noiseLevel: "moderate",
          crowdingLevel: "busy",
          accessibilityFeatures: ["wheelchair_accessible", "visual_displays"],
          steps: [
            { stop: "Union Station", time: "2:10 PM", type: "departure" },
            { stop: "Bloor-Yonge Station", time: "2:22 PM", type: "transfer" },
            { stop: "Carlton & College", time: "2:35 PM", type: "stop" },
            { stop: "Cabbagetown", time: "2:45 PM", type: "arrival" }
          ]
        }
      ]);
      setIsSearching(false);
    }, 1500);
  };

  const planTrip = async (route) => {
    try {
      const scheduledTime = new Date();
      scheduledTime.setHours(14, 15, 0, 0); // 2:15 PM
      
      await Trip.create({
        origin: formData.origin,
        destination: formData.destination,
        route_number: route.routeNumber,
        scheduled_time: scheduledTime.toISOString(),
        status: "planned"
      });
      
      alert("Trip planned successfully! You'll receive notifications before departure.");
    } catch (error) {
      console.error("Error planning trip:", error);
    }
  };

  const startStreetViewTour = (route) => {
    setSelectedRoute(route);
    setShowStreetView(true);
  };

  const getComfortLevel = (route) => {
    const comfortFactors = [];
    if (route.noiseLevel === "quiet") comfortFactors.push("quiet");
    if (route.crowdingLevel === "comfortable") comfortFactors.push("comfortable");
    if (route.transfers === 0) comfortFactors.push("direct");
    
    return comfortFactors.length >= 2 ? "high" : comfortFactors.length === 1 ? "medium" : "low";
  };

  if (showStreetView) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
        <div className="max-w-6xl mx-auto">
          <StreetViewTour 
            route={selectedRoute} 
            onClose={() => setShowStreetView(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Route className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Plan Your Trip</h1>
          <p className="text-lg text-gray-600">
            Find the most comfortable route through downtown Toronto
          </p>
        </div>

        {/* User Preferences Alert */}
        {user?.accessibility_needs && (
          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Your accessibility preferences are active:</strong> {user.accessibility_needs.join(", ").replace(/_/g, " ")}
              <br />Routes will be filtered to match your comfort level.
            </AlertDescription>
          </Alert>
        )}

        {/* Trip Planning Form */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Navigation className="w-5 h-5" />
              Where would you like to go?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="origin" className="text-base font-medium">From</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="origin"
                    placeholder="e.g., Union Station, Toronto"
                    value={formData.origin}
                    onChange={(e) => handleInputChange('origin', e.target.value)}
                    className="pl-10 text-base h-12"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-base font-medium">To</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="destination"
                    placeholder="e.g., CN Tower, Distillery District"
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    className="pl-10 text-base h-12"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-base font-medium">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="pl-10 text-base h-12"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time" className="text-base font-medium">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="pl-10 text-base h-12"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={searchRoutes}
              disabled={isSearching || !formData.origin || !formData.destination}
              className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-base"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching Toronto Routes...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Find Best Routes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Route Results */}
        {routeOptions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bus className="w-6 h-6" />
              Toronto Transit Routes
            </h2>
            
            <div className="space-y-4">
              {routeOptions.map((route) => (
                <Card key={route.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-100 text-blue-800 text-base px-3 py-1">
                          {route.routeNumber}
                        </Badge>
                        <span className="text-lg font-semibold text-gray-900">{route.duration}</span>
                        {route.transfers === 0 && (
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            Direct
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < (getComfortLevel(route) === "high" ? 5 : getComfortLevel(route) === "medium" ? 3 : 1) 
                                  ? "text-yellow-400 fill-current" 
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">Comfort</span>
                      </div>
                    </div>

                    {/* Route Details */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={`${
                          route.noiseLevel === "quiet" ? "text-green-600 border-green-300" :
                          route.noiseLevel === "moderate" ? "text-yellow-600 border-yellow-300" :
                          "text-red-600 border-red-300"
                        }`}>
                          <Volume2 className="w-3 h-3 mr-1" />
                          {route.noiseLevel}
                        </Badge>
                        
                        <Badge variant="outline" className={`${
                          route.crowdingLevel === "comfortable" ? "text-green-600 border-green-300" :
                          route.crowdingLevel === "busy" ? "text-yellow-600 border-yellow-300" :
                          "text-red-600 border-red-300"
                        }`}>
                          <Users className="w-3 h-3 mr-1" />
                          {route.crowdingLevel}
                        </Badge>
                        
                        {route.accessibilityFeatures.includes("wheelchair_accessible") && (
                          <Badge variant="outline" className="text-blue-600 border-blue-300">
                            <Shield className="w-3 h-3 mr-1" />
                            Accessible
                          </Badge>
                        )}
                      </div>

                      {/* Route Steps */}
                      <div className="space-y-2">
                        {route.steps.map((step, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                            <div className={`w-3 h-3 rounded-full ${
                              step.type === "departure" ? "bg-green-500" :
                              step.type === "arrival" ? "bg-red-500" :
                              step.type === "transfer" ? "bg-orange-500" :
                              "bg-blue-500"
                            }`}></div>
                            <div className="flex-1">
                              <span className="font-medium">{step.stop}</span>
                              <span className="text-sm text-gray-600 ml-2">{step.time}</span>
                            </div>
                            {index < route.steps.length - 1 && (
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button 
                        onClick={() => planTrip(route)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        Plan This Trip
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => startStreetViewTour(route)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Virtual Tour
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}