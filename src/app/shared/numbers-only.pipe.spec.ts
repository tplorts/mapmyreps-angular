import { NumbersOnlyPipe } from './numbers-only.pipe';

describe('NumbersOnlyPipe', () => {
  it('create an instance', () => {
    const pipe = new NumbersOnlyPipe();
    expect(pipe).toBeTruthy();
  });
});
