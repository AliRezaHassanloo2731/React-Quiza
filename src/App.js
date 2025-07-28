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

const initialState = {
  questions: [],

  status: "loading",
  idx: 0,
  answer: null,
  points: 0,
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
            <NextButton
              dispatch={dispatch}
              answer={answer}
            />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
