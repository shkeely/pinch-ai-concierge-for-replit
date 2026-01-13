import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWedding } from '@/contexts/WeddingContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone,
  Plus,
  Trash2,
  Edit2,
  Crown,
  UserPlus
} from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'partner';
}

export default function Profile() {
  const { user } = useAuth();
  const { wedding, updateWedding } = useWedding();
  
  const [partners, setPartners] = useState<Partner[]>(
    wedding?.partners?.map(p => ({ ...p, role: 'partner' as const })) || []
  );
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: '', email: '', phone: '' });
  const [editing, setEditing] = useState(false);
  const [couple1, setCouple1] = useState(wedding?.couple1 || '');
  const [couple2, setCouple2] = useState(wedding?.couple2 || '');

  const handleSaveNames = async () => {
    await updateWedding({ couple1, couple2 });
    setEditing(false);
    toast.success('Names updated');
  };

  const handleAddPartner = () => {
    if (!newPartner.name.trim() || !newPartner.email.trim()) {
      toast.error('Please fill in name and email');
      return;
    }

    const partner: Partner = {
      id: Date.now().toString(),
      ...newPartner,
      role: 'partner'
    };

    setPartners([...partners, partner]);
    setNewPartner({ name: '', email: '', phone: '' });
    setShowAddPartner(false);
    toast.success('Partner invited');
  };

  const handleRemovePartner = (id: string) => {
    setPartners(partners.filter(p => p.id !== id));
    toast.success('Partner removed');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-serif font-bold">Profile</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your account and partner access
          </p>
        </div>

        {/* Current User */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src="" />
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {getInitials(user?.email?.split('@')[0] || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-semibold">{user?.email?.split('@')[0]}</h2>
                <Badge variant="secondary">
                  <Crown className="w-3 h-3 mr-1" />
                  Owner
                </Badge>
              </div>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Couple Names</h3>
              {!editing && (
                <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="couple1">Partner 1</Label>
                    <Input
                      id="couple1"
                      value={couple1}
                      onChange={(e) => setCouple1(e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="couple2">Partner 2</Label>
                    <Input
                      id="couple2"
                      value={couple2}
                      onChange={(e) => setCouple2(e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveNames}>Save</Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <p className="text-lg">
                {couple1 && couple2 
                  ? `${couple1} & ${couple2}`
                  : couple1 || couple2 || 'Not set'}
              </p>
            )}
          </div>
        </Card>

        {/* Partner Access */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-serif font-semibold">Partner Access</h3>
              <p className="text-sm text-muted-foreground">
                Invite your partner or wedding planner to collaborate
              </p>
            </div>
            <Button onClick={() => setShowAddPartner(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
          </div>

          {/* Add Partner Form */}
          {showAddPartner && (
            <Card className="p-4 mb-4 bg-muted/30">
              <h4 className="font-medium mb-4">Invite Partner</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="partnerName">Name</Label>
                  <Input
                    id="partnerName"
                    value={newPartner.name}
                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                    placeholder="Partner's name"
                  />
                </div>
                <div>
                  <Label htmlFor="partnerEmail">Email</Label>
                  <Input
                    id="partnerEmail"
                    type="email"
                    value={newPartner.email}
                    onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                    placeholder="partner@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="partnerPhone">Phone (optional)</Label>
                  <Input
                    id="partnerPhone"
                    value={newPartner.phone}
                    onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                    placeholder="+1 555-0100"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddPartner}>Send Invite</Button>
                  <Button variant="outline" onClick={() => setShowAddPartner(false)}>Cancel</Button>
                </div>
              </div>
            </Card>
          )}

          {/* Partners List */}
          <div className="space-y-3">
            {partners.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No partners added yet. Invite someone to help manage your wedding!
              </p>
            ) : (
              partners.map((partner) => (
                <div 
                  key={partner.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-lavender/30 text-primary">
                        {getInitials(partner.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{partner.name}</p>
                      <p className="text-sm text-muted-foreground">{partner.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Partner</Badge>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemovePartner(partner.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}