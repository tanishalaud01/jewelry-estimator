import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import JewelryEstimatorForm from "@/components/JewelryEstimatorForm";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: valuations } = await supabase
    .from("valuations")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between border-b border-border pb-6">
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Jewelry Value Estimator
            </span>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted">
              Signed in as {user.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/index"
              className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted"
            >
              View index
            </Link>
            <LogoutButton />
          </div>
        </div>

        <JewelryEstimatorForm />

        <section className="mt-10 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            Previous estimates
          </h2>

          {valuations && valuations.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-medium uppercase tracking-wide text-muted">
                    <th className="py-2 font-medium">Item</th>
                    <th className="py-2 font-medium">Metal</th>
                    <th className="py-2 font-medium">Gemstone</th>
                    <th className="py-2 font-medium">Estimate</th>
                    <th className="py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {valuations.map((valuation) => (
                    <tr
                      key={valuation.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2.5 capitalize text-foreground">
                        {valuation.jewelry_type}
                      </td>
                      <td className="py-2.5 capitalize text-foreground">
                        {valuation.purity} {valuation.metal}
                      </td>
                      <td className="py-2.5 capitalize text-foreground">
                        {valuation.gemstone}
                      </td>
                      <td className="py-2.5 font-tabular font-medium text-foreground">
                        ${valuation.estimated_value}
                      </td>
                      <td className="py-2.5 text-muted">
                        {new Date(valuation.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">No estimates saved yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}