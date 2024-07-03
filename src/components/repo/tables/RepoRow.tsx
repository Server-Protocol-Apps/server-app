import { Repo } from "@/lib/data/repo";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { VoteAction } from "../VoteAction";
import { SubscriptionAction } from "../SubscriptionAction";
import { Subscription } from "@/lib/data/subscription";
import { useState } from "react";

export const RepoRow = ({
  repo,
  refetch,
}: {
  repo: Repo;
  refetch: () => void;
}) => {
  const [subscription, setSubscription] = useState<Subscription>();
  return (
    <tr>
      <td>
        <div className="flex items-center">
          <span className="mr-2">{repo.name}</span>
          <a
            target="blank"
            href={`https://github.com/${repo.owner}/${repo.name}`}
          >
            <OpenInNewIcon fontSize="small" />
          </a>
        </div>
      </td>
      <td>{repo.owner}</td>
      <td>{repo.branch}</td>
      <td>{repo.votes.toNumber()}</td>
      {repo.approved ? (
        <>
          <td>
            {new Date(repo.approvedTimestamp.toNumber()).toLocaleDateString()}
          </td>
          <td>{repo.subscribers.toNumber()}</td>
          <td>{repo.totalClaimed.toNumber()}</td>
          <td>{subscription ? subscription.totalClaimed.toNumber() : "-"}</td>
        </>
      ) : (
        <></>
      )}

      <td>
        <div className="flex flex-row justify-between">
          <VoteAction repo={repo} refetch={refetch} />
          {repo.approved && (
            <SubscriptionAction
              repo={repo}
              refetch={refetch}
              subscription={subscription}
              setSubscription={setSubscription}
            />
          )}
        </div>
      </td>
    </tr>
  );
};
