import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings as SettingsIcon, 
  User as UserIcon, 
  Shield, 
  Bell, 
  Phone,
  Save,
  AlertCircle,
  Check
} from "lucide-react";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    accessibility_needs: [],
    preferred_audio_alerts: true,
    noise_tolerance: 'medium',
    crowding_tolerance: 'medium',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    presto_card_number: '',
    trusted_contacts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData({
        full_name: userData.full_name || '',
        email: userData.email || '',
        accessibility_needs: userData.accessibility_needs || [],
        preferred_audio_alerts: userData.preferred_audio_alerts !== false,
        noise_tolerance: userData.noise_tolerance || 'medium',
        crowding_tolerance: userData.crowding_tolerance || 'medium',
        emergency_contact_name: userData.emergency_contact_name || '',
        emergency_contact_phone: userData.emergency_contact_phone || '',
        presto_card_number: userData.presto_card_number || '',
        trusted_contacts: userData.trusted_contacts || []
      });
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAccessibilityChange = (need, checked) => {
    setFormData(prev => ({
      ...prev,
      accessibility_needs: checked 
        ? [...prev.accessibility_needs, need]
        : prev.accessibility_needs.filter(n => n !== need)
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
    setIsSaving(false);
  };

  const accessibilityOptions = [
    { id: "noise_sensitivity", label: "Noise Sensitivity", description: "Prefer quieter buses and routes" },
    { id: "crowding_anxiety", label: "Crowding Anxiety", description: "Prefer less crowded transportation" },
    { id: "visual_processing", label: "Visual Processing Support", description: "Need clear visual cues and signage" },
    { id: "routine_dependency", label: "Routine Dependency", description: "Prefer consistent routes and timing" },
    { id: "communication_support", label: "Communication Support", description: "Need assistance with interactions" },
    { id: "sensory_overload", label: "Sensory Overload Prevention", description: "Require reduced sensory input" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
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
          <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-lg text-gray-600">
            Customize your accessibility preferences and account settings
          </p>
        </div>

        {/* Save Success Alert */}
        {saveSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <Check className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Settings saved successfully! Your preferences have been updated.
            </AlertDescription>
          </Alert>
        )}

        {/* Personal Information */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="text-base h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="text-base h-12 bg-gray-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Preferences */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Accessibility Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Select your accessibility needs:</h3>
              <div className="grid grid-cols-1 gap-4">
                {accessibilityOptions.map((option) => (
                  <div key={option.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200">
                    <Checkbox
                      id={option.id}
                      checked={formData.accessibility_needs.includes(option.id)}
                      onCheckedChange={(checked) => handleAccessibilityChange(option.id, checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={option.id} className="font-medium text-gray-900">
                        {option.label}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="noise_tolerance">Noise Tolerance</Label>
                <Select
                  value={formData.noise_tolerance}
                  onValueChange={(value) => handleInputChange('noise_tolerance', value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Prefer quiet environments</SelectItem>
                    <SelectItem value="medium">Medium - Moderate noise is okay</SelectItem>
                    <SelectItem value="high">High - Comfortable with noise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="crowding_tolerance">Crowding Tolerance</Label>
                <Select
                  value={formData.crowding_tolerance}
                  onValueChange={(value) => handleInputChange('crowding_tolerance', value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Prefer less crowded spaces</SelectItem>
                    <SelectItem value="medium">Medium - Some crowding is okay</SelectItem>
                    <SelectItem value="high">High - Comfortable with crowds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Contact Name</Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  placeholder="Emergency contact name"
                  className="text-base h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Phone Number</Label>
                <Input
                  id="emergency_contact_phone"
                  type="tel"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="text-base h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Presto Card */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Presto Card Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="presto_card_number">Presto Card Number</Label>
              <Input
                id="presto_card_number"
                value={formData.presto_card_number}
                onChange={(e) => handleInputChange('presto_card_number', e.target.value)}
                placeholder="Enter your 16-digit card number"
                className="text-base h-12"
              />
              <p className="text-sm text-gray-600">
                This allows us to show your balance and transaction history
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Checkbox
                id="preferred_audio_alerts"
                checked={formData.preferred_audio_alerts}
                onCheckedChange={(checked) => handleInputChange('preferred_audio_alerts', checked)}
              />
              <Label htmlFor="preferred_audio_alerts" className="text-base">
                Enable audio alerts for balance and transactions
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button
            onClick={saveSettings}
            disabled={isSaving}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}