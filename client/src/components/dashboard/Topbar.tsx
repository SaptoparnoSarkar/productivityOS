export function Topbar() {
  return (
    <header className="topbar">
      <input
        type="text"
        placeholder="Search Task"
        disabled
        className="topbar-search"
      />

      {/* Right Cluster */}
      <div className="topbar-actions">
        <div className="topbar-user">
          <span>DUMMY DUMB</span>
        </div>
        <button type="button" className="topbar-signout">
          Logout
        </button>
      </div>
    </header>
  );
}
