import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  MapPin, 
  Share2, 
  UserPlus, 
  Phone,
  Mail,
  Navigation,
  Shield,
  Clock,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";

export default function FamilyFriends() {
  const [user, setUser] = useState(null);
  const [trustedContacts, setTrustedContacts] = useState([]);
  const [newContactEmail, setNewContactEmail] = useState('');
  const [locationSharing, setLocationSharing] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    getCurrentLocation();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      // Simulate trusted contacts with Toronto locations
      setTrustedContacts([
        {
          id: 1,
          name: "Mom",
          email: "mom@example.com",
          phone: "(416) 555-0123",
          location: { 
            lat: 43.6532, 
            lng: -79.3832, 
            address: "Union Station, Toronto",
            lastUpdate: new Date(Date.now() - 5 * 60 * 1000)
          },
          status: "online"
        },
        {
          id: 2,
          name: "Sarah (Support Worker)",
          email: "sarah@example.com",
          phone: "(416) 555-0456",
          location: { 
            lat: 43.6426, 
            lng: -79.3871, 
            address: "CN Tower, Toronto",
            lastUpdate: new Date(Date.now() - 15 * 60 * 1000)
          },
          status: "online"
        }
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: 43.6511,
            lng: -79.3470,
            address: "Eaton Centre, Toronto"
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Toronto downtown
          setCurrentLocation({
            lat: 43.6511,
            lng: -79.3470,
            address: "Downtown Toronto"
          });
        }
      );
    }
  };

  const addTrustedContact = async () => {
    if (!newContactEmail.trim()) return;
    
    const newContact = {
      id: Date.now(),
      email: newContactEmail.trim(),
      name: "New Contact",
      phone: "",
      location: null,
      status: "invited"
    };
    
    setTrustedContacts(prev => [...prev, newContact]);
    setNewContactEmail('');
    
    try {
      await User.updateMyUserData({
        ...user,
        trusted_contacts: [...(user.trusted_contacts || []), newContactEmail.trim()]
      });
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const toggleLocationSharing = async () => {
    setLocationSharing(!locationSharing);
    // In a real app, this would update the user's preferences
  };

  const callContact = (contact) => {
    if (contact.phone) {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  const emailContact = (contact) => {
    window.location.href = `mailto:${contact.email}`;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-blue-500";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Family & Friends</h1>
          <p className="text-lg text-gray-600">
            Stay connected with your support network during your journey
          </p>
        </div>

        {/* Location Sharing Status */}
        <Alert className={`border-l-4 ${locationSharing ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className={`w-4 h-4 ${locationSharing ? 'text-green-600' : 'text-yellow-600'}`} />
              <span className="font-medium">
                Location Sharing: {locationSharing ? 'Active' : 'Paused'}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLocationSharing}
              className="flex items-center gap-2"
            >
              {locationSharing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {locationSharing ? 'Pause' : 'Resume'}
            </Button>
          </div>
          <AlertDescription className="mt-2">
            {locationSharing 
              ? "Your trusted contacts can see your location and journey progress."
              : "Your location is hidden from all contacts. Enable to share your journey."
            }
          </AlertDescription>
        </Alert>

        {/* Your Current Location */}
        {currentLocation && (
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Your Current Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-semibold text-gray-900">{currentLocation.address}</p>
                  <p className="text-sm text-gray-600">
                    Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add New Contact */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Add Trusted Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Enter email address"
                value={newContactEmail}
                onChange={(e) => setNewContactEmail(e.target.value)}
                className="flex-1 text-base h-12"
              />
              <Button 
                onClick={addTrustedContact}
                disabled={!newContactEmail.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Trusted contacts will receive an invitation to connect and can see your location when you're traveling.
            </p>
          </CardContent>
        </Card>

        {/* Trusted Contacts */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Trusted Contacts ({trustedContacts.length})
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trustedContacts.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No trusted contacts yet</p>
                <p className="text-sm text-gray-500">Add family members or support workers to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trustedContacts.map((contact) => (
                  <div key={contact.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {contact.name.charAt(0)}
                              </span>
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(contact.status)} rounded-full border-2 border-white`}></div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                          </div>
                          <Badge variant="outline" className={`${
                            contact.status === 'online' ? 'text-green-600 border-green-300' :
                            contact.status === 'invited' ? 'text-blue-600 border-blue-300' :
                            'text-gray-600 border-gray-300'
                          }`}>
                            {contact.status}
                          </Badge>
                        </div>
                        
                        {contact.location && (
                          <div className="ml-13 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Navigation className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{contact.location.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>Updated {Math.floor((Date.now() - contact.location.lastUpdate) / (1000 * 60))} min ago</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {contact.phone && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => callContact(contact)}
                            className="flex items-center gap-1"
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => emailContact(contact)}
                          className="flex items-center gap-1"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Features */}
        <Card className="border-0 bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Emergency Features</h3>
            <p className="mb-4 opacity-90">
              Quick access to help when you need it most
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                <Phone className="w-4 h-4 mr-2" />
                Call Emergency Contact
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Share2 className="w-4 h-4 mr-2" />
                Share Live Location
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Map */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Live Location Map - Downtown Toronto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-green-200 opacity-50"></div>
              <div className="text-center z-10">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-700 font-medium">Interactive Map View</p>
                <p className="text-sm text-gray-600">Downtown Toronto - CN Tower, Union Station, Eaton Centre</p>
                <p className="text-xs text-gray-500 mt-2">Real-time locations of you and your trusted contacts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}