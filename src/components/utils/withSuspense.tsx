import { Suspense, type JSX } from "react";
import { LoadingScreenFallback } from "../custom/loaders/LoadingScreenFallback";

export const withSuspense = (
  Component: React.LazyExoticComponent<() => JSX.Element>,
  fallback?: JSX.Element,
) => (
  <Suspense fallback={fallback ?? <LoadingScreenFallback />}>
    <Component />
  </Suspense>
);
