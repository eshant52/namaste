import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import type { Input } from "../../ui/input";

export default function UsernameInput({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type">) {
  return (
    <InputGroup>
      <InputGroupAddon>
        <User />
      </InputGroupAddon>
      <InputGroupInput
        type="text"
        className={cn("pr-10", className)}
        {...props}
      />
    </InputGroup>
  );
}
