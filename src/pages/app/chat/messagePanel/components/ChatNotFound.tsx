import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function ChatNotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full flex-1 flex-col items-center justify-center border-l border-r bg-muted/10 p-8 text-center">
      <div className="mb-5 rounded-full bg-destructive/10 p-5">
        <AlertCircle className="size-10 text-destructive" />
      </div>

      <h2 className="mb-2 text-2xl font-bold tracking-tight">Chat Not Found</h2>
      <p className="mb-6 max-w-100 text-muted-foreground">
        The chat you are looking for does not exist, is not available to your
        account, or has already been removed.
      </p>

      <Button
        variant="outline"
        onClick={() => navigate("/app/chats", { replace: true })}
      >
        Back to Chats
      </Button>
    </div>
  );
}
