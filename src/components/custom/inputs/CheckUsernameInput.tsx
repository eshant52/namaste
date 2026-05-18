import { useEffect, useMemo, useState } from "react";
import UsernameInput from "./UsernameInput";
import { useCheckUsernameMutation } from "@/hooks/queries/auth/useCheckUsernameMutation";
import useDebounce from "@/hooks/useDebouce";
import { userCheckUsernameRequestSchema } from "@/schemas/user/auth.zod";

export type UsernameStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "error";

type CheckUsernameInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onStatusChange?: (status: UsernameStatus) => void;
};

export default function CheckUsernameInput(props: CheckUsernameInputProps) {
  const checkUsernameMutation = useCheckUsernameMutation();
  const triggerUsernameCheck = checkUsernameMutation.mutate;
  const onStatusChange = props.onStatusChange;
  const [username, setUsername] = useState("");

  const inputUsername = useMemo<string>(() => {
    if (typeof props.value === "string") {
      return props.value;
    }

    if (typeof props.value === "number") {
      return String(props.value);
    }

    if (Array.isArray(props.value)) {
      return props.value[0] ?? "";
    }

    return username;
  }, [props.value, username]);

  // Debounce the username input to avoid making API calls on every keystroke
  const debouncedUsername = useDebounce(inputUsername, 500);

  // Validate first; only valid values are used as normalized username for API checks.
  const parsedUsername = useMemo(() => {
    const trimmedInput = debouncedUsername.trim();
    if (!trimmedInput) {
      return { normalizedUsername: "", validationError: null as string | null };
    }

    const result =
      userCheckUsernameRequestSchema.shape.username.safeParse(
        debouncedUsername,
      );
    if (!result.success) {
      return {
        normalizedUsername: "",
        validationError: result.error.issues[0]?.message ?? "Invalid username",
      };
    }

    return {
      normalizedUsername: result.data,
      validationError: null as string | null,
    };
  }, [debouncedUsername]);

  const normalizedUsername = parsedUsername.normalizedUsername;
  const validationError = parsedUsername.validationError;

  useEffect(() => {
    if (!normalizedUsername) {
      return;
    }

    triggerUsernameCheck({ username: normalizedUsername });
  }, [normalizedUsername, triggerUsernameCheck]);

  const usernameStatus: UsernameStatus = useMemo(() => {
    if (validationError || normalizedUsername.length < 3) {
      return "idle";
    }

    if (checkUsernameMutation.isError) {
      return "error";
    }

    if (
      debouncedUsername.trim() !== normalizedUsername ||
      checkUsernameMutation.isPending
    ) {
      return "checking";
    }

    if (
      checkUsernameMutation.data?.status === "success" &&
      checkUsernameMutation.data?.data.available === true
    ) {
      return "available";
    }

    if (
      checkUsernameMutation.data?.status === "success" &&
      checkUsernameMutation.data?.data.available === false
    ) {
      return "taken";
    }

    return "idle";
  }, [
    normalizedUsername,
    validationError,
    debouncedUsername,
    checkUsernameMutation.data,
    checkUsernameMutation.isError,
    checkUsernameMutation.isPending,
  ]);

  const usernameStatusText = useMemo(() => {
    if (validationError) {
      return <p className="text-xs text-red-600">{validationError}</p>;
    }

    if (usernameStatus === "checking") {
      return (
        <p className="text-xs text-muted-foreground">Checking username...</p>
      );
    }

    if (usernameStatus === "available") {
      return <p className="text-xs text-green-600">Username is available</p>;
    }

    if (usernameStatus === "taken") {
      return <p className="text-xs text-red-600">Username is already taken</p>;
    }

    if (usernameStatus === "error") {
      return (
        <p className="text-xs text-red-600">
          Unable to check username right now
        </p>
      );
    }

    return null;
  }, [usernameStatus, validationError]);

  useEffect(() => {
    onStatusChange?.(usernameStatus);
  }, [onStatusChange, usernameStatus]);

  return (
    <>
      <UsernameInput
        {...props}
        value={inputUsername}
        onChange={(e) => {
          props.onChange?.(e);
          setUsername(e.target.value);
        }}
      />
      {usernameStatusText}
    </>
  );
}
