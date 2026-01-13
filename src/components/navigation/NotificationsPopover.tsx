import { Bell, MessageSquare, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { LucideIcon } from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  route: string;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'message',
    icon: MessageSquare,
    title: 'New message from Sarah',
    description: 'Question about parking arrangements',
    time: '5 min ago',
    unread: true,
    route: '/messages',
  },
  {
    id: 2,
    type: 'reminder',
    icon: Calendar,
    title: 'Reminder: Follow up needed',
    description: '3 guests waiting for dietary confirmation',
    time: '1 hour ago',
    unread: true,
    route: '/reminders',
  },
  {
    id: 3,
    type: 'guest',
    icon: Users,
    title: '5 new RSVPs received',
    description: 'All guests confirmed attendance',
    time: '3 hours ago',
    unread: false,
    route: '/guests',
  },
  {
    id: 4,
    type: 'update',
    icon: CheckCircle2,
    title: 'FAQ updated successfully',
    description: 'Shuttle information added',
    time: '1 day ago',
    unread: false,
    route: '/chatbot',
  },
];

export default function NotificationsPopover() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleNotificationClick = (notification: Notification) => {
    navigate(notification.route);
    setIsOpen(false);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="w-4 h-4 md:w-5 md:h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 md:w-96 p-0 bg-card border-border z-50"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="h-5 px-2 text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground h-auto p-0"
            onClick={handleMarkAllRead}
          >
            Mark all read
          </Button>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="divide-y divide-border">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                    notification.unread ? 'bg-muted/20' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      notification.unread ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        notification.unread ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${
                          notification.unread ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {notification.title}
                        </p>
                        {notification.unread && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <div className="px-4 py-3 border-t border-border">
          <Button variant="ghost" className="w-full text-sm hover:bg-indigo-400 hover:text-white">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
