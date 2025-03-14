"use client";

import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function CopyButton() {
  const [isCopied, setIsCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Button variant="outline" onClick={handleCopy}>
      <Share className="h-4 w-4" />
      <span>{isCopied ? "Copied" : "Copy"}</span>
    </Button>
  );
}
