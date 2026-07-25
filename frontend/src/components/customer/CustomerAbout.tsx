import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Globe, Edit } from 'lucide-react';
import { apiService } from '@/api/api';
import { useToast } from '@/hooks/use-toast';

export default function AboutCustom() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await apiService.getProfile();
        const u = (res as any);
        const user = u?.user || u; // support both shapes
        setProfile(user);
        setForm({
          name: user?.name || '',
          bio: user?.bio || '',
          location: user?.location || '',
          phone: user?.phone || '',
          website: user?.website || '',
        });
      } catch (e: any) {
        toast({ title: 'Failed to load profile', description: e.message || 'Please try again', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async () => {
    try {
      setLoading(true);
      await apiService.updateProfile({
        name: form.name,
        bio: form.bio,
        location: form.location,
        phone: form.phone,
        website: form.website,
      });
      toast({ title: 'Profile updated' });
      setEdit(false);
      // refresh
      const res = await apiService.getProfile();
      const u = (res as any);
      setProfile(u?.user || u);
    } catch (e: any) {
      toast({ title: 'Failed to update', description: e.message || 'Please try again', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">About</h1>
          <p className="text-muted-foreground">View and edit your profile information</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90" onClick={() => setEdit((e) => !e)}>
          <Edit className="h-4 w-4 mr-2" />
          {edit ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.avatar || '/placeholder-avatar.jpg'} alt="Avatar" />
                <AvatarFallback className="text-lg bg-gradient-primary text-primary-foreground">
                  {profile?.name ? profile.name.slice(0,2).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {edit ? (
                  <div className="grid gap-3">
                    <div>
                      <Label>Name</Label>
                      <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Bio</Label>
                      <Textarea value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} />
                    </div>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-2xl">{profile?.name || 'Your Name'}</CardTitle>
                    <CardDescription className="text-base">{profile?.bio || 'Add a short bio about yourself'}</CardDescription>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Contact Information</h3>
              {edit ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Location</Label>
                    <Input value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={profile?.email || ''} disabled />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input value={form.website} onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))} />
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{profile?.location || '—'}</span></div>
                  <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{profile?.phone || '—'}</span></div>
                  <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{profile?.email || '—'}</span></div>
                  <div className="flex items-center gap-3"><Globe className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{profile?.website || '—'}</span></div>
                </div>
              )}
            </div>

            {edit && (
              <div className="flex justify-end">
                <Button onClick={save} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Badges / Quick info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Basic account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Role</Badge>
                <span className="text-sm">{profile?.role || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Member Since</Badge>
                <span className="text-sm">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}