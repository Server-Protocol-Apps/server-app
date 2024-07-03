import { Exceptions } from "@/lib/exceptions";
import { Coupons } from "@/lib/smart-contract/coupons";
import { getSession } from "@/session";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getSession();
  if (!session || !session.user)
    return Response.json({ error: "Unauthorized operation" });

  const coupon = Coupons.gitHubId(session.user.github.id);

  return Response.json({ payload: { coupon } });
};
