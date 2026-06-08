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
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Jewelry Value Estimator
            </h1>
            <p className="mt-2 text-gray-600">Signed in as {user.email}</p>
          </div>

          <LogoutButton />
        </div>

        <JewelryEstimatorForm />

        <section className="mt-10 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900">
            Previous estimates
          </h2>

          {valuations && valuations.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Item</th>
                    <th className="py-2">Metal</th>
                    <th className="py-2">Gemstone</th>
                    <th className="py-2">Estimate</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {valuations.map((valuation) => (
                    <tr key={valuation.id} className="border-b">
                      <td className="py-2 capitalize">
                        {valuation.jewelry_type}
                      </td>
                      <td className="py-2 capitalize">
                        {valuation.purity} {valuation.metal}
                      </td>
                      <td className="py-2 capitalize">
                        {valuation.gemstone}
                      </td>
                      <td className="py-2 font-medium">
                        ${valuation.estimated_value}
                      </td>
                      <td className="py-2">
                        {new Date(valuation.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-gray-600">No estimates saved yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}