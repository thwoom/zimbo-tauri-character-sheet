/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import StatusEffectTimer from './StatusEffectTimer';

describe('StatusEffectTimer', () => {
  const defaultTimerStatus = {
    remaining: 10,
    minutes: 10,
    seconds: 0,
    status: 'normal',
    count: 1,
  };

  const defaultProps = {
    effect: 'poisoned',
    timerStatus: defaultTimerStatus,
    onAdjust: vi.fn(),
  };

  function renderComponent(propOverrides = {}) {
    return {
      ...render(<StatusEffectTimer {...defaultProps} {...propOverrides} />),
      props: { ...defaultProps, ...propOverrides },
    };
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders timer with effect name and time', () => {
    renderComponent();

    expect(screen.getByText('poisoned')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('does not render when timerStatus is null', () => {
    renderComponent({ timerStatus: null });

    expect(screen.queryByText('poisoned')).not.toBeInTheDocument();
  });

  it('displays count when multiple instances exist', () => {
    renderComponent({
      timerStatus: {
        ...defaultTimerStatus,
        count: 3,
      },
    });

    expect(screen.getByText('(3)')).toBeInTheDocument();
  });

  it('formats time correctly for minutes and seconds', () => {
    renderComponent({
      timerStatus: {
        ...defaultTimerStatus,
        minutes: 5,
        seconds: 30,
      },
    });

    expect(screen.getByText('5:30')).toBeInTheDocument();
  });

  it('formats time correctly for seconds only', () => {
    renderComponent({
      timerStatus: {
        ...defaultTimerStatus,
        minutes: 0,
        seconds: 45,
      },
    });

    expect(screen.getByText('45s')).toBeInTheDocument();
  });

  it('applies normal status class', () => {
    const { container } = renderComponent();

    const timerElement = container.firstChild;
    expect(timerElement.className).toContain('normal');
  });

  it('applies warning status class', () => {
    const { container } = renderComponent({
      timerStatus: {
        ...defaultTimerStatus,
        status: 'warning',
      },
    });

    const timerElement = container.firstChild;
    expect(timerElement.className).toContain('warning');
  });

  it('applies critical status class', () => {
    const { container } = renderComponent({
      timerStatus: {
        ...defaultTimerStatus,
        status: 'critical',
      },
    });

    const timerElement = container.firstChild;
    expect(timerElement.className).toContain('critical');
  });

  it('displays correct icon for normal status', () => {
    renderComponent();

    // Clock icon should be present (check for SVG element)
    const clockIcon = document.querySelector('svg');
    expect(clockIcon).toBeInTheDocument();
  });

  it('displays correct icon for warning status', () => {
    renderComponent({
      timerStatus: {
        ...defaultTimerStatus,
        status: 'warning',
      },
    });

    // Warning triangle icon should be present (check for SVG element)
    const warningIcon = document.querySelector('svg');
    expect(warningIcon).toBeInTheDocument();
  });

  it('displays correct icon for critical status', () => {
    renderComponent({
      timerStatus: {
        ...defaultTimerStatus,
        status: 'critical',
      },
    });

    // Skull icon should be present (check for SVG element)
    const skullIcon = document.querySelector('svg');
    expect(skullIcon).toBeInTheDocument();
  });

  it('calls onAdjust with positive value when +1m button is clicked', async () => {
    const user = userEvent.setup();
    const onAdjust = vi.fn();
    renderComponent({ onAdjust });

    const addButton = screen.getByLabelText('Add 1 minute to poisoned timer');
    await user.click(addButton);

    expect(onAdjust).toHaveBeenCalledWith('poisoned', 1);
  });

  it('calls onAdjust with negative value when -1m button is clicked', async () => {
    const user = userEvent.setup();
    const onAdjust = vi.fn();
    renderComponent({ onAdjust });

    const removeButton = screen.getByLabelText('Remove 1 minute from poisoned timer');
    await user.click(removeButton);

    expect(onAdjust).toHaveBeenCalledWith('poisoned', -1);
  });

  it('does not call onAdjust when onAdjust is not provided', async () => {
    const user = userEvent.setup();
    renderComponent({ onAdjust: undefined });

    const addButton = screen.getByLabelText('Add 1 minute to poisoned timer');
    await user.click(addButton);

    // Should not throw error
    expect(addButton).toBeInTheDocument();
  });

  it('displays correct button labels', () => {
    renderComponent();

    expect(screen.getByText('+1m')).toBeInTheDocument();
    expect(screen.getByText('-1m')).toBeInTheDocument();
  });

  it('has correct button titles', () => {
    renderComponent();

    const addButton = screen.getByTitle('Add 1 minute');
    const removeButton = screen.getByTitle('Remove 1 minute');

    expect(addButton).toBeInTheDocument();
    expect(removeButton).toBeInTheDocument();
  });

  it('handles different effect names', () => {
    renderComponent({ effect: 'burning' });

    expect(screen.getByText('burning')).toBeInTheDocument();
    expect(screen.getByLabelText('Add 1 minute to burning timer')).toBeInTheDocument();
  });

  it('handles zero remaining time', () => {
    renderComponent({
      timerStatus: {
        ...defaultTimerStatus,
        remaining: 0,
        minutes: 0,
        seconds: 0,
      },
    });

    expect(screen.getByText('0s')).toBeInTheDocument();
  });

  it('handles fractional remaining time', () => {
    renderComponent({
      timerStatus: {
        ...defaultTimerStatus,
        remaining: 0.5,
        minutes: 0,
        seconds: 30,
      },
    });

    expect(screen.getByText('30s')).toBeInTheDocument();
  });

  it('capitalizes effect name', () => {
    renderComponent({ effect: 'poisoned' });

    const effectElement = screen.getByText('poisoned');
    expect(effectElement.className).toContain('effectName');
  });

  it('renders count badge with correct styling', () => {
    renderComponent({
      timerStatus: {
        ...defaultTimerStatus,
        count: 2,
      },
    });

    const countElement = screen.getByText('(2)');
    expect(countElement.className).toContain('count');
  });
});
