import type { ContactRequest } from "@/types/contact.types";
import { ContactRequestSection } from "./ContactRequestSection";

type ContactRequestsProps = {
  incoming: ContactRequest[];
  outgoing: ContactRequest[];
  isPending: boolean;
  onAction: (requestId: string, action: "accept" | "reject" | "cancel") => void;
};

export default function ContactRequests({
  incoming,
  outgoing,
  isPending,
  onAction,
}: ContactRequestsProps) {
  return (
    <div className="flex flex-col gap-8">
      <ContactRequestSection
        title="Incoming Requests"
        emptyText="No incoming requests."
        requests={incoming}
        direction="incoming"
        isPending={isPending}
        onAction={onAction}
        showCount
      />

      <ContactRequestSection
        title="Outgoing Requests"
        emptyText="No outgoing requests."
        requests={outgoing}
        direction="outgoing"
        isPending={isPending}
        onAction={onAction}
      />
    </div>
  );
}
