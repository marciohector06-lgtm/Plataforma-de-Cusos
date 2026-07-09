import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  delta?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
}

export function StatCard({ icon: Icon, label, value, delta }: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
          <Icon className="size-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-brand-navy">{value}</p>
            {delta && (
              <span
                className={cn(
                  "text-xs font-medium",
                  delta.trend === "up" && "text-brand-teal-600",
                  delta.trend === "down" && "text-destructive",
                  delta.trend === "neutral" && "text-muted-foreground"
                )}
              >
                {delta.value}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
