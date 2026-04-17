import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Info, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import {
  getAssessmentQuestions,
  submitCompletedAssessment,
} from "../api/assessment.ts";
import {
  randomizeArray,
  prepareAnswerOptions,
  prepareBlankAnswers,
  shuffle,
} from "../features/assessment/utils.ts";
import { classTypesMap } from "../messages.ts";
import { useClassId } from "../features/classes/hooks/useClassId.tsx";
import { useLoggedInUserContext } from "../hooks/useLoggedInUserContext.ts";
import {
  CompletedAssessmentData,
  AssessmentQuestion,
} from "../features/assessment/types.ts";
import BeatLoader from "react-spinners/BeatLoader";
import { QueryKeys } from "../lib/QueryKeys.ts";
import { strings } from "../utils/strings.ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type MissedQuestion = {
  slotIndex: number;
  title: string;
  correctAnswer: string;
  currentAnswer: string;
};

const formatAnswer = (answer: string): string => {
  const lower = answer.toLowerCase();
  if (lower === "true") return "True";
  if (lower === "false") return "False";
  return answer;
};

const AssessmentPage = () => {
  const { handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();
  const [assessmentQuestions, setAssessmentQuestions] = useState<
    AssessmentQuestion[]
  >([]);
  const [currentAnswers, setCurrentAnswers] = useState<Record<
    string,
    any
  > | null>(null);
  const [questionOrder, setQuestionOrder] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [assessmentPassed, setAssessmentPassed] = useState(false);
  const [missedQuestions, setMissedQuestions] = useState<MissedQuestion[]>([]);
  const [attemptKey, setAttemptKey] = useState(0);
  const { loggedInUserInfo } = useLoggedInUserContext();
  const navigate = useNavigate();

  const { level, first_name, last_name, phone, id } = loggedInUserInfo || {};
  const { classId = "" } = useParams();
  const { classInfo, classType } = useClassId(classId);

  const {
    isLoading,
    isError,
    data: questions,
    error,
  } = useQuery({
    queryKey: [QueryKeys.LIST_ASSESSMENT_QUESTIONS, classId],
    queryFn: getAssessmentQuestions,
  });

  const submitAssessmentMutation = useMutation({
    mutationFn: async (completedAssessmentData: CompletedAssessmentData) => {
      return await submitCompletedAssessment(completedAssessmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.LIST_USER_PRODUCTS],
      });
    },
  });

  useEffect(() => {
    if (questions) {
      const randomQuestions = randomizeArray(questions.data, level || "").map(
        (question) => ({
          ...question,
          answerOptions: prepareAnswerOptions(question),
        }),
      );
      setAssessmentQuestions(randomQuestions);
      const blankAnswers = prepareBlankAnswers(randomQuestions);
      setCurrentAnswers(blankAnswers);
      if (!questionOrder) setQuestionOrder(!questionOrder);
    }
  }, [classId, questionOrder, questions]);

  const { answeredCount, totalCount } = useMemo(() => {
    if (!currentAnswers)
      return { answeredCount: 0, totalCount: assessmentQuestions.length };
    const total = Object.keys(currentAnswers).length;
    const answered = Object.values(currentAnswers).filter(
      (a: any) => a.currentAnswer !== "",
    ).length;
    return { answeredCount: answered, totalCount: total };
  }, [currentAnswers, assessmentQuestions.length]);

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <BeatLoader color="#123abc" loading={true} size={15} />
      </div>
    );
  if (isError)
    return <span>{`${strings["common.error"]}: ${error.message}`}</span>;

  const submitForm = async () => {
    if (answeredCount < totalCount) {
      toast.error(
        `Please answer all ${totalCount} questions before submitting (${
          totalCount - answeredCount
        } remaining).`,
      );
      return;
    }

    const missed: MissedQuestion[] = [];
    for (const key in currentAnswers) {
      if (
        currentAnswers[key].currentAnswer.toLowerCase() !==
        currentAnswers[key].correctAnswer.toLowerCase()
      ) {
        missed.push(currentAnswers[key]);
      }
    }
    missed.sort((a, b) => a.slotIndex - b.slotIndex);

    if (!classId || !first_name || !last_name || !phone || !id) {
      console.error("All fields must be filled out");
      toast.error("Couldn't submit — your account info is still loading.");
      return;
    }

    const completedAssessmentData: CompletedAssessmentData = {
      classId,
      first_name,
      last_name,
      phone,
      userId: id,
      questionsMissed: missed.map((m) => [m]),
    };

    try {
      await submitAssessmentMutation.mutateAsync(completedAssessmentData);
      setMissedQuestions(missed);
      setAssessmentPassed(missed.length === 0);
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error(
        "Couldn't save your assessment result — please try again.",
      );
    }
  };

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newObject = { ...currentAnswers };
    newObject[name].currentAnswer = value;
    setCurrentAnswers({ ...newObject });
  };

  const closeModal = () => {
    setShowModal(false);
    navigate(`/class/${classId}`);
    reset();
  };

  const retakeAssessment = () => {
    setShowModal(false);
    setMissedQuestions([]);
    setAssessmentPassed(false);
    if (questions) {
      const randomQuestions = shuffle<AssessmentQuestion>(questions.data).map(
        (question) => ({
          ...question,
          answerOptions: prepareAnswerOptions(question),
        }),
      );
      setAssessmentQuestions(randomQuestions);
      setCurrentAnswers(prepareBlankAnswers(randomQuestions));
    }
    setAttemptKey((k) => k + 1);
    reset();
  };

  return (
    <div className="mx-auto max-w-4xl pb-10">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-050 p-4 shadow-sm lg:p-6">
        <AssessmentHeader
          productName={classInfo.productName}
          classType={classType}
          answeredCount={answeredCount}
          totalCount={totalCount}
        />
        <form key={attemptKey} onSubmit={handleSubmit(submitForm)}>
          <div className="divide-y divide-slate-200 border-t border-slate-200">
            {assessmentQuestions.map((question: AssessmentQuestion, idx) => (
              <QuestionRow
                key={question.id}
                question={question}
                idx={idx}
                showAdminId={loggedInUserInfo?.level === "0"}
                onAnswerChange={handleClick}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={submitAssessmentMutation.isPending}
              className="rounded-md bg-orange-500 px-6 py-2 text-base font-semibold text-slate-050 shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:cursor-not-allowed disabled:bg-orange-300"
            >
              {submitAssessmentMutation.isPending
                ? "Submitting…"
                : "Submit Assessment"}
            </button>
          </div>
        </form>
      </div>

      <Dialog
        open={showModal}
        onOpenChange={(open) => !open && closeModal()}
      >
        <DialogContent className="max-w-lg">
          {assessmentPassed ? (
            <PassContent score={totalCount} total={totalCount} />
          ) : (
            <FailContent
              missedQuestions={missedQuestions}
              total={totalCount}
              classId={classId}
              onRetake={retakeAssessment}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

type PassContentProps = {
  score: number;
  total: number;
};

const PassContent: React.FC<PassContentProps> = ({ score, total }) => (
  <div className="flex flex-col items-center gap-3 py-2 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
      <CheckCircle2 className="h-9 w-9 text-green-600" strokeWidth={2.5} />
    </div>
    <DialogHeader className="space-y-1">
      <DialogTitle className="text-xl lg:text-2xl">Nailed it!</DialogTitle>
    </DialogHeader>
    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
      {score} / {total} correct
    </span>
    <p className="text-sm text-slate-600">
      You passed this assessment. Nice work.
    </p>
    <div className="mt-4 flex w-full justify-end">
      <Link to="/">
        <button className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-050 shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400">
          Return home
        </button>
      </Link>
    </div>
  </div>
);

type FailContentProps = {
  missedQuestions: MissedQuestion[];
  total: number;
  classId: string;
  onRetake: () => void;
};

const FailContent: React.FC<FailContentProps> = ({
  missedQuestions,
  total,
  classId,
  onRetake,
}) => {
  const missedCount = missedQuestions.length;
  const correctCount = total - missedCount;
  const headline = missedCount === 1 ? "Almost there" : "Keep practicing";

  return (
    <div className="flex flex-col gap-4">
      <DialogHeader className="space-y-1">
        <DialogTitle className="text-xl lg:text-2xl">{headline}</DialogTitle>
      </DialogHeader>
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
        {correctCount} / {total} correct · missed {missedCount}
      </span>
      <p className="text-sm text-slate-600">Review the questions below, then retake when you're ready.</p>
      <div className="flex max-h-80 flex-col gap-3 overflow-y-auto">
        {missedQuestions.map((question, i) => (
          <div
            key={i}
            className="rounded-md border border-slate-200 bg-slate-050 p-3"
          >
            <div className="mb-2 flex items-start gap-2">
              <span className="shrink-0 rounded bg-slate-200 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700">
                Q{question.slotIndex}
              </span>
              <p className="text-sm text-slate-800">{question.title}</p>
            </div>
            <div className="flex flex-col gap-1 pl-1">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-green-600"
                  strokeWidth={2.5}
                />
                <span className="text-sm text-slate-600">Correct:</span>
                <span className="rounded bg-green-100 px-2 py-0.5 text-sm font-medium text-green-700">
                  {formatAnswer(question.correctAnswer)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle
                  className="h-4 w-4 shrink-0 text-red-600"
                  strokeWidth={2.5}
                />
                <span className="text-sm text-slate-600">You picked:</span>
                <span className="rounded bg-red-100 px-2 py-0.5 text-sm font-medium text-red-700">
                  {formatAnswer(question.currentAnswer)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-end gap-2">
        <Link to={`/class/${classId}`}>
          <button className="rounded-md border border-slate-300 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400">
            Return to class PDF
          </button>
        </Link>
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center gap-1.5 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-050 shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <RotateCcw className="h-4 w-4" />
          Retake assessment
        </button>
      </div>
    </div>
  );
};

type AssessmentHeaderProps = {
  productName: string;
  classType: string;
  answeredCount: number;
  totalCount: number;
};

const AssessmentHeader: React.FC<AssessmentHeaderProps> = ({
  productName,
  classType,
  answeredCount,
  totalCount,
}) => {
  const isAllAnswered = totalCount > 0 && answeredCount === totalCount;

  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-slate-900 lg:text-3xl">
            {productName}
          </h2>
          <Popover>
            <PopoverTrigger
              aria-label="Assessment instructions"
              className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <Info className="h-5 w-5" />
            </PopoverTrigger>
            <PopoverContent className="w-80 text-sm">
              <p className="mb-2 font-semibold text-slate-800">
                Assessment info
              </p>
              <ul className="list-disc space-y-1 pl-4 text-slate-700">
                <li>The assessment is open book.</li>
                <li>All questions must be answered correctly to pass.</li>
              </ul>
            </PopoverContent>
          </Popover>
        </div>
        <ClassTypeBreadcrumb classType={classType} />
      </div>
      <div
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium lg:text-sm ${
          isAllAnswered
            ? "bg-green-100 text-green-700"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        Answered {answeredCount}/{totalCount}
      </div>
    </div>
  );
};

const ClassTypeBreadcrumb = ({ classType }: { classType: string }) => {
  const currentLabel = classTypesMap[classType as keyof typeof classTypesMap];
  const entries = Object.entries(classTypesMap) as [string, string][];

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs lg:text-sm">
      {entries.map(([key, label], i) => {
        const isCurrent = label === currentLabel;
        return (
          <React.Fragment key={key}>
            {i > 0 && <span className="text-slate-300">•</span>}
            {isCurrent ? (
              <span className="rounded-full bg-orange-500 px-2 py-0.5 font-semibold text-slate-050">
                {label}
              </span>
            ) : (
              <span className="text-slate-400">{label}</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

type QuestionRowProps = {
  question: AssessmentQuestion;
  idx: number;
  showAdminId: boolean;
  onAnswerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const QuestionRow: React.FC<QuestionRowProps> = ({
  question,
  idx,
  showAdminId,
  onAnswerChange,
}) => {
  const { answerOptions } = question;
  const isTrueFalse = question.true_or_false === "TRUE";
  const options = isTrueFalse ? ["True", "False"] : answerOptions;

  return (
    <div className="py-4">
      <p className="text-left text-base text-slate-800 lg:text-lg">
        <span className="font-semibold">{idx + 1}.</span> {question.title}
        {showAdminId && (
          <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs text-slate-600">
            #{question.id}
          </span>
        )}
      </p>
      <div className="mt-2 flex flex-col gap-1 pl-6">
        {options.map((option, i) => (
          <label
            key={i}
            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm transition-colors hover:bg-slate-100 lg:text-base"
          >
            <input
              type="radio"
              name={JSON.stringify(question.id)}
              value={isTrueFalse ? option.toLowerCase() : option}
              onChange={onAnswerChange}
              className="accent-orange-500"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default AssessmentPage;
