function FinishScreen({
  points,
  maxPossiblepoints,
  highscore,
  dispatch,
}) {
  const percentage =
    (points / maxPossiblepoints) * 100;
  let emoji;
  if (percentage === 100) emoji = "🎖️";
  if (
    percentage >= 80 &&
    percentage < 100
  )
    emoji = "〽️";
  if (
    percentage >= 50 &&
    percentage < 80
  )
    emoji = "☺️";
  if (
    percentage >= 0 &&
    percentage < 50
  )
    emoji = "🙅‍♂️";
  if (percentage === 0) emoji = "🤔";

  return (
    <>
      <div className="result">
        {emoji} Your scored{" "}
        <strong>{points}</strong>out of{" "}
        {maxPossiblepoints}(
        {Math.ceil(percentage)}%)
      </div>
      <p className="highscore">
        Highscore:{highscore} pints
      </p>
      <button
        className="btn btn-ui"
        onClick={() =>
          dispatch({
            type: "restart",
          })
        }
      >
        Restart quiz
      </button>
    </>
  );
}

export default FinishScreen;
