function NextButton({
  dispatch,
  answer,
  idx,
  numQuestions,
}) {
  if (answer === null) return null;

  if (idx < numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() =>
          dispatch({
            type: "nextQuestion",
          })
        }
      >
        Next
      </button>
    );
  }

  if (idx === numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() =>
          dispatch({
            type: "finish",
          })
        }
      >
        Finish
      </button>
    );
  }
}

export default NextButton;
