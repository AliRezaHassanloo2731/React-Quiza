import {
  useReducer,
  useState,
} from "react";

function DateCounter() {
  function reducer(state, action) {
    if (action.type === "inc")
      return state + 1;
    if (action.type === "dec")
      return state - 1;
    if (action.type === "setCount")
      return action.payload;
  }
  const [count, dispatch] = useReducer(
    reducer,
    0
  );

  const [step, setStep] = useState(1);

  const date = new Date("july 26 2025");
  date.setDate(date.getDate() + count);

  const dec = function () {
    // setCount((count) => count - step);
    dispatch({
      type: "dec",
    });
  };

  const inc = function () {
    dispatch({
      type: "inc",
    });
  };

  const defineCount = function (e) {
    dispatch({
      type: "setCount",
      payload: Number(e.target.value),
    });
  };

  const defineStep = function (e) {
    setStep(Number(e.target.value));
  };

  const reset = function () {
    // setCount(0);
    setStep(1);
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input
          value={count}
          onChange={defineCount}
        />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
export default DateCounter;
