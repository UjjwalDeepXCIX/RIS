import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordian";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
      <div
          className={cn(
              "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
              score > 69
                  ? "bg-badge-green"
                  : score > 39
                      ? "bg-badge-yellow"
                      : "bg-badge-red"
          )}
      >
        <img
            src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
            alt="score"
            className="size-4"
        />
        <p
            className={cn(
                "text-sm font-medium",
                score > 69
                    ? "text-badge-green-text"
                    : score > 39
                        ? "text-badge-yellow-text"
                        : "text-badge-red-text"
            )}
        >
          {score}/100
        </p>
      </div>
  );
};

const CategoryHeader = ({
                          title,
                          categoryScore,
                        }: {
  title: string;
  categoryScore: number;
}) => {
  return (
      <div className="flex flex-row gap-4 items-center py-2">
        <p className="text-lg font-semibold text-white tracking-wide"> {title} </p><p className="text-2xl font-semibold">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

const CategoryContent = ({
                           tips,
                         }: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
        
        <div className="flex flex-col gap-4 w-full">
  {tips.map((tip, index) => (
    <div
      key={index + tip.tip}
      className={cn(
        "flex flex-col gap-3 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(0,0,0,0.6)]",
        tip.type === "good"
          ? "bg-emerald-500/10 border border-emerald-400/20 text-emerald-300"
          : "bg-amber-500/10 border border-amber-400/20 text-amber-300"
      )}
    >
      <div className="flex flex-row gap-2 items-center">
        <img
          src={
            tip.type === "good"
              ? "/icons/check.svg"
              : "/icons/warning.svg"
          }
          className="size-5 opacity-80"
        />
        <p className="text-sm font-semibold">{tip.tip}</p>
      </div>

      {/* OPTIONAL: only show explanation if exists */}
      {tip.explanation && (
        <p className="text-xs text-gray-400 leading-relaxed">
          {tip.explanation}
        </p>
      )}
    </div>
  ))}
</div>

  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
      <div className="flex flex-col gap-4 w-full">
        <Accordion>
          <AccordionItem id="tone-style" className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
            <AccordionHeader itemId="tone-style">
              <CategoryHeader
                  title="Tone & Style"
                  categoryScore={feedback.toneAndStyle.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback.toneAndStyle.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="content">
            <AccordionHeader itemId="content">
              <CategoryHeader
                  title="Content"
                  categoryScore={feedback.content.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback.content.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="structure">
            <AccordionHeader itemId="structure">
              <CategoryHeader
                  title="Structure"
                  categoryScore={feedback.structure.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback.structure.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="skills">
            <AccordionHeader itemId="skills">
              <CategoryHeader
                  title="Skills"
                  categoryScore={feedback.skills.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback.skills.tips} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  );
};

export default Details;