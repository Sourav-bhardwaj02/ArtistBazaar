import { useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface LocationData {
  address: string;
  latitude?: number;
  longitude?: number;
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
}

interface LocationPickerProps {
  location: LocationData;
  onLocationChange: (location: LocationData) => void;
  className?: string;
}

// Mock location suggestions for demo
const mockSuggestions = [
  { address: '123 Tech Street, San Francisco, CA 94105', lat: 37.7749, lng: -122.4194 },
  { address: '456 Business Ave, San Francisco, CA 94107', lat: 37.7849, lng: -122.4094 },
  { address: '789 Commerce Blvd, San Francisco, CA 94108', lat: 37.7649, lng: -122.4294 },
  { address: '321 Market Street, San Francisco, CA 94102', lat: 37.7749, lng: -122.4394 },
];

export function LocationPicker({ location, onLocationChange, className }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState(location.address);
  const [suggestions, setSuggestions] = useState<typeof mockSuggestions>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleAddressSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length > 2) {
      setIsSearching(true);
      // Mock API delay
      setTimeout(() => {
        const filtered = mockSuggestions.filter(suggestion =>
          suggestion.address.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
        setIsSearching(false);
      }, 300);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: typeof mockSuggestions[0]) => {
    setSearchQuery(suggestion.address);
    setShowSuggestions(false);
    onLocationChange({
      ...location,
      address: suggestion.address,
      latitude: suggestion.lat,
      longitude: suggestion.lng,
    });
  };

  const handleManualAddressUpdate = () => {
    onLocationChange({
      ...location,
      address: searchQuery,
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Mock reverse geocoding
          const mockAddress = `Current Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setSearchQuery(mockAddress);
          onLocationChange({
            ...location,
            address: mockAddress,
            latitude,
            longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Product Location
          </CardTitle>
          <CardDescription>
            Set pickup and delivery locations for this product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Address Search */}
          <div className="space-y-2">
            <Label htmlFor="address-search">Search Address</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address-search"
                placeholder="Enter address or search location"
                value={searchQuery}
                onChange={(e) => handleAddressSearch(e.target.value)}
                onBlur={handleManualAddressUpdate}
                className="pl-10 pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={getCurrentLocation}
                title="Use current location"
              >
                <Navigation className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <Card className="absolute z-10 w-full mt-1 shadow-lg">
                <CardContent className="p-2">
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto p-2"
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{suggestion.address}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {isSearching && (
              <p className="text-sm text-muted-foreground">Searching locations...</p>
            )}
          </div>

          {/* Mock Map Placeholder */}
          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Interactive Map</p>
              <p className="text-xs text-muted-foreground">Click to pin exact location</p>
              {location.latitude && location.longitude && (
                <Badge variant="secondary" className="mt-2">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </Badge>
              )}
            </div>
          </div>

          {/* Service Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pickup-available">Pickup Available</Label>
                <p className="text-sm text-muted-foreground">
                  Allow customers to pick up this product
                </p>
              </div>
              <Switch
                id="pickup-available"
                checked={location.pickupAvailable}
                onCheckedChange={(checked) =>
                  onLocationChange({ ...location, pickupAvailable: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="delivery-available">Delivery Available</Label>
                <p className="text-sm text-muted-foreground">
                  Offer delivery service for this product
                </p>
              </div>
              <Switch
                id="delivery-available"
                checked={location.deliveryAvailable}
                onCheckedChange={(checked) =>
                  onLocationChange({ ...location, deliveryAvailable: checked })
                }
              />
            </div>
          </div>

          {/* Selected Address Summary */}
          {location.address && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{location.address}</p>
                    <div className="flex gap-2 mt-2">
                      {location.pickupAvailable && (
                        <Badge variant="secondary">Pickup Available</Badge>
                      )}
                      {location.deliveryAvailable && (
                        <Badge variant="secondary">Delivery Available</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}