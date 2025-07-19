import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  Navigation,
  MapPin,
  Clock,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Settings,
  Maximize,
  RotateCcw
} from "lucide-react";

export default function StreetViewTour({ route, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tourSteps, setTourSteps] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [tourSpeed, setTourSpeed] = useState(1);

  useEffect(() => {
    if (route) {
      generateTourSteps();
    }
  }, [route]);

  const generateTourSteps = () => {
    // Simulate Toronto street view tour steps
    const steps = [
      {
        id: 1,
        location: "Union Station - Main Entrance",
        coordinates: { lat: 43.6452, lng: -79.3806 },
        description: "Start your journey at Union Station, Toronto's main transportation hub",
        landmarks: ["CN Tower visible", "Skydome nearby", "Multiple transit connections"],
        accessibility: ["Wheelchair accessible entrance", "Elevator access", "Audio announcements"],
        duration: "30 seconds",
        audioNarration: "Welcome to Union Station. This is the main entrance with full accessibility features."
      },
      {
        id: 2,
        location: "Front Street West",
        coordinates: { lat: 43.6458, lng: -79.3825 },
        description: "Walking along Front Street towards your bus stop",
        landmarks: ["Royal Bank Plaza", "Union Station Bus Terminal", "Pedestrian walkways"],
        accessibility: ["Wide sidewalks", "Tactile paving", "Clear signage"],
        duration: "45 seconds",
        audioNarration: "Now walking along Front Street. Notice the wide sidewalks and clear signage for easy navigation."
      },
      {
        id: 3,
        location: "Bay Street Transit Stop",
        coordinates: { lat: 43.6465, lng: -79.3892 },
        description: "Arriving at your bus stop on Bay Street",
        landmarks: ["TD Centre", "Royal Bank Plaza", "Clear bus shelter"],
        accessibility: ["Covered waiting area", "Real-time displays", "Audio announcements"],
        duration: "60 seconds",
        audioNarration: "Here's your bus stop. The shelter provides protection from weather and has real-time arrival displays."
      },
      {
        id: 4,
        location: "Queen Street West",
        coordinates: { lat: 43.6507, lng: -79.3889 },
        description: "Your bus route continues along Queen Street",
        landmarks: ["Eaton Centre", "City Hall", "Nathan Phillips Square"],
        accessibility: ["Bus accessibility features", "Priority seating", "Audio stop announcements"],
        duration: "90 seconds",
        audioNarration: "Traveling along Queen Street. This route passes major landmarks and shopping areas."
      },
      {
        id: 5,
        location: "Yonge-Dundas Square",
        coordinates: { lat: 43.6561, lng: -79.3802 },
        description: "Approaching your destination at Yonge-Dundas Square",
        landmarks: ["Bright billboards", "Eaton Centre entrance", "Dundas Subway Station"],
        accessibility: ["Multiple exit options", "Elevator access", "Clear wayfinding"],
        duration: "45 seconds",
        audioNarration: "Arriving at Yonge-Dundas Square. Multiple transportation options available here."
      }
    ];
    
    setTourSteps(steps);
  };

  const playTour = () => {
    setIsPlaying(true);
    // In a real app, this would start the virtual tour
  };

  const pauseTour = () => {
    setIsPlaying(false);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetTour = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const currentStepData = tourSteps[currentStep];

  if (!route || tourSteps.length === 0) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-8 text-center">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading virtual tour...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tour Header */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Street View Virtual Tour
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              Step {currentStep + 1} of {tourSteps.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-blue-200 bg-blue-50">
            <Navigation className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Virtual Preview:</strong> Experience your route before traveling. 
              This helps familiarize yourself with the journey and reduce anxiety.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Street View Display */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-0">
          <div className="relative h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
            {/* Simulated Street View */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-16 h-16 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentStepData?.location}
                </h3>
                <p className="text-gray-700 max-w-md mx-auto">
                  {currentStepData?.description}
                </p>
              </div>
            </div>

            {/* Tour Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={isPlaying ? pauseTour : playTour}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextStep}
                    disabled={currentStep === tourSteps.length - 1}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className="text-white hover:bg-white/20"
                  >
                    <Volume2 className={`w-4 h-4 ${audioEnabled ? 'text-white' : 'text-gray-400'}`} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetTour}
                    className="text-white hover:bg-white/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute top-4 left-4 right-4">
              <div className="w-full bg-black/30 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Details */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">What You'll See</h4>
              <ul className="space-y-2">
                {currentStepData?.landmarks.map((landmark, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {landmark}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Accessibility Features</h4>
              <ul className="space-y-2">
                {currentStepData?.accessibility.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Settings className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {audioEnabled && currentStepData?.audioNarration && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Audio Narration</span>
              </div>
              <p className="text-blue-800 text-sm">{currentStepData.audioNarration}</p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Duration: {currentStepData?.duration}</span>
            </div>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <Maximize className="w-4 h-4" />
              Exit Tour
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}