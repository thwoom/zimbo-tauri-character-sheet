export const parseXp = (text: string): number => {
  const match = /XP: (\d+)/.exec(text);
  return match ? Number(match[1]) : 0;
};

export const xpSelector = 'div*=XP:';
export const xpButtonSelector = 'button=+1 XP';
