import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddExpense from '../components/AddExpense';

beforeEach(() => {
    global.fetch = jest.fn((url) =>
        Promise.resolve({
            json: () => {
                if (url.includes('participants')) {
                    return Promise.resolve([
                        { id: 1, name: 'Alice' },
                        { id: 2, name: 'Bob' }
                    ]);
                }
                return Promise.resolve({});
            },
        })
    );
});

afterEach(() => {
    global.fetch.mockClear();
});

describe('boundary', () => {
    test('AddExpenseComponent boundary renders without crashing', () => {
        render(<AddExpense />);
    });

    test('AddExpenseComponent boundary has "Add a New Expense" h3', () => {
        render(<AddExpense />);
        expect(screen.queryByText('Add a New Expense')).toBeInTheDocument();
    });

    test('AddExpenseComponent boundary displays form fields', async () => {
        render(<AddExpense />);
        await waitFor(() => expect(screen.getByLabelText('Description:')).toBeInTheDocument());
        expect(screen.getByLabelText('Amount:')).toBeInTheDocument();
        expect(screen.getByLabelText('Payer:')).toBeInTheDocument();
        expect(screen.getByLabelText('Divide Among:')).toBeInTheDocument();
    });

    test('AddExpenseComponent boundary Can submit the form after adding an expense', async () => {
        global.fetch.mockImplementationOnce((url) => {
            if (url.includes('expenses')) {
                return Promise.resolve({
                    json: () => Promise.resolve({ id: 3, description: 'Lunch', amount: 50, payer: 'Alice', dividedAmong: ['Alice', 'Bob'] })
                });
            }
            return Promise.resolve({});
        });

        render(<AddExpense />);
        fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'Lunch' } });
        fireEvent.change(screen.getByLabelText('Amount:'), { target: { value: '50' } });
        await waitFor(() => fireEvent.change(screen.getByLabelText('Payer:'), { target: { value: 'Alice' } }));
        fireEvent.change(screen.getByLabelText('Divide Among:'), { target: { value: 'Bob' } });

        fireEvent.click(screen.getByText('Add Expense'));

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2)); // Assuming 1 call for initial fetch, 1 for post
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('expenses'), expect.anything());
    });
});
