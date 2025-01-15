import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faFileExcel,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const AccountsOverview = () => {
  const ip = import.meta.env.VITE_IP;
  const [accounts, setAccounts] = useState([]);
  const [fetcheddata, setFetched] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    totalAmount: 0,
    totalIn: 0,
    totalOut: 0,
  });
  const calculateTotals = (data) => {
    const totalAmount = data.reduce((sum, account) => sum + account.amount, 0);
    const totalIn = data
      .filter((account) => account.amt_in_out === "IN")
      .reduce((sum, account) => sum + account.amount, 0);
    const totalOut = data
      .filter((account) => account.amt_in_out === "OUT")
      .reduce((sum, account) => sum + account.amount, 0);

    setTotals({ totalAmount, totalIn, totalOut });
  };

  const [filters, setFilters] = useState({
    amtInOut: "",
    fromDate: "",
    toDate: "",
    description: "",
    method: "",
  });
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amt_in_out: "",
    amount: "",
    method: "",
    description: "",
  });

  const closeExpenseForm = () => {
    setNewExpense({
      amt_in_out: "",
      amount: "",
      method: "",
      description: "",
    });
    toggleExpenseForm();
  };

  const toggleExpenseForm = () => {
    setShowExpenseForm(!showExpenseForm);
  };

  const handleExpenseChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      const email = localStorage.getItem("userid");

      if (!email) {
        console.error("Missing email or societyId in localStorage");
        return;
      }

      await axios.post(`http://${ip}/api/accounts/transaction/add`, {
        ...newExpense,
        email,
      });

      fetchAccounts();
      setShowExpenseForm(false);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Set filters' fromDate and toDate to current month start and end
    setFilters((prevFilters) => ({
      ...prevFilters,
      fromDate: startOfMonth.toISOString().split("T")[0], // YYYY-MM-DD format
      toDate: endOfMonth.toISOString().split("T")[0], // YYYY-MM-DD format
    }));
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    const userid = localStorage.getItem("userid");

    try {
      const [fetchedResponse, accountResponse] = await Promise.all([
        axios.post(`http://${ip}/api/accounts/data`, { userid }),
        axios.post(`http://${ip}/api/accounts/transactions`, { userid }),
      ]);
      setAccounts(
        Array.isArray(accountResponse.data) ? accountResponse.data : []
      );
      setFetched(fetchedResponse.data.balance);
      setError(null);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError("Failed to fetch account data.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data) => {
    if (!Array.isArray(data)) {
      console.error("applyFilters: Expected an array, got:", data);
      return [];
    }

    return data.filter((account) => {
      const matchesAmtInOut = filters.amtInOut
        ? account.amt_in_out === filters.amtInOut
        : true;
      const metchesMethod = filters.Method
        ? account.method === filters.Method
        : true;
      const matchesDescription = filters.description
        ? account.description
            .toLowerCase()
            .includes(filters.description.toLowerCase())
        : true;

      let matchesDateRange = true;
      if (filters.fromDate) {
        matchesDateRange =
          new Date(account.createdAt) >= new Date(filters.fromDate);
      }
      if (filters.toDate) {
        matchesDateRange =
          matchesDateRange &&
          new Date(account.createdAt) <= new Date(filters.toDate);
      }

      return (
        metchesMethod &&
        matchesAmtInOut &&
        matchesDescription &&
        matchesDateRange
      );
    });
  };

  const filteredAccounts = applyFilters(accounts || []);
  useEffect(() => {
    calculateTotals(filteredAccounts);
  }, [filteredAccounts]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Account Statement", 20, 10);
    autoTable(doc, {
      head: [
        [
          "#",
          "Date",
          "Amount In/Out",
          "Amount",
          "Description",
          "Method",
          "Balance Before",
          "Balance After",
        ],
      ],
      body: filteredAccounts.map((account, index) => [
        index + 1,
        new Date(account.createdAt).toLocaleString(),
        account.amt_in_out,
        account.amount,
        account.description,
        account.method,
        account.balance_before_transaction,
        account.balance_after_transaction,
      ]),
    });
    doc.save("account-statement.pdf");
  };

  const handleDownloadXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredAccounts.map((account, index) => ({
        "#": index + 1,
        Date: new Date(account.createdAt).toLocaleString(),
        "Amount In/Out": account.amt_in_out,
        Amount: account.amount,
        Description: account.description,
        Method: account.method,
        "Balance Before": account.balance_before_transaction,
        "Balance After": account.balance_after_transaction,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Accounts");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "account-statement.xlsx");
  };

  return (

<>
  {/* <div className="flex flex-col w-full mt-3 bg-white rounded-lg">
    <div className="flex md:flex-row flex-col gap-3 justify-between items-center w-full">

      <div className="flex gap-6 md:w-2/3 w-full justify-between md:justify-start items-center">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center justify-center px-6 py-3 bg-white text-red-500 font-semibold rounded-lg shadow-md hover:bg-red-500 hover:text-white transition duration-200 ease-in-out"
        >
          <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
          Download PDF
        </button>

        <button
          onClick={handleDownloadXLSX}
          className="flex items-center justify-center px-6 py-3 bg-white text-green-500 font-semibold rounded-lg shadow-md hover:bg-green-500 hover:text-white transition duration-200 ease-in-out"
        >
          <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
          Download XLSX
        </button>

        <button
          onClick={toggleExpenseForm}
          className="flex items-center justify-center px-6 py-3 bg-white text-indigo-500 font-semibold rounded-lg shadow-md hover:bg-indigo-500 hover:text-white transition duration-200 ease-in-out"
        >
          <FontAwesomeIcon
            icon={showExpenseForm ? faTimes : faPlus}
            className="mr-2"
          />
          {showExpenseForm ? "Cancel" : "Add Entry"}
        </button>
      </div>
    </div>


    <div className="flex flex-col md:flex-row gap-6 mt-6">

      <div className="flex flex-col w-full md:w-2/3 gap-3 justify-center items-start">
        <h2 className="text-xl font-bold">Filters</h2>
        <div className="flex gap-6 items-center flex-wrap">
          <div className="flex flex-col w-full md:w-1/5">
            <label className="block text-sm font-medium mb-2">Amount In/Out:</label>
            <select
              name="amtInOut"
              value={filters.amtInOut}
              onChange={handleFilterChange}
              className="form-select rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
            </select>
          </div>

          <div className="flex flex-col w-full md:w-1/5">
            <label className="block text-sm font-medium mb-2">Method:</label>
            <select
              name="Method"
              value={filters.Method}
              onChange={handleFilterChange}
              className="form-select rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="CASH">CASH</option>
              <option value="UPI">UPI</option>
              <option value="CARD">CARD</option>
              <option value="NET BANKING">NET BANKING</option>
              <option value="CHEQUE">CHEQUE</option>
              <option value="DEMAND DRAFT">DEMAND DRAFT</option>
            </select>
          </div>

          <div className="flex flex-col w-full md:w-1/5">
            <label className="block text-sm font-medium mb-2">Description:</label>
            <input
              type="text"
              name="description"
              value={filters.description}
              onChange={handleFilterChange}
              className="form-input rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col w-full md:w-1/5">
            <label className="block text-sm font-medium mb-2">From Date:</label>
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="form-input rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col w-full md:w-1/5">
            <label className="block text-sm font-medium mb-2">To Date:</label>
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
              className="form-input rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

 
      <div className="flex flex-col w-full md:w-1/3 gap-6">

      <div className="flex flex-col bg-white rounded-lg p-3 shadow-md border border-indigo-300">
          <h3 className="text-lg font-semibold text-indigo-600">Current Balance</h3>
          <p className="text-2xl font-bold text-indigo-700">₹ {fetcheddata}</p>
        </div>

        <div className="flex flex-col bg-white rounded-lg p-3 shadow-md border border-green-300">
          <h3 className="text-lg font-semibold text-green-600">Total IN</h3>
          <p className="text-2xl font-bold text-green-700">₹ {totals.totalIn}</p>
        </div>

        <div className="flex flex-col bg-white rounded-lg p-3 shadow-md border border-red-300">
          <h3 className="text-lg font-semibold text-red-600">Total OUT</h3>
          <p className="text-2xl font-bold text-red-700">₹ {totals.totalOut}</p>
        </div>


      </div>
    </div>

    <div className="max-h-[70vh] overflow-y-auto border-2 rounded-lg mt-6">
      <table className="table-auto w-full text-sm">
        <thead className="bg-gray-100 border-b text-gray-600">
          <tr className="text-center">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Amount In/Out</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Method</th>
            <th className="px-4 py-2">Balance Before</th>
            <th className="px-4 py-2">Balance After</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredAccounts.map((account, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{new Date(account.createdAt).toLocaleString()}</td>
              <td
  className={`px-4 py-2 ${
    account.amt_in_out === "IN" ? "text-green-600" : "text-red-600"
  }`}
>
  {account.amt_in_out}
</td>

              <td className="px-4 py-2">{account.amount}</td>
              <td className="px-4 py-2">{account.description}</td>
              <td className="px-4 py-2">{account.method}</td>
              <td className="px-4 py-2">{account.balance_before_transaction}</td>
              <td className="px-4 py-2">{account.balance_after_transaction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {loading && <p>Loading accounts...</p>}
    {error && <p className="text-red-500">{error}</p>}
  </div> */}

<div className="flex flex-col w-auto mt-3 bg-white rounded-lg">
  <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center w-full">

    <div className="flex flex-col md:flex-row gap-3 w-full md:w-2/3 items-center">
      <button
        onClick={handleDownloadPDF}
        className="flex items-center justify-center px-4 py-2 bg-white text-red-500 font-semibold rounded-lg shadow-md hover:bg-red-500 hover:text-white transition duration-200 ease-in-out"
      >
        <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
        Download PDF
      </button>

      <button
        onClick={handleDownloadXLSX}
        className="flex items-center justify-center px-4 py-2 bg-white text-green-500 font-semibold rounded-lg shadow-md hover:bg-green-500 hover:text-white transition duration-200 ease-in-out"
      >
        <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
        Download XLSX
      </button>

      <button
        onClick={toggleExpenseForm}
        className="flex items-center justify-center px-4 py-2 bg-white text-indigo-500 font-semibold rounded-lg shadow-md hover:bg-indigo-500 hover:text-white transition duration-200 ease-in-out"
      >
        <FontAwesomeIcon
          icon={showExpenseForm ? faTimes : faPlus}
          className="mr-2"
        />
        {showExpenseForm ? "Cancel" : "Add Entry"}
      </button>
    </div>
  </div>

  <div className="flex flex-col md:flex-row gap-6 mt-6">
    {/* Filter Section */}
    <div className="flex flex-col w-full gap-3">
      <h2 className="text-xl font-bold">Filters</h2>
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex flex-col w-full sm:w-1/2 md:w-1/5">
          <label className="block text-sm font-medium mb-2">Amount In/Out:</label>
          <select
            name="amtInOut"
            value={filters.amtInOut}
            onChange={handleFilterChange}
            className="form-select rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </select>
        </div>

        <div className="flex flex-col w-full sm:w-1/2 md:w-1/5">
          <label className="block text-sm font-medium mb-2">Method:</label>
          <select
            name="Method"
            value={filters.Method}
            onChange={handleFilterChange}
            className="form-select rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option value="CASH">CASH</option>
            <option value="UPI">UPI</option>
            <option value="CARD">CARD</option>
            <option value="NET BANKING">NET BANKING</option>
            <option value="CHEQUE">CHEQUE</option>
            <option value="DEMAND DRAFT">DEMAND DRAFT</option>
          </select>
        </div>

        <div className="flex flex-col w-full sm:w-1/2 md:w-1/5">
          <label className="block text-sm font-medium mb-2">Description:</label>
          <input
            type="text"
            name="description"
            value={filters.description}
            onChange={handleFilterChange}
            className="form-input rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col w-full sm:w-1/2 md:w-1/5">
          <label className="block text-sm font-medium mb-2">From Date:</label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            className="form-input rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col w-full sm:w-1/2 md:w-1/5">
          <label className="block text-sm font-medium mb-2">To Date:</label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            className="form-input rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>

    {/* Total IN/OUT Section */}
    <div className="flex flex-col w-full md:w-1/3 gap-6">
      <div className="flex flex-col bg-white rounded-lg p-3 shadow-md border border-indigo-300">
        <h3 className="text-lg font-semibold text-indigo-600">Current Balance</h3>
        <p className="text-2xl font-bold text-indigo-700">₹ {fetcheddata}</p>
      </div>

      <div className="flex flex-col bg-white rounded-lg p-3 shadow-md border border-green-300">
        <h3 className="text-lg font-semibold text-green-600">Total IN</h3>
        <p className="text-2xl font-bold text-green-700">₹ {totals.totalIn}</p>
      </div>

      <div className="flex flex-col bg-white rounded-lg p-3 shadow-md border border-red-300">
        <h3 className="text-lg font-semibold text-red-600">Total OUT</h3>
        <p className="text-2xl font-bold text-red-700">₹ {totals.totalOut}</p>
      </div>
    </div>
  </div>

  {/* Account Table */}
  <div className="overflow-x-auto border-2 rounded-lg mt-6">
    <table className="table-auto w-full text-sm">
      <thead className="bg-gray-100 border-b text-gray-600">
        <tr className="text-center">
          <th className="px-4 py-2">#</th>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Amount In/Out</th>
          <th className="px-4 py-2">Amount</th>
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Method</th>
          <th className="px-4 py-2">Balance Before</th>
          <th className="px-4 py-2">Balance After</th>
        </tr>
      </thead>
      <tbody className="text-center">
        {filteredAccounts.map((account, index) => (
          <tr key={index} className="border-b">
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{new Date(account.createdAt).toLocaleString()}</td>
            <td
              className={`px-4 py-2 ${
                account.amt_in_out === "IN" ? "text-green-600" : "text-red-600"
              }`}
            >
              {account.amt_in_out}
            </td>
            <td className="px-4 py-2">{account.amount}</td>
            <td className="px-4 py-2">{account.description}</td>
            <td className="px-4 py-2">{account.method}</td>
            <td className="px-4 py-2">{account.balance_before_transaction}</td>
            <td className="px-4 py-2">{account.balance_after_transaction}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {loading && <p>Loading accounts...</p>}
  {error && <p className="text-red-500">{error}</p>}
</div>


  {showExpenseForm && (
    <div className="fixed top-0 left-0 w-screen h-screen bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={handleAddExpense}
        className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[50%]"
      >
        <h2 className="text-lg font-bold mb-4">Add New Expense</h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="amt_in_out">Amount In/Out:</label>
            <select
              id="amt_in_out"
              name="amt_in_out"
              value={newExpense.amt_in_out}
              onChange={handleExpenseChange}
              className="form-select rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select</option>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="method">Method:</label>
            <select
              id="method"
              name="method"
              value={newExpense.method}
              onChange={handleExpenseChange}
              className="form-select rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select</option>
              <option value="CASH">CASH</option>
              <option value="UPI">UPI</option>
              <option value="CARD">CARD</option>
              <option value="NET BANKING">NET BANKING</option>
              <option value="CHEQUE">CHEQUE</option>
              <option value="DEMAND DRAFT">DEMAND DRAFT</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="amount">Amount:</label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={newExpense.amount}
              onChange={handleExpenseChange}
              className="form-input rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description">Description:</label>
            <input
              id="description"
              name="description"
              type="text"
              value={newExpense.description}
              onChange={handleExpenseChange}
              className="form-input rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex gap-6 mt-4">
            <button
              type="submit"
              className="bg-indigo-500 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-200 ease-in-out"
            >
              Add Expense
            </button>
            <button
              type="button"
              onClick={closeExpenseForm}
              className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )}
</>


  );
};

export default AccountsOverview;
