import { row } from "../../styles/layout";
import { pill } from "../../styles/ui";

type Props = {
  steps: string[];
  currentIndex: number; // 0-based
};

function Stepper(props: Props) {
  return (
    <div className={row}>
      {props.steps.map((s, idx) => {
        const isCurrent = idx === props.currentIndex;
        const isDone = idx < props.currentIndex;

        const tone = isCurrent
          ? "bg-emerald-700 text-white border-emerald-700"
          : isDone
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-white text-emerald-800 border-emerald-200";

        return (
          <span key={s} className={`${pill} ${tone}`}>
            {idx + 1}. {s}
          </span>
        );
      })}
    </div>
  );
}

export default Stepper;
