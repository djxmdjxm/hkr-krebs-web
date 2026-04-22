"use client";
import { useState, useEffect } from "react";

export function useCodeServerUrl(): string {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(`http://${window.location.hostname}:8091`);
  }, []);
  return url;
}
