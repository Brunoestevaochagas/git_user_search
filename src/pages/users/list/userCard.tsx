import { useNavigate } from "react-router-dom";
import { UsersType } from "../../../@types/User";

interface UserProps {
  user: UsersType;
}

export const UserCard = ({ user }: UserProps) => {
  const { login, avatar_url } = user;
  const navigate = useNavigate();
  return (
    <div
      className="card card-content"
      onClick={() => navigate(`/user/${login}`)}
    >
      <div className="avatar-div">
        <img className="avatar-img" src={avatar_url} alt="Avatar" />
      </div>

      <div className="avatar-text-div">
        <small>{`Username:`}</small>
        <small className="avatar-text-name">{login}</small>
      </div>
    </div>
  );
};
