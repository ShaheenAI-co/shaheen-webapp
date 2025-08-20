import { TextShimmer } from "./text-shimmer";
import { useTranslations } from "next-intl";

export function TextShimmerBasic() {
  const t = useTranslations("ImageEdit");

  return (
    <TextShimmer className="font-mono text-sm" duration={1}>
      {t("generating")}
    </TextShimmer>
  );
}
