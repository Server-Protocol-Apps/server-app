import { Claim } from "@/lib/data/claim";
import { RepoPayload } from "@/lib/data/repo";
import { Exceptions } from "@/lib/exceptions";
import { Coupons } from "@/lib/smart-contract/coupons";
import { getSession } from "@/session";
import { NextRequest } from "next/server";

export interface ClaimPayload {
  repo: RepoPayload;
  subscribedAt: number;
}

const fetchCommits = async (
  author: string,
  {
    owner,
    name,
    since, //  ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ,
    branch,
  }: RepoPayload & { since: Date }
) => {
  try {
    return fetch(
      `https://api.github.com/repos/${owner}/${name}/commits?since=${since.toISOString()}&sha=${branch}&author=${author}`
    ).then((res) => res.json());
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const POST = async (req: NextRequest) => {
  const session = await getSession();
  if (!session || !session.user)
    return Response.json({ error: "Unauthorized operation" });

  const {
    user: { github },
  } = session;
  const body = await req.json();
  const { repo, since } = body;

  const response: any[] = await fetchCommits(github.name, {
    ...repo,
    since: new Date(since),
  });
  const commits = response.length;
  if (!commits) {
    return Response.json({ error: Exceptions.no_commits });
  }
  const payload: Claim = {
    commits,
    timestamp: Date.now(),
    userId: github.id.toString(),
  };

  const coupon = Coupons.claim(payload);

  return Response.json({ coupon, payload });
};
