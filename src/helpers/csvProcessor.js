import Papa from "papaparse";

export const readAndParseCSV = async (file) => {
  let csvContent;

  // the jest wasnt supporting file.text() method so i added this
  // will also cover other browsers that might not support ti
  if (typeof file.text === "function") {
    csvContent = await file.text();
  } else {
    csvContent = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: ({ data, errors }) => {
        if (errors.length > 0) {
          return reject(new Error(`CSV parsing error: ${errors[0].message}`));
        }
        resolve(data);
      },
      error: reject,
    });
  });
};

const parseDate = (dateString) => {
  if (!dateString || dateString.toLowerCase() === "null") return null;

  const date = new Date(dateString);
  if (!isNaN(date.getTime())) return date;

  const parts = dateString.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    const usDate = new Date(parts[2], parts[0] - 1, parts[1]);
    if (!isNaN(usDate.getTime())) return usDate;

    const euDate = new Date(parts[2], parts[1] - 1, parts[0]);
    if (!isNaN(euDate.getTime())) return euDate;
  }

  throw new Error(`Invalid date format: "${dateString}"`);
};

const calculateOverlapDays = (period1, period2) => {
  const today = new Date();

  const start1 = period1.dateFrom;
  const end1 = period1.dateTo || today;
  const start2 = period2.dateFrom;
  const end2 = period2.dateTo || today;

  const overlapStart = new Date(Math.max(start1.getTime(), start2.getTime()));
  const overlapEnd = new Date(Math.min(end1.getTime(), end2.getTime()));

  if (overlapStart > overlapEnd) return 0;

  return Math.ceil((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24)) + 1;
};

const findLongestCollaboratingPair = (pairCollaborations) => {
  let maxDays = 0;
  let longestPair = null;

  for (const pairKey in pairCollaborations) {
    const totalDays = pairCollaborations[pairKey];
    if (totalDays > maxDays) {
      maxDays = totalDays;
      const [emp1, emp2] = pairKey.split("-").map(Number);
      longestPair = {
        employeeId1: emp1,
        employeeId2: emp2,
        totalDays,
      };
    }
  }

  return longestPair;
};

export const processCSVToArray = async (file, onDataProcessed) => {
  const data = await readAndParseCSV(file);

  const projectEmployees = {};
  const pairCollaborations = {};
  const collaborationDetails = [];

  data.forEach((row) => {
    const empId = parseInt(row.EmpID);
    const projectId = parseInt(row.ProjectID);

    if (isNaN(empId) || isNaN(projectId)) {
      throw new Error(`Invalid ID values in row`);
    }

    const currentPeriod = {
      employeeId: empId,
      dateFrom: parseDate(row.DateFrom),
      dateTo: parseDate(row.DateTo),
    };

    const existingEmployees = projectEmployees[projectId] || [];

    existingEmployees.forEach((existingPeriod) => {
      if (existingPeriod.employeeId === empId) return;

      const overlapDays = calculateOverlapDays(currentPeriod, existingPeriod);
      if (overlapDays > 0) {
        const emp1 = Math.min(empId, existingPeriod.employeeId);
        const emp2 = Math.max(empId, existingPeriod.employeeId);
        const pairKey = `${emp1}-${emp2}`;

        const currentTotal = pairCollaborations[pairKey] || 0;
        pairCollaborations[pairKey] = currentTotal + overlapDays;

        collaborationDetails.push({
          employeeId1: emp1,
          employeeId2: emp2,
          projectId: projectId,
          daysWorked: overlapDays,
        });
      }
    });

    existingEmployees.push(currentPeriod);
    projectEmployees[projectId] = existingEmployees;
  });

  const longestPair = findLongestCollaboratingPair(pairCollaborations);

  const longestPairDetails = longestPair
    ? collaborationDetails.filter(
        (detail) =>
          detail.employeeId1 === longestPair.employeeId1 &&
          detail.employeeId2 === longestPair.employeeId2
      )
    : [];

  onDataProcessed({
    longestPair,
    details: longestPairDetails,
  });

  return { longestPair, details: longestPairDetails };
};
