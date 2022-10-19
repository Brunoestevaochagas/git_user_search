import { ReposType } from "../../../@types/User";
import { Icon } from "@iconify/react";

interface UserProps {
  repo: ReposType;
}

export const RepoCard = ({ repo }: UserProps) => {
  return (
    <>
      <div className="repo-div">
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
          <h5 className="repo-name"> {repo?.full_name}</h5>
        </a>
        <p className="repo-description"> {repo?.description}</p>
        <div className="repo-info-container">
          {repo.language ? (
            <div className="repo-info-div">
              <p>{repo.language}</p>
            </div>
          ) : null}

          {repo.stargazers_count ? (
            <div className="repo-info-div">
              <p>
                <Icon icon="ant-design:star-filled" />
                {repo.stargazers_count}
              </p>
            </div>
          ) : null}
          {repo.watchers_count ? (
            <div className="repo-info-div">
              <p>
                <Icon icon="raphael:view" />
                {repo.watchers_count}
              </p>
            </div>
          ) : null}
        </div>
        <hr className="divide" />
      </div>
    </>
  );
};
