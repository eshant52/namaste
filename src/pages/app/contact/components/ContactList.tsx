import ContactListItem from "./ContactListItem";
import { ContactRowSkeletonList } from "./ContactRowSkeletonList";
import type { Contact } from "@/types/contact.types";

type ContactListProps = {
  contacts: Contact[];
  isLoading: boolean;
  emptyMessage?: string;
};

export default function ContactList({
  contacts,
  isLoading,
  emptyMessage = "No contacts yet. Search for people to add!",
}: ContactListProps) {
  if (isLoading) {
    return <ContactRowSkeletonList count={3} />;
  }

  if (contacts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {contacts.map((contact) => (
        <ContactListItem key={contact.id} contact={contact} />
      ))}
    </div>
  );
}
