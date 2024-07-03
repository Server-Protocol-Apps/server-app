"use client";

import { Button } from "@/components/Button";
import { useLoading } from "@/lib/hooks/useLoading";
import { useNotify } from "@/lib/hooks/useNotify";
import { Fetchers } from "@/utils/fetchers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TableType, useTableStore } from "@/store/table";
import { useProgramStore } from "@/store/smart_contract";

type Branch = { name: string; protected: boolean };

export default function ProposePage() {
  const route = useRouter();
  const { query, sign, confirmation, loading } = useLoading();
  const { setTable } = useTableStore();
  const client = useProgramStore((state) => state.client);
  const notify = useNotify();

  const [[owner, name], setRepo] = useState<[string, string]>(["", ""]);
  const [branch, setBranch] = useState<string>();
  const [branches, setBranches] = useState<string[]>([]);
  const [error, setError] = useState(false);

  const onSubmit = async () => {
    if (!client || !owner || !name || !branch) return;

    const { payload } = await query<any>(() =>
      Fetchers.GET(`/repos?owner=${owner}&name=${name}&branch=${branch}`)
    );

    const tx = await sign(() => client.instructions.propose(payload));
    if (!tx) return;

    await confirmation(tx, () => {
      setTable(TableType.proposed);
      route.push(`/repos`);
    });
  };

  const validate = async (e: any) => {
    setBranches([]);
    const value = e.target.value;
    const regex = /github\.com\/(?<owner>.+)\/(?<name>.+)/;
    if (!value) {
      setError(false);
      return;
    }
    const { owner, name } = regex.exec(value)?.groups ?? {
      owner: null,
      name: null,
    };
    if (!owner || !name) return setError(true);
    setError(false);
    setRepo([owner, name]);
    fetchBranches(owner, name);
  };

  const fetchBranches = async (owner: string, name: string) => {
    const data = await fetch(
      `https://api.github.com/repos/${owner}/${name}/branches`
    ).then((r) => r.json());

    if (data.message === "Not Found") {
      notify("error", "This repo either does not exist or is private");
      return;
    }
    const branches = data
      .sort((a: Branch) => (a.protected ? -1 : 1))
      .map((branch: Branch) => branch.name);

    setBranch(branches[0]);
    setBranches(branches);
  };

  return (
    <div className="flex flex-col items-center mt-16 gap-8">
      <div className="flex flex-col items-center w-9/12 gap-2">
        <label>Repo URL</label>
        <input
          onChange={(e) => validate(e)}
          className={`border-2 rounded-lg p-2 w-full text-center bg-black ${
            error ? "border-red-500" : "border-white"
          }`}
          defaultValue={"https://github.com/<<owner>>/<<name>>"}
        />
        {error && (
          <span className="self-start text-sm text-red-500">Invalid URL</span>
        )}
      </div>
      {branches.length ? (
        <select
          className="border-white bg-black text-center w-24"
          name="select"
          onChange={(e) => setBranch(e.target.value)}
        >
          {branches.map((branch, i) => (
            <option key={i} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      ) : (
        <></>
      )}
      {loading ? (
        loading
      ) : branches.length ? (
        <Button onClick={onSubmit} disabled={error || owner === "" || !branch}>
          Propose
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
}
