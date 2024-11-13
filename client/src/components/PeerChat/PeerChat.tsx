import "./PeerChat.scss";
import { ProjectSuggestion } from "../ProjectSuggestion/ProjectSuggestion";
import { PeerChatProps } from "../../interface";

const PeerChat = (props: PeerChatProps) => {

  const {
    username,
    pairUsername
  } = props;

  function next() {
    window.location.reload();
  }

  return (
    <div className="peerchat">
      <div className="users">
        <h3 className="users__heading">Current Users: </h3>
        <div className="online-user">
          <span className="online-user__status"></span>
          <span className="online-user__username">{username}</span>
        </div>
        <div className="online-user">
          <span
            className={
              pairUsername
                ? "online-user__status"
                : "online-user__status online-user__status--offline"
            }
          ></span>
          <span className="online-user__username">
            {pairUsername ? pairUsername : "looking for partner"}
          </span>
        </div>
      </div>

      <ProjectSuggestion />

      <button onClick={next} className="next-dev">
        Next Dev
      </button>
    </div>
  );
};

export default PeerChat;
