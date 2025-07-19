import React, { useState, useEffect } from "react";
import { BusStatus } from "@/entities/BusStatus";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Map,
  MapPin,
  Bus,
  Volume2,
  Users,
  Clock,
  Navigation,
  StopCircle,
  Phone,
  Bell,
  Wifi,
  WifiOff,
  Shield
} from "lucide-react";

export default function LiveTracking() {
  const [user, setUser] = useState(null);
  const [activeBus, setActiveBus] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [stopRequested, setStopRequested] = useState(false);

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

  const connectToBus = async (busId) => {
    setConnectionStatus("connecting");
    
    // Simulate connection process
    setTimeout(() => {
      setActiveBus({
        id: busId,
        route_number: "32",
        current_location: { lat: 43.6532, lng: -79.3832 },
        noise_level: "quiet",
        crowding_level: "comfortable",
        driver_rating: 4.8,
        accessibility_features: ["wheelchair_accessible", "audio_announcements", "low_floor"],
        next_stop: "University Avenue",
        estimated_arrival: new Date(Date.now() + 5 * 60 * 1000).toISOString()
      });
      setConnectionStatus("connected");
      setIsTracking(true);
    }, 2000);
  };

  const requestStop = async () => {
    if (!activeBus) return;
    
    setStopRequested(true);
    
    // Simulate stop request
    setTimeout(() => {
      alert("Stop requested successfully! The driver has been notified.");
    }, 1000);
  };

  const callForAssistance = () => {
    if (!activeBus) return;
    alert("Assistance request sent to driver. Help is on the way!");
  };

  const getComfortColor = (level) => {
    switch(level) {
      case "quiet": case "comfortable": case "empty": return "text-green-600 border-green-300";
      case "moderate": case "busy": return "text-yellow-600 border-yellow-300";
      case "loud": case "crowded": return "text-red-600 border-red-300";
      default: return "text-gray-600 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Map className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Live Bus Tracking</h1>
          <p className="text-lg text-gray-600">
            Connect to your bus for real-time updates and remote controls
          </p>
        </div>

        {/* Connection Status */}
        <Alert className={`border-l-4 ${
          connectionStatus === "connected" ? "border-green-500 bg-green-50" :
          connectionStatus === "connecting" ? "border-yellow-500 bg-yellow-50" :
          "border-gray-500 bg-gray-50"
        }`}>
          <div className="flex items-center gap-2">
            {connectionStatus === "connected" ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-gray-600" />
            )}
            <span className="font-medium">
              {connectionStatus === "connected" ? "Connected to Bus" :
               connectionStatus === "connecting" ? "Connecting..." :
               "Not Connected"}
            </span>
          </div>
          <AlertDescription className="mt-2">
            {connectionStatus === "connected" ? 
              `Connected to Route ${activeBus?.route_number}. All features are available.` :
              "Scan the QR code on your bus or enter the bus ID to connect."
            }
          </AlertDescription>
        </Alert>

        {/* Bus Connection */}
        {!isTracking && (
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="w-5 h-5" />
                Connect to Your Bus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                  <div className="text-center">
                    <Bus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">QR Code Scanner</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  Scan the QR code located near the bus entrance or manually enter the bus ID
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => connectToBus("BUS_001")}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                  disabled={connectionStatus === "connecting"}
                >
                  {connectionStatus === "connecting" ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wifi className="w-4 h-4 mr-2" />
                      Connect to Bus
                    </>
                  )}
                </Button>
                <Button variant="outline" className="flex-1">
                  Enter Bus ID
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Bus Tracking */}
        {isTracking && activeBus && (
          <div className="space-y-6">
            {/* Bus Status Card */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bus className="w-5 h-5" />
                    Route {activeBus.route_number}
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Connected
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Comfort Indicators */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">Noise Level</span>
                    </div>
                    <Badge variant="outline" className={getComfortColor(activeBus.noise_level)}>
                      {activeBus.noise_level}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">Crowding</span>
                    </div>
                    <Badge variant="outline" className={getComfortColor(activeBus.crowding_level)}>
                      {activeBus.crowding_level}
                    </Badge>
                  </div>
                </div>

                {/* Next Stop */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Next Stop</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{activeBus.next_stop}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Arriving in {Math.ceil((new Date(activeBus.estimated_arrival) - new Date()) / (1000 * 60))} minutes
                  </p>
                </div>

                {/* Accessibility Features */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Accessibility Features</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeBus.accessibility_features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-blue-600 border-blue-300">
                        {feature.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Remote Controls */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Remote Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={requestStop}
                    disabled={stopRequested}
                    className="h-16 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold"
                  >
                    <StopCircle className="w-6 h-6 mr-2" />
                    {stopRequested ? "Stop Requested" : "Request Stop"}
                  </Button>
                  
                  <Button 
                    onClick={callForAssistance}
                    variant="outline"
                    className="h-16 text-lg font-semibold"
                  >
                    <Bell className="w-6 h-6 mr-2" />
                    Call for Help
                  </Button>
                </div>
                
                <div className="text-center text-sm text-gray-600 mt-4">
                  <p>These controls connect directly to your bus driver</p>
                  <p>Use responsibly and only when needed</p>
                </div>
              </CardContent>
            </Card>

            {/* Live Map Placeholder */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Live Route Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive route map</p>
                    <p className="text-sm text-gray-500">Real-time bus position and upcoming stops</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}