import { useNavigate } from "react-router";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/hooks/queries/auth/useRegisterMutation";
import { userRegisterRequestSchema } from "@/schemas/user/auth.zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import SecretInput from "@/components/custom/inputs/SecretInput";
import { toast } from "sonner";
import EmailInput from "@/components/custom/inputs/EmailInput";
import { useSendRegisterEmailOtpMutation } from "@/hooks/queries/auth/useSendRegisterEmailOtpMutation";
import CheckUsernameInput, {
  type UsernameStatus,
} from "@/components/custom/inputs/CheckUsernameInput";
import { AuthPageShell } from "./components/AuthPageShell";
import { AuthFooterLink } from "./components/AuthFooterLink";

export default function Register() {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation({ showToast: true });
  const sendRegisterEmailOtpMutation = useSendRegisterEmailOtpMutation();
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");

  const form = useForm({
    formId: "user-register-form",
    defaultValues: {
      name: "",
      email: "",
      username: "",
      emailOtp: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (usernameStatus === "checking") {
        toast.error("Please wait while we verify the username");
        return;
      }

      if (usernameStatus === "taken") {
        toast.error("Username is already taken");
        return;
      }

      if (usernameStatus === "error") {
        toast.error("Unable to verify username right now");
        return;
      }

      if (usernameStatus !== "available") {
        toast.error("Please enter a valid available username");
        return;
      }

      registerMutation.mutate(value, {
        onSuccess: () => {
          navigate("/auth/login");
          toast.info("Please login to continue.");
        },
      });
    },
    validators: {
      onSubmit: userRegisterRequestSchema,
    },
  });

  return (
    <AuthPageShell containerClassName="max-w-sm">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id={form.formId}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field aria-invalid={isInvalid} className="grid gap-2">
                      <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="John Doe"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors}
                          className="text-xs"
                        />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const emailValue = field.state.value.trim();
                  return (
                    <Field aria-invalid={isInvalid} className="grid gap-2">
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <EmailInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="m@example.com"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors}
                          className="text-xs"
                        />
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (!emailValue) {
                            toast.error("Enter email first");
                            return;
                          }

                          sendRegisterEmailOtpMutation.mutate({
                            email: emailValue,
                          });
                        }}
                        disabled={sendRegisterEmailOtpMutation.isPending}
                        className="justify-self-start"
                      >
                        {sendRegisterEmailOtpMutation.isPending ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </Field>
                  );
                }}
              />

              <form.Field
                name="emailOtp"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field aria-invalid={isInvalid} className="grid gap-2">
                      <FieldLabel htmlFor={field.name}>Email OTP</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        inputMode="numeric"
                        pattern="\d{6}"
                        autoComplete="one-time-code"
                        aria-invalid={isInvalid}
                        required
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors}
                          className="text-xs"
                        />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="username"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field aria-invalid={isInvalid} className="grid gap-2">
                      <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                      <CheckUsernameInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onStatusChange={setUsernameStatus}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="johndoe123"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors}
                          className="text-xs"
                        />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field aria-invalid={isInvalid} className="grid gap-2">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <SecretInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="••••••••"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors}
                          className="text-xs"
                        />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="confirmPassword"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field aria-invalid={isInvalid} className="grid gap-2">
                      <FieldLabel htmlFor={field.name}>
                        Confirm Password
                      </FieldLabel>
                      <SecretInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="••••••••"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors}
                          className="text-xs"
                        />
                      )}
                    </Field>
                  );
                }}
              />

              <Field orientation={"responsive"}>
                <Button
                  type="submit"
                  className="mt-2 flex items-center gap-2"
                  disabled={
                    form.state.isSubmitting ||
                    registerMutation.isPending ||
                    usernameStatus !== "available"
                  }
                >
                  {form.state.isSubmitting || registerMutation.isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Signing up...</span>
                    </>
                  ) : (
                    <span>Sign up</span>
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <AuthFooterLink
          prefixText="Already have an account?"
          linkText="Log in"
          to="/auth/login"
        />
      </Card>
    </AuthPageShell>
  );
}
