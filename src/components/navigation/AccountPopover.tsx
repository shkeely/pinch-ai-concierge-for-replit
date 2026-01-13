import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, HelpCircle, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWedding } from "@/contexts/WeddingContext";
import { toast } from "sonner";

export default function AccountPopover() {
  const navigate = useNavigate();
  const { wedding } = useWedding();

  const getInitials = () => {
    if (!wedding) return "SP";
    const first = (wedding.couple1 || '').charAt(0).toUpperCase();
    const second = (wedding.couple2 || '').charAt(0).toUpperCase();
    return first && second ? `${first}${second}` : "SP";
  };

  const getDisplayName = () => {
    if (!wedding) return "Your Account";
    if (wedding.couple1 && wedding.couple2) {
      return `${wedding.couple1} & ${wedding.couple2}`;
    }
    return "Your Account";
  };

  const handleSignOut = () => {
    toast.success("Signed out successfully");
    // Future: Add actual sign out logic
  };

  const menuItems = [
    {
      icon: User,
      label: "My Profile",
      onClick: () => navigate("/profile"),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      onClick: () => navigate("/help-support"),
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-indigo-600 text-white text-xs">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-3 w-3 absolute -bottom-1 -right-1 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="space-y-4">
          {/* User Profile Header */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-indigo-600 text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{getDisplayName()}</p>
              <p className="text-xs text-muted-foreground truncate">
                account@wedding.app
              </p>
            </div>
          </div>

          <Separator />

          {/* Menu Items */}
          <ScrollArea className="max-h-[300px]">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="w-full justify-start gap-3 hover:bg-indigo-400 hover:text-white transition-colors"
                    onClick={item.onClick}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>

          <Separator />

          {/* Sign Out */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
