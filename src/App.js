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

const initialState = {
  questions: [],

  //NUMBER OF STATE WE NEED, WE MUST CREATE A UNIC USTSTAE
  // FOR ALL OF THEM SEPERATELY SOMEHOW IN USEREDUCER WE
  // do it with just on state
  //STATES :LOAD,Err,Rady,Active,Finished
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
        state.question.at(state.idx);
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
  } = state;

  const numQuestions = questions.length;

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
          <Question
            question={questions[idx]}
            dispatch={dispatch}
            answer={answer}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
