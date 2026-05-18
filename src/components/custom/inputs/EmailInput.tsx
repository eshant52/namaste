import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import type { Input } from "../../ui/input";

export default function EmailInput({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type">) {
  return (
    <InputGroup>
      <InputGroupAddon>
        <Mail />
      </InputGroupAddon>
      <InputGroupInput
        type="email"
        className={cn("pr-10", className)}
        {...props}
      />
    </InputGroup>
  );
}
