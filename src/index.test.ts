import { expect, describe, it } from 'bun:test';
import { add } from './index';

describe('add', () => {
  it('adds two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
