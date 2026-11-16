import { act, fireEvent, render, screen } from '@testing-library/react';

import { DecisionPanel } from './DecisionPanel';
import type { DecisionPanelProps } from './types';

const outcomes = [
  { value: 'approve', label: 'Approve', hint: 'Approves', description: 'Session passes', tone: 'primary' as const },
  { value: 'correct', label: 'Request correction', hint: 'Asks again', description: 'User re-uploads' },
  { value: 'reject', label: 'Reject', hint: 'Rejects', description: 'Note required', tone: 'danger' as const, noteRequired: true },
];

const labels = {
  title: 'Your decision',
  note: 'Note',
  noteRequiredError: 'A note is required',
  chooseError: 'Choose a decision',
  submit: 'Submit decision',
  submitHint: 'Sends the decision',
};

const checklist = { title: 'Checks', items: [{ id: 'doc', label: 'Document matches' }] };

const renderPanel = (overrides: Partial<DecisionPanelProps<string>>): jest.Mock => {
  const onSubmit = jest.fn();
  render(<DecisionPanel labels={labels} outcomes={outcomes} testID="dp" variant="choose-then-submit" onSubmit={onSubmit} {...overrides} />);
  return onSubmit;
};

const typeNote = (text: string): void => {
  fireEvent.change(screen.getByTestId('dp-note'), { target: { value: text } });
};

const press = async (testID: string): Promise<void> => {
  await act(async () => {
    fireEvent.click(screen.getByTestId(testID));
  });
};

describe('DecisionPanel choose-then-submit', () => {
  it('with reject chosen and no note, refuses and shows the note error', async () => {
    const onSubmit = renderPanel({});
    await press('dp-outcome-reject');

    await press('dp-submit');

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('A note is required')).toBeTruthy();
  });

  it('with reject chosen and a note, submits outcome and note', async () => {
    const onSubmit = renderPanel({});
    await press('dp-outcome-reject');
    typeNote('Forged document');

    await press('dp-submit');

    expect(onSubmit).toHaveBeenCalledWith({ outcome: 'reject', note: 'Forged document', reasons: [] });
  });

  it('with nothing chosen, refuses and shows the choose error', async () => {
    const onSubmit = renderPanel({});

    await press('dp-submit');

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Choose a decision')).toBeTruthy();
  });
});

describe('DecisionPanel sticky-bar', () => {
  it('with an outcome that needs no note, pressing it submits that outcome', async () => {
    const onSubmit = renderPanel({ variant: 'sticky-bar' });

    await press('dp-action-approve');

    expect(onSubmit).toHaveBeenCalledWith({ outcome: 'approve', note: '', reasons: [] });
  });

  it('with reject and no note, pressing it refuses', async () => {
    const onSubmit = renderPanel({ variant: 'sticky-bar' });

    await press('dp-action-reject');

    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe('DecisionPanel checks-drive', () => {
  it('with a reason picked, pressing the lead outcome submits the reason', async () => {
    const reasons = [{ value: 'blur', label: 'Photo blurred' }, { value: 'expired', label: 'Expired' }];
    const onSubmit = renderPanel({ variant: 'checks-drive', reasons, leadOutcome: 'correct' });
    await press('dp-reason-blur');

    await press('dp-action-correct');

    expect(onSubmit).toHaveBeenCalledWith({ outcome: 'correct', note: '', reasons: ['blur'] });
  });
});

describe('DecisionPanel checklist gate', () => {
  it('with the checklist incomplete, pressing an outcome does not submit', async () => {
    const onSubmit = renderPanel({ variant: 'sticky-bar', checklist });

    await press('dp-action-approve');

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('with the checklist ticked, pressing an outcome submits', async () => {
    const onSubmit = renderPanel({ variant: 'sticky-bar', checklist });
    await press('dp-checklist-item-doc');

    await press('dp-action-approve');

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
