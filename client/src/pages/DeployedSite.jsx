import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";

function DeployedSite() {
  const { slug } = useParams();
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("Deployed Website");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWebsite = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await axios.get(`${serverUrl}/api/website/public/${slug}`);
        setCode(result?.data?.code || "");
        setTitle(result?.data?.title || "Deployed Website");
      } catch (err) {
        console.log(err);
        setError(err?.response?.data?.message || "Failed to load deployed website.");
      } finally {
        setLoading(false);
      }
    };

    fetchWebsite();
  }, [slug]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black text-zinc-200 flex items-center justify-center">
        Loading deployed site...
      </div>
    );
  }

  if (error || !code) {
    return (
      <div className="h-screen w-screen bg-black text-red-400 flex items-center justify-center px-4 text-center">
        {error || "No deployed code found."}
      </div>
    );
  }

  return (
    <iframe
      title={title}
      srcDoc={code}
      className="h-screen w-screen border-0"
      sandbox="allow-scripts allow-forms allow-modals allow-popups"
    />
  );
}

export default DeployedSite;
