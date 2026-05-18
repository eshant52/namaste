import LogoSvg from "@/components/svg/Logo";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { SquareArrowOutUpRight } from "lucide-react";
import { NavLink } from "react-router";

export const EmptyChatState = () => {
  // return (
  //   <div className="flex h-full flex-1 flex-col items-center justify-center bg-muted/10 p-8 text-center">
  //     <div className="mb-6 rounded-full bg-primary/10 p-6">
  //       <MessageSquare className="size-12 text-primary" />
  //     </div>
  //     <h2 className="mb-2 text-2xl font-bold tracking-tight">Your Messages</h2>
  //     <p className="max-w-100 text-muted-foreground">
  //       Select a chat from the sidebar or start a new conversation to begin
  //       messaging.
  //     </p>
  //   </div>
  // );

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia
          variant={"icon"}
          className="mb-6 size-35 rounded-full bg-green-300 dark:bg-green-200 text-primary-foreground"
        >
          <LogoSvg className="size-15 md:size-25" />
        </EmptyMedia>

        <EmptyTitle className="text-2xl font-bold tracking-tight mb-2">
          Your Messages
        </EmptyTitle>

        <EmptyDescription className="max-w-100 text-muted-foreground">
          Select a chat from the sidebar or start a new conversation to begin
          messaging.
        </EmptyDescription>
      </EmptyHeader>
      <Separator className="max-w-60" />
      <EmptyContent>
        <h1 className="text-muted-foreground">Find new peoples to chat</h1>
        <NavLink to={"/app/contacts"}>
          <Button variant={"link"}>
            Go to Contacts <SquareArrowOutUpRight />
          </Button>
        </NavLink>
      </EmptyContent>
    </Empty>
  );
};
