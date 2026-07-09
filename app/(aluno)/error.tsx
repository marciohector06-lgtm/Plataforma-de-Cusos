"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" aria-hidden />
      </div>
      <div className="space-y-1">
        <p className="font-medium text-brand-navy">Algo deu errado</p>
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar esta página. Tente novamente.
        </p>
      </div>
      <Button onClick={reset} className="mt-2">
        Tentar novamente
      </Button>
    </div>
  );
}
