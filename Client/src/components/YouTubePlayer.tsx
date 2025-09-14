import React, { useState, useEffect } from "react";

interface YouTubePlayerProps {
  url: string;
  width?: string;
  height?: string;
  autoplay?: boolean;
}

const getYouTubeId = (url: string): string | null => {
  // Handle empty URLs
  if (!url || url.trim() === "") return null;

  // Handle different URL formats
  try {
    // Directly return ID if the URL is already in embed format
    if (url.includes("youtube.com/embed/")) {
      const parts = url.split("youtube.com/embed/");
      if (parts.length > 1) {
        const id = parts[1].split("?")[0];
        return id.length === 11 ? id : null;
      }
    }

    // Standard youtube.com URLs
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const regExp =
        /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[1].length === 11 ? match[1] : null;
    }

    // Plain video IDs (just the 11 character code)
    if (url.trim().length === 11) {
      return url.trim();
    }

    return null;
  } catch (error) {
    console.error("Error extracting YouTube ID:", error);
    return null;
  }
};

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  url,
  width = "100%",
  height = "400px",
  autoplay = false,
}) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset states when URL changes
    setIsLoading(true);
    setError(null);

    const id = getYouTubeId(url);
    setVideoId(id);

    if (!id) {
      setError("Invalid YouTube URL");
    }

    setIsLoading(false);
  }, [url]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-900">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  if (error || !videoId) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-900 text-white">
        {error || "Invalid YouTube URL"}
      </div>
    );
  }
  return (
    <iframe
      width={width}
      height={height}
      src={`https://www.youtube.com/embed/${videoId}?autoplay=${
        autoplay ? 1 : 0
      }&rel=0&modestbranding=1`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
      className="w-full h-full"
    />
  );
};

export default YouTubePlayer;
