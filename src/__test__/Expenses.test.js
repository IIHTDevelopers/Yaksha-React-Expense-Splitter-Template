import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Expenses from '../components/Expenses';

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([
                { id: 1, description: 'Lunch', amount: 50, payer: 'Alice' },
                { id: 2, description: 'Gas', amount: 30, payer: 'Bob' },
            ]),
        })
    );
});

beforeEach(() => {
    fetch.mockClear();
});

describe('boundary', () => {
    test('ExpensesComponent boundary renders without crashing', async () => {
        render(<Expenses />);
        await waitFor(() => expect(screen.getByText('Expenses')).toBeInTheDocument());
    });

    test('ExpensesComponent boundary has "Expenses" h2', () => {
        render(<Expenses />);
        expect(screen.queryByText('Expenses')).toBeInTheDocument();
    });

    test('ExpensesComponent boundary has "Total Expense" h3', () => {
        render(<Expenses />);
        expect(screen.getByText(/total expense/i)).toBeInTheDocument();
    });

    test('ExpensesComponent boundary has "Expenses by User" h4', () => {
        render(<Expenses />);
        expect(screen.getByText(/expenses by User/i)).toBeInTheDocument();
    });

    test('ExpensesComponent boundary fetches expenses data and displays it', async () => {
        render(<Expenses />);
        await waitFor(() => {
            expect(screen.getByText('Lunch - $50 (Paid by Alice)')).toBeInTheDocument();
            expect(screen.getByText('Gas - $30 (Paid by Bob)')).toBeInTheDocument();
        });
    });

    test('ExpensesComponent boundary calculates and displays total expense', async () => {
        render(<Expenses />);
        await waitFor(() => {
            expect(screen.getByText('Total Expense: $80')).toBeInTheDocument();
        });
    });

    test('ExpensesComponent boundary calculates and displays expenses by user', async () => {
        render(<Expenses />);
        await waitFor(() => {
            expect(screen.getByText('Alice: $50')).toBeInTheDocument();
            expect(screen.getByText('Bob: $30')).toBeInTheDocument();
        });
    });
});
