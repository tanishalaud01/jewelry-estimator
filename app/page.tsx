import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Jewelry Value Estimator
        </h1>

        <p className="mt-4 text-gray-600">
          Estimate the resale value of jewelry based on metal, weight, gemstone,
          condition, and brand tier.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-md bg-black px-5 py-3 text-white"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="rounded-md border border-gray-300 px-5 py-3 text-gray-900"
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}