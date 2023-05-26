import { fizzBuzzChecker } from './fizzbuzz';

describe("fizzbuzz", () => {
  const errorMessage = 'Number must be between 1 and 100';

  it('should know that fizzBuzzChecker exists', () => {
    expect(fizzBuzzChecker).toBeDefined();
  });

  it('should return a string', () => {
    const result = fizzBuzzChecker(25);

    expect(typeof result).toBe('string');
  });

  it.each([
    102,
    -12,
    0,
    101
  ])('should throw an Error when given %d', (param) => {
    expect(() => fizzBuzzChecker(param)).toThrowError(errorMessage);
  })

  it.each([
    [3, 'Fizz'],
    [9, 'Fizz'],
    [42, 'Fizz'],
    [5, 'Buzz'],
    [10, 'Buzz'],
    [20, 'Buzz'],
    [15, 'FizzBuzz'],
    [45, 'FizzBuzz'],
    [60, 'FizzBuzz'],
    [43, '43'],
    [26, '26'],
    [13, '13'],
  ])('when given %d should return %s', (param, expected) => {
    expect(fizzBuzzChecker(param)).toBe(expected);
  })
});
