let isStorybookEnv = false;

export function isStorybook(): boolean {
  return isStorybookEnv;
}

export function setStorybookEnv(value: boolean): void {
  isStorybookEnv = value;
}
