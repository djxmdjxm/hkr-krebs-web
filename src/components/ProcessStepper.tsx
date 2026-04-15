interface Step {
  number: number;
  label: string;
}

const STEPS: Step[] = [
  { number: 1, label: "Upload" },
  { number: 2, label: "Validierung" },
  { number: 3, label: "Import" },
  { number: 4, label: "Ergebnis" },
];

interface ProcessStepperProps {
  currentStep: number; // 1-4
}

export default function ProcessStepper({ currentStep }: ProcessStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-2xl mx-auto">
      {STEPS.map((step, idx) => {
        const isActive = step.number === currentStep;
        const isDone = step.number < currentStep;
        const isLast = idx === STEPS.length - 1;

        return (
          <div key={step.number} className="flex items-center">
            {/* Circle + Label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                style={{
                  backgroundColor: isActive
                    ? "#003063"
                    : isDone
                    ? "#0B70C8"
                    : "#D8D8D8",
                  color: isActive || isDone ? "#FFFFFF" : "#505050",
                }}
              >
                {isDone ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8l3.5 3.5L13 5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className="text-xs font-medium whitespace-nowrap"
                style={{ color: isActive ? "#003063" : "#505050" }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className="w-16 h-0.5 mb-5 mx-1"
                style={{ backgroundColor: isDone ? "#0B70C8" : "#D8D8D8" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
