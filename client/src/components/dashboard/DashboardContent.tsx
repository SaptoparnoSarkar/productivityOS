"use client";
import { MetricCard } from "./MetricCard";
import { SubjectWidget } from "./SubjectsWidget";
import { UpcomingMilestoneWidget } from "./RecentMilestoneWidget";
import { Widget } from "./Widget";
import { XpRankWidget } from "./XpRankWidget";
import { useEffect, useState } from "react";
import { Dashboard } from "@/types/dashboard";
import { dashboardMetric } from "@/lib/api/dashboard";
import { PomodoroWidget } from "./PomodoroWidget";
import WeaknessWidget from "./WeaknessWidget";
import ShowcaseWidget from "./ShowcaseWidget";
import {
  AlarmCheck,
  BookOpen,
  Clock,
  Trophy,
  UnlinkIcon,
  Zap,
} from "lucide-react";
import { Greeting } from "./Greeting";

export default function DashboardShell() {
  const [metricValue, setMetricValue] = useState<Dashboard>({
    message: "",
    metrics: {
      totalSubjects: 0,
      activeMilestones: 0,
      completedDailies: 0,
      xpToday: 0,
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
    <main className="ml-14 mt-2 mr-12">
      <section className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="header-text">Dashboard</h1>
          <p className="subheading-text">
            <Greeting />
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
          text="Add your first Subject"
          isActive={metricValue.metrics.totalSubjects > 0}
        />
        <MetricCard
          label="Active Milestones"
          value={metricValue.metrics.activeMilestones}
          text="Create your first Milestone"
          isActive={metricValue.metrics.activeMilestones > 0}
        />
        <MetricCard
          label="Dailies Completed"
          value={metricValue.metrics.completedDailies}
          text="Create your first Milestone Daily"
          isActive={metricValue.metrics.completedDailies > 0}
        />

        <MetricCard
          label="Today's XP"
          value={metricValue.metrics.xpToday}
          text="Get to work"
          isActive={metricValue.metrics.xpToday > 0}
        />
      </section>

      <section className="grid grid-cols-4 gap-4 my-8">

        <Widget title="Subjects" icon={BookOpen}>
          <SubjectWidget />
        </Widget>

        <Widget title="Recent Milestones" icon={AlarmCheck}>
          <UpcomingMilestoneWidget />
        </Widget>

        <Widget title="XP & Rank" icon={Zap}>
          <XpRankWidget />
        </Widget>

        <Widget title="Weakness" icon={UnlinkIcon}>
          <WeaknessWidget />
        </Widget>

      </section>

      <section className="grid grid-cols-4 gap-4 my-8">
        <Widget title="Pomodoro" icon={Clock}>
          <PomodoroWidget />
        </Widget>

        {/* Placeholder for floating dock */}
        <div className="col-start-2 col-end-4" aria-hidden="true" />

        <Widget title="Hall of Fame" icon={Trophy}>
          <ShowcaseWidget />
        </Widget>
      </section>
    </main>
  );
}
// TODOs: Write subject-create.
