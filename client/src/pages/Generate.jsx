import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { serverUrl } from "../App";
import axios from "axios";

const GENERATION_STEPS = [
  "Understanding your prompt",
  "Designing responsive layout",
  "Writing production-ready code",
  "Finalizing and preparing editor",
];


function Generate() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setActiveStep(0);
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => Math.min(prev + 5, 92));
    }, 300);

    const stepTimer = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, GENERATION_STEPS.length - 1));
    }, 1600);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, [loading]);

  const handleGenerateWebsite = async () => {
    if (!prompt.trim()) {
      setError("Please provide a description for your website.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await axios.post(
        `${serverUrl}/api/website/generate`,
        { prompt },
        { withCredentials: true }
      );
      const websiteId = result?.data?.websiteId;
      setProgress(100);
      if (!websiteId) {
        setError("Website created but ID is missing.");
        return;
      }
      setTimeout(() => {
        navigate(`/editor/${websiteId}`);
      }, 350);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "An error occurred while generating the website."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0B0B0B] to-[#050505] text-white">
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button className="p-2 rounded-md hover:bg-white/10 transition" onClick={() => navigate("/")}>
                <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">GenWeb.<span className="text-blue-500">ai</span></h1>


        </div>
       

      </div>

      </div>
      <div className="max-w-3xl mx-auto px-6 py-12">
       <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
       >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Build your website with <br />
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Real AI Power</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Describe your dream website in detail, and let our AI generate production-ready code for you.
        </p>

       </motion.div>
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: 0.2 }}
         className="space-y-8"
       >
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300 ml-1">Describe your website</label>
            <textarea 
            onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              
              placeholder="e.g. A modern portfolio website for a photographer with a dark theme, image gallery, and contact form..."
              className="w-full h-56 p-6 rounded-2xl bg-white/5 border border-white/10 outline-none resize-none text-base leading-relaxed focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-zinc-600"
              disabled={loading}
            ></textarea>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          </div>

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4"
            >
              <div className="flex items-center justify-between text-sm">
                <p className="text-zinc-300">Generating your website...</p>
                <p className="text-blue-400 font-medium">{progress}%</p>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
              </div>
              <div className="space-y-2">
                {GENERATION_STEPS.map((step, index) => {
                  const isDone = index < activeStep;
                  const isActive = index === activeStep;
                  return (
                    <div
                      key={step}
                      className={`text-sm ${
                        isDone
                          ? "text-emerald-300"
                          : isActive
                          ? "text-white"
                          : "text-zinc-500"
                      }`}
                    >
                      {isDone ? "✓" : isActive ? "●" : "○"} {step}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          <div className="flex justify-center">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateWebsite}
              disabled={loading}
              className="w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate Website"}
            </motion.button>
          </div>
       </motion.div>

      </div>
    </div>
  );
}

export default Generate;
