import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, ExternalLink, Rocket, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";

function Dashboard() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deployingId, setDeployingId] = useState("");
  const [shareMsgById, setShareMsgById] = useState({});

  useEffect(() => {
    const handleGetAllWebsites = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-all`, {
          withCredentials: true,
        });
        setWebsites(result.data || []);
      } catch (err) {
        console.log(err);
        setError(err?.response?.data?.message || "Failed to load websites.");
      } finally {
        setLoading(false);
      }
    };

    handleGetAllWebsites();
  }, []);

  const handleDepoly = async (id) => {
    if (!id) return;
    setDeployingId(id);
    setShareMsgById((prev) => ({ ...prev, [id]: "" }));
    try {
      const result = await axios.get(`${serverUrl}/api/website/depoly/${id}`, {
        withCredentials: true,
      });
      const deployedUrl = result?.data?.url;
      if (!deployedUrl) return;
      setWebsites((prev) =>
        prev.map((site) =>
          site._id === id
            ? {
                ...site,
                depolyUrl: deployedUrl,
                depolyed: true,
              }
            : site
        )
      );
      window.open(deployedUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.log(err);
      setShareMsgById((prev) => ({
        ...prev,
        [id]: err?.response?.data?.message || "Deployment failed.",
      }));
    } finally {
      setDeployingId("");
    }
  };

  const handleShare = async (id, website) => {
    const url = website?.depolyUrl;
    if (!url) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: website?.title || "My website",
          text: "Check out my deployed website",
          url,
        });
        setShareMsgById((prev) => ({ ...prev, [id]: "Shared successfully." }));
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareMsgById((prev) => ({
        ...prev,
        [id]: "Share API not available. Link copied.",
      }));
    } catch (err) {
      console.log(err);
      setShareMsgById((prev) => ({ ...prev, [id]: "Share cancelled." }));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="p-2 rounded-md hover:bg-white/10 transition"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <button
            className="px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-all duration-200 active:scale-95 text-sm sm:text-base"
            onClick={() => navigate("/generate")}
          >
            + New Website
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-10"
        >
          <p className="text-sm text-zinc-400 mb-1">Welcome back</p>
          <h1 className="text-2xl sm:text-3xl text-zinc-200 mb-1">
            {userData?.name || "User"}
          </h1>
        </motion.div>

        {loading && <div className="text-zinc-300">Loading websites...</div>}

        {!loading && error && <div className="text-red-400">{error}</div>}

        {!loading && !error && websites.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-zinc-400">
            No websites yet. Create your first one.
          </div>
        )}

        {!loading && !error && websites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {websites.map((w, i) => (
              <motion.div
                key={w._id || i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 sm:p-5"
              >
                <h2 className="text-lg font-semibold text-white truncate mb-2">
                  {w.title || "Untitled Website"}
                </h2>
                <p className="text-xs text-zinc-400 mb-5">
                  {w.updatedAt
                    ? `Updated ${new Date(w.updatedAt).toLocaleString()}`
                    : "No update time available"}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  {!w.depolyUrl && !w.depolyed ? (
                    <button
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                      onClick={() => handleDepoly(w._id)}
                      disabled={!w.latestCode || deployingId === w._id}
                      title={w.latestCode ? "Deploy website" : "No code to deploy"}
                    >
                      <Rocket size={15} />
                      {deployingId === w._id ? "Deploying..." : "Deploy"}
                    </button>
                  ) : null}
                  <button
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-sm hover:bg-white/10 transition"
                    onClick={() => navigate(`/editor/${w._id}`)}
                  >
                    <ExternalLink size={15} />
                    Open
                  </button>
                </div>

                {w.depolyUrl ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-2">
                    <p className="text-xs text-emerald-300">Deployed Link</p>
                    <a
                      href={w.depolyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-300 break-all hover:underline"
                    >
                      {w.depolyUrl}
                    </a>
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md bg-white/10 hover:bg-white/20 transition"
                        onClick={() => handleShare(w._id, w)}
                      >
                        <Share2 size={13} />
                        Share
                      </button>
                    </div>
                  </div>
                ) : null}

                {shareMsgById[w._id] ? (
                  <p className="mt-2 text-xs text-zinc-400">{shareMsgById[w._id]}</p>
                ) : null}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
