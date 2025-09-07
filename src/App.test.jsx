import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

describe("App Component Integration Tests", () => {
  describe("CSV Processing - Longest Pair Detection", () => {
    it("correctly identifies and displays the longest collaboration pair", async () => {
      // CSV with multiple pairs - 143 & 218 should be the longest with 108 days total
      const csvContent = `EmpID,ProjectID,DateFrom,DateTo
143,12,2013-11-01,2014-01-05
218,10,2012-05-16,NULL
143,10,2009-01-01,2011-04-27
218,12,2013-11-15,2014-01-10
143,15,2014-02-01,2014-05-01
218,15,2014-03-01,2014-06-01
100,20,2014-01-01,2014-02-01
200,20,2014-01-01,2014-02-01`;

      const file = new File([csvContent], "test.csv", {
        type: "text/csv",
      });

      render(<App />);

      const fileInput = screen.getByTestId("file-input");
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText("test.csv")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.getByText("Longest Collaboration Pair")
        ).toBeInTheDocument();
      });

      const winnerSection = screen.getByText(/worked together/).parentElement;
      expect(winnerSection.textContent).toContain("Employee 143");
      expect(winnerSection.textContent).toContain("Employee 218");
      expect(screen.getByText(/\d+ days/)).toBeInTheDocument();
      expect(screen.getByText("Project Details:")).toBeInTheDocument();
      expect(screen.getByRole("table")).toBeInTheDocument();

      const cells = screen.getAllByRole("cell");
      const cellTexts = cells.map((cell) => cell.textContent);

      // Should show 143-218 collaborations on projects 12 and 15
      expect(cellTexts).toContain("143");
      expect(cellTexts).toContain("218");
      expect(cellTexts).toContain("12");
      expect(cellTexts).toContain("15");

      // Should NOT show the 100-200 pair
      expect(cellTexts).not.toContain("100");
      expect(cellTexts).not.toContain("200");
      expect(cellTexts).not.toContain("20");
    });

    it("handles CSV with no collaborations", async () => {
      const csvContent = `EmpID,ProjectID,DateFrom,DateTo
1,10,2013-01-01,2013-01-10
2,10,2013-02-01,2013-02-10
3,11,2013-03-01,2013-03-10`;

      const file = new File([csvContent], "no-overlap.csv", {
        type: "text/csv",
      });

      render(<App />);

      const fileInput = screen.getByTestId("file-input");
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText("no-overlap.csv")).toBeInTheDocument();
      });

      // Should not show any results when no collaborations exist
      await waitFor(
        () => {
          expect(
            screen.queryByText("Longest Collaboration Pair")
          ).not.toBeInTheDocument();
          expect(screen.queryByRole("table")).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("handles NULL dates correctly", async () => {
      // CSV with NULL DateTo values (ongoing projects)
      const csvContent = `EmpID,ProjectID,DateFrom,DateTo
1,1,2024-01-01,NULL
2,1,2024-01-01,NULL`;

      const file = new File([csvContent], "null-dates.csv", {
        type: "text/csv",
      });

      render(<App />);

      const fileInput = screen.getByTestId("file-input");
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText("null-dates.csv")).toBeInTheDocument();
      });

      // Should show the collaboration
      await waitFor(() => {
        expect(
          screen.getByText("Longest Collaboration Pair")
        ).toBeInTheDocument();
      });

      // Verify employees 1 and 2 are shown
      const winnerSection = screen.getByText(/worked together/).parentElement;
      expect(winnerSection.textContent).toContain("Employee 1");
      expect(winnerSection.textContent).toContain("Employee 2");
    });

    it("correctly identifies longest pair among multiple collaborations", async () => {
      // CSV with three pairs, where 5-6 should be the longest
      const csvContent = `EmpID,ProjectID,DateFrom,DateTo
1,10,2023-01-01,2023-01-10
2,10,2023-01-01,2023-01-10
3,11,2023-01-01,2023-01-20
4,11,2023-01-01,2023-01-20
5,12,2023-01-01,2023-02-01
6,12,2023-01-01,2023-02-01`;

      const file = new File([csvContent], "multiple-pairs.csv", {
        type: "text/csv",
      });

      render(<App />);

      const fileInput = screen.getByTestId("file-input");
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText("multiple-pairs.csv")).toBeInTheDocument();
      });

      // Should show the longest pair (5-6)
      await waitFor(() => {
        expect(
          screen.getByText("Longest Collaboration Pair")
        ).toBeInTheDocument();
      });

      const winnerSection = screen.getByText(/worked together/).parentElement;
      expect(winnerSection.textContent).toContain("Employee 5");
      expect(winnerSection.textContent).toContain("Employee 6");

      // Verify only the longest pair's details are shown in the table
      const cells = screen.getAllByRole("cell");
      const cellTexts = cells.map((cell) => cell.textContent);

      expect(cellTexts).toContain("5");
      expect(cellTexts).toContain("6");
      expect(cellTexts).toContain("12");

      // Should NOT show the other pairs
      expect(cellTexts).not.toContain("1");
      expect(cellTexts).not.toContain("2");
      expect(cellTexts).not.toContain("3");
      expect(cellTexts).not.toContain("4");
    });

    it("handles various date formats", async () => {
      // Test with different date formats
      const csvContent = `EmpID,ProjectID,DateFrom,DateTo
1,100,2013-11-01,2014-01-05
2,100,11/01/2013,01/05/2014
3,101,01-02-2014,28-02-2014
4,101,2014-02-01,2014-02-28`;

      const file = new File([csvContent], "date-formats.csv", {
        type: "text/csv",
      });

      render(<App />);

      const fileInput = screen.getByTestId("file-input");
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText("date-formats.csv")).toBeInTheDocument();
      });

      // Should process and show results
      await waitFor(() => {
        expect(
          screen.getByText("Longest Collaboration Pair")
        ).toBeInTheDocument();
      });

      // Should show one of the pairs
      expect(screen.getByText(/worked together/)).toBeInTheDocument();
    });
  });
});
