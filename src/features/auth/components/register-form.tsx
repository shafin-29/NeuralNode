"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const ENTER =
  "animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none";

const stagger = (index: number, step = 60): React.CSSProperties => ({
  animationDelay: `${index * step}ms`,
});

const registerSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const BrandMark = ({ className }: { className?: string }) => {
  return (
    <svg viewBox="0 0 24 24" fill="#000" aria-hidden className={className}>
      <path d="M18.23 19.77 16.26 19.77 12.02 8.48 10.7 12.02 12.02 15.51 12.71 13.79 13.97 17.14 13.01 19.77 10.99 19.77 6.78 8.5 2.57 19.77 0.01 19.77 5.77 4.24 7.79 4.24 9.42 8.48 11.04 4.24 13.03 4.24 14.63 8.48 16.21 4.24 18.77 4.24 15.91 11.97 17.24 15.51 21.43 4.24 24 4.24ZM5.28 19.77 7.47 13.82 8.73 17.14 7.79 19.77Z" />
    </svg>
  );
};

// Inline password input with a show/hide toggle (UI only).
const PasswordField = ({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <InputGroup className={className}>
      <InputGroupInput type={visible ? "text" : "password"} {...props} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          size="icon-sm"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    await authClient.signUp.email(
      {
        name: values.email,
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <section
      data-slot="register"
      className="relative isolate flex min-h-svh items-center justify-center bg-background py-4"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="mx-auto w-full max-w-md px-6">
        <div
          data-slot="register-card"
          className={cn(ENTER, "rounded-sm border border-border bg-card")}
          style={{ boxShadow: "8px 8px 0 0 var(--border)" }}
        >
          <div
            data-slot="register-header"
            className="flex flex-col items-center gap-3 border-b border-border px-6 pb-4 pt-5"
          >
            <BrandMark className={cn(ENTER, "size-7 text-foreground")} />
            <div className="flex flex-col items-center gap-1 text-center">
              <h1
                style={stagger(1)}
                className={cn(
                  ENTER,
                  "font-serif text-3xl font-medium tracking-tight",
                )}
              >
                Get Started
              </h1>
              <p
                style={stagger(2)}
                className={cn(ENTER, "text-xs text-muted-foreground")}
              >
                Create your account to get started
              </p>
            </div>
          </div>

          <form
            data-slot="register-form"
            noValidate
            style={stagger(3)}
            className={cn(ENTER, "p-6")}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup className="gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  disabled={isPending}
                >
                  <Image
                    alt="GitHub"
                    src="/logos/github.svg"
                    width={20}
                    height={20}
                  />
                  Continue with GitHub
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  disabled={isPending}
                >
                  <Image
                    alt="Google"
                    src="/logos/google.svg"
                    width={20}
                    height={20}
                  />
                  Continue with Google
                </Button>
              </div>

              <FieldSeparator className="**:data-[slot=field-separator-content]:bg-card">
                or continue with email
              </FieldSeparator>

              <Field
                className="gap-1.5"
                data-invalid={!!form.formState.errors.email}
              >
                <FieldLabel
                  htmlFor="email"
                  className="text-xs uppercase text-muted-foreground"
                >
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  aria-invalid={!!form.formState.errors.email}
                  {...form.register("email")}
                />
                <FieldError
                  className="text-xs"
                  errors={[form.formState.errors.email]}
                />
              </Field>

              <Field
                className="gap-1.5"
                data-invalid={!!form.formState.errors.password}
              >
                <FieldLabel
                  htmlFor="password"
                  className="text-xs uppercase text-muted-foreground"
                >
                  Password
                </FieldLabel>
                <PasswordField
                  id="password"
                  placeholder="*********"
                  autoComplete="new-password"
                  aria-invalid={!!form.formState.errors.password}
                  {...form.register("password")}
                />
                <FieldError
                  className="text-xs"
                  errors={[form.formState.errors.password]}
                />
              </Field>

              <Field
                className="gap-1.5"
                data-invalid={!!form.formState.errors.confirmPassword}
              >
                <FieldLabel
                  htmlFor="confirmPassword"
                  className="text-xs uppercase text-muted-foreground"
                >
                  Confirm Password
                </FieldLabel>
                <PasswordField
                  id="confirmPassword"
                  placeholder="*********"
                  autoComplete="new-password"
                  aria-invalid={!!form.formState.errors.confirmPassword}
                  {...form.register("confirmPassword")}
                />
                <FieldError
                  className="text-xs"
                  errors={[form.formState.errors.confirmPassword]}
                />
              </Field>

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="group w-full"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing up…
                  </>
                ) : (
                  <>
                    Sign up
                    <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>

          <div
            data-slot="register-footer"
            className="border-t border-border px-6 py-3 text-center"
          >
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
