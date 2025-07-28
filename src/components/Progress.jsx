function Progress({
  idx,
  points,
  numQuestions,
  maxPossiblepoints,
  answer,
}) {
  return (
    <div>
      <header className="progress">
        <progress
          max={numQuestions}
          value={
            idx +
            Number(answer !== null)
          }
        />
        <p>
          Qestion{" "}
          <strong>{idx + 1}</strong> /{" "}
          {numQuestions}{" "}
        </p>
        <p>
          {points} / {maxPossiblepoints}{" "}
          points{" "}
        </p>
      </header>
    </div>
  );
}

export default Progress;
