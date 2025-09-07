import PropTypes from "prop-types";
import "./DataGrid.scss";

function DataGrid({ data }) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="datagrid-container">
      <table className="datagrid">
        <thead>
          <tr>
            <th>Employee ID #1</th>
            <th>Employee ID #2</th>
            <th>Project ID</th>
            <th>Days worked</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.employeeId1}</td>
              <td>{row.employeeId2}</td>
              <td>{row.projectId}</td>
              <td>{row.daysWorked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

DataGrid.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      employeeId1: PropTypes.number.isRequired,
      employeeId2: PropTypes.number.isRequired,
      projectId: PropTypes.number.isRequired,
      daysWorked: PropTypes.number.isRequired,
    })
  ),
};

export default DataGrid;
