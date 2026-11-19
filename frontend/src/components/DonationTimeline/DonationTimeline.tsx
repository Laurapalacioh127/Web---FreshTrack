export interface TimelineStep {
  title: string;
  detail: string;
  done: boolean;
}

export const DonationTimeline = ({ steps }: { steps: TimelineStep[] }) => (
  <ol className="flex flex-col gap-4">
    {steps.map((step, index) => (
      <li key={step.title} className="flex items-center gap-3">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
            step.done ? 'bg-brand text-white' : 'bg-black/10'
          }`}
        >
          {step.done ? '✓' : index + 1}
        </span>
        <div>
          <p className="text-sm font-semibold">{step.title}</p>
          <p className="text-xs text-neutral-600">{step.detail}</p>
        </div>
      </li>
    ))}
  </ol>
);