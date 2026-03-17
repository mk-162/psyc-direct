"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
    setDismissed(true);
  };

  if (!visible || dismissed) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <span className="cookie-banner-text">
          We use cookies to improve your experience. By continuing to browse, you agree to our{" "}
          <Link href="/utility/cookies" className="cookie-banner-link">Cookie Policy</Link>.
        </span>
        <button onClick={accept} className="cookie-banner-btn">
          Accept
        </button>
      </div>
    </div>
  );
}
