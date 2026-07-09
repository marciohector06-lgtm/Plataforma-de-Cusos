import { Bell, LogOut, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/lib/actions/auth";

interface TopbarProps {
  userName: string;
  userEmail: string;
  profileHref: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Topbar({ userName, userEmail, profileHref }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-2 border-b border-border bg-card/80 px-4 backdrop-blur sm:px-6">
      <Button variant="ghost" size="icon" aria-label="Notificações">
        <Bell className="size-5" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" className="gap-2 px-2" />}
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-brand-navy text-white">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium text-brand-navy sm:inline">
            {userName}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium text-brand-navy">{userName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {userEmail}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<a href={profileHref} />}>
            <UserIcon />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            render={<form action={signOutAction} className="w-full" />}
          >
            <button type="submit" className="flex w-full items-center gap-2">
              <LogOut className="size-4" />
              Sair
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
