"use client";
import { useState, useEffect } from "react";

export function useCodeServerUrl(): string {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(`http://${window.location.hostname}:8081`);
  }, []);
  return url;
}
