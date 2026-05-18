import { UserSearch } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

type ContactSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function ContactSearchInput({
  value,
  onChange,
  placeholder = "Search by username...",
}: ContactSearchInputProps) {
  return (
    <InputGroup>
      <InputGroupAddon>
        <UserSearch />
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </InputGroup>
  );
}
