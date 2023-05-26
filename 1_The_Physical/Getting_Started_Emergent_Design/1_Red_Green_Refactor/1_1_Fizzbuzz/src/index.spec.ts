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

  it('should throw an error when 102 is passed in as an argument', () => {
    expect(() => fizzBuzzChecker(102)).toThrowError(errorMessage);
  });

  it('should throw and error when -12 is passed in as an argument', () => {
    expect(() => fizzBuzzChecker(-12)).toThrowError(errorMessage);
  });

  it('should throw an error when 0 is passed as an argument', () => {
    expect(() => fizzBuzzChecker(0)).toThrowError(errorMessage);
  });

  it('should throw an error when 101 is passed as an argument', () => {
    expect(() => fizzBuzzChecker(101)).toThrowError(errorMessage);
  });

  it.each([
    [3, 'Fizz'],
    [9, 'Fizz'],
    [36, 'Fizz'],
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
