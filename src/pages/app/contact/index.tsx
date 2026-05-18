import { useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetContactRequests,
  useGetContacts,
  useSearchUsersByUsername,
  useSendContactRequest,
  useUpdateContactRequest,
} from "@/hooks/queries/app";
import ContactSearchInput from "./components/ContactSearchInput";
import UserSearchResults from "./components/UserSearchResults";
import ContactList from "./components/ContactList";
import ContactRequests from "./components/ContactRequests";
import useDebounce from "@/hooks/useDebouce";
import { Button } from "@/components/ui/button";

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [showBlocked, setShowBlocked] = useState(false);
  const debouncedQuery = useDebounce(search.trim(), 400);

  const { data: users = [], isLoading: isSearchLoading } =
    useSearchUsersByUsername(debouncedQuery);
  const { data: contacts = [], isLoading: isContactsLoading } =
    useGetContacts();
  const { data: contactsWithArchived = [], isLoading: isArchivedLoading } =
    useGetContacts(true);
  const { data: incoming = [] } = useGetContactRequests("incoming");
  const { data: outgoing = [] } = useGetContactRequests("outgoing");
  const sendRequest = useSendContactRequest();
  const updateRequest = useUpdateContactRequest();

  const handleUpdateRequest = useMemo(
    () => (requestId: string, action: "accept" | "reject" | "cancel") => {
      updateRequest.mutate({ requestId, action });
    },
    [updateRequest],
  );

  const visibleContacts = useMemo(
    () => contacts.filter((contact) => showBlocked || !contact.blocked),
    [contacts, showBlocked],
  );

  const archivedContacts = useMemo(
    () =>
      contactsWithArchived.filter(
        (contact) => contact.archived && (showBlocked || !contact.blocked),
      ),
    [contactsWithArchived, showBlocked],
  );

  return (
    <main className="flex flex-1 h-full overflow-hidden">
      {/* Left column: Search + Contacts list */}
      <section className="flex flex-col w-full max-w-md border-r h-full">
        <div className="p-4 border-b shrink-0">
          <h1 className="text-xl font-bold mb-4">Contacts</h1>
          <ContactSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Find people by username..."
          />
        </div>

        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-4">
            {/* Search results take priority when a query is active */}
            {debouncedQuery ? (
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Search Results
                </h2>
                <UserSearchResults
                  users={users}
                  isLoading={isSearchLoading}
                  query={debouncedQuery}
                  isPending={sendRequest.isPending}
                  onSendRequest={(userId) => sendRequest.mutate(userId)}
                />
              </section>
            ) : (
              <>
                <section>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      My Contacts
                    </h2>
                    <Button
                      type="button"
                      variant={showBlocked ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setShowBlocked((value) => !value)}
                    >
                      {showBlocked ? "Hide blocked" : "Show blocked"}
                    </Button>
                  </div>
                  <ContactList
                    contacts={visibleContacts}
                    isLoading={isContactsLoading}
                  />
                </section>

                <section className="mt-6">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Archived
                  </h2>
                  <ContactList
                    contacts={archivedContacts}
                    isLoading={isArchivedLoading}
                    emptyMessage="No archived contacts."
                  />
                </section>
              </>
            )}
          </div>
        </ScrollArea>
      </section>

      {/* Right column: Pending Requests */}
      <section className="flex flex-col flex-1 h-full">
        <div className="p-6 border-b shrink-0">
          <h2 className="text-xl font-bold">Requests</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-6">
            <ContactRequests
              incoming={incoming}
              outgoing={outgoing}
              isPending={updateRequest.isPending}
              onAction={handleUpdateRequest}
            />
          </div>
        </ScrollArea>
      </section>
    </main>
  );
}
