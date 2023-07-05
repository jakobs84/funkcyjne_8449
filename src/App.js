import React, { useState } from 'react';
import { BsTrash, BsPencil, BsCheck, BsArrowUp } from 'react-icons/bs';

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [kwota, setKwota] = useState('');
  const [opis, setOpis] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleKwotaChange = (event) => {
    const value = event.target.value.replace(',', '.');
    setKwota(value);
    setErrorMessage('');
  };

  const handleOpisChange = (event) => {
    setOpis(event.target.value);
  };

  const handleSaveExpense = () => {
    if (validateKwota()) {
      const newExpense = {
        kwota: kwota,
        opis: opis
      };

      if (editIndex !== null) {
        const updatedExpenses = [...expenses];
        updatedExpenses[editIndex] = newExpense;
        setExpenses(updatedExpenses);
        setEditIndex(null);
      } else {
        setExpenses([...expenses, newExpense]);
      }

      setKwota('');
      setOpis('');
    }
  };

  const handleDeleteExpense = (index) => {
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
    setExpenses(updatedExpenses);
  };

  const handleEditExpense = (index) => {
    const expenseToEdit = expenses[index];
    setKwota(expenseToEdit.kwota);
    setOpis(expenseToEdit.opis);
    setEditIndex(index);
  };

  const handleExport = () => {
    const currentDate = new Date().toLocaleString('pl-PL', { hour12: false }).replace(/[:.]/g, '-');
    let exportData = '';
    expenses.forEach((expense) => {
      exportData += `${expense.kwota} ${expense.opis}\n`;
    });
    exportData += `Suma: ${calculateSum()}`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(exportData));
    element.setAttribute('download', `expenses_${currentDate}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const calculateSum = () => {
    let sum = 0;
    expenses.forEach((expense) => {
      sum += parseFloat(expense.kwota);
    });
    return sum.toFixed(2);
  };

  const validateKwota = () => {
    if (kwota === '') {
      setErrorMessage('Pole Kwota jest wymagane');
      return false;
    }

    if (isNaN(parseFloat(kwota))) {
      setErrorMessage('Pole Kwota musi być liczbą');
      return false;
    }

    return true;
  };

  return (
    <div className="container">
      <h2>Wydatki</h2>
      <table className="table table-borderless">
        <thead>
          <tr>
            <th>Kwota</th>
            <th>Opis</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="Kwota"
                value={kwota}
                onChange={handleKwotaChange}
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="Opis"
                value={opis}
                onChange={handleOpisChange}
              />
            </td>
            <td>
              {editIndex !== null ? (
                <button className="btn btn-warning mr-2" onClick={handleSaveExpense}>
                  <BsCheck /> Edytuj
                </button>
              ) : (
                <button className="btn btn-success mr-2" onClick={handleSaveExpense}>
                  <BsCheck /> Zapisz
                </button>
              )}
              <span>{errorMessage}</span>
            </td>
          </tr>
          {expenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.kwota}</td>
              <td>{expense.opis}</td>
              <td>
                <button className="btn btn-danger mr-2" onClick={() => handleDeleteExpense(index)}>
                  <BsTrash /> Usuń
                </button>
                <button className="btn btn-success mr-2" onClick={() => handleEditExpense(index)}>
                  <BsPencil /> Edytuj
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between mt-3">
        <div>
          Suma: {calculateSum()}
        </div>
        <div>
          <button className="btn btn-primary" onClick={handleExport}>
            <BsArrowUp /> Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
