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
import { PomodoroWidget } from "./PomodoroWidget";
import WeaknessWidget from "./WeaknessWidget";

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
    <main className="ml-14 mt-15 mr-12">
      <section className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="header-text">Dashboard</h1>
          <p className="subheading-text">
            Plan, prioritize and accomplish your tasks with ease.
          </p>
        </div>

        {/* <div className="mr-6">
          <Link href={"/dashboard/subjects/new"} className="btn-primary">
            + Add Subject
          </Link>
        </div> */}
      </section>

      <section className="grid grid-cols-4 gap-4 mt-10 mb-6">
        <MetricCard
          label="Total Subjects"
          value={metricValue.metrics.totalSubjects}
          hint="_"
          isActive={metricValue.metrics.totalSubjects > 0}
        />
        <MetricCard
          label="Completed Milestone Daily's"
          value={metricValue.metrics.completedDailies}
          hint="_"
          isActive={metricValue.metrics.completedDailies > 0}
        />
        <MetricCard
          label="Active Milestones"
          value={metricValue.metrics.activeMilestones}
          hint="_"
          isActive={metricValue.metrics.activeMilestones > 0}
        />
        <MetricCard
          label="Streak"
          value={metricValue.metrics.streak}
          hint="_"
          isActive={metricValue.metrics.streak >= 3}
        />
      </section>

      <section className="grid grid-cols-4 gap-4 my-8">
        <Widget state="real" title="Subjects Due Soon">
          <SubjectWidget />
        </Widget>

        <Widget state="real" title="Recent Milestones">
          <UpcomingMilestoneWidget />
        </Widget>

        <Widget state="real" title="XP & Rank">
          <XpRankWidget />
        </Widget>
        <Widget state="real" title="Weakness">
          <WeaknessWidget />
        </Widget>
      </section>

      <section className="grid grid-cols-4 gap-4 my-8">
        <Widget state="real" title="Pomodoro">
          <PomodoroWidget />
        </Widget>

        {/* Placeholder for floating dock */}
        <div className="col-start-2 col-end-4" aria-hidden="true" />

        <Widget state="real" title="Hall of Fame">
          <WeaknessWidget />
        </Widget>
      </section>
    </main>
  );
}
// TODOs: Write subject-create.
