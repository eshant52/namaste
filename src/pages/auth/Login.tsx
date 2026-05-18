import { useNavigate } from "react-router";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLoginMutation } from "@/hooks/queries/auth";
import {
  userLoginRequestSchema,
  type UserLoginConflictResponseData,
} from "@/schemas/user/auth.zod";
import type { ErrorResponseData } from "@/schemas/error.zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import SecretInput from "@/components/custom/inputs/SecretInput";
import UsernameInput from "@/components/custom/inputs/UsernameInput";
import { isAxiosError } from "axios";
import { AuthPageShell } from "./components/AuthPageShell";
import { AuthFooterLink } from "./components/AuthFooterLink";

export default function Login() {
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const form = useForm({
    formId: "user-login-form",
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await loginMutation.mutateAsync(value);

        if (response.status === "success") {
          navigate("/app");
        }
      } catch (error: unknown) {
        if (!isAxiosError<ErrorResponseData>(error)) {
          return;
        }

        const responseData = error.response?.data;

        if (
          error.response?.status === 409 &&
          responseData?.status === "fail" &&
          responseData?.type === "CONFLICT_ERROR" &&
          responseData?.diagnostics.metadata?.errorCode === "VAL_007"
        ) {
          navigate("/auth/session-limit", {
            state: {
              data: responseData.data as UserLoginConflictResponseData["data"],
            },
          });
        }
      }
    },
    validators: {
      onSubmit: userLoginRequestSchema,
    },
  });

  return (
    <AuthPageShell containerClassName="max-w-sm">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
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
                name="username"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field className="grid gap-2">
                      <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                      <UsernameInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="johndoe"
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
                    <Field className="grid gap-2">
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

              <Field>
                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={form.state.isSubmitting || loginMutation.isPending}
                >
                  {form.state.isSubmitting || loginMutation.isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <span>Login</span>
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <AuthFooterLink
          prefixText="Don't have an account?"
          linkText="Sign up"
          to="/auth/register"
        />
      </Card>
    </AuthPageShell>
  );
}
