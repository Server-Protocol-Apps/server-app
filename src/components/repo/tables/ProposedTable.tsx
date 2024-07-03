"use client";

import { RepoRow } from "@/components/repo/tables/RepoRow";
import { PublicKey } from "@solana/web3.js";
import { Repo } from "@/lib/data/repo";
import { SmartContract } from "@/lib/smart-contract";

export default function ProposedTable({
  repos,
  refetch,
}: {
  repos: Repo[];
  refetch: (publicKey: PublicKey, index: number) => void;
}) {
  return (
    <table className="table-auto self-center w-full border-separate border-spacing-2">
      <thead className="text-left">
        <tr>
          <th>Name</th>
          <th>Owner</th>
          <th>Branch</th>
          <th>Votes</th>
        </tr>
      </thead>
      <tbody>
        {repos.map((repo, i) => (
          <RepoRow
            key={i}
            repo={repo}
            refetch={() => refetch(repo.publicKey, i)}
          />
        ))}
        {!repos.length && (
          <span className="text-amber-500">No repos found</span>
        )}
      </tbody>
    </table>
  );
}
