import Link from "next/link";

const Nav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Subjects", href: "/subjects" },
  { label: "Milestones", href: "/milestones" },
  { label: "XP", locked: true, phase: 6 },
  { label: "Pomodoro", locked: true, phase: 7 },
  { label: "Weakness", locked: true, phase: 8 },
  { label: "Hall of fame", locked: true, phase: 8 },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        {Nav.map((item) =>
          item.locked ? (
            <span key={item.label} className="nav-item nav-locked">
              🔒 {item.label} · Phase {item.phase}
            </span>
          ) : (
            <Link key={item.label} href={item.href} className="nav-item">
              {item.label}
            </Link>
          ),
        )}
      </nav>
    </aside>
  );
}

// TODOs: 1. Wire Paths. 2. Add Settings and Help.
