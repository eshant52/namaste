import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ContactIdentityProps = {
  name: string;
  username: string;
  avatarUrl?: string | null;
  avatarClassName?: string;
  usernameClassName?: string;
};

export const ContactIdentity = ({
  name,
  username,
  avatarUrl,
  avatarClassName,
  usernameClassName,
}: ContactIdentityProps) => {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className={cn("size-10 shrink-0", avatarClassName)}>
        <AvatarImage src={avatarUrl ?? ""} alt={name} />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-medium">{name}</p>
        <p
          className={cn(
            "truncate text-sm text-muted-foreground",
            usernameClassName,
          )}
        >
          @{username}
        </p>
      </div>
    </div>
  );
};
