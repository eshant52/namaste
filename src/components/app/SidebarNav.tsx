import { MessageCircle, Users, Settings, Bell } from "lucide-react";
import { NavLink } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  useGetUnreadNotificationCount,
  useGetUserInfo,
} from "@/hooks/queries/app";
import LogoutButton from "../custom/buttons/LogoutButton";
import ThemeToggleButton from "../custom/buttons/ThemeToggleButton";
import { Button } from "@base-ui/react";
import LogoSvg from "../svg/Logo";
import { cn } from "@/lib/utils";

export const SidebarNav = () => {
  const user = useGetUserInfo();
  const { data: unreadNotificationCount = 0 } = useGetUnreadNotificationCount();

  return (
    <nav className="flex w-16 md:w-20 flex-col items-center border-r bg-muted/30 py-4 h-full shrink-0">
      <div className="mb-8 flex items-center justify-center">
        {/* Placeholder App Logo */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-300 dark:bg-green-200 text-primary-foreground font-bold">
          <LogoSvg />
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1 w-full items-center">
        <Tooltip>
          <TooltipTrigger>
            <NavLink
              to="/app/chats"
              className={({ isActive }) =>
                cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-muted",
                  isActive ? "bg-muted text-primary" : "text-muted-foreground",
                )
              }
            >
              <MessageCircle className="h-5 w-5" />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right">Chats</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <NavLink
              to="/app/contacts"
              className={({ isActive }) =>
                cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-muted",
                  isActive ? "bg-muted text-primary" : "text-muted-foreground",
                )
              }
            >
              <Users className="h-5 w-5" />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right">Contacts</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <NavLink
              to="/app/notifications"
              className={({ isActive }) =>
                cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-muted",
                  isActive ? "bg-muted text-primary" : "text-muted-foreground",
                )
              }
            >
              <Bell className="h-5 w-5" />
              {unreadNotificationCount > 0 ? (
                <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </span>
              ) : null}
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right">Notifications</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-4 items-center w-full">
        <Separator className="w-10" />

        <Tooltip>
          <TooltipTrigger
            render={
              <Button className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted" />
            }
          >
            <Settings className="h-5 w-5" />
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<ThemeToggleButton />} />
          <TooltipContent side="right">Toggle Theme</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<LogoutButton />} />
          <TooltipContent side="right">Log Out</TooltipContent>
        </Tooltip>

        <Avatar className="size-10 mt-2 cursor-pointer hover:opacity-80 transition-opacity ">
          <AvatarImage
            src={
              user.data?.data.dp ||
              "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Felix"
            }
            alt={user.data?.data.name || "User"}
          />
          <AvatarFallback>
            {user.data?.data.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};
