import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Settlements from '../components/Settlements';

beforeEach(() => {
    global.fetch = jest.fn();
});
beforeEach(() => {
    fetch.mockClear();
});

const mockExpenses = [
    { id: 1, description: 'Dinner', amount: 100, payer: 'Alice', dividedAmong: ['Alice', 'Bob', 'Charlie'] },
    { id: 2, description: 'Taxi', amount: 30, payer: 'Bob', dividedAmong: ['Alice', 'Bob'] }
];

const mockParticipants = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
];

describe('boundary', () => {
    test('SettlementsComponent boundary renders without crashing', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(mockExpenses) }))
            .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(mockParticipants) }));
        render(<Settlements />);
        await waitFor(() => expect(screen.getByText('Settlements')).toBeInTheDocument());
    });

    test('SettlementsComponent boundary has "Settlements" h2', () => {
        render(<Settlements />);
        expect(screen.getByText(/Settlements/i)).toBeInTheDocument();
    });

    test('SettlementsComponent boundary handles empty data without crashing and shows no settlements', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve([]) })) // Mock empty expenses
            .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve([]) })); // Mock empty participants

        render(<Settlements />);
        await waitFor(() => {
            expect(screen.getByText('Settlements')).toBeInTheDocument();
            expect(screen.queryByText(/balance:/)).not.toBeInTheDocument(); // No balance information should be displayed
        });
    });
});
