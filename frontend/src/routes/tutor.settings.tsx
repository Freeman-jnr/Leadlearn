import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Loader2, Camera } from 'lucide-react';

export const Route = createFileRoute('/tutor/settings')({
  component: TutorSettingsPage,
});

function TutorSettingsPage() {
  const { profile, isLoading, updateTutor, fetchProfile, uploadAvatar } = useProfile();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [subjects, setSubjects] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setPhone(profile.phone || '');
      if (profile.tutor) {
        setBio(profile.tutor.bio || '');
        setQualifications(profile.tutor.qualifications || '');
        setSubjects(profile.tutor.subjects?.join(', ') || '');
      }
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      await updateTutor({
        firstName,
        lastName,
        phone,
        bio,
        qualifications,
        subjects: subjects.split(',').map(s => s.trim()).filter(Boolean),
      } as any); // Type assertion needed because we added firstName to the API
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !profile) {
    return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      
      <div className="bg-white rounded-3xl p-6 border border-border shadow-[var(--shadow-soft)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg" />
              ) : (
                <div className="h-24 w-24 rounded-full bg-secondary grid place-items-center border-4 border-white shadow-lg text-3xl font-bold text-muted-foreground">
                  {firstName?.[0] || 'T'}
                </div>
              )}
              <label className="absolute bottom-0 right-0 h-8 w-8 bg-primary rounded-full grid place-items-center text-white shadow cursor-pointer hover:scale-105 transition-transform">
                <Camera className="h-4 w-4" />
                <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setIsSaving(true);
                    try {
                      await uploadAvatar(file);
                      setMessage('Profile picture updated successfully!');
                    } catch {
                      setMessage('Failed to upload picture.');
                    } finally {
                      setIsSaving(false);
                    }
                  }
                }} />
              </label>
            </div>
            <div>
              <h3 className="font-bold text-lg">Profile Picture</h3>
              <p className="text-sm text-muted-foreground mt-1">Upload a new avatar.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">First Name</label>
              <input
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Last Name</label>
              <input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1.5">Phone Number</label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Qualifications</label>
            <input
              value={qualifications}
              onChange={e => setQualifications(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary"
              placeholder="e.g. B.Sc Mathematics, PGDE"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Subjects (comma separated)</label>
            <input
              value={subjects}
              onChange={e => setSubjects(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary"
              placeholder="e.g. Mathematics, Physics"
            />
          </div>

          {message && (
            <p className={`text-sm font-semibold ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--gradient-brand)" }}
          >
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
