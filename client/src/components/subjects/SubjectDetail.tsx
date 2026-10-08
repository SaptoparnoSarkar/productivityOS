"use client";

import {
  deleteSubject,
  getSubject,
  markSubjectComplete,
} from "@/lib/api/subjects";
import { SubjectDetail } from "@/types/subject";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MilestoneList } from "../milestones/MilestoneList";
import Link from "next/link";

import {
  BookOpen,
  Clock,
  Edit2,
  Flag,
  Loader,
  LockKeyhole,
  LockOpen,
  PlusIcon,
  Target,
  Trash2,
  Zap,
} from "lucide-react";
import formatDate from "@/lib/subjects/derive";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { promoteSubject } from "@/lib/api/showcase";

export default function SubjectDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  //Subject
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [subjectError, setSubjectError] = useState<string>("");

  //Delete
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  //Submit
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setSubjectError("Invalid subject ID");
      setLoading(false);
      return;
    }

    async function fetchSubject() {
      try {
        const data = await getSubject(id);
        setSubject(data);
      } catch (err) {
        setSubjectError(
          err instanceof Error
            ? err.message
            : "An error occurred. Please try again",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchSubject();
  }, [id]);

  //Delete Handler
  async function handleDelete() {
    if (!window.confirm("Are you sure?")) return;

    setDeleting(true);

    try {
      await deleteSubject(id);
      router.push("/dashboard/subjects");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while deleting.",
      );
    } finally {
      setDeleting(false);
    }
  }

  const canComplete = subject?.subject.status === "pending" && subject.stats.total > 0 && subject.stats.done === subject.stats.total;

  //Submit Handler
  async function completeSubject() {
    setCompleting(true);
    try {
      await markSubjectComplete(id);
      await promoteSubject(id);
      toast.success("Subject complete. +500 XP");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not complete",
      );
    } finally {
      setCompleting(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (subjectError) return <div>Error : {subjectError}</div>;
  if (!subject) return <div>Subject not found.</div>;

  const dateLabel = formatDate(subject.subject);
  return (
    <main className="flex flex-col gap-6 max-w-5xl mx-auto py-8">
      <div>
        <Link
          href={"/dashboard/subjects"}
        >
          <p className="text-white/50 text-md font-bold hover:text-white transition duration-200 w-fit">← Back to Subjects</p>
        </Link>
      </div>

      <section className="detail-card border border-white/15">
        <div className="flex justify-between items-center">
          {/* left: Logo + TEXT */}
          <div className="flex gap-3">
            <span>
              <BookOpen className="detail-logo" size={60} />
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="text-white text-3xl font-bold">
                  {subject.subject.title}
                </h2>
                <span className=" text-purple-400 px-2 py-0.5 text-md rounded-lg bg-purple-500/30 capitalize">
                  {subject.subject.type}
                </span>
              </div>
              <p className="text-white/60">{dateLabel}</p>
            </div>
          </div>

          {/* Right: Actions */}

          <div className="flex gap-1.5 mb-15">
            <Link
              href={`${id}/edit`}
              className="text-blue-700 bg-gray-700/30 rounded-lg p-3 flex gap-1 justify-center hover:bg-gray-600/40 transition duration-200"
            >
              <Edit2 />
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 bg-gray-700/30 rounded-lg p-3 flex gap-1 justify-center cursor-pointer hover:bg-gray-600/40 transition duration-200"
            >
              {deleting ? <Loader /> : <Trash2 />}
            </button>
          </div>
        </div>

        <div className="flex gap-3 ">
          <div className="flex shrink-0 items-center gap-3 border border-slate-50/20 p-3 rounded-2xl bg-gray-700/20">
            <span className="p-3 bg-purple-600/30 rounded-lg">
              <Flag className="text-pink-500 h-6 w-6" />
            </span>

            <div className="flex flex-col">
              <p className="">MILESTONES</p>
              <span>
                {subject.stats.done}/{subject.stats.total}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 border border-slate-50/20 p-3 rounded-2xl bg-gray-700/20">
            <span className="p-3 bg-blue-800 rounded-lg">
              <Zap className="text-blue-400 h-6 w-6" />
            </span>

            <div className="flex flex-col">
              <p>Xp Reward</p>
              <p>+500</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 border border-slate-50/20 p-3 rounded-2xl bg-gray-700/20">
            <span className="p-3 bg-yellow-400/30 rounded-lg">
              <Clock className="text-yellow-400 h-6 w-6" />
            </span>

            <div className="flex flex-col">
              <p>STATUS</p>
              <p
                className={cn(
                  "",
                  subject.subject.status === "pending"
                    ? "text-yellow-400"
                    : "text-green-500",
                )}
              >
                {subject.subject.status === "pending"
                  ? "In Progress"
                  : "Completed"}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="flex justify-between my-8">
          <div>
            <div className="flex justify-between w-180 mb-2 text-md text-slate-400">
              <p>Progress</p>{" "}
              <p>
                {subject.stats.done / subject.stats.total
                  ? (subject.stats.done / subject.stats.total) * 100
                  : 0}
                %
              </p>
            </div>
            <div className="h-2 w-full bg-gray-600 rounded-full">
              <div
                className={cn(
                  "h-2 rounded-full",
                  subject.stats.total > 0 &&
                  (subject.stats.done / subject.stats.total === 1
                    ? "bg-green-500"
                    : "bg-purple-500"),
                )}
                style={{
                  width: `${(subject.stats.done / subject.stats.total) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Subject Complete Button */}
          <div className="flex flex-col">
            <button
              type="button"
              disabled={!canComplete || completing}
              onClick={() => completeSubject()}
              className={cn(
                "rounded-2xl px-6 py-4 font-bold text-md transition-all flex gap-2 items-center",
                !canComplete
                  ? "bg-gray-600 text-slate-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600 cursor-pointer",
              )}
            >
              {!canComplete ? (
                <>
                  <LockKeyhole className="h-6 w-6" />
                  <span>Complete Subject</span>
                </>
              ) : (
                <>
                  <LockOpen className="h-6 w-6" />
                  <span>{completing ? "Completing..." : "Complete Subject"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="detail-card">
        <div className="flex justify-between items-center">
          {/* Left: Milestone Title + Desc */}
          <div className="flex items-center gap-3">
            <span>
              <Target className="detail-logo" size={60} />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="detail-title">Milestones</h2>
              <p className="text-white/60">
                Use milestones to track your progress.
              </p>
            </div>
          </div>
          {/* Right: Action */}
          <div>
            <Link
              href={`/dashboard/subjects/${id}/milestones/new`}
              className={cn(
                "border border-slate-50/20 rounded-[10] py-2 px-2.5 text-slate-400 hover:bg-gray-600/10 hover:text-white transition-colors duration-200 flex items-center gap-2",
                subject.subject.status === "completed" && "hidden",
              )}
            >
              <PlusIcon size={20} />
              <span>Add New Milestone</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col mt-4 w-full justify-center">
          <h3 className="text-white font-bold text-lg mb-3">Milestones List</h3>
          <MilestoneList subjectId={id} />
        </div>
      </section>

      {/* Recent sessions card - table */}
      {/* TODO: Recent Session Component */}
    </main>
  );
}
