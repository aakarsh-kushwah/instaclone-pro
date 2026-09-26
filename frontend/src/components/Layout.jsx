import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Instaclone Pro</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/reels">Reels</Link>
          <Link to="/stories">Stories</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/notifications">Notifications</Link>
          <Link to="/profile/me">Profile</Link>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
