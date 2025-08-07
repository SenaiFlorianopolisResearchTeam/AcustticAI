"use client";
import { Suspense, lazy } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const IAContent = lazy(() => import(".//IAcontent"));

export default function IAProtected() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) return <div>Carregando...</div>;

  if (!isAuthenticated) {
    loginWithRedirect();
    return <div>Redirecionando para login...</div>;
  }

  return (
    <Suspense fallback={<div>Carregando IA...</div>}>
      <IAContent />
    </Suspense>
  );
}
