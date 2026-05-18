import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ContactsResponseData } from "@/schemas/user/protected.zod";

type ContactListItem = ContactsResponseData["data"][number];

type GroupContactRowProps = {
  contactItem: ContactListItem;
  selected: boolean;
  onToggle: (contactId: string) => void;
  disabled?: boolean;
};

export const GroupContactRow = ({
  contactItem,
  selected,
  onToggle,
  disabled = false,
}: GroupContactRowProps) => {
  const { contact, archived } = contactItem;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2",
        selected && "bg-muted/50",
        disabled && "opacity-70",
      )}
    >
      <Checkbox
        checked={selected}
        disabled={disabled}
        onCheckedChange={() => onToggle(contact.id)}
        aria-label={`Select ${contact.name}`}
      />

      <Avatar className="size-9 border border-border/60">
        <AvatarImage src={contact.dp ?? ""} alt={contact.name} />
        <AvatarFallback>{contact.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{contact.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          @{contact.username}
        </p>
      </div>

      {archived ? <Badge variant="outline">Archived</Badge> : null}
    </div>
  );
};
