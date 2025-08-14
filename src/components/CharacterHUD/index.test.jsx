/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CharacterHUD, { LOW_HP_THRESHOLD } from './index.jsx';
import styles from './index.module.css';

describe('CharacterHUD', () => {
  it('applies casting and progress classes', () => {
    render(<CharacterHUD isCasting castPercent={50} hp={10} maxHp={10} effects={[]} />);
    const hud = screen.getByTestId('hud');
    expect(hud).toHaveClass(styles.casting);
    expect(hud).toHaveClass(styles.castProgress);
  });

  it('applies cast complete class when castPercent is 100', () => {
    render(<CharacterHUD isCasting castPercent={100} hp={10} maxHp={10} effects={[]} />);
    const hud = screen.getByTestId('hud');
    expect(hud).toHaveClass(styles.castComplete);
  });

  it('applies low hp class when below threshold', () => {
    const maxHp = 10;
    const hp = Math.floor(maxHp * LOW_HP_THRESHOLD) - 1;
    render(<CharacterHUD hp={hp} maxHp={maxHp} />);
    const hud = screen.getByTestId('hud');
    expect(hud).toHaveClass(styles.lowHp);
  });

  it('applies effect classes based on effects array', () => {
    render(<CharacterHUD effects={['poisoned', 'burning']} />);
    const hud = screen.getByTestId('hud');
    expect(hud).toHaveClass(styles.effectPoisoned);
    expect(hud).toHaveClass(styles.effectBurning);
  });
});
