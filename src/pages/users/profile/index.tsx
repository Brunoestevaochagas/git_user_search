import { useEffect } from "react";

import { dispatch, useSelector } from "../../../redux/store";
import { clearUser, getUser, getUserRepos } from "../../../redux/slices/users";

import { useNavigate, useParams } from "react-router-dom";
import { RepoCard } from "./repoCard";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { repos, user } = useSelector((state) => state.users);

  useEffect(() => {
    if (id) {
      try {
        dispatch(getUserRepos(id));
        dispatch(getUser(id));
      } catch (error) {}
    }
    return () => {
      dispatch(clearUser());
    };
  }, [id]);

  return (
    <div id="profile" style={{ padding: 24 }}>
      <div className="card card-content-profile">
        <div className="backdrop-filter">
          <div className="avatar-div">
            <div className="avatar-root">
              <img
                alt="Minimal UI"
                src={user?.avatar_url}
                className="avatar-img"
              />
            </div>
            <div className="name-div">
              <h4>{user?.login}</h4>
              <p>Profile name</p>
            </div>
          </div>
          <div className="img-div">
            <img className="git-img" src="/images/github.png" alt="gitimage" />
          </div>
          <div className="card-footer"></div>
          <div>
            <button onClick={() => navigate("/users")} className="button-back">
              Back
            </button>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="card card-content followers-div">
          <div className="text-div">
            <h4 className="text-number">{user?.followers}</h4>
            <p className="tex-description">Followers</p>
          </div>
          <hr className="followers-divide" />
          <div className="text-div">
            <h4 className="text-number"> {user?.following}</h4>
            <p className="tex-description"> Following</p>
          </div>
          <hr className="followers-divide" />
          <div className="text-div">
            <h4 className="text-number"> {user?.public_repos || 0}</h4>
            <p className="tex-description"> Public Repos</p>
          </div>
        </div>
        {repos.length > 0 ? (
          <div className="card card-content repos-div">
            <h4 className="card-header">Public Repositories</h4>
            <div className="repo-content">
              {repos?.map((repo: any) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/*  <div>user{user?.login}</div>
      <div>followers{user?.followers}</div>
      <div>following{user?.following}</div>
      <div>location{user?.location}</div>
      <div>created_at{user?.created_at}</div>
      <img src={user?.avatar_url} alt="Avatar" />
      <div>
        {repos?.map((repo: any) => (
          <h6 key={repo.id}>{repo.name}</h6>
        ))}
      </div> */}
    </div>
  );
};

export default UserProfile;
