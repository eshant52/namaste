import type { ReactNode } from "react";
import { ContactIdentity } from "./ContactIdentity";

type ContactRowCardProps = {
  name: string;
  username: string;
  avatarUrl?: string | null;
  actions?: ReactNode;
};

export const ContactRowCard = ({
  name,
  username,
  avatarUrl,
  actions,
}: ContactRowCardProps) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <ContactIdentity name={name} username={username} avatarUrl={avatarUrl} />

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
};
