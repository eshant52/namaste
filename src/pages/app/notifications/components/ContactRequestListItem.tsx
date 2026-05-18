import { Button } from "@/components/ui/button";
import type { ContactRequestListResponseData } from "@/schemas/user/protected.zod";

type ContactRequestItem = ContactRequestListResponseData["data"][number];

type ContactRequestListItemProps = {
  request: ContactRequestItem;
  isPending: boolean;
  onRespond: (action: "accept" | "reject") => void;
};

export const ContactRequestListItem = ({
  request,
  isPending,
  onRespond,
}: ContactRequestListItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div>
        <p className="font-medium">{request.contact.name}</p>
        <p className="text-sm text-muted-foreground">
          @{request.contact.username}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={isPending}
          onClick={() => onRespond("accept")}
        >
          Accept
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={isPending}
          onClick={() => onRespond("reject")}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};
