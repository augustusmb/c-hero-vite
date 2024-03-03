import React, { useState, useEffect, ReactNode } from "react";
import { useForm } from "react-hook-form";
import Modal from "simple-react-modal";
import { Link, useParams, useNavigate } from "react-router-dom";
import TestInfoInput from "./textComponents/TestInfoInput.tsx";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTestQuestions, submitCompletedTest } from "./api/test.ts";
import {
  randomizeArray,
  prepareAnswerOptions,
  prepareBlankAnswers,
} from "./utils/test.js";
import { classTypesMap } from "./messages.ts";
import { useClassId } from "./hooks/useClassId.tsx";
import { useLoggedInUserContext } from "./hooks/useLoggedInUserContext.ts";
import { CompletedTestData, TestQuestion } from "./types/types.ts";
import BeatLoader from "react-spinners/BeatLoader";

const TestTakingPage = () => {
  const { handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentAnswers, setCurrentAnswers] = React.useState<Record<
    string,
    any
  > | null>(null);
  const [questionOrder, setQuestionOrder] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<ReactNode>(null);
  const [testPassed, setTestPassed] = useState(false);
  const { loggedInUserInfo } = useLoggedInUserContext();
  let navigate = useNavigate();

  const { level, name, phone, id } = loggedInUserInfo || {};
  const { classId = "" } = useParams();
  const { testInfo, testType } = useClassId(classId);

  const {
    isLoading,
    isError,
    data: questions,
    error,
  } = useQuery({
    queryKey: ["get-test-questions", classId],
    queryFn: getTestQuestions,
  });

  const submitTestMutation = useMutation({
    mutationFn: async (completedTestData: CompletedTestData) => {
      submitCompletedTest(completedTestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-user-products"] });
    },
  });

  useEffect(() => {
    if (questions) {
      let randomQuestions = randomizeArray(questions.data, level || "");
      randomQuestions.forEach((question: TestQuestion) => {
        question.answerOptions = prepareAnswerOptions(question);
      });
      setTestQuestions(randomQuestions);

      let blankAnswers = prepareBlankAnswers(randomQuestions);
      setCurrentAnswers(blankAnswers);

      if (!questionOrder) setQuestionOrder(!questionOrder);
    }
  }, [classId, questionOrder, questions]);

  if (isLoading) return <BeatLoader color="#123abc" loading={true} size={15} />;
  if (isError) return <span>Error: {error.message}</span>;

  const submitForm = () => {
    let questionsMissed = [];

    for (let key in currentAnswers) {
      if (
        currentAnswers[key].currentAnswer.toLowerCase() !==
        currentAnswers[key].correctAnswer.toLowerCase()
      ) {
        questionsMissed.push([currentAnswers[key]]);
      }
    }
    questionsMissed.sort(
      (a: any[], b: any[]) => a[0].slotIndex - b[0].slotIndex,
    );
    if (!classId || !name || !phone || !id) {
      // Handle the error here, e.g., show an error message to the user
      console.error("All fields must be filled out");
    } else {
      const completedTestData: CompletedTestData = {
        classId,
        name,
        phone,
        userId: id,
        questionsMissed,
      };

      submitTestMutation.mutate(completedTestData);
    }
    setShowModal(true);
    questionsMissed.length === 0
      ? (setTestPassed(true),
        setModalData(
          <div className="text-xl font-medium">
            You scored 100% and passed the test!
          </div>,
        ))
      : setModalData(
          <div>
            <h2 className="text-xl font-medium">
              You did not pass the test, you missed the following questions:
            </h2>
            {questionsMissed.map((question, i) => {
              return (
                <div key={i}>
                  <p className="bg-slate-300 text-base">{`${question[0].slotIndex}. ${question[0].title}`}</p>
                  <p className="text-blue-500">{`Correct Answer: ${question[0].correctAnswer}`}</p>
                  <p>{`Your Answer: ${question[0].currentAnswer}`}</p>
                </div>
              );
            })}
          </div>,
        );
  };

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    let newObject = { ...currentAnswers };

    newObject[name].currentAnswer = value;
    setCurrentAnswers({ ...newObject });
  };

  function getBody(question: TestQuestion) {
    let { answerOptions } = question;
    return question.true_or_false === "TRUE" ? (
      <div className="flex flex-col items-start gap-1 indent-10">
        <div>
          <label className="text-lg">
            <input
              type="radio"
              name={JSON.stringify(question.id)}
              value="true"
              onChange={handleClick}
              className="accent-orange-500"
            />{" "}
            True
          </label>
        </div>
        <div>
          <label className="text-lg">
            <input
              type="radio"
              name={JSON.stringify(question.id)}
              value="false"
              onChange={handleClick}
              className="accent-orange-500"
            />{" "}
            False
          </label>
        </div>
        <br></br>
      </div>
    ) : (
      <div className="flex flex-col items-start gap-1 indent-10">
        {answerOptions.map((option, i) => (
          <div key={i}>
            <label className="text-lg">
              <input
                type="radio"
                name={JSON.stringify(question.id)}
                value={option}
                onChange={handleClick}
                className="accent-orange-500"
              ></input>{" "}
              {option}
            </label>
          </div>
        ))}
      </div>
    );
  }

  const closeModal = () => {
    setShowModal((prev) => !prev);
    navigate(`/class/${classId}`);
    reset();
  };

  const highlightTestType = () => {
    const classTypeValues = Object.values(classTypesMap);

    return classTypeValues.map((type, i) => {
      if (type === classTypesMap[testType as keyof typeof classTypesMap]) {
        return (
          <span
            key={i}
            className="mx-1 text-xl italic text-magenta-500 lg:text-3xl"
          >
            {`${type}`}
          </span>
        );
      } else {
        return (
          <span className="mx-1 text-sm italic text-slate-300" key={i}>
            {type}
          </span>
        );
      }
    });
  };

  return (
    <div className="text-md mx-1 pb-10 drop-shadow-xl lg:mx-10 lg:text-lg">
      <div className="my-4">
        <div className="mb-1 text-2xl underline lg:mb-3 lg:text-4xl">{`${testInfo.productName}`}</div>
        {highlightTestType()}
      </div>
      <TestInfoInput />
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="flex flex-col items-start overflow-hidden rounded-3xl bg-orange-050">
          {testQuestions.map((question: TestQuestion, idx) => {
            return (
              <div
                key={idx}
                className={`${idx % 2 === 0 ? "bg-indigo-050" : ""} w-full`}
              >
                <div className="mx-2 mb-1 mt-3">
                  <p className="text-left text-xl">
                    {`${idx + 1}. ${question.title} `}
                    <span className="italic underline">
                      {loggedInUserInfo?.level === "0"
                        ? `(ID#: ${question.id})`
                        : ""}
                    </span>
                  </p>
                </div>
                <div>{getBody(question)}</div>
              </div>
            );
          })}
        </div>
        <div>
          <input
            className="text-slate-950 drop-shadow-orange-900 mt-10 w-40 rounded bg-orange-300 px-2 py-2 text-lg font-bold drop-shadow-2xl hover:bg-orange-500 hover:text-slate-050 lg:text-2xl"
            type="submit"
          ></input>
        </div>
      </form>
      <Modal show={showModal} onClose={closeModal}>
        {modalData}
        <div>
          {testPassed ? (
            <Link to={"/"}>
              <button className="text-md text-slate-950 rounded bg-orange-300 px-2 py-2 font-bold hover:bg-orange-500 hover:text-slate-050">
                Return to home page
              </button>
            </Link>
          ) : (
            <Link to={`/class/${classId}`}>
              <button className="text-slate-950 rounded bg-orange-300 px-2 py-2 text-lg font-bold hover:bg-orange-500 hover:text-slate-050">
                Return to class PDF
              </button>
            </Link>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TestTakingPage;
