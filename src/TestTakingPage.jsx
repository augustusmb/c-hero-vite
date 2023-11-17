import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { productsMap } from "./messages.js";
import Modal from "simple-react-modal";
import { UserAuthContext } from "./MainPanelLayout.jsx";

import { Link, useParams } from "react-router-dom";

import TestInfoInput from "./TestInfoInput.jsx";

const TestTakingPage = () => {
  const { handleSubmit, reset } = useForm();
  let [testQuestions, setTestQuestions] = useState([]);
  let [currentAnswers, setCurrentAnswers] = useState();
  let [questionOrder, setQuestionOrder] = useState(false);
  let [showModal, setShowModal] = useState(false);
  let [modalData, setModalData] = useState();
  let [testPassed, setTestPassed] = useState(false);
  const userInfo = useContext(UserAuthContext);

  const { classId } = useParams();

  const testInfo = productsMap[classId.slice(0, 2)];
  const testType = classId.slice(3, 5);

  const classTypes = {
    a: "Setup",
    b: "Operation",
    c: "MOB Drills",
    d: "Inspection & Storage",
  };

  useEffect(() => {
    axios
      .get("/api/routes/questions", {
        params: { classId: classId },
      })
      .then((res) => {
        let randomQuestions = res.data.sort(() => Math.random() - 0.5);
        randomQuestions.forEach((question) => {
          let {
            correct_answer,
            incorrect_answer1,
            incorrect_answer2,
            incorrect_answer3,
          } = question;
          let answers = [
            correct_answer,
            incorrect_answer1,
            incorrect_answer2,
            incorrect_answer3,
          ];
          question.answerOptions = answers
            .filter((answer) => {
              return answer ? true : false;
            })
            .sort(() => Math.random() - 0.5);
          question.answerOptions.forEach((item, idx) => {
            if (item === "All of the above") {
              question.answerOptions.splice(idx, 1);
              question.answerOptions.push("All of the above");
            }
          });
        });
        setTestQuestions(randomQuestions);
        let blankAnswers = {};
        randomQuestions.forEach((question, slotIndex) => {
          blankAnswers[question.id] = {
            title: question.title,
            slotIndex: slotIndex + 1,
            currentAnswer: "",
            correctAnswer: question.correct_answer,
          };
        });
        setCurrentAnswers(blankAnswers);
        if (!questionOrder) setQuestionOrder(!questionOrder);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

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
    axios.post("/routes/submit-test", { completedTestData });
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
                  <h3>{`${question[0].slotIndex}. ${question[0].title}`}</h3>
                  <h4>{`Correct Answer: ${question[0].correctAnswer}`}</h4>
                  <h4>{`Your Answer: ${question[0].currentAnswer}`}</h4>
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
    return question.true_or_false ? (
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
        {answerOptions.map((option) => (
          <div key="answer">
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
      <div>
        <div>{`${testInfo.name}`}</div>
        <div>{`${classTypes[testType]} - TEST`}</div>
      </div>
      <TestInfoInput />
      <form onSubmit={handleSubmit(submitForm)}>
        <div>
          {testQuestions.map((question, idx) => {
            return (
              <div key={idx}>
                <div>
                  <p>{`${idx + 1}. ${question.title}`}</p>
                </div>
                <div>{getBody(question)}</div>
              </div>
            );
          })}
        </div>
        <div>
          <input type="submit"></input>
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
              <button>Return to class and take the test again</button>
            </Link>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TestTakingPage;
