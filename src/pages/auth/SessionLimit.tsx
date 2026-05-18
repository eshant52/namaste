import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useSessionLimitContinueMutation,
  useSessionLimitRevokeMutation,
} from "@/hooks/queries/auth";
import type { UserLoginConflictResponseData } from "@/schemas/user/auth.zod";
import { AuthPageShell } from "./components/AuthPageShell";
import { SessionDeviceCard } from "./components/SessionDeviceCard";

type SessionLimitLocationState = {
  data?: UserLoginConflictResponseData["data"];
};

const formatSessionTime = (ts: number): string => {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SessionLimit() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SessionLimitLocationState | null;

  const initialData = state?.data;
  const [sessions, setSessions] = useState(initialData?.sessions ?? []);
  const [maxSessions] = useState(initialData?.maxSessions ?? 0);
  const [challengeToken] = useState(initialData?.challengeToken ?? "");

  const revokeMutation = useSessionLimitRevokeMutation();
  const continueMutation = useSessionLimitContinueMutation();

  const missingState = useMemo(() => {
    return !challengeToken || sessions.length === 0 || !maxSessions;
  }, [challengeToken, sessions.length, maxSessions]);

  const handleRevoke = async (sessionId: string) => {
    const response = await revokeMutation.mutateAsync({
      challengeToken,
      sessionId,
    });

    if (response.status === "success") {
      setSessions(response.data.sessions);

      if (response.data.canContinue) {
        await handleContinue();
      }
    }
  };

  const handleContinue = async () => {
    const response = await continueMutation.mutateAsync({ challengeToken });
    if (response.status === "success") {
      navigate("/app", { replace: true });
    }
  };

  if (missingState) {
    return (
      <AuthPageShell containerClassName="max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">
              Session challenge expired
            </CardTitle>
            <CardDescription>
              Please sign in again to review and manage your active sessions.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-end">
            <Button onClick={() => navigate("/auth/login", { replace: true })}>
              Back to login
            </Button>
          </CardFooter>
        </Card>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell containerClassName="max-w-2xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Session limit reached</CardTitle>
          <CardDescription>
            You can have up to {maxSessions} active sessions. Revoke one old
            session below, then continue sign in on this device.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {sessions.map((session) => (
            <SessionDeviceCard
              key={session.sessionId}
              session={session}
              formatSessionTime={formatSessionTime}
              isPending={revokeMutation.isPending || continueMutation.isPending}
              onRevoke={handleRevoke}
            />
          ))}
        </CardContent>

        <CardFooter className="justify-end gap-2">
          <Button
            variant="outline"
            disabled={continueMutation.isPending}
            onClick={() => navigate("/auth/login", { replace: true })}
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            disabled={
              continueMutation.isPending ||
              revokeMutation.isPending ||
              sessions.length > maxSessions - 1
            }
          >
            {continueMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Continue sign in</span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </AuthPageShell>
  );
}
