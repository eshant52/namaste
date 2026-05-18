import { Button } from "@/components/ui/button";
import type { ContactRequest } from "@/types/contact.types";
import { ContactRowCard } from "./ContactRowCard";

type Direction = "incoming" | "outgoing";

type ContactRequestItemProps = {
  request: ContactRequest;
  direction: Direction;
  isPending: boolean;
  onAction: (requestId: string, action: "accept" | "reject" | "cancel") => void;
};

export default function ContactRequestItem({
  request,
  direction,
  isPending,
  onAction,
}: ContactRequestItemProps) {
  const { contact } = request;

  return (
    <ContactRowCard
      name={contact.name}
      username={contact.username}
      avatarUrl={contact.dp}
      actions={
        <div className="flex items-center gap-2">
          {direction === "incoming" ? (
            <>
              <Button
                size="sm"
                disabled={isPending}
                onClick={() => onAction(request.id, "accept")}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={isPending}
                onClick={() => onAction(request.id, "reject")}
              >
                Reject
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              disabled={isPending}
              onClick={() => onAction(request.id, "cancel")}
            >
              Cancel
            </Button>
          )}
        </div>
      }
    />
  );
}
