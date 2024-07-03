import { Exceptions } from "@/lib/exceptions";
import { Coupons } from "@/lib/smart-contract/coupons";
import { getSession } from "@/session";
import { NextRequest } from "next/server";

const fetchRepo = async (owner: string, name: string) => {
  return fetch(`https://api.github.com/repos/${owner}/${name}/branches`).then(
    (res) => res.json()
  );
};

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const owner = searchParams.get("owner");
  const name = searchParams.get("name");
  const branch = searchParams.get("branch");

  const session = await getSession();
  if (!session || !session.user)
    return Response.json({ error: "Unauthorized operation" });

  if (!owner || !name || !branch)
    return Response.json({ error: "owner, name and branch required" });

  const response = await fetchRepo(owner, name);

  if (response.message === "Not Found")
    return Response.json(Exceptions.repo_doesnt_exists);

  const repo = { name, owner, branch };
  const coupon = Coupons.addRepo(repo);

  return Response.json({ response, payload: { coupon, repo } });
};
