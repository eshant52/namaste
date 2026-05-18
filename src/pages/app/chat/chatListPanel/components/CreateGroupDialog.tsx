import { isAxiosError } from "axios";
import { Loader2Icon, SearchIcon, UsersIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateGroup, useGetContacts } from "@/hooks/queries/app";
import type { ErrorResponseData } from "@/schemas/error.zod";
import { GroupContactRow } from "./GroupContactRow";

const MAX_GROUP_MEMBERS = 50;
const MAX_INVITABLE_MEMBERS = MAX_GROUP_MEMBERS - 1;

export const CreateGroupDialog = () => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const createGroup = useCreateGroup();
  const { data: contacts = [], isLoading: isContactsLoading } =
    useGetContacts();

  const availableContacts = useMemo(
    () => contacts.filter((item) => !item.blocked),
    [contacts],
  );

  const filteredContacts = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return availableContacts;
    }

    return availableContacts.filter((item) => {
      const normalizedName = item.contact.name.toLowerCase();
      const normalizedUsername = item.contact.username.toLowerCase();
      return (
        normalizedName.includes(query) || normalizedUsername.includes(query)
      );
    });
  }, [availableContacts, searchValue]);

  const selectedContacts = useMemo(
    () =>
      availableContacts.filter((item) =>
        selectedMemberIds.includes(item.contact.id),
      ),
    [availableContacts, selectedMemberIds],
  );

  const resetState = () => {
    setGroupName("");
    setAvatarUrl("");
    setSearchValue("");
    setSelectedMemberIds([]);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen && !createGroup.isPending) {
      resetState();
    }
  };

  const handleToggleMember = (contactId: string) => {
    setSelectedMemberIds((currentIds) => {
      if (currentIds.includes(contactId)) {
        return currentIds.filter((id) => id !== contactId);
      }

      if (currentIds.length >= MAX_INVITABLE_MEMBERS) {
        toast.warning(`You can invite up to ${MAX_INVITABLE_MEMBERS} members.`);
        return currentIds;
      }

      return [...currentIds, contactId];
    });
  };

  const handleCreateGroup = async () => {
    const trimmedName = groupName.trim();

    if (!trimmedName) {
      toast.error("Group name is required.");
      return;
    }

    try {
      await createGroup.mutateAsync({
        name: trimmedName,
        avatarUrl: avatarUrl.trim() ? avatarUrl.trim() : null,
        memberIds: selectedMemberIds,
      });

      toast.success("Group created successfully.");
      setOpen(false);
      resetState();
    } catch (error: unknown) {
      if (isAxiosError<ErrorResponseData>(error)) {
        toast.error(error.response?.data.message ?? "Unable to create group.");
        return;
      }

      toast.error("Unable to create group.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <UsersIcon data-icon="inline-start" />
        New Group
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Give your group a name and select contacts to invite.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="group-name">Group Name</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="group-name"
                placeholder="Weekend Plan"
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                maxLength={255}
                aria-invalid={groupName.trim().length === 0}
              />
            </InputGroup>
            <FieldDescription>
              Required. Keep it short and clear for members.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="group-avatar-url">
              Avatar URL (Optional)
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="group-avatar-url"
                placeholder="https://..."
                value={avatarUrl}
                onChange={(event) => setAvatarUrl(event.target.value)}
              />
            </InputGroup>
          </Field>

          <Field>
            <div className="flex items-center justify-between gap-2">
              <FieldLabel htmlFor="group-member-search">
                Invite Members
              </FieldLabel>
              <Badge variant="outline">
                {selectedMemberIds.length}/{MAX_INVITABLE_MEMBERS} selected
              </Badge>
            </div>

            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                id="group-member-search"
                placeholder="Search contacts by name or username"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
            </InputGroup>

            {selectedContacts.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {selectedContacts.map((item) => (
                  <Badge key={item.contact.id} variant="secondary">
                    {item.contact.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <FieldDescription>
                No members selected yet. You can still create a group with only
                you.
              </FieldDescription>
            )}

            <ScrollArea className="h-64 rounded-lg border p-2">
              {isContactsLoading ? (
                <div className="flex flex-col gap-2 p-1">
                  {[1, 2, 3, 4].map((index) => (
                    <Skeleton key={index} className="h-14 rounded-lg" />
                  ))}
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                  No contacts found.
                </div>
              ) : (
                <div className="flex flex-col gap-2 p-1">
                  {filteredContacts.map((contactItem) => (
                    <GroupContactRow
                      key={contactItem.contact.id}
                      contactItem={contactItem}
                      selected={selectedMemberIds.includes(
                        contactItem.contact.id,
                      )}
                      onToggle={handleToggleMember}
                      disabled={
                        !selectedMemberIds.includes(contactItem.contact.id) &&
                        selectedMemberIds.length >= MAX_INVITABLE_MEMBERS
                      }
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            onClick={handleCreateGroup}
            disabled={createGroup.isPending || groupName.trim().length === 0}
          >
            {createGroup.isPending ? (
              <>
                <Loader2Icon
                  data-icon="inline-start"
                  className="animate-spin"
                />
                Creating...
              </>
            ) : (
              "Create Group"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
