import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FileUpload from "./index";
import { processCSVToArray } from "../../helpers/csvProcessor";

jest.mock("../../helpers/csvProcessor", () => ({
  processCSVToArray: jest.fn(),
}));

describe("FileUpload", () => {
  const mockOnDataProcessed = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when component is rendered", () => {
    it("displays the  upload prompt", () => {
      render(<FileUpload onDataProcessed={mockOnDataProcessed} />);

      expect(
        screen.getByText("Click to select your CSV file")
      ).toBeInTheDocument();
      expect(screen.getByText("Choose a file to upload")).toBeInTheDocument();
    });

    it("renders file input", () => {
      render(<FileUpload onDataProcessed={mockOnDataProcessed} />);

      const fileInput = screen.getByTestId("file-input");
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute("type", "file");
      expect(fileInput).toHaveAttribute("accept", ".csv,text/csv");
    });
  });

  describe("when a valid CSV file is selected", () => {
    const mockFile = new File(["test,data"], "test.csv", { type: "text/csv" });

    beforeEach(() => {
      processCSVToArray.mockResolvedValue();
    });

    it("displays selected file information", async () => {
      render(<FileUpload onDataProcessed={mockOnDataProcessed} />);

      const fileInput = screen.getByTestId("file-input");
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      await waitFor(() => {
        expect(screen.getByText("test.csv")).toBeInTheDocument();
        expect(screen.getByText("0.01 KB")).toBeInTheDocument();
      });
    });

    it("calls processCSVToArray with file and callback", async () => {
      render(<FileUpload onDataProcessed={mockOnDataProcessed} />);

      const fileInput = screen.getByTestId("file-input");
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      await waitFor(() => {
        expect(processCSVToArray).toHaveBeenCalledWith(
          mockFile,
          mockOnDataProcessed
        );
      });
    });

    it("shows processing and disable button while file is being processed", async () => {
      processCSVToArray.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<FileUpload onDataProcessed={mockOnDataProcessed} />);

      const fileInput = screen.getByTestId("file-input");
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      expect(screen.getByText("Processing...")).toBeInTheDocument();
      expect(
        screen.getByText("Reading and parsing CSV file")
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText("Processing...")).not.toBeInTheDocument();
      });
    });
  });

  describe("when invalid file is selected", () => {
    it("shows error for non-CSV file", () => {
      render(<FileUpload onDataProcessed={mockOnDataProcessed} />);

      const invalidFile = new File(["test"], "test.txt", {
        type: "text/plain",
      });
      const fileInput = screen.getByTestId("file-input");

      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Please select a CSV file only."
      );
    });

    it("does not set selected file for invalid file type", () => {
      render(<FileUpload onDataProcessed={mockOnDataProcessed} />);

      const invalidFile = new File(["test"], "test.json", {
        type: "application/json",
      });
      const fileInput = screen.getByTestId("file-input");

      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      expect(screen.queryByText("test.json")).not.toBeInTheDocument();
      expect(processCSVToArray).not.toHaveBeenCalled();
    });
  });

  describe("when file processing fails", () => {
    const mockFile = new File(["test,data"], "test.csv", { type: "text/csv" });
    const errorMessage = "You need to change data in eow 5";

    beforeEach(() => {
      processCSVToArray.mockRejectedValue(new Error(errorMessage));
    });

    it("displays error message", async () => {
      render(<FileUpload onDataProcessed={mockOnDataProcessed} />);

      const fileInput = screen.getByTestId("file-input");
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toHaveTextContent(
          `Error processing file: ${errorMessage}`
        );
      });
    });

    it("stops showing processing state after error", async () => {
      render(<FileUpload onDataProcessed={mockOnDataProcessed} />);

      const fileInput = screen.getByTestId("file-input");
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      await waitFor(() => {
        expect(screen.queryByText("Processing...")).not.toBeInTheDocument();
      });
    });

    it("re-enables input after processing error", async () => {
      render(<FileUpload onDataProcessed={mockOnDataProcessed} />);

      const fileInput = screen.getByTestId("file-input");
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      await waitFor(() => {
        expect(fileInput).not.toBeDisabled();
      });
    });
  });

  describe("when file with uppercase extension is selected", () => {
    it("accepts CSV file with uppercase extension", async () => {
      processCSVToArray.mockResolvedValue();

      render(<FileUpload onDataProcessed={mockOnDataProcessed} />);

      const uppercaseFile = new File(["data"], "TEST.CSV", {
        type: "text/csv",
      });
      const fileInput = screen.getByTestId("file-input");

      fireEvent.change(fileInput, { target: { files: [uppercaseFile] } });

      await waitFor(() => {
        expect(processCSVToArray).toHaveBeenCalledWith(
          uppercaseFile,
          mockOnDataProcessed
        );
      });
    });
  });

  describe("when no file is selected", () => {
    it("does not process when files array is empty", () => {
      render(<FileUpload onDataProcessed={mockOnDataProcessed} />);

      const fileInput = screen.getByTestId("file-input");
      fireEvent.change(fileInput, { target: { files: [] } });

      expect(processCSVToArray).not.toHaveBeenCalled();
    });
  });
});
