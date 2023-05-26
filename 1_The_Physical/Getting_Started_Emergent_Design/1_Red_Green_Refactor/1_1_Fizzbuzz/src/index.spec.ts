
function fizzBuzzChecker(num: number) {
  if (num > 100) {
    throw new Error('Number cannot exceed 100.');
  }

  if (num < 1) {
    throw new Error();
  }

  if (num % 3 === 0) {
    return 'Fizz';
  }

  if (num % 5 === 0) {
    return 'Buzz';
  }

  return '';
}

describe("fizzbuzz", () => {
  it('should know that fizzBuzzChecker exists', () => {
    expect(fizzBuzzChecker).toBeDefined();
  });

  it('should return a string', () => {
    const result = fizzBuzzChecker(25);

    expect(typeof result).toBe('string');
  });

  it('should throw an error when 102 is passed in as an argument', () => {
    expect(() => fizzBuzzChecker(102)).toThrowError();
  });

  it('should throw and error when -12 is passed in as an argument', () => {
    expect(() => fizzBuzzChecker(-12)).toThrowError();
  });

  it('should throw an error when 0 is passed as an argument', () => {
    expect(() => fizzBuzzChecker(0)).toThrowError();
  });

  it('should throw an error when 101 is passed as an argument', () => {
    expect(() => fizzBuzzChecker(101)).toThrowError();
  });

  it('should return Fizz when given 3', () => {
    expect(fizzBuzzChecker(3)).toBe('Fizz');
  });

  it('should return Fizz when given 9', () => {
    expect(fizzBuzzChecker(9)).toBe('Fizz');
  });

  it('should return Buzz when given 5', () => {
    expect(fizzBuzzChecker(5)).toBe('Buzz');
  });

  it('should return Buzz when given 10', () => {
    expect(fizzBuzzChecker(10)).toBe('Buzz');
  });

  it('should return FizzBuzz when given 15', () => {
    expect(fizzBuzzChecker(15)).toBe('FizzBuzz');
  });
});
