import {
  useEffect,
  useReducer,
} from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./Footer";
import Timer from "./components/Timer";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  status: "loading",
  idx: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "start":
      return {
        ...state,
        status: "active",
        secondRemaining:
          state.questions.length *
          SECS_PER_QUESTION,
      };

    case "newAnswer":
      const question =
        state.questions.at(state.idx);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload ===
          question.correctOption
            ? state.points +
              question.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        idx: state.idx + 1,
        answer: null,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore
            ? state.points
            : state.highscore,
      };

    case "restart":
      return {
        ...state,
        status: "ready",
        idx: 0,
        answer: null,
        points: 0,
        highscore: 0,
      };

    case "tick":
      return {
        ...state,
        secondRemaining:
          state.secondRemaining - 1,

        status:
          state.secondRemaining === 0
            ? "finished"
            : state.status,
      };

    default:
      throw new Error(
        "Action is unknown"
      );
  }
}

function App() {
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );
  const {
    questions,
    status,
    idx,
    answer,
    points,
    highscore,
    secondRemaining,
  } = state;

  const numQuestions = questions.length;
  const maxPossiblepoints =
    questions.reduce(
      (prev, curr) =>
        prev + curr.points,
      0
    );

  useEffect(function () {
    async function fetchData() {
      try {
        const response = await fetch(
          "http://localhost:8000/questions"
        );

        if (!response.ok) {
          dispatch({
            type: "dataFailed",
          });
        }

        const data =
          await response.json();
        dispatch({
          type: "dataRecived",
          payload: data,
        });
      } catch (err) {
        console.error("Fetch Error");
      }
    }

    fetchData();
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && (
          <Loader />
        )}
        {status === "error" && (
          <Error />
        )}
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              idx={idx}
              points={points}
              numQuestions={
                numQuestions
              }
              maxPossiblepoints={
                maxPossiblepoints
              }
              answer={answer}
            />
            <Question
              question={questions[idx]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer
                dispatch={dispatch}
                secondRemaining={
                  secondRemaining
                }
              />

              <NextButton
                dispatch={dispatch}
                answer={answer}
                idx={idx}
                numQuestions={
                  numQuestions
                }
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblepoints={
              maxPossiblepoints
            }
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
