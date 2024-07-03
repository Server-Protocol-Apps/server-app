import { getSession } from "@/session";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="flex flex-col items-center gap-8 mt-32">
      <span>{`Welcome ${session?.user.github.name}!`}</span>
    </div>
  );
}
