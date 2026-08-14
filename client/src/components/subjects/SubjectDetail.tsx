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

export default function SubjectDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  //Subject
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  //Delete
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const router = useRouter();

  //Submit
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState<String>("");

  useEffect(() => {
    if (Number.isNaN(id)) {
      setError("Invalid subject ID");
      setLoading(false);
      return;
    }
    async function fetchSubject() {
      try {
        const data = await getSubject(id);
        setSubject(data);
      } catch (err) {
        setError(
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
    setDeleteError("");

    try {
      await deleteSubject(id);
      router.push("/dashboard/subjects");
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "An error occurred while deleting.",
      );
    } finally {
      setDeleting(false);
    }
  }

  //Submit Handler
  async function completeSubject() {
    setCompleting(true);
    setCompleteError("");
    try {
      await markSubjectComplete(id);
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
  if (error) return <div>Error : {error}</div>;
  if (!subject) return <div>Subject not found.</div>;

  const dateLabel = formatDate(subject.subject);
  const isDisabled = subject.stats.total < 1;
  return (
    <main className="flex flex-col gap-6 max-w-5xl mx-auto py-8">
      <div>
        <Link
          className="text-white/50 text-xl hover:text-white transition duration-200 "
          href={"/dashboard/subjects"}
        >
          ← Back to Subjects
        </Link>
      </div>

      <section className="detail-card border-2 border-purple-500">
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
              className="text-blue-700 bg-gray-700/30 rounded-lg p-3 flex gap-1 justify-center hover:bg-gray-600 transition duration-200"
            >
              <Edit2 />
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 bg-gray-700/30 rounded-lg p-3 flex gap-1 justify-center cursor-pointer hover:bg-gray-600 transition duration-200"
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
              disabled={subject.stats.total < 1}
              onClick={() => completeSubject()}
              className={cn(
                "rounded-2xl px-6 py-4 font-bold text-md cursor-pointer transition-all flex gap-2 items-center",
                subject.stats.total < 1
                  ? "bg-gray-600 text-slate-400"
                  : "bg-green-500 text-white hover:bg-green-600",
              )}
            >
              {isDisabled ? (
                <>
                  <LockKeyhole className="h-6 w-6" />
                  <span>Complete Subject</span>
                </>
              ) : (
                <>
                  <LockOpen className="h-6 w-6" />
                  <span>Complete Subject</span>
                </>
              )}
            </button>
            <span className="text-red-500">{error}</span>
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
                "border border-purple-500 rounded-[10] py-3 px-4.5 text-purple-500 hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2",
                subject.subject.status === "completed" && "hidden",
              )}
            >
              <span className="text-purple-500 text-4xl pr-2">
                {" "}
                {<PlusIcon />}{" "}
              </span>
              Create New Milestone
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
