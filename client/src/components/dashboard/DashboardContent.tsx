"use client";
import { MetricCard } from "./MetricCard";
import { SubjectWidget } from "./SubjectsWidget";
import { UpcomingMilestoneWidget } from "./RecentMilestoneWidget";
import { Widget } from "./Widget";
import Link from "next/link";
import { XpRankWidget } from "./XpRankWidget";
import { useEffect, useState } from "react";
import { Dashboard } from "@/types/dashboard";
import { dashboardMetric } from "@/lib/api/dashboard";

export default function DashboardShell() {
  const [metricValue, setMetricValue] = useState<Dashboard>({
    message: "",
    metrics: {
      totalSubjects: 0,
      activeMilestones: 0,
      completedDailies: 0,
      streak: 0,
    },
  });
  useEffect(() => {
    async function fetch() {
      const data = await dashboardMetric();
      setMetricValue(data);
    }
    fetch();
  }, []);

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
          <Link href={"/dashboard/subjects/new"} className="btn-primary">
            + Add Subject
          </Link>
        </div>
      </section>

      <section className="metric-row">
        <MetricCard
          label="Total Subjects"
          value={metricValue.metrics.totalSubjects}
          hint="_"
          isActive
        />
        <MetricCard
          label="Completed Milestone Daily's"
          value={metricValue.metrics.completedDailies}
          hint="_"
          isActive
        />
        <MetricCard
          label="Active Milestones"
          value={metricValue.metrics.activeMilestones}
          hint="_"
          isActive
        />
        <MetricCard
          label="Streak"
          value={metricValue.metrics.streak}
          hint="_"
          isActive
        />
      </section>

      <section className="widget-grid">
        <Widget state="real" title="Subjects Due Soon">
          <SubjectWidget />
        </Widget>

        <Widget state="real" title="Recent Milestones">
          <UpcomingMilestoneWidget />
        </Widget>

        <Widget state="real" title="XP & Rank">
          <XpRankWidget />
        </Widget>
        <Widget state="locked" title="Weakness" phase={8} />
      </section>

      <section className="widget-grid widget-grid--bottom">
        <Widget state="locked" title="Pomodoro" phase={7} />

        {/* Placeholder for floating dock */}
        <div className="floating-nav-slot" aria-hidden="true" />

        <Widget state="locked" title="Hall of Fame" phase={8} />
      </section>
    </main>
  );
}
// TODOs: Write subject-create.
