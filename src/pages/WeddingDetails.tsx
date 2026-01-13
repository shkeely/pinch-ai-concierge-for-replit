import { useState, useEffect } from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Shirt,
  Car,
  Hotel,
  Gift,
  Baby,
  Globe,
  Save
} from 'lucide-react';

export default function WeddingDetails() {
  const { wedding, updateWedding, loading } = useWedding();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    date: wedding?.date || '',
    time: wedding?.time || '',
    venue: wedding?.venue || '',
    venueAddress: wedding?.venueAddress || '',
    dressCode: wedding?.dressCode || '',
    parking: wedding?.parking || '',
    hotels: wedding?.hotels || '',
    registry: wedding?.registry || '',
    kidsPolicy: wedding?.kidsPolicy || '',
    websiteUrl: wedding?.websiteUrl || ''
  });

  useEffect(() => {
    if (wedding) {
      setFormData({
        date: wedding.date || '',
        time: wedding.time || '',
        venue: wedding.venue || '',
        venueAddress: wedding.venueAddress || '',
        dressCode: wedding.dressCode || '',
        parking: wedding.parking || '',
        hotels: wedding.hotels || '',
        registry: wedding.registry || '',
        kidsPolicy: wedding.kidsPolicy || '',
        websiteUrl: wedding.websiteUrl || ''
      });
    }
  }, [wedding]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateWedding(formData);
      toast.success('Wedding details saved');
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-serif font-bold">Wedding Details</h1>
          </div>
          <p className="text-muted-foreground">
            Information your AI concierge will use to answer guest questions
          </p>
        </div>

        <div className="space-y-6">
          {/* Date & Time */}
          <Card className="p-6">
            <h2 className="text-lg font-serif font-semibold mb-4">Date & Time</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Wedding Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Ceremony Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Venue */}
          <Card className="p-6">
            <h2 className="text-lg font-serif font-semibold mb-4">Venue</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="venue" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Venue Name
                </Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => handleChange('venue', e.target.value)}
                  placeholder="e.g., The Grand Ballroom"
                />
              </div>
              <div>
                <Label htmlFor="venueAddress">Full Address</Label>
                <Textarea
                  id="venueAddress"
                  value={formData.venueAddress}
                  onChange={(e) => handleChange('venueAddress', e.target.value)}
                  placeholder="123 Main Street, City, State 12345"
                  rows={2}
                />
              </div>
            </div>
          </Card>

          {/* Guest Information */}
          <Card className="p-6">
            <h2 className="text-lg font-serif font-semibold mb-4">Guest Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dressCode" className="flex items-center gap-2">
                  <Shirt className="w-4 h-4" />
                  Dress Code
                </Label>
                <Input
                  id="dressCode"
                  value={formData.dressCode}
                  onChange={(e) => handleChange('dressCode', e.target.value)}
                  placeholder="e.g., Black tie, Cocktail attire, Garden casual"
                />
              </div>
              <div>
                <Label htmlFor="parking" className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Parking Information
                </Label>
                <Textarea
                  id="parking"
                  value={formData.parking}
                  onChange={(e) => handleChange('parking', e.target.value)}
                  placeholder="Describe parking options, valet service, etc."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="hotels" className="flex items-center gap-2">
                  <Hotel className="w-4 h-4" />
                  Recommended Hotels
                </Label>
                <Textarea
                  id="hotels"
                  value={formData.hotels}
                  onChange={(e) => handleChange('hotels', e.target.value)}
                  placeholder="List nearby hotels and any room blocks"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="kidsPolicy" className="flex items-center gap-2">
                  <Baby className="w-4 h-4" />
                  Kids Policy
                </Label>
                <Input
                  id="kidsPolicy"
                  value={formData.kidsPolicy}
                  onChange={(e) => handleChange('kidsPolicy', e.target.value)}
                  placeholder="e.g., Adults only, All ages welcome, Kids under 12 welcome"
                />
              </div>
            </div>
          </Card>

          {/* Additional Info */}
          <Card className="p-6">
            <h2 className="text-lg font-serif font-semibold mb-4">Additional Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="registry" className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Registry Link
                </Label>
                <Input
                  id="registry"
                  type="url"
                  value={formData.registry}
                  onChange={(e) => handleChange('registry', e.target.value)}
                  placeholder="https://registry.example.com/your-registry"
                />
              </div>
              <div>
                <Label htmlFor="websiteUrl" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Wedding Website
                </Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => handleChange('websiteUrl', e.target.value)}
                  placeholder="https://yourwedding.com"
                />
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} size="lg">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}