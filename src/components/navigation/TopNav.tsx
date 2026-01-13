import { Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import NotificationsPopover from './NotificationsPopover';
import AccountPopover from './AccountPopover';

const navItems = [
  { label: 'Homepage', path: '/homepage' },
  { label: 'Messages', path: '/messages' },
  { label: 'Concierge', path: '/chatbot' },
  { label: 'Guests', path: '/guests' },
];

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <header data-tour-id="navbar" className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="w-full max-w-none grid grid-cols-[auto_1fr_auto] h-16 items-center px-4 md:px-6">
        {/* Mobile: Hamburger Menu */}
        <div className="flex items-center gap-3 md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-card p-5">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      data-tour-id={item.label.toLowerCase()}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        px-4 py-3 text-base font-medium rounded-lg transition-colors text-left
                        ${isActive
                          ? 'bg-foreground text-background'
                          : 'text-foreground hover:bg-foreground/10'
                        }
                      `}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo - Centered on mobile, left on desktop */}
        <h1 className="justify-self-center md:justify-self-start text-xl md:text-2xl font-serif font-semibold tracking-tight flex-shrink-0">
          PINCH.
        </h1>

        {/* Desktop Navigation Pills - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 rounded-full bg-muted/50 p-1 lg:p-1.5 shadow-sm justify-self-center max-w-[calc(100%-400px)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                data-tour-id={item.label.toLowerCase()}
                onClick={() => navigate(item.path)}
                className={`
                  px-3 lg:px-6 py-1.5 lg:py-2 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap
                  ${isActive
                    ? 'bg-foreground text-background shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <Button
            data-tour-id="settings"
            variant="ghost"
            size="icon"
            className="hidden md:flex rounded-full"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-5 h-5" />
          </Button>

          <div data-tour-id="notifications"><NotificationsPopover /></div>

          <div data-tour-id="profile"><AccountPopover /></div>
        </div>
      </div>
    </header>
  );
}
