import { MetricCard } from "./MetricCard";
import { Sidebar } from "./Sidebar";
import { SubjectWidget } from "./SubjectsWidget";
import { Topbar } from "./Topbar";
import { UpcomingMilestoneWidget } from "./UpcomingMilestoneWidget";
import { Widget } from "./Widget";

export function DashboardShell() {
  return (
    <div className="grid grid-cols-[260px_1fr] min-h-screen">
      <Sidebar />
      <main>
        <Topbar />
        <section className="hero">
          <div className="hero-text">
            <h1 className="hero-title">Dashboard</h1>
            <p className="hero-subtitle">
              Plan, prioritize and accomplish your tasks with ease.
            </p>
          </div>

          <div className="hero-actions">
            <button type="button" className="btn-primary">
              + Add Subject
            </button>
          </div>
        </section>

        <section className="metric-row">
          <MetricCard label="Total Subjects" value={0} hint="_" isActive />
          <MetricCard label="Completed Milestones" value={0} hint="_" />
          <MetricCard label="Active Milestones" value={0} hint="_" />
          <MetricCard label="Due Soon" value={0} hint="_" />
        </section>

        <section className="widget-grid">
          <Widget state="real" title="Subjects">
            <SubjectWidget />
          </Widget>

          <Widget state="real" title="Due Soon">
            <UpcomingMilestoneWidget />
          </Widget>

          <Widget state="locked" title="XP & Rank" phase={6} />
          <Widget state="locked" title="Pomodoro" phase={7} />
          <Widget state="locked" title="Weakness" phase={8} />
          <Widget state="locked" title="Hall of Fame" phase={8} />
        </section>
      </main>
    </div>
  );
}
// TODOs: Write subject-create.
