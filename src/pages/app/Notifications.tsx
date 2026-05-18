import {
  useGetContactRequests,
  useGetNotifications,
  useMarkNotificationRead,
  useRespondGroupInvite,
  useUpdateContactRequest,
} from "@/hooks/queries/app";
import type { NotificationsResponseData } from "@/schemas/user/protected.zod";
import { ContactRequestListItem } from "./notifications/components/ContactRequestListItem";
import { GroupInviteListItem } from "./notifications/components/GroupInviteListItem";
import { NotificationListItem } from "./notifications/components/NotificationListItem";

type NotificationItem = NotificationsResponseData["data"][number];

const labelMap: Record<NotificationItem["type"], string> = {
  contact_request_received: "sent you a contact request",
  contact_request_accepted: "accepted your contact request",
  contact_request_rejected: "rejected your contact request",
  group_invite_received: "invited you to a group",
  group_invite_accepted: "accepted your group invite",
  group_invite_rejected: "rejected your group invite",
  group_member_added: "joined the group",
  group_member_removed: "left the group",
};

export default function NotificationsPage() {
  const { data: notifications = [] } = useGetNotifications();
  const { data: incomingRequests = [] } = useGetContactRequests("incoming");
  const markRead = useMarkNotificationRead();
  const updateRequest = useUpdateContactRequest();
  const respondGroupInvite = useRespondGroupInvite();

  const pendingGroupInvites = notifications.filter(
    (notification) =>
      notification.type === "group_invite_received" &&
      notification.groupInviteId !== null,
  );

  const handleGroupInviteResponse = (
    notification: NotificationItem,
    action: "accept" | "reject",
  ) => {
    if (!notification.groupInviteId) {
      return;
    }

    respondGroupInvite.mutate(
      {
        inviteId: notification.groupInviteId,
        action,
      },
      {
        onSuccess: () => {
          if (!notification.readAt) {
            markRead.mutate(notification.id);
          }
        },
      },
    );
  };

  return (
    <main className="flex flex-1 h-full overflow-hidden">
      <section className="w-full p-6 overflow-y-auto border-r">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <div className="flex flex-col gap-2">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications.</p>
          ) : (
            notifications.map((notification) => (
              <NotificationListItem
                key={notification.id}
                notification={notification}
                label={labelMap[notification.type]}
                isMarking={markRead.isPending}
                onMarkRead={(notificationId) => markRead.mutate(notificationId)}
              />
            ))
          )}
        </div>
      </section>

      <section className="w-full p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Pending Group Invites</h2>
        <div className="mb-8 flex flex-col gap-2">
          {pendingGroupInvites.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No pending group invites.
            </p>
          ) : (
            pendingGroupInvites.map((notification) => (
              <GroupInviteListItem
                key={notification.id}
                notification={notification}
                isPending={respondGroupInvite.isPending}
                onRespond={(action) =>
                  handleGroupInviteResponse(notification, action)
                }
              />
            ))
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">Pending Contact Requests</h2>
        <div className="flex flex-col gap-2">
          {incomingRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No pending requests.
            </p>
          ) : (
            incomingRequests.map((request) => (
              <ContactRequestListItem
                key={request.id}
                request={request}
                isPending={updateRequest.isPending}
                onRespond={(action) =>
                  updateRequest.mutate({
                    requestId: request.id,
                    action,
                  })
                }
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
