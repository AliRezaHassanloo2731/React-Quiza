import {
  useEffect,
  useReducer,
} from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";

const initialState = {
  questions: [],

  //NUMBER OF STATE WE NEED, WE MUST CREATE A UNIC USTSTAE
  // FOR ALL OF THEM SEPERATELY SOMEHOW IN USEREDUCER WE
  // do it with just on state
  //STATES :LOAD,Err,Rady,Active,Finished
  status: "loading",
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
        staus: "error",
      };

    // case "loading":
    //   console.log("loading");
    //   break;

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
  const { questions, status } = state;

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
        {status === "ready"}
      </Main>
    </div>
  );
}

export default App;
