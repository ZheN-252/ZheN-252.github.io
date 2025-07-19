import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Hospital, 
  MapPin, 
  Phone, 
  Clock, 
  Navigation,
  Search,
  Star,
  Stethoscope,
  Heart,
  Brain,
  Shield,
  Route,
  Bus
} from "lucide-react";

export default function MedicalFacilities() {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicalFacilities, setMedicalFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMedicalFacilities();
  }, []);

  useEffect(() => {
    filterFacilities();
  }, [searchTerm, selectedCategory, medicalFacilities]);

  const loadMedicalFacilities = async () => {
    setIsLoading(true);
    
    // Simulate loading Toronto medical facilities
    setTimeout(() => {
      setMedicalFacilities([
        {
          id: 1,
          name: "Toronto General Hospital",
          type: "hospital",
          category: "General Hospital",
          address: "200 Elizabeth St, Toronto, ON M5G 2C4",
          phone: "(416) 340-4800",
          coordinates: { lat: 43.6596, lng: -79.3896 },
          rating: 4.2,
          transitAccess: ["Line 1 - College Station", "Route 506 Carlton"],
          specialties: ["Emergency", "Cardiology", "Neurology", "Surgery"],
          accessibilityFeatures: ["Wheelchair accessible", "Accessible parking", "Audio assistance"],
          hours: "24/7 Emergency",
          distance: "0.8 km"
        },
        {
          id: 2,
          name: "Toronto Western Hospital",
          type: "hospital",
          category: "General Hospital",
          address: "399 Bathurst St, Toronto, ON M5T 2S8",
          phone: "(416) 603-2581",
          coordinates: { lat: 43.6558, lng: -79.4089 },
          rating: 4.0,
          transitAccess: ["Line 1 - Bathurst Station", "Route 511 Bathurst"],
          specialties: ["Emergency", "Orthopedics", "Neurosurgery", "Mental Health"],
          accessibilityFeatures: ["Wheelchair accessible", "Accessible parking", "Visual aids"],
          hours: "24/7 Emergency",
          distance: "1.2 km"
        },
        {
          id: 3,
          name: "Hospital for Sick Children",
          type: "hospital",
          category: "Children's Hospital",
          address: "555 University Ave, Toronto, ON M5G 1X8",
          phone: "(416) 813-1500",
          coordinates: { lat: 43.6578, lng: -79.3871 },
          rating: 4.7,
          transitAccess: ["Line 1 - Dundas Station", "Route 505 Dundas"],
          specialties: ["Pediatrics", "Pediatric Emergency", "Child Development", "Autism Support"],
          accessibilityFeatures: ["Wheelchair accessible", "Sensory-friendly spaces", "Communication aids"],
          hours: "24/7 Emergency",
          distance: "0.5 km"
        },
        {
          id: 4,
          name: "Toronto Rehab Institute",
          type: "clinic",
          category: "Rehabilitation",
          address: "550 University Ave, Toronto, ON M5G 2A2",
          phone: "(416) 597-3422",
          coordinates: { lat: 43.6566, lng: -79.3880 },
          rating: 4.3,
          transitAccess: ["Line 1 - St. Patrick Station", "Route 506 Carlton"],
          specialties: ["Physical Therapy", "Occupational Therapy", "Speech Therapy", "Neurological Rehab"],
          accessibilityFeatures: ["Wheelchair accessible", "Accessible equipment", "Specialized transport"],
          hours: "Mon-Fri 7AM-6PM",
          distance: "0.7 km"
        },
        {
          id: 5,
          name: "CAMH - Centre for Addiction and Mental Health",
          type: "clinic",
          category: "Mental Health",
          address: "1001 Queen St W, Toronto, ON M6J 1H4",
          phone: "(416) 535-8501",
          coordinates: { lat: 43.6434, lng: -79.4186 },
          rating: 4.1,
          transitAccess: ["Line 2 - Ossington Station", "Route 501 Queen"],
          specialties: ["Mental Health", "Addiction Services", "Autism Spectrum", "Anxiety & Depression"],
          accessibilityFeatures: ["Wheelchair accessible", "Quiet rooms", "Sensory accommodations"],
          hours: "Mon-Fri 8AM-5PM, Emergency 24/7",
          distance: "2.1 km"
        },
        {
          id: 6,
          name: "Toronto East General Hospital",
          type: "hospital",
          category: "Community Hospital",
          address: "825 Coxwell Ave, Toronto, ON M4C 3E7",
          phone: "(416) 461-8272",
          coordinates: { lat: 43.6890, lng: -79.3184 },
          rating: 3.9,
          transitAccess: ["Line 2 - Coxwell Station", "Route 92 Woodbine South"],
          specialties: ["Emergency", "Family Medicine", "Seniors Care", "Community Health"],
          accessibilityFeatures: ["Wheelchair accessible", "Accessible parking", "Language interpretation"],
          hours: "24/7 Emergency",
          distance: "4.2 km"
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const filterFacilities = () => {
    let filtered = medicalFacilities;

    if (searchTerm) {
      filtered = filtered.filter(facility => 
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        facility.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(facility => facility.category === selectedCategory);
    }

    setFilteredFacilities(filtered);
  };

  const categories = [
    { id: 'all', label: 'All Facilities', icon: Hospital },
    { id: 'General Hospital', label: 'General Hospitals', icon: Hospital },
    { id: 'Children\'s Hospital', label: 'Children\'s Hospitals', icon: Heart },
    { id: 'Mental Health', label: 'Mental Health', icon: Brain },
    { id: 'Rehabilitation', label: 'Rehabilitation', icon: Stethoscope },
    { id: 'Community Hospital', label: 'Community Hospitals', icon: Shield }
  ];

  const getDirections = (facility) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(facility.address)}&travelmode=transit`;
    window.open(url, '_blank');
  };

  const callFacility = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Hospital className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Facilities</h1>
          <p className="text-lg text-gray-600">
            Find accessible healthcare facilities in downtown Toronto
          </p>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search facilities, specialties, or addresses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-base h-12"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <Alert className="border-blue-200 bg-blue-50">
          <Hospital className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Found <strong>{filteredFacilities.length}</strong> accessible medical facilities in downtown Toronto
          </AlertDescription>
        </Alert>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
            <Card key={facility.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-gray-900 mb-1">
                      {facility.name}
                    </CardTitle>
                    <Badge className="bg-red-100 text-red-800 mb-2">
                      {facility.category}
                    </Badge>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(facility.rating) 
                              ? "text-yellow-400 fill-current" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        {facility.rating} ({facility.distance})
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Hospital className="w-8 h-8 text-red-500 mb-2" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{facility.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{facility.hours}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm">Transit Access:</h4>
                  <div className="flex flex-wrap gap-1">
                    {facility.transitAccess.map((transit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Bus className="w-3 h-3 mr-1" />
                        {transit}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm">Specialties:</h4>
                  <div className="flex flex-wrap gap-1">
                    {facility.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {facility.specialties.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{facility.specialties.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm">Accessibility:</h4>
                  <div className="flex flex-wrap gap-1">
                    {facility.accessibilityFeatures.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-green-600 border-green-300">
                        <Shield className="w-3 h-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => getDirections(facility)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm"
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    Directions
                  </Button>
                  <Button 
                    onClick={() => callFacility(facility.phone)}
                    variant="outline"
                    className="flex-1 text-sm"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredFacilities.length === 0 && (
          <div className="text-center py-12">
            <Hospital className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No facilities found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Emergency Notice */}
        <Alert className="border-red-200 bg-red-50">
          <Hospital className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Emergency:</strong> For medical emergencies, call 911 immediately. 
            This directory is for planning and reference only.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}