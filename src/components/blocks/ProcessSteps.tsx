import React from "react";

interface ProcessStepsData {
  eyebrow?: string;
  heading?: string;
  theme?: "off-white" | "green" | "grey" | "terracotta";
  steps?: Array<{ number: string; title: string; description: string }>;
}

export const ProcessSteps = ({ data }: { data: ProcessStepsData }) => {
  const themeClass =
    data.theme === "green"
      ? "section-deep-green theme-dark"
      : data.theme === "grey"
        ? "section-warm-stone theme-light"
        : data.theme === "terracotta"
          ? "section-terracotta theme-dark"
          : "section-mineral-white theme-light";

  return (
    <section className={`section-editorial section-bleed ${themeClass}`}>
      <div className="container-wide">
        <div className="section-header-center">
          {data.eyebrow && (
            <div className="eyebrow eyebrow-center">{data.eyebrow}</div>
          )}
          {data.heading && (
            <h2 className="heading-display-lg">{data.heading}</h2>
          )}
        </div>
        {data.steps && data.steps.length > 0 && (
          <div className="process-steps mt-section">
            {data.steps.map((step, i) => (
              <div key={i} className="process-step">
                <div className="process-step-number">{step.number}</div>
                <div className="process-step-title">{step.title}</div>
                <div className="process-step-desc">{step.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
