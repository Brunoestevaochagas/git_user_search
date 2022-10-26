import { useDispatch, useSelector } from "../redux/store";
import { getUsers, setSearchValue } from "../redux/slices/users";
import { Loading } from "../component/loading";
import { useLocation, useNavigate } from "react-router-dom";
import GitLogo from "../component/gitLogo";

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { foundValue, usersInfiniteScroll, searchValue } = useSelector(
    (state) => state.users
  );

  const dispatch = useDispatch();

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchValue(e.target.value));
  };

  const handleSearch = async () => {
    if (searchValue !== foundValue) {
      try {
        await dispatch(getUsers(searchValue, usersInfiniteScroll.per_page, 1));
        pathname !== "/users" && navigate("/users");
      } catch (error) {}
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-group">
        <div className="search-input">
          <input
            placeholder="Search for a Github user, Eg. josealves"
            type="search"
            id="users-search"
            value={searchValue}
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={(e) => handleChanges(e)}
          />
          <button onClick={handleSearch}>
            {usersInfiniteScroll.isLoading ? <Loading /> : "Search"}
          </button>
        </div>
        <div>
          {foundValue ? (
            <small className="found-text">{`Found ${usersInfiniteScroll.count} results for "${foundValue}"`}</small>
          ) : null}
        </div>
      </div>
      <div>
        <GitLogo />
      </div>
    </div>
  );
};
export default Header;
