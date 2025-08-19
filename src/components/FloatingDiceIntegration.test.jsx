import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import App from '../App';
import { CharacterProvider } from '../state/CharacterContext';
import { SettingsProvider } from '../state/SettingsContext';
import { ThemeProvider } from '../state/ThemeContext';

// Mock Math.random for predictable dice rolls
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5; // This will give us predictable results
global.Math = mockMath;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock safeLocalStorage
vi.mock('../utils/safeLocalStorage.js', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe('Floating Dice Integration', () => {
  const user = userEvent.setup();

  const renderApp = () => {
    return render(
      <ThemeProvider>
        <SettingsProvider>
          <CharacterProvider>
            <App />
          </CharacterProvider>
        </SettingsProvider>
      </ThemeProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders floating dice button on the page', async () => {
    renderApp();

    expect(screen.getByRole('button', { name: 'Open dice roller' })).toBeInTheDocument();
    expect(screen.getByText('🎲')).toBeInTheDocument();
  });

  it('opens dice roller modal when floating button is clicked', async () => {
    renderApp();

    const diceButton = screen.getByRole('button', { name: 'Open dice roller' });
    await user.click(diceButton);

    // Modal should be open
    expect(screen.getByText('🎲 Dice Roller')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close dice roller' })).toBeInTheDocument();
  });

  it('closes dice roller modal when close button is clicked', async () => {
    renderApp();

    // Open modal
    const diceButton = screen.getByRole('button', { name: 'Open dice roller' });
    await user.click(diceButton);

    // Verify modal is open
    expect(screen.getByText('🎲 Dice Roller')).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByRole('button', { name: 'Close dice roller' });
    await user.click(closeButton);

    // Verify modal is closed
    expect(screen.queryByText('🎲 Dice Roller')).not.toBeInTheDocument();
  });

  it('closes dice roller modal when clicking outside', async () => {
    renderApp();

    // Open modal
    const diceButton = screen.getByRole('button', { name: 'Open dice roller' });
    await user.click(diceButton);

    // Verify modal is open
    expect(screen.getByText('🎲 Dice Roller')).toBeInTheDocument();

    // Click outside (on the overlay)
    const overlay = screen.getByRole('presentation');
    await user.click(overlay);

    // Verify modal is closed
    expect(screen.queryByText('🎲 Dice Roller')).not.toBeInTheDocument();
  });

  it('can roll dice from the modal', async () => {
    renderApp();

    // Open modal
    const diceButton = screen.getByRole('button', { name: 'Open dice roller' });
    await user.click(diceButton);

    // Roll a d6
    const d6Button = screen.getByRole('button', { name: 'Roll d6' });
    await user.click(d6Button);

    // Should show rolling state briefly, then result
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    });

    // Should show a roll result (the exact number depends on the mock)
    expect(screen.getAllByText(/d6: \d+ = \d+/)).toHaveLength(3); // Result box, history, and roll modal
  });

  it('can roll combat actions from the modal', async () => {
    renderApp();

    // Open modal
    const diceButton = screen.getByRole('button', { name: 'Open dice roller' });
    await user.click(diceButton);

    // Roll Hack & Slash
    const hackButton = screen.getByRole('button', { name: 'Roll Hack & Slash' });
    await user.click(hackButton);

    // Should show rolling state briefly, then result
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    });

    // Should show a roll result
    expect(screen.getByText(/Hack & Slash/)).toBeInTheDocument();
  });

  it('can add and use roll presets', async () => {
    renderApp();

    // Open modal
    const diceButton = screen.getByRole('button', { name: 'Open dice roller' });
    await user.click(diceButton);

    // Add a preset
    const nameInput = screen.getByRole('textbox', { name: 'Preset name' });
    const formulaInput = screen.getByRole('textbox', { name: 'Preset formula' });
    const addButton = screen.getByRole('button', { name: 'Add preset' });

    await user.type(nameInput, 'Test Roll');
    await user.type(formulaInput, '2d6+1');
    await user.click(addButton);

    // Should now have a preset button
    const presetButton = screen.getByRole('button', { name: 'Roll preset Test Roll' });
    expect(presetButton).toBeInTheDocument();

    // Use the preset
    await user.click(presetButton);

    // Should show rolling state briefly, then result
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    });

    // Should show a roll result
    expect(screen.getByText(/Test Roll/)).toBeInTheDocument();
  });

  it('can be opened via command palette', async () => {
    renderApp();

    // Open command palette with Ctrl+K
    await user.keyboard('{Control>}k{/Control}');

    // Should show command palette
    expect(screen.getByText('Open Dice Roller')).toBeInTheDocument();

    // Click on the dice roller command
    const diceCommand = screen.getByText('Open Dice Roller');
    await user.click(diceCommand);

    // Modal should be open
    expect(screen.getByText('🎲 Dice Roller')).toBeInTheDocument();
  });

  it('shows roll history in the modal', async () => {
    renderApp();

    // Open modal
    const diceButton = screen.getByRole('button', { name: 'Open dice roller' });
    await user.click(diceButton);

    // Roll a few dice to generate history
    const d6Button = screen.getByRole('button', { name: 'Roll d6' });
    await user.click(d6Button);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    });

    // Should show roll history
    expect(screen.getByText('Recent Rolls:')).toBeInTheDocument();
  });

  it('floating button shows active state when modal is open', async () => {
    renderApp();

    const diceButton = screen.getByRole('button', { name: 'Open dice roller' });

    // Button should not be active initially
    expect(diceButton.className).not.toContain('active');

    // Open modal
    await user.click(diceButton);

    // Button should be active when modal is open
    expect(diceButton.className).toContain('active');

    // Close modal
    const closeButton = screen.getByRole('button', { name: 'Close dice roller' });
    await user.click(closeButton);

    // Button should not be active again
    expect(diceButton.className).not.toContain('active');
  });
});
