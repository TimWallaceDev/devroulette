export function SideBar(username: string, pairUsername: string) {
  return (
    <div className="peerchat">
      <div className="online-user">
        <span className="online-user__status"></span>
        <span className="online-user__username">YOU: {username}</span>
      </div>
      <div className="online-user">
        <span className="online-user__status"></span>
        <span className="online-user__username">
          PARTNER: {pairUsername ? pairUsername : "looking for partner"}
        </span>
      </div>
    </div>
  );
}
