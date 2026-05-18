import UserSearchResultItem from "./UserSearchResultItem";
import { ContactRowSkeletonList } from "./ContactRowSkeletonList";
import type { SearchContact } from "@/types/contact.types";

type UserSearchResultsProps = {
  users: SearchContact[];
  isLoading: boolean;
  query: string;
  isPending: boolean;
  onSendRequest: (userId: string) => void;
};

export default function UserSearchResults({
  users,
  isLoading,
  query,
  isPending,
  onSendRequest,
}: UserSearchResultsProps) {
  if (!query) return null;

  if (isLoading) {
    return <ContactRowSkeletonList count={2} />;
  }

  if (users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        No users found for &quot;{query}&quot;.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {users.map((user) => (
        <UserSearchResultItem
          key={user.id}
          user={user}
          isPending={isPending}
          onSendRequest={onSendRequest}
        />
      ))}
    </div>
  );
}
