import { useState } from "react";
import { Input } from "../../ui/input";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../../ui/input-group";
import { EyeIcon, EyeOffIcon, Key } from "lucide-react";

export default function SecretInput({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type">) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup>
      <InputGroupAddon>
        <Key />
      </InputGroupAddon>
      <InputGroupInput
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          aria-label="Eye icon button to toggle password visibility"
          title="Toggle password visibility"
          size="icon-xs"
          className="cursor-pointer select-none"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
