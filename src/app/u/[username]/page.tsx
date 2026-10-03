import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioByUsername } from "@/lib/portfolio";
import { MinimalTemplate } from "@/components/templates/minimal-template";
import { ModernTemplate } from "@/components/templates/modern-template";

type Params = Promise<{ username: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await getPortfolioByUsername(username);

  if (!user || !user.profile?.isPublished) {
    return { title: "Portfolio not found" };
  }

  const name = user.profile.fullName || user.username;
  const headline = user.profile.headline || "Portfolio";

  return {
    title: `${name} — ${headline}`,
    description: user.profile.bio?.slice(0, 160) || `Portfolio of ${name}`,
    openGraph: {
      title: `${name} — ${headline}`,
      description: user.profile.bio?.slice(0, 160) || `Portfolio of ${name}`,
      images: user.profile.photoUrl ? [user.profile.photoUrl] : undefined,
    },
  };
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Params;
}) {
  const { username } = await params;
  const user = await getPortfolioByUsername(username);

  if (!user) notFound();

  // Not published -> friendly notice
  if (!user.profile?.isPublished) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">ポートフォリーヨ</h1>
          <p className="text-neutral-700">
            This portfolio is not published yet.
          </p>
          <p className="text-sm text-neutral-500 mt-4">
            If this is your portfolio, log in and enable{" "}
            <span className="font-medium">Published</span> on your{" "}
            <a href="/dashboard/profile" className="underline">
              profile page
            </a>
            .
          </p>
        </div>
      </main>
    );
  }

  const theme = user.profile.theme === "modern" ? "modern" : "minimal";

  return (
    <main>
      {theme === "modern" ? (
        <ModernTemplate data={user} />
      ) : (
        <MinimalTemplate data={user} />
      )}
    </main>
  );
}
