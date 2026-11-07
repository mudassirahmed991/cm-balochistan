"use client";

import { useState, useTransition } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileCheck2,
  HelpCircle,
  Loader2,
  Mail,
  Search,
  Send,
  ShieldCheck,
} from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  submitComplaintAction,
  trackComplaintAction,
  submitComplaintFeedbackAction,
  type TrackingResult,
} from "@/app/actions/complaints";
import { submitInquiryAction } from "@/app/actions/inquiries";

const districts = [
  "Quetta",
  "Gwadar",
  "Turbat (Kech)",
  "Khuzdar",
  "Hub",
  "Kalat",
  "Zhob",
  "Sibi",
  "Loralai",
  "Dera Bugti",
  "Naseerabad",
  "Jaffarabad",
  "Chagai",
  "Panjgur",
  "Lasbela",
  "Pishin",
  "Killa Abdullah",
  "Chaman",
  "Ziarat",
  "Mastung",
  "Nushki",
  "Kharan",
  "Washuk",
  "Awaran",
  "Barkhan",
  "Musakhail",
  "Killa Saifullah",
  "Duki",
  "Kohlu",
  "Sohbatpur",
  "Jhal Magsi",
  "Usta Muhammad",
  "Surab",
  "Harnai",
  "Other district",
];

const categories = [
  "Healthcare & Hospital Services",
  "Schooling & Higher Education",
  "Clean Drinking Water & PHE",
  "Roads, Transport & Infrastructure",
  "Electricity & Energy Supply",
  "Agriculture & Irrigation Water",
  "Local Government & Municipal Services",
  "Law, Security & Civil Administration",
  "Other Public Grievance",
];

const inputClass =
  "glass-input-3d w-full rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-pine-950 placeholder:text-pine-900/40 transition-all";

const labelClass = "mb-1.5 block text-[11px] font-bold tracking-wider text-pine-900/70 uppercase";

export function ConnectHub({ initialTab = "complaint" }: { initialTab?: "complaint" | "track" | "inquiry" | "guidelines" }) {
  const [activeTab, setActiveTab] = useState<"complaint" | "track" | "inquiry" | "guidelines">(initialTab);

  // Transitions
  const [isSubmittingComplaint, startSubmitComplaint] = useTransition();
  const [isTracking, startTracking] = useTransition();
  const [isSubmittingInquiry, startSubmitInquiry] = useTransition();

  // Complaint Form State
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);
  const [generatedRef, setGeneratedRef] = useState("");
  const [complaintError, setComplaintError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Tracking State
  const [searchRef, setSearchRef] = useState("");
  const [trackingResult, setTrackingResult] = useState<TrackingResult["complaint"] | null>(null);
  const [trackingTimeline, setTrackingTimeline] = useState<NonNullable<TrackingResult["timeline"]>>([]);
  const [trackError, setTrackError] = useState("");

  // Feedback & Appeal State
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [appealOpen, setAppealOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState("");
  const [appealComments, setAppealComments] = useState("");
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState("");
  const [feedbackErrorMsg, setFeedbackErrorMsg] = useState("");
  const [isSubmittingFeedback, startSubmitFeedback] = useTransition();

  // Inquiry Form State
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryError, setInquiryError] = useState("");

  // Copied state
  const [copied, setCopied] = useState(false);

  function handleComplaintSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setComplaintError("");
    setFieldErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    startSubmitComplaint(async () => {
      const res = await submitComplaintAction(null, formData);
      if (res.success && res.trackingCode) {
        setGeneratedRef(res.trackingCode);
        setComplaintSubmitted(true);
        form.reset();
      } else {
        setComplaintError(res.message);
        if (res.errors) {
          setFieldErrors(res.errors);
        }
      }
    });
  }

  function handleTrackSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = searchRef.trim().toUpperCase();
    if (!clean) {
      setTrackError("Please enter your official tracking code (e.g., CMB-2026-1001).");
      return;
    }

    setTrackError("");
    setTrackingResult(null);
    setTrackingTimeline([]);

    startTracking(async () => {
      const res = await trackComplaintAction(clean);
      if (res.success && res.complaint) {
        setTrackingResult(res.complaint);
        setTrackingTimeline(res.timeline || []);
      } else {
        setTrackError(res.message || "No grievance found with this reference.");
      }
    });
  }

  function handleInquirySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setInquiryError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    startSubmitInquiry(async () => {
      const res = await submitInquiryAction(null, formData);
      if (res.success) {
        setInquiryMessage(res.message);
        setInquirySubmitted(true);
        form.reset();
      } else {
        setInquiryError(res.message);
      }
    });
  }

  function copyTrackingCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function trackFromSuccess(code: string) {
    setSearchRef(code);
    setActiveTab("track");
    startTracking(async () => {
      const res = await trackComplaintAction(code);
      if (res.success && res.complaint) {
        setTrackingResult(res.complaint);
        setTrackingTimeline(res.timeline || []);
      }
    });
  }

  function handleFeedbackSubmit(e: React.FormEvent, isAppeal: boolean) {
    e.preventDefault();
    if (!trackingResult) return;
    setFeedbackErrorMsg("");
    setFeedbackSuccessMsg("");

    const comments = isAppeal ? appealComments : feedbackComments;
    if (!comments || comments.trim().length < 5) {
      setFeedbackErrorMsg("Please enter at least 5 characters.");
      return;
    }

    startSubmitFeedback(async () => {
      const res = await submitComplaintFeedbackAction(
        trackingResult.trackingCode,
        comments,
        isAppeal ? 1 : feedbackRating,
        isAppeal
      );
      if (res.success) {
        setFeedbackSuccessMsg(res.message);
        setFeedbackComments("");
        setAppealComments("");
        setFeedbackOpen(false);
        setAppealOpen(false);
        const updated = await trackComplaintAction(trackingResult.trackingCode);
        if (updated.success && updated.complaint) {
          setTrackingResult(updated.complaint);
          setTrackingTimeline(updated.timeline || []);
        }
      } else {
        setFeedbackErrorMsg(res.message);
      }
    });
  }

  return (
    <div className="glass-panel-3d rounded-3xl overflow-hidden shadow-lift transition-all">
      {/* Official External GRM Banner */}
      <div className="border-b border-white/10 bg-gradient-to-r from-pine-950 via-pine-900 to-pine-950 px-5 py-4 text-white relative overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div className="flex items-start gap-3">
            <span className="icon-box-3d mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-pine-900 text-gold-300">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-300">
                  Official Provincial Portal
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80 border border-white/15">
                  AWAAZ Grievance Cell
                </span>
              </div>
              <p className="mt-0.5 text-xs text-white/70">
                Centralized Balochistan Grievance Redressal Mechanism for provincial line departments.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <a
              href={site.grm.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-gold inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold"
            >
              Register on Official GRM
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={site.grm.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-glass text-white border-white/20 hover:border-white/40 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold"
            >
              Track on Official GRM
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-pine-900/10 bg-mist/40 backdrop-blur-md p-2.5 sm:p-3.5 gap-2.5" role="tablist">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={site.grm.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d-emerald flex items-center gap-2 px-4 py-2 text-xs font-bold"
          >
            <FileCheck2 className="h-4 w-4 text-gold-300" />
            Register Complaint
            <ArrowUpRight className="h-3.5 w-3.5 opacity-80" />
          </a>

          <a
            href={site.grm.trackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d-glass flex items-center gap-2 px-4 py-2 text-xs font-bold text-pine-950"
          >
            <Search className="h-4 w-4 text-pine-700" />
            Track Complaint
            <ArrowUpRight className="h-3.5 w-3.5 opacity-80" />
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "complaint"}
            onClick={() => setActiveTab("complaint")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all",
              activeTab === "complaint"
                ? "btn-3d-emerald font-bold text-white"
                : "btn-3d-glass text-pine-900/80 hover:text-pine-950",
            )}
          >
            CM Secretariat Petition
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "track"}
            onClick={() => setActiveTab("track")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all",
              activeTab === "track"
                ? "btn-3d-emerald font-bold text-white"
                : "btn-3d-glass text-pine-900/80 hover:text-pine-950",
            )}
          >
            Track CMB Petition
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "inquiry"}
            onClick={() => setActiveTab("inquiry")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all",
              activeTab === "inquiry"
                ? "btn-3d-emerald font-bold text-white"
                : "btn-3d-glass text-pine-900/80 hover:text-pine-950",
            )}
          >
            <Mail className="h-3.5 w-3.5" />
            Public Inquiry
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "guidelines"}
            onClick={() => setActiveTab("guidelines")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all",
              activeTab === "guidelines"
                ? "btn-3d-emerald font-bold text-white"
                : "btn-3d-glass text-pine-900/80 hover:text-pine-950",
            )}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Guidelines & Policy
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-10">
        {/* TAB 1: REGISTER COMPLAINT */}
        {activeTab === "complaint" && (
          <div>
            {complaintSubmitted ? (
              <div className="py-8 text-center max-w-xl mx-auto">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-display mt-5 text-2xl font-bold text-pine-950">
                  Grievance Successfully Registered
                </h3>
                <p className="mt-2 text-sm text-pine-900/70 leading-relaxed">
                  Your grievance has been submitted directly to the Chief Minister&apos;s Public Complaint Cell and stored in the provincial database.
                </p>

                <div className="mt-6 rounded-2xl border border-pine-900/15 bg-sand/60 p-5">
                  <p className="text-[11px] font-bold tracking-widest text-pine-900/60 uppercase">
                    Official Grievance Reference
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <p className="font-mono text-2xl sm:text-3xl font-extrabold text-pine-950 tracking-wider">
                      {generatedRef}
                    </p>
                    <button
                      type="button"
                      onClick={() => copyTrackingCode(generatedRef)}
                      className="rounded-xl border border-pine-900/20 bg-white p-2 text-pine-900/80 hover:bg-pine-50 hover:text-pine-950 transition-colors"
                      title="Copy Tracking Code"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  {copied && (
                    <p className="mt-1 text-xs font-semibold text-emerald-700">Code copied to clipboard!</p>
                  )}
                  <p className="mt-2 text-xs text-pine-900/65">
                    Save this reference code to track ongoing departmental progress and resolution notes.
                  </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => trackFromSuccess(generatedRef)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-pine-900 px-6 py-3.5 text-xs font-bold text-white shadow-soft hover:bg-pine-800 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    Track This Grievance Now
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setComplaintSubmitted(false);
                      setGeneratedRef("");
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-pine-900/20 bg-white px-6 py-3.5 text-xs font-bold text-pine-950 hover:bg-sand/60 transition-colors"
                  >
                    Submit Another Complaint
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit} className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-pine-950">
                    Lodge a Grievance with the Chief Minister
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-pine-900/70 leading-relaxed">
                    Direct public redressal mechanism monitored by the Chief Minister&apos;s Secretariat. Every complaint is assigned a verified tracking number and routed to the competent departmental authority.
                  </p>
                </div>

                {/* Official Provincial GRM Notice */}
                <div className="glass-dark-3d rounded-2xl p-5 sm:p-6 text-white shadow-lift flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/20 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-gold-300 uppercase border border-gold-400/25">
                      Official Provincial System · AWAAZ
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                      Register Public Service Complaint on Official GRM Portal
                    </h4>
                    <p className="mt-1 text-xs text-white/75 max-w-xl">
                      To register grievances regarding healthcare, education, clean water, roads, electricity, or administrative services across all 37 districts, open the official provincial grievance portal.
                    </p>
                  </div>
                  <a
                    href={site.grm.registerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-3d-gold inline-flex shrink-0 items-center justify-center gap-2 px-5 py-3 text-xs font-bold"
                  >
                    Open Complaint Register Link
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>

                {complaintError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <p>{complaintError}</p>
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="citizenName" className={labelClass}>
                      Full Legal Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="citizenName"
                      name="citizenName"
                      type="text"
                      required
                      placeholder="e.g. Mir Gul Khan Baloch"
                      className={inputClass}
                    />
                    {fieldErrors.citizenName && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.citizenName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="citizenPhone" className={labelClass}>
                      Mobile Number (Pakistan) <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="citizenPhone"
                      name="citizenPhone"
                      type="tel"
                      required
                      placeholder="03001234567"
                      className={inputClass}
                    />
                    {fieldErrors.citizenPhone && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.citizenPhone}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label htmlFor="citizenEmail" className={labelClass}>
                      Email Address (Optional)
                    </label>
                    <input
                      id="citizenEmail"
                      name="citizenEmail"
                      type="email"
                      placeholder="citizen@example.com"
                      className={inputClass}
                    />
                    {fieldErrors.citizenEmail && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.citizenEmail}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="district" className={labelClass}>
                      District <span className="text-red-600">*</span>
                    </label>
                    <select id="district" name="district" required className={inputClass} defaultValue="">
                      <option value="" disabled>Select your district...</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {fieldErrors.district && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.district}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="category" className={labelClass}>
                      Grievance Category <span className="text-red-600">*</span>
                    </label>
                    <select id="category" name="category" required className={inputClass} defaultValue="">
                      <option value="" disabled>Select sector category...</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {fieldErrors.category && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.category}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="department" className={labelClass}>
                    Relevant Department or Sub-Division (If Known)
                  </label>
                  <input
                    id="department"
                    name="department"
                    type="text"
                    placeholder="e.g. Public Health Engineering, Education Dept Quetta, DHQ Hospital"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="description" className={labelClass}>
                    Detailed Description of Grievance <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    placeholder="Provide specific details including village/mohalla, landmark, officials contacted, and exact nature of public issue (minimum 20 characters)..."
                    className={inputClass}
                  />
                  {fieldErrors.description && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>
                  )}
                </div>

                <div className="rounded-2xl border border-pine-900/10 bg-mist/60 p-4 text-xs text-pine-900/70 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-pine-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-pine-950">Official Privacy & Whistleblower Protection</p>
                    <p className="mt-0.5">Your personal information is strictly safeguarded in accordance with the Balochistan Information Protection Standards and is only shared with authorized investigating officers.</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingComplaint}
                    className="btn-3d-emerald inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingComplaint ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting to Database...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Official Grievance
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: TRACK COMPLAINT */}
        {activeTab === "track" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-pine-950">
                Track Grievance Status
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-pine-900/70">
                Enter your official tracking code (e.g., <strong className="text-pine-900 font-mono">CMB-2026-1001</strong> or <strong className="text-pine-900 font-mono">CMB-2026-1002</strong>) to inspect live departmental actions and resolution milestones.
              </p>
            </div>

            {/* Official GRM Tracking Notice */}
            <div className="glass-dark-3d rounded-2xl p-5 sm:p-6 text-white shadow-lift flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/20 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-gold-300 uppercase border border-gold-400/25">
                  Centralized Provincial Tracker · AWAAZ
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                  Track Your Grievance on Official GRM Portal
                </h4>
                <p className="mt-1 text-xs text-white/75 max-w-xl">
                  Already have an AWAAZ ticket number from grmbalochistan.com or the 24/7 hotline (1160)? Open the official tracker for live department milestones.
                </p>
              </div>
              <a
                href={site.grm.trackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d-gold inline-flex shrink-0 items-center justify-center gap-2 px-5 py-3 text-xs font-bold"
              >
                Open Complaint Track Link
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                placeholder="Enter Reference (e.g., CMB-2026-1001)"
                className={cn(inputClass, "font-mono uppercase tracking-wider")}
              />
              <button
                type="submit"
                disabled={isTracking}
                className="btn-3d-emerald inline-flex shrink-0 items-center justify-center gap-2 px-7 py-3.5 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
              >
                {isTracking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Check Status
                  </>
                )}
              </button>
            </form>

            {trackError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <p>{trackError}</p>
              </div>
            )}

            {trackingResult && (
              <div className="glass-card-3d rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-pine-900/10 pb-5">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-pine-900/50 uppercase">
                      Official Tracking Code
                    </span>
                    <p className="font-mono text-2xl font-black text-pine-950">
                      {trackingResult.trackingCode}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-pine-900/60">Current Status:</span>
                    <span
                      className={cn(
                        "rounded-full px-3.5 py-1 text-xs font-bold tracking-wide",
                        trackingResult.status === "RESOLVED"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : trackingResult.status === "IN_PROGRESS"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : trackingResult.status === "ASSIGNED"
                          ? "bg-blue-100 text-blue-900 border border-blue-300"
                          : "bg-pine-100 text-pine-900 border border-pine-300",
                      )}
                    >
                      {trackingResult.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 text-xs">
                  <div className="glass-card-3d rounded-xl p-3.5">
                    <p className="text-pine-900/50 uppercase font-bold text-[10px]">District</p>
                    <p className="mt-1 font-semibold text-pine-950">{trackingResult.district}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3.5 border border-pine-900/8">
                    <p className="text-pine-900/50 uppercase font-bold text-[10px]">Category</p>
                    <p className="mt-1 font-semibold text-pine-950">{trackingResult.category}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3.5 border border-pine-900/8">
                    <p className="text-pine-900/50 uppercase font-bold text-[10px]">Lodged On</p>
                    <p className="mt-1 font-semibold text-pine-950">
                      {new Date(trackingResult.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {trackingResult.department && (
                  <div className="rounded-xl bg-white p-4 border border-pine-900/8 text-xs">
                    <p className="text-pine-900/50 uppercase font-bold text-[10px]">Assigned Department</p>
                    <p className="mt-1 font-semibold text-pine-950">{trackingResult.department}</p>
                  </div>
                )}

                {trackingResult.resolutionNotes && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-950">
                    <p className="text-emerald-800 uppercase font-bold text-[10px]">Official Resolution Findings</p>
                    <p className="mt-1.5 leading-relaxed font-medium">{trackingResult.resolutionNotes}</p>
                  </div>
                )}

                {/* Timeline History */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-pine-900/60 mb-3">
                    Progress Timeline ({trackingTimeline?.length || 0} Events)
                  </h4>
                  <div className="space-y-3">
                    {trackingTimeline && trackingTimeline.length > 0 ? (
                      trackingTimeline.map((item: NonNullable<TrackingResult["timeline"]>[number], idx: number) => (
                        <div key={item.id || idx} className="flex gap-3 text-xs bg-white p-3.5 rounded-xl border border-pine-900/8">
                          <div className="flex flex-col items-center">
                            <div className="h-2 w-2 rounded-full bg-pine-700 mt-1.5" />
                            {idx < trackingTimeline.length - 1 && (
                              <div className="w-0.5 grow bg-pine-200 my-1" />
                            )}
                          </div>
                          <div className="grow">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-pine-950">{item.newStatus.replace("_", " ")}</span>
                              <span className="text-[10px] text-pine-900/50">
                                {new Date(item.createdAt).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            {item.comments && (
                              <p className="mt-1 text-pine-900/75 leading-relaxed">{item.comments}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-pine-900/60">No status logs recorded yet.</p>
                    )}
                  </div>
                </div>

                {/* CITIZEN FEEDBACK & ESCALATION APPEAL PANEL */}
                <div className="glass-panel-3d rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h5 className="font-bold text-pine-950 text-xs sm:text-sm">
                        Citizen Feedback & Right of Appeal
                      </h5>
                      <p className="text-[11px] text-pine-900/60 mt-0.5">
                        {trackingResult.status === "RESOLVED"
                          ? "Has this grievance been satisfactorily addressed by the department?"
                          : "Grievance undergoing departmental processing. You may submit additional remarks or file an escalation appeal."}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFeedbackOpen(!feedbackOpen);
                          setAppealOpen(false);
                          setFeedbackErrorMsg("");
                          setFeedbackSuccessMsg("");
                        }}
                        className="btn-3d-glass text-pine-900 px-3.5 py-1.5 text-xs font-bold"
                      >
                        Submit Feedback
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAppealOpen(!appealOpen);
                          setFeedbackOpen(false);
                          setFeedbackErrorMsg("");
                          setFeedbackSuccessMsg("");
                        }}
                        className="btn-3d-gold px-3.5 py-1.5 text-xs font-bold"
                      >
                        Request Escalation (Appeal)
                      </button>
                    </div>
                  </div>

                  {feedbackSuccessMsg && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>{feedbackSuccessMsg}</span>
                    </div>
                  )}

                  {feedbackErrorMsg && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{feedbackErrorMsg}</span>
                    </div>
                  )}

                  {/* Feedback Form */}
                  {feedbackOpen && (
                    <form onSubmit={(e) => handleFeedbackSubmit(e, false)} className="space-y-3 pt-3 border-t border-pine-900/10">
                      <div>
                        <label className={labelClass}>Satisfaction Rating</label>
                        <select
                          value={feedbackRating}
                          onChange={(e) => setFeedbackRating(Number(e.target.value))}
                          className={inputClass}
                        >
                          <option value={5}>5 Stars — Excellent / Completely Resolved</option>
                          <option value={4}>4 Stars — Good / Adequately Resolved</option>
                          <option value={3}>3 Stars — Average / Partially Resolved</option>
                          <option value={2}>2 Stars — Below Expectations</option>
                          <option value={1}>1 Star — Dissatisfied</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Your Comments</label>
                        <textarea
                          value={feedbackComments}
                          onChange={(e) => setFeedbackComments(e.target.value)}
                          rows={2}
                          placeholder="Tell us about your experience with the departmental response..."
                          className={inputClass}
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setFeedbackOpen(false)}
                          className="btn-3d-glass text-pine-900 px-4 py-2 text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingFeedback}
                          className="btn-3d-emerald px-5 py-2 text-xs font-bold text-white disabled:opacity-50"
                        >
                          {isSubmittingFeedback ? "Submitting..." : "Send Feedback"}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Appeal Form */}
                  {appealOpen && (
                    <form onSubmit={(e) => handleFeedbackSubmit(e, true)} className="space-y-3 pt-3 border-t border-amber-200 bg-amber-50/40 p-4 rounded-xl">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                          Tier-2 Secretariat Escalation Notice
                        </span>
                        <p className="text-xs text-amber-950 mt-1">
                          If your grievance was prematurely closed or the department has not taken effective action, you can escalate the matter directly to the Chief Minister&apos;s Secretariat Oversight Cell.
                        </p>
                      </div>
                      <div>
                        <label className={labelClass}>Grounds for Appeal & Unresolved Details</label>
                        <textarea
                          value={appealComments}
                          onChange={(e) => setAppealComments(e.target.value)}
                          rows={3}
                          placeholder="Explain why the current action is insufficient and what specific remedy is requested..."
                          className={inputClass}
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setAppealOpen(false)}
                          className="btn-3d-glass text-pine-900 px-4 py-2 text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingFeedback}
                          className="btn-3d-danger px-5 py-2 text-xs font-bold text-white disabled:opacity-50"
                        >
                          {isSubmittingFeedback ? "Submitting Appeal..." : "Submit Formal Appeal"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PUBLIC INQUIRY */}
        {activeTab === "inquiry" && (
          <div>
            {inquirySubmitted ? (
              <div className="glass-card-3d py-8 text-center max-w-xl mx-auto rounded-3xl p-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-soft">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-display mt-5 text-2xl font-bold text-pine-950">
                  Inquiry Dispatched
                </h3>
                <p className="mt-2 text-sm text-pine-900/70 leading-relaxed">
                  {inquiryMessage || "Your official inquiry has been submitted to the Chief Minister's Secretariat. Our communications officer will respond via email."}
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setInquirySubmitted(false);
                      setInquiryMessage("");
                    }}
                    className="btn-3d-emerald inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-pine-950">
                    Direct Public Inquiry & Secretariat Correspondence
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-pine-900/70">
                    Use this form for administrative inquiries, official protocol matters, scheduling requests, or general provincial government communications.
                  </p>
                </div>

                {inquiryError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <p>{inquiryError}</p>
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="inquiryName" className={labelClass}>
                      Your Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="inquiryName"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Dr. Tariq Jamali"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="inquiryEmail" className={labelClass}>
                      Official / Personal Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="inquiryEmail"
                      name="email"
                      type="email"
                      required
                      placeholder="tariq.jamali@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="inquiryPhone" className={labelClass}>
                      Contact Phone (Optional)
                    </label>
                    <input
                      id="inquiryPhone"
                      name="phone"
                      type="tel"
                      placeholder="03001234567"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="inquirySubject" className={labelClass}>
                      Subject Matter <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="inquirySubject"
                      name="subject"
                      type="text"
                      required
                      placeholder="e.g. Delegation request regarding Dera Bugti sports complex"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="inquiryMessage" className={labelClass}>
                    Message Body <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="inquiryMessage"
                    name="message"
                    rows={4}
                    required
                    placeholder="Write your official inquiry clearly (minimum 15 characters)..."
                    className={inputClass}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingInquiry}
                    className="btn-3d-emerald inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingInquiry ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Transmit Inquiry
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 4: GUIDELINES & POLICY */}
        {activeTab === "guidelines" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-pine-950">
                Public Complaint Cell Guidelines & Standards
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-pine-900/70">
                Established under the direction of Chief Minister Mir Sarfraz Bugti to ensure transparent, accessible, and accountable governance for all citizens of Balochistan.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="glass-card-3d rounded-2xl p-5">
                <div className="flex items-center gap-2 text-pine-900 font-bold text-sm">
                  <Clock className="h-4 w-4 text-pine-700" />
                  Resolution Timelines
                </div>
                <p className="mt-2 text-pine-900/70 leading-relaxed">
                  - <strong>Urgent Public Hazards:</strong> 24 to 48 hours.<br />
                  - <strong>Hospital & Health Emergencies:</strong> Priority 24 hours.<br />
                  - <strong>School & Civic Infrastructure:</strong> 7 to 14 days.<br />
                  - <strong>Policy & Inter-departmental matters:</strong> 21 days maximum.
                </p>
              </div>

              <div className="glass-card-3d rounded-2xl p-5">
                <div className="flex items-center gap-2 text-pine-900 font-bold text-sm">
                  <ShieldCheck className="h-4 w-4 text-pine-700" />
                  What Can Be Reported
                </div>
                <p className="mt-2 text-pine-900/70 leading-relaxed">
                  - Ghost schools and absent government teachers.<br />
                  - Lack of doctors and emergency medical supplies.<br />
                  - Clean water supply pipeline ruptures and outages.<br />
                  - Road safety issues and municipal negligence.
                </p>
              </div>
            </div>

            <div className="glass-card-3d rounded-2xl border-amber-300/40 bg-amber-50/60 p-5 text-xs text-amber-950">
              <p className="font-bold text-amber-900">Matters Outside Complaint Cell Jurisdiction</p>
              <p className="mt-1 leading-relaxed text-amber-900/80">
                Sub-judice court proceedings, private commercial civil disputes, and matters pending before constitutional judicial tribunals cannot be decided through the administrative grievance cell.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
