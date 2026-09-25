import type { IExam } from "@/shared/interfaces";

interface IProps {
  exam: IExam;
  onClick: () => void;
}
const ExamCard = ({ exam, onClick }: IProps) => {
  return (
    <div
      key={exam._id}
      className=" w-full bg-card cursor-pointer px-5 py-3 rounded-md shadow hover:shadow-lg "
      onClick={() => onClick()}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col w-full gap-y-1">
          <span className={`font-bold text-lg capitalize`}>
            [{exam.type === "essay" ? exam.type : exam.type.toUpperCase()} Exam]
          </span>

          <span className="font-bold text-xl tracking-tight">{exam.title}</span>
          <span className="font-semibold text-base text-muted/60">
            Created: {exam.createdAt}
          </span>
        </div>
        {exam.status === "draft" && (
          <span className="capitalize font-bold text-xl text-muted">
            [{exam.status}]
          </span>
        )}
      </div>
    </div>
  );
};

export default ExamCard;
