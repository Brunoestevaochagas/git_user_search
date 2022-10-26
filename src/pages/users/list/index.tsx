import InfiniteScroll from "react-infinite-scroll-component";
import { dispatch, useSelector } from "../../../redux/store";
import { loadMoreUsers } from "../../../redux/slices/users";
import { UserCard } from "./userCard";
import { Loading } from "../../../component/loading";

const UserList = () => {
  const { users, usersInfiniteScroll, searchValue } = useSelector(
    (state) => state.users
  );

  const loadMore = async () => {
    if (searchValue) {
      try {
        await dispatch(
          loadMoreUsers(
            searchValue,
            usersInfiniteScroll.per_page,
            usersInfiniteScroll.page + 1
          )
        );
      } catch (error) {}
    }
  };

  return (
    <div id="user-list">
      <InfiniteScroll
        initialScrollY={0}
        className="cards-container "
        next={() => loadMore()}
        hasMore={usersInfiniteScroll.hasMore}
        loader={
          <div className="loading">
            <Loading />
          </div>
        }
        dataLength={users.length}
      >
        {users?.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </InfiniteScroll>
      <div className="error">
        <span>{usersInfiniteScroll?.error?.message}</span>
      </div>
    </div>
  );
};

export default UserList;
