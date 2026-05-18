import { Badge } from "@/components/ui/badge";
import type { ContactRequest } from "@/types/contact.types";
import ContactRequestItem from "./ContactRequestItem";

type Direction = "incoming" | "outgoing";

type ContactRequestSectionProps = {
  title: string;
  emptyText: string;
  requests: ContactRequest[];
  direction: Direction;
  isPending: boolean;
  onAction: (requestId: string, action: "accept" | "reject" | "cancel") => void;
  showCount?: boolean;
};

export const ContactRequestSection = ({
  title,
  emptyText,
  requests,
  direction,
  isPending,
  onAction,
  showCount = false,
}: ContactRequestSectionProps) => {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
        <span>{title}</span>
        {showCount && requests.length > 0 ? (
          <Badge variant="secondary">{requests.length}</Badge>
        ) : null}
      </h2>

      {requests.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {requests.map((request) => (
            <ContactRequestItem
              key={request.id}
              request={request}
              direction={direction}
              isPending={isPending}
              onAction={onAction}
            />
          ))}
        </div>
      )}
    </section>
  );
};
