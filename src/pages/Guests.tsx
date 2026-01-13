import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit2,
  Trash2,
  Upload,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useWedding } from '@/contexts/WeddingContext';
import { useGuests, useDeleteGuest } from '@/hooks/useGuestsApi';
import { useSegments } from '@/hooks/useSegmentsApi';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

export default function Guests() {
  const { weddingId } = useWedding();
  const { data: guestsData, isLoading: guestsLoading } = useGuests({ 
    weddingId: weddingId || '', 
    page: 1, 
    pageSize: 100 
  });
  const { data: segmentsData, isLoading: segmentsLoading } = useSegments(weddingId || '');
  const deleteGuestMutation = useDeleteGuest();
  
  const guests = guestsData?.guests || [];
  const segments = segmentsData || [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter guests
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone?.includes(searchTerm) ||
      guest.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSegment = selectedSegment === 'all' || 
      guest.segments?.includes(selectedSegment);
    
    return matchesSearch && matchesSegment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredGuests.length / ITEMS_PER_PAGE);
  const paginatedGuests = filteredGuests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDeleteGuest = async (id: string) => {
    if (confirm('Are you sure you want to delete this guest?')) {
      try {
        await deleteGuestMutation.mutateAsync(id);
        toast.success('Guest deleted');
      } catch (error) {
        toast.error('Failed to delete guest');
      }
    }
  };

  const getSegmentName = (segmentName: string) => {
    const segment = segments.find(s => s.name === segmentName);
    return segment?.name || segmentName;
  };

  // Generate a consistent color based on segment name
  const getSegmentColor = (segmentName: string) => {
    const colors = ['#5b6850', '#b7c4f1', '#c8e6c9', '#e1bee7', '#ffe0b2', '#b2dfdb'];
    const index = segmentName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  if (guestsLoading || segmentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-serif font-bold">Guest List</h1>
            </div>
            <p className="text-muted-foreground">
              Manage your {guests.length} guests and their segments
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Guest
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select 
              value={selectedSegment} 
              onValueChange={(value) => {
                setSelectedSegment(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Segments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                {segments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.name}>
                    {segment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Guest Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Segments</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGuests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm || selectedSegment !== 'all' 
                      ? 'No guests match your filters'
                      : 'No guests yet. Add your first guest!'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedGuests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.name}</TableCell>
                    <TableCell>{guest.phone || '-'}</TableCell>
                    <TableCell>{guest.email || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {guest.segments?.map((segmentName) => (
                          <Badge 
                            key={segmentName}
                            variant="secondary"
                            style={{ 
                              backgroundColor: `${getSegmentColor(segmentName)}20`,
                              color: getSegmentColor(segmentName)
                            }}
                          >
                            {getSegmentName(segmentName)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteGuest(guest.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredGuests.length)} of {filteredGuests.length} guests
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Segments Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {segments.map((segment) => {
            const count = guests.filter(g => g.segments?.includes(segment.name)).length;
            return (
              <Card key={segment.id} className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getSegmentColor(segment.name) }}
                  />
                  <span className="font-medium text-sm">{segment.name}</span>
                </div>
                <p className="text-2xl font-serif font-bold">{count}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}