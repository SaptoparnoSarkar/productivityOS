import { MetricCard } from "./MetricCard";
import { SubjectWidget } from "./SubjectsWidget";
import { UpcomingMilestoneWidget } from "./RecentMilestoneWidget";
import { Widget } from "./Widget";
import Link from "next/link";

export default function DashboardShell() {
  return (

    <main>
      <section className="hero">
        <div className="hero-text">
          <h1 className="hero-title">Dashboard</h1>
          <p className="hero-subtitle">
            Plan, prioritize and accomplish your tasks with ease.
          </p>
        </div>

        <div className="hero-actions">
          <Link href={'/dashboard/subjects/new'} className="btn-primary">
            + Add Subject
          </Link>
        </div>
      </section>

      <section className="metric-row">
        <MetricCard label="Total Subjects" value={0} hint="_" isActive />
        <MetricCard label="Completed Milestones" value={0} hint="_" />
        <MetricCard label="Active Milestones" value={0} hint="_" />
        <MetricCard label="Due Soon" value={0} hint="_" />
      </section>

      <section className="widget-grid">
        <Widget state="real" title="Due Soon">
          <SubjectWidget />
        </Widget>

        <Widget state="real" title="Recent Milestones">
          <UpcomingMilestoneWidget />
        </Widget>

        <Widget state="locked" title="XP & Rank" phase={6} />
        <Widget state="locked" title="Weakness" phase={8} />

      </section>

      <section className="widget-grid widget-grid--bottom">
        <Widget state="locked" title="Pomodoro" phase={7} />

        {/* Placeholder for floating dock */}
        <div className="floating-nav-slot" aria-hidden='true' />

        <Widget state="locked" title="Hall of Fame" phase={8} />
      </section>
    </main>
  );
}
// TODOs: Write subject-create.
