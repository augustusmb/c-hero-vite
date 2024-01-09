import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { productsMap } from "./messages.js";
import Modal from "simple-react-modal";
import { UserAuthContext } from "./MainPanelLayout.jsx";
import { Link, useParams } from "react-router-dom";
import TestInfoInput from "./TestInfoInput.jsx";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTestQuestions, submitCompletedTest } from "./api/test.js";
import {
  randomizeArray,
  prepareAnswerOptions,
  prepareBlankAnswers,
} from "./utils/test.js";
import { classTypes } from "./messages.js";

const TestTakingPage = () => {
  const { handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentAnswers, setCurrentAnswers] = useState();
  const [questionOrder, setQuestionOrder] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState();
  const [testPassed, setTestPassed] = useState(false);
  const userInfo = useContext(UserAuthContext);

  const { classId } = useParams();

  const testInfo = productsMap[classId.slice(0, 2)];
  const testType = classId.slice(3, 5);

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
    mutationFn: (completedTestData) => {
      submitCompletedTest(completedTestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["get-user-products"]);
    },
  });

  useEffect(() => {
    if (questions) {
      let randomQuestions = randomizeArray(questions.data);
      randomQuestions.forEach((question) => {
        question.answerOptions = prepareAnswerOptions(question);
      });
      setTestQuestions(randomQuestions);

      let blankAnswers = prepareBlankAnswers(randomQuestions);
      setCurrentAnswers(blankAnswers);

      if (!questionOrder) setQuestionOrder(!questionOrder);
    }
  }, [classId, questionOrder, questions]);

  if (isLoading) return <span>Loading...</span>;

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
    questionsMissed.sort((a, b) => a[0].slotIndex - b[0].slotIndex);
    let completedTestData = {
      classId: classId,
      name: userInfo.userInfo.name,
      phone: userInfo.userInfo.phone,
      userId: userInfo.userInfo.id,
      questionsMissed: questionsMissed.length,
    };
    if (questionsMissed.length === 0) {
      setTestPassed(true);
    }
    submitTestMutation.mutate(completedTestData);
    setShowModal(true);
    questionsMissed.length === 0
      ? setModalData(<div>You scored 100% and passed the test!</div>)
      : setModalData(
          <div>
            <h2>
              You did not pass the test, you missed the following questions:
            </h2>
            {questionsMissed.map((question, i) => {
              return (
                <div key={i}>
                  <p className="text-base bg-slate-300">{`${question[0].slotIndex}. ${question[0].title}`}</p>
                  <p className="text-blue-500">{`Correct Answer: ${question[0].correctAnswer}`}</p>
                  <p>{`Your Answer: ${question[0].currentAnswer}`}</p>
                </div>
              );
            })}
          </div>,
        );
  };

  const handleClick = (e) => {
    let { name, value } = e.target;
    let newObject = { ...currentAnswers };

    newObject[name].currentAnswer = value;
    setCurrentAnswers({ ...newObject });
  };

  function getBody(question) {
    let { answerOptions } = question;
    return question.true_or_false === "TRUE" ? (
      <div>
        <div>
          <label>
            <input
              type="radio"
              name={question.id}
              value="true"
              onClick={handleClick}
            />
            True
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name={question.id}
              value="false"
              onClick={handleClick}
            />
            False
          </label>
        </div>
        <br></br>
      </div>
    ) : (
      <div className="answerBody">
        {answerOptions.map((option, i) => (
          <div key={i}>
            <label>
              <input
                type="radio"
                name={question.id}
                value={option}
                onClick={handleClick}
              ></input>
              {option}
            </label>
          </div>
        ))}
      </div>
    );
  }

  const closeModal = () => {
    setShowModal(!showModal);
    reset();
  };

  return (
    <div>
      <div className="m-8 text-xl underline">
        <div>{`${testInfo.productName}`}</div>
        <div>{`${classTypes[testType]} - TEST`}</div>
      </div>
      <TestInfoInput />
      <form onSubmit={handleSubmit(submitForm)}>
        <div>
          {testQuestions.map((question, idx) => {
            return (
              <div key={idx}>
                <div>
                  <p>
                    {`${idx + 1}. ${question.title} `}
                    <span className="underline">
                      {userInfo.userInfo.level === "0"
                        ? `(ID #: ${question.id})`
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
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded"
            type="submit"
          ></input>
        </div>
      </form>
      <Modal show={showModal} onClose={closeModal}>
        {modalData}
        <div>
          {testPassed ? (
            <Link to={"/"}>
              <button>Return home to view other tests</button>
            </Link>
          ) : (
            <Link to={`/class/${classId}`}>
              <button className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded">
                Return to class and take the test again
              </button>
            </Link>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TestTakingPage;
