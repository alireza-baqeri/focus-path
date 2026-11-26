/**
 * Module: Course Progress Tracker Container
 * Path: src/components/courses/course-tracker-container.tsx
 *
 * Description:
 * This component manages the complete UI and state for the Course Tracking feature.
 * It handles displaying courses, sections, and videos, allowing the user to mark items
 * as watched, flag videos, and write notes. It also contains the Drag and Drop logic
 * for importing JSON course payloads.
 *
 * New Features (v2):
 * - Course deletion with confirmation dialog
 * - Course rename (inline edit)
 * - Sticky progress/overview card
 * - Expand All / Collapse All sections
 * - Video search/filter within a course
 * - Show only flagged videos toggle
 * - Flagged video count badge on course cards
 */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronRight,
  Upload,
  ArrowLeft,
  Target,
  Flag,
  MessageSquare,
  Trash2,
  Pencil,
  Check,
  X,
  Search,
  ChevronsDownUp,
  ChevronsUpDown,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ─── Types ───────────────────────────────────────────────────────────────────

interface VideoItem {
  id: string;
  title: string;
  duration: number;
  isWatched: boolean;
  watchedAtDate?: string | null;
  isFlagged?: boolean;
  notes?: string | null;
}

interface SectionItem {
  id: string;
  title: string;
  orderIndex: number;
  videos: VideoItem[];
}

interface CourseItem {
  id: string;
  title: string;
  rootPath: string;
  totalDuration: number;
  sections: SectionItem[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CourseTrackerContainer() {
  // ── Core state ──────────────────────────────────────────────────────────────
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // ── Import modal ────────────────────────────────────────────────────────────
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [importError, setImportError] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // ── Completion estimator ─────────────────────────────────────────────────────
  const [estType, setEstType] = useState<"videos" | "hours">("videos");
  const [estValue, setEstValue] = useState(5);

  // ── Delete state ────────────────────────────────────────────────────────────
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // ── Rename state ────────────────────────────────────────────────────────────
  const [renamingCourseId, setRenamingCourseId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  // ── Course card context menu ─────────────────────────────────────────────────
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // ── Search / filter ─────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyFlagged, setShowOnlyFlagged] = useState(false);

  // ─── Data Fetching ────────────────────────────────────────────────────────

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data: CourseItem[] = await res.json();
        setCourses(data);
        if (data.length > 0 && !selectedCourseId) {
          setSelectedCourseId(data[0].id);
          const initialExpanded: Record<string, boolean> = {};
          data[0].sections.slice(0, 3).forEach((s) => {
            initialExpanded[s.id] = true;
          });
          setExpandedSections(initialExpanded);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/courses")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to fetch"))))
      .then((data: CourseItem[]) => {
        if (cancelled) return;
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseId(data[0].id);
          const initialExpanded: Record<string, boolean> = {};
          data[0].sections.slice(0, 3).forEach((s) => {
            initialExpanded[s.id] = true;
          });
          setExpandedSections(initialExpanded);
        }
      })
      .catch((e) => {
        if (!cancelled) console.error(e);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Focus rename input when it appears
  useEffect(() => {
    if (renamingCourseId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingCourseId]);

  // Close context menu on outside click
  useEffect(() => {
    if (!openMenuId) return;
    const handler = () => setOpenMenuId(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [openMenuId]);

  // ─── Derived values ───────────────────────────────────────────────────────

  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const totalVideos = activeCourse
    ? activeCourse.sections.reduce((acc, s) => acc + s.videos.length, 0)
    : 0;

  const watchedVideos = activeCourse
    ? activeCourse.sections.reduce((acc, s) => acc + s.videos.filter((v) => v.isWatched).length, 0)
    : 0;

  const watchedSeconds = activeCourse
    ? activeCourse.sections.reduce(
        (acc, s) =>
          acc + s.videos.filter((v) => v.isWatched).reduce((vAcc, v) => vAcc + v.duration, 0),
        0
      )
    : 0;

  const progressPercent = totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0;

  const totalFlagged = activeCourse
    ? activeCourse.sections.reduce((acc, s) => acc + s.videos.filter((v) => v.isFlagged).length, 0)
    : 0;

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const formatSeconds = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const formatVideoTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0)
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // ─── Section toggle ───────────────────────────────────────────────────────

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const expandAll = () => {
    if (!activeCourse) return;
    const all: Record<string, boolean> = {};
    activeCourse.sections.forEach((s) => (all[s.id] = true));
    setExpandedSections(all);
  };

  const collapseAll = () => setExpandedSections({});

  // ─── Video toggle ─────────────────────────────────────────────────────────

  const handleToggleVideo = async (videoId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setCourses((prev) =>
      prev.map((c) => ({
        ...c,
        sections: c.sections.map((s) => ({
          ...s,
          videos: s.videos.map((v) =>
            v.id === videoId
              ? { ...v, isWatched: nextStatus, watchedAtDate: nextStatus ? new Date().toISOString() : null }
              : v
          ),
        })),
      }))
    );
    try {
      const res = await fetch("/api/courses/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, isWatched: nextStatus }),
      });
      if (!res.ok) {
        throw new Error("Failed to toggle video");
      }
    } catch {
      toast.error("Could not update video status.");
      fetchCourses();
    }
  };

  // ─── Section mark all watched ─────────────────────────────────────────────

  const handleMarkSectionWatched = async (sectionId: string) => {
    setCourses((prev) =>
      prev.map((c) => ({
        ...c,
        sections: c.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                videos: s.videos.map((v) =>
                  v.isWatched ? v : { ...v, isWatched: true, watchedAtDate: new Date().toISOString() }
                ),
              }
            : s
        ),
      }))
    );
    try {
      const res = await fetch("/api/courses/toggle-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId }),
      });
      if (!res.ok) {
        throw new Error("Failed to mark section watched");
      }
    } catch {
      toast.error("Could not update section status.");
      fetchCourses();
    }
  };

  // ─── Video meta (flag/notes) ──────────────────────────────────────────────

  const handleUpdateVideoMeta = async (
    videoId: string,
    meta: { isFlagged?: boolean; notes?: string }
  ) => {
    setCourses((prev) =>
      prev.map((c) => ({
        ...c,
        sections: c.sections.map((s) => ({
          ...s,
          videos: s.videos.map((v) => (v.id === videoId ? { ...v, ...meta } : v)),
        })),
      }))
    );
    try {
      const res = await fetch("/api/courses/video-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, ...meta }),
      });
      if (!res.ok) {
        throw new Error("Failed to update video metadata");
      }
    } catch {
      toast.error("Could not save video notes.");
      fetchCourses();
    }
  };

  // ─── Course Delete ────────────────────────────────────────────────────────

  const handleDeleteCourse = async (courseId: string) => {
    setIsDeletingId(courseId);
    setConfirmDeleteId(null);

    // Optimistic: remove from list immediately
    const prevCourses = courses;
    const remaining = courses.filter((c) => c.id !== courseId);
    setCourses(remaining);

    // If deleting the active course, switch to the next available
    if (selectedCourseId === courseId) {
      if (remaining.length > 0) {
        setSelectedCourseId(remaining[0].id);
        const initialExpanded: Record<string, boolean> = {};
        remaining[0].sections.slice(0, 3).forEach((s) => {
          initialExpanded[s.id] = true;
        });
        setExpandedSections(initialExpanded);
      } else {
        setSelectedCourseId(null);
        setExpandedSections({});
      }
    }

    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Course deleted successfully");
      } else {
        // Rollback
        setCourses(prevCourses);
        toast.error("Failed to delete course. Please try again.");
      }
    } catch {
      setCourses(prevCourses);
      toast.error("Network error. Could not delete course.");
    } finally {
      setIsDeletingId(null);
    }
  };

  // ─── Course Rename ────────────────────────────────────────────────────────

  const startRename = (course: CourseItem) => {
    setRenamingCourseId(course.id);
    setRenameValue(course.title);
    setOpenMenuId(null);
  };

  const cancelRename = () => {
    setRenamingCourseId(null);
    setRenameValue("");
  };

  const commitRename = async () => {
    if (!renamingCourseId) return;
    const targetId = renamingCourseId;
    const trimmed = renameValue.trim();
    if (!trimmed) {
      cancelRename();
      return;
    }

    const original = courses.find((c) => c.id === targetId)?.title;
    if (trimmed === original) {
      cancelRename();
      return;
    }

    // Optimistic update
    setCourses((prev) =>
      prev.map((c) => (c.id === targetId ? { ...c, title: trimmed } : c))
    );
    cancelRename();

    try {
      const res = await fetch(`/api/courses/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
      if (res.ok) {
        toast.success("Course renamed");
      } else {
        // Rollback
        setCourses((prev) =>
          prev.map((c) => (c.id === targetId && original !== undefined ? { ...c, title: original } : c))
        );
        toast.error("Failed to rename course.");
      }
    } catch {
      fetchCourses();
    }
  };

  // ─── Import JSON ──────────────────────────────────────────────────────────

  const handleImportJson = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportError("");
    setIsImporting(true);
    try {
      const parsed = JSON.parse(importJson);
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (res.ok) {
        setIsImportModalOpen(false);
        setImportJson("");
        toast.success("Course imported successfully!");
        fetchCourses();
      } else {
        const data = await res.json();
        setImportError(data.message || "Failed to import course");
      }
    } catch {
      setImportError("Invalid JSON format. Please paste the JSON generated by sync_course.py.");
    } finally {
      setIsImporting(false);
    }
  };

  // ─── Filtered sections for active course ──────────────────────────────────

  const filteredSections = activeCourse
    ? activeCourse.sections
        .map((sec) => ({
          ...sec,
          videos: sec.videos.filter((v) => {
            const matchesSearch =
              searchQuery.trim() === "" ||
              v.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFlag = !showOnlyFlagged || v.isFlagged;
            return matchesSearch && matchesFlag;
          }),
        }))
        .filter((sec) => sec.videos.length > 0)
    : [];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/">
            <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Course Progress Tracker
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Track course chapters, video lectures, and automatically feed learning hours to your
              dashboard
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsImportModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 h-9 rounded-xl"
        >
          <Upload className="w-4 h-4" />
          <span>Sync / Import Course</span>
        </Button>
      </div>

      {/* ── Loading / Empty / Main ── */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-sm text-gray-500">
          Loading course library...
        </div>
      ) : courses.length === 0 ? (
        <Card className="p-12 text-center bg-white dark:bg-gray-900 border-dashed border-2 border-gray-300 dark:border-gray-700">
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-3 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 w-fit mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold">No Courses Synced Yet</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Use our companion scanner script to scan any folder of Udemy or video courses on your
              machine, and sync them with one command!
            </p>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 font-mono text-xs text-left text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              python sync_course.py &quot;D:\Courses\YourCourseFolder&quot;
            </div>
            <Button
              onClick={() => setIsImportModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Import Course JSON</span>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* ══ Left Column: Course List ══ */}
          <div className="col-span-1 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
              Your Courses ({courses.length})
            </span>

            <div className="space-y-2">
              {courses.map((course) => {
                const isSelected = course.id === selectedCourseId;
                const cTotalVids = course.sections.reduce((a, s) => a + s.videos.length, 0);
                const cWatchedVids = course.sections.reduce(
                  (a, s) => a + s.videos.filter((v) => v.isWatched).length,
                  0
                );
                const cFlagged = course.sections.reduce(
                  (a, s) => a + s.videos.filter((v) => v.isFlagged).length,
                  0
                );
                const cPercent = cTotalVids > 0 ? Math.round((cWatchedVids / cTotalVids) * 100) : 0;
                const isConfirmDelete = confirmDeleteId === course.id;
                const isRenaming = renamingCourseId === course.id;

                return (
                  <div
                    key={course.id}
                    onClick={() => {
                      if (isRenaming || isConfirmDelete) return;
                      setSelectedCourseId(course.id);
                      setSearchQuery("");
                      setShowOnlyFlagged(false);
                      const initialExpanded: Record<string, boolean> = {};
                      course.sections.slice(0, 3).forEach((s) => {
                        initialExpanded[s.id] = true;
                      });
                      setExpandedSections(initialExpanded);
                    }}
                    className={`p-3.5 rounded-xl transition-all border relative group ${
                      isConfirmDelete
                        ? "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/30"
                        : isSelected
                        ? "bg-white dark:bg-gray-900 border-emerald-500 shadow-sm ring-1 ring-emerald-500/20 cursor-pointer"
                        : "bg-white dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer"
                    }`}
                  >
                    {/* ── Confirm Delete Overlay ── */}
                    {isConfirmDelete ? (
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="text-[11px] font-bold">Delete this course?</span>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                          All sections and videos will be permanently removed. This cannot be undone.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCourse(course.id);
                            }}
                            disabled={isDeletingId === course.id}
                            className="flex-1 py-1.5 text-[11px] font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isDeletingId === course.id ? "Deleting..." : "Yes, Delete"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId(null);
                            }}
                            className="flex-1 py-1.5 text-[11px] font-bold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : isRenaming ? (
                      /* ── Rename Input ── */
                      <div
                        className="space-y-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          ref={renameInputRef}
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitRename();
                            if (e.key === "Escape") cancelRename();
                          }}
                          className="w-full text-xs font-bold bg-white dark:bg-gray-900 border border-emerald-400 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                        />
                        <div className="flex gap-1.5">
                          <button
                            onClick={commitRename}
                            className="flex-1 flex items-center justify-center gap-1 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button
                            onClick={cancelRename}
                            className="flex-1 flex items-center justify-center gap-1 py-1 text-[11px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                          >
                            <X className="w-3 h-3" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Normal Course Card ── */
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={`text-xs font-bold line-clamp-2 flex-1 ${
                              isSelected
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            {course.title}
                          </h4>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {cFlagged > 0 && (
                              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 rounded px-1 py-0.5">
                                {cFlagged} ⚑
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-gray-400">
                              {cPercent}%
                            </span>

                            {/* Three-dot menu */}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(openMenuId === course.id ? null : course.id);
                                }}
                                className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100"
                                title="Course options"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {openMenuId === course.id && (
                                <div
                                  className="absolute right-0 top-5 z-20 w-36 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={() => startRename(course)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                  >
                                    <Pencil className="w-3.5 h-3.5 text-gray-400" />
                                    Rename
                                  </button>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setConfirmDeleteId(course.id);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 space-y-1">
                          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${cPercent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-400">
                            <span>
                              {cWatchedVids}/{cTotalVids} vids
                            </span>
                            <span>{formatSeconds(course.totalDuration)}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ══ Right Column: Active Course Detail ══ */}
          {activeCourse && (
            <div className="col-span-1 lg:col-span-3 flex flex-col gap-5">
              {/* ── Sticky Overview Card ── */}
              <div className="sticky top-20 z-10">
                <Card className="p-5 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 dark:from-emerald-950/20 dark:via-gray-900 dark:to-teal-950/10 border-emerald-200/50 dark:border-emerald-800/40 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
                        Active Course
                      </span>
                      <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mt-0.5 truncate">
                        {activeCourse.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono line-clamp-1">
                        {activeCourse.rootPath}
                      </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-3 bg-white dark:bg-gray-900/80 p-3 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex-shrink-0">
                      <div className="text-center px-2 border-r border-gray-100 dark:border-gray-800">
                        <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                          {progressPercent}%
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">Done</div>
                      </div>
                      <div className="text-center px-2 border-r border-gray-100 dark:border-gray-800">
                        <div className="text-base font-extrabold text-gray-900 dark:text-gray-100">
                          {watchedVideos}/{totalVideos}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">Videos</div>
                      </div>
                      <div className="text-center px-2 border-r border-gray-100 dark:border-gray-800">
                        <div className="text-base font-extrabold text-gray-900 dark:text-gray-100">
                          {formatSeconds(watchedSeconds)}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">Watched</div>
                      </div>
                      <div className="text-center px-2 border-r border-gray-100 dark:border-gray-800">
                        <div className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                          {totalVideos - watchedVideos}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">Left</div>
                      </div>
                      <div className="text-center px-2">
                        <div className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                          {formatSeconds(activeCourse.totalDuration - watchedSeconds)}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">Time Left</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 mb-1">
                    <div className="w-full bg-gray-200/70 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Completion Estimator */}
                  {totalVideos - watchedVideos > 0 && (
                    <div className="mt-3 pt-4 border-t border-emerald-100 dark:border-emerald-900/30 flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Target className="w-4 h-4 text-emerald-500" />
                        <span>If I do</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={estValue}
                          onChange={(e) => setEstValue(Number(e.target.value) || 1)}
                          className="w-14 px-2 py-1 text-xs text-center font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md outline-none focus:border-emerald-500"
                        />
                        <select
                          value={estType}
                          onChange={(e) => setEstType(e.target.value as "videos" | "hours")}
                          className="px-2 py-1 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md outline-none focus:border-emerald-500"
                        >
                          <option value="videos">videos / day</option>
                          <option value="hours">hours / day</option>
                        </select>
                      </div>
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-300 sm:ml-auto bg-white/50 dark:bg-gray-900/50 px-3 py-1.5 rounded-lg">
                        Course finishes in:{" "}
                        <strong className="text-emerald-600 dark:text-emerald-400 text-sm">
                          {estType === "videos"
                            ? Math.ceil((totalVideos - watchedVideos) / estValue)
                            : Math.ceil(
                                (activeCourse.totalDuration - watchedSeconds) / 3600 / estValue
                              )}{" "}
                          days
                        </strong>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* ── Sections Accordion ── */}
              <div className="space-y-3">
                {/* Syllabus Header: search, filter, expand/collapse */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-1">
                  <div className="flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Course Syllabus &amp; Lectures ({activeCourse.sections.length} Sections)
                    </span>
                  </div>

                  {/* Search bar */}
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 h-8 w-full sm:w-48 shadow-sm">
                    <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search videos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-xs bg-transparent outline-none w-full text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")}>
                        <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>

                  {/* Flagged filter */}
                  {totalFlagged > 0 && (
                    <button
                      onClick={() => setShowOnlyFlagged((v) => !v)}
                      className={`flex items-center gap-1.5 px-3 h-8 rounded-xl text-xs font-semibold border transition-colors flex-shrink-0 ${
                        showOnlyFlagged
                          ? "bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400"
                          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-600"
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Flagged ({totalFlagged})</span>
                    </button>
                  )}

                  {/* Expand / Collapse all */}
                  <button
                    onClick={expandAll}
                    className="flex items-center gap-1 px-2.5 h-8 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 transition-colors flex-shrink-0"
                    title="Expand all sections"
                  >
                    <ChevronsUpDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={collapseAll}
                    className="flex items-center gap-1 px-2.5 h-8 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 transition-colors flex-shrink-0"
                    title="Collapse all sections"
                  >
                    <ChevronsDownUp className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* No results state */}
                {filteredSections.length === 0 && (searchQuery || showOnlyFlagged) && (
                  <div className="py-10 text-center text-sm text-gray-400">
                    No videos match your filter.{" "}
                    <button
                      className="underline text-emerald-500 hover:text-emerald-600"
                      onClick={() => {
                        setSearchQuery("");
                        setShowOnlyFlagged(false);
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}

                {/* Section list */}
                {filteredSections.map((sec) => {
                  const isExpanded = !!expandedSections[sec.id];
                  // Use original section data for counts
                  const originalSec = activeCourse.sections.find((s) => s.id === sec.id)!;
                  const secWatched = originalSec.videos.filter((v) => v.isWatched).length;
                  const secTotal = originalSec.videos.length;
                  const isComplete = secTotal > 0 && secWatched === secTotal;
                  const secPercent = secTotal > 0 ? Math.round((secWatched / secTotal) * 100) : 0;

                  return (
                    <div
                      key={sec.id}
                      className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
                    >
                      {/* Section Header */}
                      <div
                        onClick={() => toggleSection(sec.id)}
                        className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors select-none"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          )}
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                            {sec.title}
                          </span>
                          {isComplete && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                              <CheckCircle2 className="w-3 h-3" /> Done
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-gray-400 flex-shrink-0 ml-2">
                          {/* Section mini-progress */}
                          <div className="hidden sm:flex items-center gap-1.5">
                            <div className="w-16 bg-gray-100 dark:bg-gray-800 rounded-full h-1 overflow-hidden">
                              <div
                                className={`h-1 rounded-full transition-all duration-300 ${
                                  isComplete ? "bg-emerald-500" : "bg-blue-400"
                                }`}
                                style={{ width: `${secPercent}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono">
                              {secWatched}/{secTotal}
                            </span>
                          </div>

                          {!isComplete && secTotal > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkSectionWatched(sec.id);
                              }}
                              className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/40 transition-colors border border-emerald-200 dark:border-emerald-800/50 text-[10px] font-semibold"
                            >
                              Mark All
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Video List */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 bg-gray-50/40 dark:bg-gray-950/20">
                          {sec.videos.map((vid) => (
                            <div key={vid.id} className="flex flex-col">
                              <div
                                onClick={() => handleToggleVideo(vid.id, vid.isWatched)}
                                className={`p-3 pl-8 flex items-center justify-between cursor-pointer transition-colors hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 ${
                                  vid.isWatched ? "bg-emerald-50/20 dark:bg-emerald-950/10" : ""
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  {vid.isWatched ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0 hover:text-emerald-400" />
                                  )}
                                  <span
                                    className={`text-xs truncate ${
                                      vid.isWatched
                                        ? "line-through text-gray-400 dark:text-gray-500 font-medium"
                                        : "text-gray-700 dark:text-gray-200 font-medium"
                                    }`}
                                  >
                                    {vid.title}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400 flex-shrink-0 ml-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateVideoMeta(vid.id, { isFlagged: !vid.isFlagged });
                                    }}
                                    className={`hover:text-amber-500 transition-colors ${
                                      vid.isFlagged
                                        ? "text-amber-500"
                                        : "text-gray-300 dark:text-gray-600"
                                    }`}
                                    title="Flag for review"
                                  >
                                    <Flag className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatVideoTime(vid.duration)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Notes area for flagged video */}
                              {vid.isFlagged && (
                                <div className="pl-14 pr-4 pb-3 bg-amber-50/30 dark:bg-amber-950/10 border-t border-amber-100/50 dark:border-amber-900/30">
                                  <div className="flex items-start gap-2 pt-2 text-amber-700 dark:text-amber-500">
                                    <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                    <input
                                      type="text"
                                      defaultValue={vid.notes || ""}
                                      placeholder="Add a note for this flagged video... (Enter to save)"
                                      className="text-xs bg-transparent border-none outline-none w-full placeholder:text-amber-400/70"
                                      onBlur={(e) => {
                                        if (e.target.value !== vid.notes) {
                                          handleUpdateVideoMeta(vid.id, { notes: e.target.value });
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") e.currentTarget.blur();
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Import / Sync JSON Modal ── */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Sync / Import Video Course
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleImportJson} className="p-6 space-y-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Paste the JSON generated by{" "}
                <code className="text-emerald-500 font-bold">sync_course.py</code>, or run the
                script on your computer:
              </p>

              <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 font-mono text-[11px] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                python sync_course.py &quot;D:\Courses\YourCourseFolder&quot;
              </div>

              {importError && (
                <p className="text-xs text-red-500 font-medium">{importError}</p>
              )}

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file && file.name.endsWith(".json")) {
                    const reader = new FileReader();
                    reader.onload = (event) =>
                      setImportJson(event.target?.result as string);
                    reader.readAsText(file);
                  } else {
                    setImportError("Please drop a valid .json file");
                  }
                }}
                className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors p-4"
              >
                <div
                  className="absolute inset-0 w-full h-full cursor-pointer z-10"
                  onClick={() => document.getElementById("json-upload")?.click()}
                />
                <input
                  id="json-upload"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) =>
                        setImportJson(event.target?.result as string);
                      reader.readAsText(file);
                    }
                  }}
                />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 pointer-events-none">
                  Drag &amp; Drop{" "}
                  <span className="font-bold text-emerald-600">course_data.json</span> here
                </span>
                <span className="text-xs text-gray-400 pointer-events-none">
                  or click to browse files
                </span>
              </div>

              <div className="flex items-center gap-2 my-2">
                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
                <span className="text-[10px] uppercase font-bold text-gray-400">OR PASTE JSON</span>
                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
              </div>

              <textarea
                rows={4}
                placeholder="Paste JSON content here if drag &amp; drop is not available..."
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                className="w-full text-xs font-mono p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsImportModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={isImporting}
                >
                  {isImporting ? "Importing..." : "Import Course"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * HOW THIS MODULE WORKS (v2):
 * 1. Data Fetching: Calls `/api/courses` on mount to retrieve the user's parsed course tree.
 * 2. State: Maintains `selectedCourseId`, `expandedSections`, plus new feature states.
 * 3. Optimistic Updates: All mutations update local React state immediately; API call fires in
 *    background. On failure, state is re-fetched for consistency.
 * 4. Course Deletion: DELETE /api/courses/[courseId] — cascades via Prisma schema.
 *    Confirmation dialog shown inline on course card before destructive action.
 * 5. Course Rename: PATCH /api/courses/[courseId] with { title } — inline edit on course card.
 * 6. Sticky Progress Card: Uses CSS `sticky top-20 z-10` on the overview card wrapper.
 * 7. Expand/Collapse All: Buttons in the syllabus header control `expandedSections` state.
 * 8. Video Search: Filters `filteredSections` by video title on the client side.
 * 9. Flagged Filter: Toggle to show only flagged videos across all visible sections.
 * 10. Course Estimator: Calculates remaining days based on `(Total - Watched) / UserInputSpeed`.
 * 11. Import Logic: Accepts drag-and-drop or click-to-upload JSON files.
 */
