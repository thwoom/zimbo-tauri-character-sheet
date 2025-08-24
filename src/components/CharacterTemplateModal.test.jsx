/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import CharacterTemplateModal from './CharacterTemplateModal';

// Mock the classes module
vi.mock('../data/classes', () => ({
  getClassNames: () => ['fighter', 'wizard', 'thief'],
  getClassTemplate: vi.fn((className) => ({
    name: 'Test Character',
    class: className,
    className: className.charAt(0).toUpperCase() + className.slice(1),
    level: 1,
    hp: 20,
    maxHp: 20,
    stats: {
      STR: { score: 10, mod: 0 },
      DEX: { score: 10, mod: 0 },
      CON: { score: 10, mod: 0 },
      INT: { score: 10, mod: 0 },
      WIS: { score: 10, mod: 0 },
      CHA: { score: 10, mod: 0 },
    },
  })),
  getClass: vi.fn((className) => ({
    description: `${className} description`,
    startingMoves: [
      { id: 'm1', name: 'Move One' },
      { id: 'm2', name: 'Move Two' },
    ],
  })),
}));

describe('CharacterTemplateModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSelectTemplate: vi.fn(),
  };

  function renderComponent(propOverrides = {}) {
    return {
      ...render(<CharacterTemplateModal {...defaultProps} {...propOverrides} />),
      props: { ...defaultProps, ...propOverrides },
    };
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open', () => {
    renderComponent();
    expect(screen.getByText('Character Template')).toBeInTheDocument();
    expect(screen.getByText('Choose a Class')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderComponent({ isOpen: false });
    expect(screen.queryByText('Character Template')).not.toBeInTheDocument();
  });

  it('displays all available classes', () => {
    renderComponent();
    expect(screen.getByText('Fighter')).toBeInTheDocument();
    expect(screen.getByText('Wizard')).toBeInTheDocument();
    expect(screen.getByText('Thief')).toBeInTheDocument();
  });

  it('allows selecting a class', async () => {
    const user = userEvent.setup();
    renderComponent();

    const fighterButton = screen.getByText('Fighter');
    await user.click(fighterButton);

    expect(fighterButton.closest('button').className).toContain('selected');
  });

  it('shows customize section when class is selected', async () => {
    const user = userEvent.setup();
    renderComponent();

    const fighterButton = screen.getByText('Fighter');
    await user.click(fighterButton);

    expect(screen.getByText('Customize')).toBeInTheDocument();
    expect(screen.getByLabelText('Character Name (Optional)')).toBeInTheDocument();
    // Preview content appears
    expect(screen.getByText('Class Preview')).toBeInTheDocument();
  });

  it('allows entering a custom character name', async () => {
    const user = userEvent.setup();
    renderComponent();

    const fighterButton = screen.getByText('Fighter');
    await user.click(fighterButton);

    const nameInput = screen.getByLabelText('Character Name (Optional)');
    await user.type(nameInput, 'Aragorn');

    expect(nameInput).toHaveValue('Aragorn');
  });

  it('calls onSelectTemplate with correct data when using template', async () => {
    const user = userEvent.setup();
    const onSelectTemplate = vi.fn();
    renderComponent({ onSelectTemplate });

    const fighterButton = screen.getByText('Fighter');
    await user.click(fighterButton);

    const useTemplateButton = screen.getByText('Use Template');
    await user.click(useTemplateButton);

    expect(onSelectTemplate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Fighter',
        class: 'fighter',
        className: 'Fighter',
      }),
    );
  });

  it('calls onSelectTemplate with custom name when provided', async () => {
    const user = userEvent.setup();
    const onSelectTemplate = vi.fn();
    renderComponent({ onSelectTemplate });

    const fighterButton = screen.getByText('Fighter');
    await user.click(fighterButton);

    const nameInput = screen.getByLabelText('Character Name (Optional)');
    await user.type(nameInput, 'Aragorn');

    const useTemplateButton = screen.getByText('Use Template');
    await user.click(useTemplateButton);

    expect(onSelectTemplate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Aragorn',
        class: 'fighter',
        className: 'Fighter',
      }),
    );
  });

  it('shows custom character form when custom button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const customButton = screen.getByText('Create Custom Character');
    await user.click(customButton);

    expect(screen.getByText('Create Custom Character')).toBeInTheDocument();
    expect(screen.getByLabelText('Character Name')).toBeInTheDocument();
    expect(screen.getByText(/This will create a blank character/)).toBeInTheDocument();
  });

  it('calls onSelectTemplate with custom character data', async () => {
    const user = userEvent.setup();
    const onSelectTemplate = vi.fn();
    renderComponent({ onSelectTemplate });

    const customButton = screen.getByText('Create Custom Character');
    await user.click(customButton);

    const nameInput = screen.getByLabelText('Character Name');
    await user.type(nameInput, 'Custom Hero');

    const createButton = screen.getByText('Create Character');
    await user.click(createButton);

    expect(onSelectTemplate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Custom Hero',
        class: 'custom',
        className: 'Custom Character',
        level: 1,
        hp: 20,
        maxHp: 20,
      }),
    );
  });

  it('disables create button when no name is provided for custom character', async () => {
    const user = userEvent.setup();
    renderComponent();

    const customButton = screen.getByText('Create Custom Character');
    await user.click(customButton);

    const createButton = screen.getByText('Create Character');
    expect(createButton).toBeDisabled();
  });

  it('disables use template button when no class is selected', () => {
    renderComponent();

    const useTemplateButton = screen.getByText('Use Template');
    expect(useTemplateButton).toBeDisabled();
  });

  it('enables use template button when class is selected', async () => {
    const user = userEvent.setup();
    renderComponent();

    const fighterButton = screen.getByText('Fighter');
    await user.click(fighterButton);

    const useTemplateButton = screen.getByText('Use Template');
    expect(useTemplateButton).not.toBeDisabled();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderComponent({ onClose });

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderComponent({ onClose });

    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('closes modal after template selection', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderComponent({ onClose });

    const fighterButton = screen.getByText('Fighter');
    await user.click(fighterButton);

    const useTemplateButton = screen.getByText('Use Template');
    await user.click(useTemplateButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('closes modal after custom character creation', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderComponent({ onClose });

    const customButton = screen.getByText('Create Custom Character');
    await user.click(customButton);

    const nameInput = screen.getByLabelText('Character Name');
    await user.type(nameInput, 'Custom Hero');

    const createButton = screen.getByText('Create Character');
    await user.click(createButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('resets form when modal is closed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { unmount } = renderComponent({ onClose });

    // Select a class first
    const fighterButton = screen.getByText('Fighter');
    await user.click(fighterButton);

    // Close modal
    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);

    // Unmount and remount to simulate reopening
    unmount();
    renderComponent({ onClose });

    expect(screen.getByText('Choose a Class')).toBeInTheDocument();
    expect(screen.queryByText('Customize')).not.toBeInTheDocument();
  });
});
