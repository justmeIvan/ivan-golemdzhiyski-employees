# Employee Collaboration Finder

Interview task to show the employee with most overlapping days on a project.

## Prerequisites

Before running this project, ensure you have the following installed on your system:

- **Node.js** (version 18.0.0 or higher)
- **npm** (version 8.0.0 or higher)

## Installation

1. Clone the repository:

```bash
git clone git@github.com:justmeIvan/ivan-golemdzhiyski-employees.git
cd pair-employee
```

2. Install the dependencies:

```bash
npm install
```

## Running the Project

### Development Mode

To run the application in development mode with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port)

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates a production build
- `npm run preview` - Preview the production build locally
- `npm test` - Runs the test suite
- `npm run test:watch` - Runs tests in watch mode
- `npm run lint` - Runs ESLint to check code quality
- `npm run lint:fix` - Automatically fixes linting issues
- `npm run format` - Formats code using Prettier

## CSV File Format

The application expects CSV files with the following columns:

- `EmpID` - Employee ID (number)
- `ProjectID` - Project ID (number)
- `DateFrom` - Start date of the project assignment
- `DateTo` - End date of the project assignment (use "NULL" for ongoing projects)

Example CSV format:

```csv
EmpID,ProjectID,DateFrom,DateTo
143,12,2013-11-01,2014-01-05
218,10,2012-05-16,NULL
143,10,2009-01-01,2011-04-27

...
```

## Usage

1. Open the application in your browser
2. Click on the file upload area or drag and drop a CSV file
3. The application will process the file and display:
   - The pair of employees who worked together the longest
   - Total days of collaboration
   - Breakdown by project showing days worked together on each project

## Assumptions

The following assumptions were made during the development of this application:

1. **Display of Results**: We don't need to show in the datagrid details of other pairs that aren't the longest. The application focuses solely on identifying and displaying information about the pair of employees who have worked together for the longest total duration.

2. **Data Types**: The employee ID and project ID will be numeric values. The application expects these fields to contain valid integers and will throw an error if non-numeric values are encountered.

3. **Device Compatibility**: The application hasn't been intentionally optimized for mobile devices with the expectation it will be primarily used on desktop computers. However, the application will still function on mobile devices, though the user experience may not be optimal.

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode for development:

```bash
npm run test:watch
```
