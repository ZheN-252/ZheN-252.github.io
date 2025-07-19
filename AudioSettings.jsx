import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Volume2, 
  VolumeX, 
  Headphones, 
  Bell, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  Save,
  Check
} from "lucide-react";

export default function AudioSettings() {
  const [user, setUser] = useState(null);
  const [audioSettings, setAudioSettings] = useState({
    masterVolume: 70,
    announcementVolume: 80,
    alertVolume: 60,
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    enableAnnouncements: true,
    enableAlerts: true,
    enableVibration: true,
    audioQuality: 'high',
    noiseCancellation: true,
    personalizedAlerts: true,
    quietHours: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      // Load existing audio preferences if available
      if (userData.audio_settings) {
        setAudioSettings(prev => ({
          ...prev,
          ...userData.audio_settings
        }));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleSettingChange = (key, value) => {
    setAudioSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const playTestAudio = () => {
    setIsPlaying(true);
    // In a real app, this would play actual audio
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const resetToDefaults = () => {
    setAudioSettings({
      masterVolume: 70,
      announcementVolume: 80,
      alertVolume: 60,
      voiceSpeed: 1.0,
      voicePitch: 1.0,
      enableAnnouncements: true,
      enableAlerts: true,
      enableVibration: true,
      audioQuality: 'high',
      noiseCancellation: true,
      personalizedAlerts: true,
      quietHours: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00'
    });
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData({
        ...user,
        audio_settings: audioSettings
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Volume2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Audio Settings</h1>
          <p className="text-lg text-gray-600">
            Customize your audio experience for better accessibility
          </p>
        </div>

        {/* Save Success Alert */}
        {saveSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <Check className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Audio settings saved successfully! Your preferences are now active.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Audio Controls */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Volume Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">Master Volume</Label>
                <div className="flex items-center gap-4">
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <Slider
                    value={[audioSettings.masterVolume]}
                    onValueChange={(value) => handleSettingChange('masterVolume', value[0])}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium w-8">{audioSettings.masterVolume}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Announcement Volume</Label>
                <div className="flex items-center gap-4">
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <Slider
                    value={[audioSettings.announcementVolume]}
                    onValueChange={(value) => handleSettingChange('announcementVolume', value[0])}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium w-8">{audioSettings.announcementVolume}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Alert Volume</Label>
                <div className="flex items-center gap-4">
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <Slider
                    value={[audioSettings.alertVolume]}
                    onValueChange={(value) => handleSettingChange('alertVolume', value[0])}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium w-8">{audioSettings.alertVolume}%</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={playTestAudio}
                disabled={isPlaying}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Playing Test Audio...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Test Audio Settings
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Voice Settings */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="w-5 h-5" />
              Voice Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-base font-medium">Voice Speed</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Slow</span>
                  <Slider
                    value={[audioSettings.voiceSpeed]}
                    onValueChange={(value) => handleSettingChange('voiceSpeed', value[0])}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600">Fast</span>
                  <span className="text-sm font-medium w-8">{audioSettings.voiceSpeed.toFixed(1)}x</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Voice Pitch</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Low</span>
                  <Slider
                    value={[audioSettings.voicePitch]}
                    onValueChange={(value) => handleSettingChange('voicePitch', value[0])}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600">High</span>
                  <span className="text-sm font-medium w-8">{audioSettings.voicePitch.toFixed(1)}x</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Audio Quality</Label>
              <Select
                value={audioSettings.audioQuality}
                onValueChange={(value) => handleSettingChange('audioQuality', value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Quality (saves battery)</SelectItem>
                  <SelectItem value="medium">Medium Quality</SelectItem>
                  <SelectItem value="high">High Quality (recommended)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Features */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Accessibility Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Transit Announcements</Label>
                  <p className="text-sm text-gray-600">Hear stop announcements and delays</p>
                </div>
                <Switch
                  checked={audioSettings.enableAnnouncements}
                  onCheckedChange={(checked) => handleSettingChange('enableAnnouncements', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Alert Notifications</Label>
                  <p className="text-sm text-gray-600">Audio alerts for important updates</p>
                </div>
                <Switch
                  checked={audioSettings.enableAlerts}
                  onCheckedChange={(checked) => handleSettingChange('enableAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Vibration Feedback</Label>
                  <p className="text-sm text-gray-600">Haptic feedback for alerts</p>
                </div>
                <Switch
                  checked={audioSettings.enableVibration}
                  onCheckedChange={(checked) => handleSettingChange('enableVibration', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Noise Cancellation</Label>
                  <p className="text-sm text-gray-600">Reduce background noise for clearer audio</p>
                </div>
                <Switch
                  checked={audioSettings.noiseCancellation}
                  onCheckedChange={(checked) => handleSettingChange('noiseCancellation', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Personalized Alerts</Label>
                  <p className="text-sm text-gray-600">Customize alerts based on your preferences</p>
                </div>
                <Switch
                  checked={audioSettings.personalizedAlerts}
                  onCheckedChange={(checked) => handleSettingChange('personalizedAlerts', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Quiet Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Enable Quiet Hours</Label>
                <p className="text-sm text-gray-600">Reduce audio volume during specified hours</p>
              </div>
              <Switch
                checked={audioSettings.quietHours}
                onCheckedChange={(checked) => handleSettingChange('quietHours', checked)}
              />
            </div>

            {audioSettings.quietHours && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Start Time</Label>
                  <input
                    type="time"
                    value={audioSettings.quietHoursStart}
                    onChange={(e) => handleSettingChange('quietHoursStart', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">End Time</Label>
                  <input
                    type="time"
                    value={audioSettings.quietHoursEnd}
                    onChange={(e) => handleSettingChange('quietHoursEnd', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-base"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={resetToDefaults}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
          <Button
            onClick={saveSettings}
            disabled={isSaving}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 text-lg"
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