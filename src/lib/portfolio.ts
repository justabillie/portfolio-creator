import { prisma, withRetry } from "./prisma";

export async function getPortfolioByUsername(username: string) {
  return withRetry(() =>
    prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        profile: true,
        projects: { orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] },
        experiences: { orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }] },
        educations: { orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }] },
        skills: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] },
        certificates: {
          orderBy: [{ sortOrder: "asc" }, { issueDate: "desc" }],
        },
        socialLinks: { orderBy: [{ sortOrder: "asc" }] },
        cvFile: true,
      },
    })
  );
}

export type PortfolioData = NonNullable<
  Awaited<ReturnType<typeof getPortfolioByUsername>>
>;
