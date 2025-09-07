import { render, screen } from "@testing-library/react";
import DataGrid from "./index";

describe("DataGrid", () => {
  const mockData = [
    {
      employeeId1: 143,
      employeeId2: 218,
      projectId: 10,
      daysWorked: 1077,
    },
    {
      employeeId1: 143,
      employeeId2: 218,
      projectId: 12,
      daysWorked: 45,
    },
    {
      employeeId1: 101,
      employeeId2: 102,
      projectId: 5,
      daysWorked: 30,
    },
  ];

  describe("when no data is provided", () => {
    it("renders nothing", () => {
      const { container } = render(<DataGrid data={null} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("when empty array is provided", () => {
    it("renders nothing", () => {
      const { container } = render(<DataGrid data={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("when data is provided", () => {
    it("renders a table with headers", () => {
      render(<DataGrid data={mockData} />);

      expect(screen.getByText("Employee ID #1")).toBeInTheDocument();
      expect(screen.getByText("Employee ID #2")).toBeInTheDocument();
      expect(screen.getByText("Project ID")).toBeInTheDocument();
      expect(screen.getByText("Days worked")).toBeInTheDocument();
    });

    it("renders all data rows", () => {
      render(<DataGrid data={mockData} />);

      expect(screen.getAllByText("143")).toHaveLength(2);
      expect(screen.getAllByText("218")).toHaveLength(2);
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("1077")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
      expect(screen.getByText("45")).toBeInTheDocument();
      expect(screen.getByText("101")).toBeInTheDocument();
      expect(screen.getByText("102")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
    });
  });

  describe("when single collaboration exists", () => {
    it("renders one data row", () => {
      const singleData = [
        {
          employeeId1: 200,
          employeeId2: 300,
          projectId: 15,
          daysWorked: 100,
        },
      ];

      render(<DataGrid data={singleData} />);

      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2);
      expect(screen.getByText("200")).toBeInTheDocument();
      expect(screen.getByText("300")).toBeInTheDocument();
      expect(screen.getByText("15")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    });
  });
});
