import { Button } from "@/components/ui/button";
import type { SearchContact } from "@/types/contact.types";
import { ContactRowCard } from "./ContactRowCard";

type UserSearchResultItemProps = {
  user: SearchContact;
  isPending: boolean;
  onSendRequest: (userId: string) => void;
};

export default function UserSearchResultItem({
  user,
  isPending,
  onSendRequest,
}: UserSearchResultItemProps) {
  return (
    <ContactRowCard
      name={user.name}
      username={user.username}
      avatarUrl={user.dp}
      actions={
        <Button
          size="sm"
          onClick={() => onSendRequest(user.id)}
          disabled={isPending}
        >
          Add
        </Button>
      }
    />
  );
}
