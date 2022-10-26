import { useEffect } from "react";

import { dispatch, useSelector } from "../../../redux/store";
import {
  clearRepos,
  clearUser,
  getUser,
  getUserRepos,
  loadMoreUserRepos,
} from "../../../redux/slices/users";

import { useNavigate, useParams } from "react-router-dom";
import { RepoCard } from "./repoCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loading } from "../../../component/loading";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { repos, user, reposInfiniteScroll, error } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    if (id) {
      try {
        dispatch(
          getUserRepos(
            id,
            reposInfiniteScroll.per_page,
            reposInfiniteScroll.page
          )
        );
        dispatch(getUser(id));
      } catch (error) {}
    }
    return () => {
      dispatch(clearUser());
      dispatch(clearRepos());
    };
  }, [id]);

  const loadMore = async () => {
    if (id) {
      try {
        await dispatch(
          loadMoreUserRepos(
            id,
            reposInfiniteScroll.per_page,
            reposInfiniteScroll.page + 1
          )
        );
      } catch (error) {}
    }
  };

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
        {error ? (
          <div className="error">
            <span>{error?.message}</span>
          </div>
        ) : (
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
        )}

        {repos.length > 0 ? (
          <div className="card card-content repos-div">
            <h4 className="card-header">Public Repositories</h4>
            <div className="repo-content">
              <InfiniteScroll
                initialScrollY={0}
                next={() => loadMore()}
                hasMore={reposInfiniteScroll.hasMore}
                loader={
                  <div className="loading">
                    <Loading />
                  </div>
                }
                dataLength={repos.length}
                style={{ overflowY: "hidden" }}
              >
                {repos?.map((repo: any) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </InfiniteScroll>
            </div>
          </div>
        ) : null}

        <div className="error">
          <span>{reposInfiniteScroll?.error?.message}</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
