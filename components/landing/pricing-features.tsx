import { Briefcase, Check } from "lucide-react";
import type { LinkedLine } from "@/lib/landing-content/types";
import { LinkedLineText, linkedLineKey } from "./linked-line";

const DURATION_COUNT = 3;

type PricingFeaturesProps = {
  features: LinkedLine[];
  classTypesLabel: string;
};

function FeatureIcon({ kind }: { kind: LinkedLine["kind"] }) {
  if (kind === "business") {
    return <Briefcase size={16} className="mt-0.5 shrink-0 text-accent-alt" />;
  }

  return <Check size={16} className="mt-0.5 shrink-0 text-accent" />;
}

function PricingFeatureItem({
  feature,
  index,
}: {
  feature: LinkedLine;
  index: number;
}) {
  const isBusiness = feature.kind === "business";

  return (
    <li
      key={linkedLineKey(feature, index)}
      className={
        isBusiness
          ? "flex items-start gap-3 border-l-2 border-accent/25 pl-3 text-sm text-fg-soft"
          : "flex items-start gap-3 text-sm text-fg-soft"
      }
    >
      <FeatureIcon kind={feature.kind} />
      <LinkedLineText line={feature} />
    </li>
  );
}

export function PricingFeatures({ features, classTypesLabel }: PricingFeaturesProps) {
  const durations = features.slice(0, DURATION_COUNT);
  const classTypes = features.slice(DURATION_COUNT);

  return (
    <ul className="space-y-3">
      {durations.map((feature, index) => (
        <PricingFeatureItem key={linkedLineKey(feature, index)} feature={feature} index={index} />
      ))}

      {classTypes.length > 0 && (
        <li className="list-none pt-2">
          <div className="border-t border-border pt-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
              {classTypesLabel}
            </p>
            <ul className="mt-3 space-y-3">
              {classTypes.map((feature, index) => (
                <PricingFeatureItem
                  key={linkedLineKey(feature, index + DURATION_COUNT)}
                  feature={feature}
                  index={index + DURATION_COUNT}
                />
              ))}
            </ul>
          </div>
        </li>
      )}
    </ul>
  );
}
