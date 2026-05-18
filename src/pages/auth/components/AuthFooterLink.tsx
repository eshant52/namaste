import { CardFooter } from "@/components/ui/card";
import { Link } from "react-router";

type AuthFooterLinkProps = {
  prefixText: string;
  linkText: string;
  to: string;
};

export const AuthFooterLink = ({
  prefixText,
  linkText,
  to,
}: AuthFooterLinkProps) => {
  return (
    <CardFooter className="mt-2 justify-center text-sm text-muted-foreground">
      {prefixText}{" "}
      <Link
        to={to}
        className="ml-1 text-primary underline underline-offset-4 hover:text-primary/90"
      >
        {linkText}
      </Link>
    </CardFooter>
  );
};
