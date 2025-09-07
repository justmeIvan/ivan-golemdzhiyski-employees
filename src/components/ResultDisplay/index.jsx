import PropTypes from "prop-types";
import DataGrid from "../DataGrid";
import "./ResultDisplay.scss";

function ResultDisplay({ result }) {
  if (!result || !result.longestPair) {
    return null;
  }

  return (
    <div className="result-display">
      <div className="winner-card">
        <h2>Longest Collaboration Pair</h2>
        <p className="winner-text">
          <strong>Employee {result.longestPair.employeeId1}</strong> and{" "}
          <strong>Employee {result.longestPair.employeeId2}</strong> worked
          together for <strong>{result.longestPair.totalDays} days</strong>
        </p>
      </div>

      {result.details.length > 0 && (
        <div className="details-section">
          <h3>Project Details:</h3>
          <DataGrid data={result.details} />
        </div>
      )}
    </div>
  );
}

ResultDisplay.propTypes = {
  result: PropTypes.shape({
    longestPair: PropTypes.shape({
      employeeId1: PropTypes.number.isRequired,
      employeeId2: PropTypes.number.isRequired,
      totalDays: PropTypes.number.isRequired,
    }),
    details: PropTypes.arrayOf(
      PropTypes.shape({
        employeeId1: PropTypes.number.isRequired,
        employeeId2: PropTypes.number.isRequired,
        projectId: PropTypes.number.isRequired,
        daysWorked: PropTypes.number.isRequired,
      })
    ),
  }),
};

export default ResultDisplay;
