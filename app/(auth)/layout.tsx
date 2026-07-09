export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <p className="mb-6 text-center font-heading text-lg font-bold text-brand-navy">
          Frontline Medical
        </p>
        {children}
      </div>
    </div>
  );
}
