import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Code2, ExternalLink, MessageSquare, Monitor, Rocket, X } from "lucide-react";
import { serverUrl } from "../App";
import { AnimatePresence, motion } from "motion/react";
import Editor from "@monaco-editor/react";

const THINKING_STEPS = [
  "Understanding your request",
  "Planning layout changes",
  "Improving responsiveness",
  "Finalizing update",
];

function WebsiteEditor() {
  const { id } = useParams();
  const [website, setWebsite] = useState(null);
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [mobileView, setMobileView] = useState("preview");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployError, setDeployError] = useState("");

  const handleUpdate = async () => {
    const nextPrompt = prompt.trim();
    if (!nextPrompt || isUpdating) return;

    setIsUpdating(true);
    setUpdateError("");
    try {
      await axios.post(
        `${serverUrl}/api/website/update/${id}`,
        { prompt: nextPrompt },
        { withCredentials: true, timeout: 120000 }
      );

      const refreshed = await axios.get(
        `${serverUrl}/api/website/get-by-id/${id}`,
        { withCredentials: true, timeout: 30000 }
      );
      setWebsite(refreshed.data);
      setPrompt("");
    } catch (err) {
      console.log(err);
      setUpdateError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update website."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeploy = async () => {
    if (isDeploying || !website?._id) return;
    setIsDeploying(true);
    setDeployError("");
    try {
      const result = await axios.get(
        `${serverUrl}/api/website/depoly/${website._id}`,
        { withCredentials: true, timeout: 30000 }
      );
      const deployedUrl = result?.data?.url;
      setWebsite((prev) =>
        prev
          ? {
              ...prev,
              depolyed: true,
              depolyUrl: deployedUrl || prev.depolyUrl,
            }
          : prev
      );
      if (deployedUrl) {
        window.open(deployedUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.log(err);
      setDeployError(
        err?.response?.data?.message || "Failed to deploy website."
      );
    } finally {
      setIsDeploying(false);
    }
  };

  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/website/get-by-id/${id}`,
          { withCredentials: true }
        );

        setWebsite(result.data);
      } catch (err) {
        console.log(err);
        setError(err?.response?.data?.message || "Failed to load website.");
      }
    };

    handleGetWebsite();
  }, [id]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-400">
        {error}
      </div>
    );
  }

  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading....
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row bg-black text-white overflow-hidden">
      <aside
        className={`${
          mobileView === "chat" ? "flex" : "hidden"
        } lg:flex w-full lg:max-w-md border-b lg:border-b-0 lg:border-r border-white/10 min-h-0 flex-col`}
      >
        <Header
          website={website}
          onShowPreviewMobile={() => setMobileView("preview")}
        />
        <Chat
          website={website}
          prompt={prompt}
          setPrompt={setPrompt}
          handleUpdate={handleUpdate}
          isUpdating={isUpdating}
          updateError={updateError}
        />
      </aside>

      <div
        className={`${
          mobileView === "preview" ? "flex" : "hidden"
        } lg:flex flex-1 min-h-0 flex-col`}
      >
        <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80">
          <span className="text-xs text-zinc-400">Live Preview</span>

          <div className="flex gap-2">
            <button
              className="p-2 lg:hidden"
              onClick={() => setMobileView("chat")}
              title="Show chat"
            >
              <MessageSquare size={18} />
            </button>
            {!website?.depolyed && !website?.depolyUrl ? (
              <button
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleDeploy}
                disabled={isDeploying}
              >
                <Rocket size={14} />
                {isDeploying ? "Deploying..." : "Deploy"}
              </button>
            ) : (
              <button
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-white/15 bg-white/5 text-sm font-semibold hover:bg-white/10 transition"
                onClick={() =>
                  window.open(website.depolyUrl, "_blank", "noopener,noreferrer")
                }
                title="Open deployed website"
              >
                <ExternalLink size={14} />
                Open Link
              </button>
            )}

            <button
              className="p-2"
              onClick={() => {
                setShowFullPreview(false);
                setShowCode(true);
              }}
              title="Show code"
            >
              <Code2 size={18} />
            </button>

            <button
              className="p-2"
              onClick={() => {
                setShowCode(false);
                setShowFullPreview(true);
              }}
              title="Full preview"
            >
              <Monitor size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-zinc-950 p-3">
          {deployError ? (
            <p className="mb-2 text-xs text-red-400">{deployError}</p>
          ) : null}
          {website.latestCode ? (
            <iframe
              title="website-preview"
              srcDoc={website.latestCode}
              className="w-full h-full rounded-xl border border-white/10 bg-white"
              sandbox="allow-scripts allow-forms allow-modals"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-400 border border-white/10 rounded-xl">
              No preview code available.
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-y-0 right-0 w-full lg:w-[45%] z-[9999] bg-[#1e1e1e] border-l border-white/10 flex flex-col"
          >
            <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
              <span className="text-sm font-medium text-zinc-200">Code</span>
              <button
                className="p-2 text-zinc-300 hover:text-white"
                onClick={() => setShowCode(false)}
                title="Close code"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                defaultLanguage="html"
                value={website.latestCode || "// No code available"}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showFullPreview && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10000] bg-black/95 flex flex-col"
          >
            <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
              <span className="text-sm font-medium text-zinc-200">
                Full Preview
              </span>
              <button
                className="p-2 text-zinc-300 hover:text-white"
                onClick={() => setShowFullPreview(false)}
                title="Close full preview"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 p-3">
              {website.latestCode ? (
                <iframe
                  title="website-full-preview"
                  srcDoc={website.latestCode}
                  className="w-full h-full rounded-xl border border-white/10 bg-white"
                  sandbox="allow-scripts allow-forms allow-modals"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-400 border border-white/10 rounded-xl">
                  No preview code available.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Header({ website, onShowPreviewMobile }) {
  return (
    <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
      <span className="font-semibold truncate">{website.title}</span>
      <button
        className="p-2 lg:hidden text-zinc-300 hover:text-white"
        onClick={onShowPreviewMobile}
        title="Show preview"
      >
        <Monitor size={18} />
      </button>
    </div>
  );
}

function Chat({
  website,
  prompt,
  setPrompt,
  handleUpdate,
  isUpdating,
  updateError,
}) {
  const [activeThinkingStep, setActiveThinkingStep] = useState(0);

  useEffect(() => {
    if (!isUpdating) {
      setActiveThinkingStep(0);
      return;
    }

    setActiveThinkingStep(0);
    const timer = setInterval(() => {
      setActiveThinkingStep((prev) =>
        Math.min(prev + 1, THINKING_STEPS.length - 1)
      );
    }, 1800);

    return () => clearInterval(timer);
  }, [isUpdating]);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {(website.conversation || []).map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}
          >
            <div
              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-white text-black"
                  : "bg-white/5 border border-white/10 text-zinc-200"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isUpdating ? (
          <div className="max-w-[85%] mr-auto">
            <div className="px-4 py-3 rounded-2xl text-sm bg-white/5 border border-white/10 text-zinc-200 space-y-2">
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                AI is working...
              </p>
              {THINKING_STEPS.map((step, index) => {
                const isDone = index < activeThinkingStep;
                const isActive = index === activeThinkingStep;
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-2 ${
                      isDone
                        ? "text-emerald-300"
                        : isActive
                        ? "text-white"
                        : "text-zinc-500"
                    }`}
                  >
                    <span className="text-xs">
                      {isDone ? "✓" : isActive ? "●" : "○"}
                    </span>
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      <div className="p-3 border-t border-white/10 mt-auto">
        {updateError ? (
          <p className="mb-2 text-xs text-red-400">{updateError}</p>
        ) : null}
        <div className="flex gap-2">
          <textarea
            rows="1"
            placeholder="Describe Changes..."
            className="flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-white outline-none focus:border-white/20 transition"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleUpdate();
              }
            }}
          />
          <button
            className="px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 transition"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WebsiteEditor;
