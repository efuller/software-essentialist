
function fizzBuzzChecker(num: number) {
  if (num > 100 || num < 1) {
    throw new Error('Number must be between 1 and 100');
  }

  if (num % 3 === 0 && num % 5 === 0) {
    return 'FizzBuzz';
  }

  if (num % 3 === 0) {
    return 'Fizz';
  }

  if (num % 5 === 0) {
    return 'Buzz';
  }

  return String(num);
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
    expect(() => fizzBuzzChecker(102)).toThrowError('Number must be between 1 and 100');
  });

  it('should throw and error when -12 is passed in as an argument', () => {
    expect(() => fizzBuzzChecker(-12)).toThrowError('Number must be between 1 and 100');
  });

  it('should throw an error when 0 is passed as an argument', () => {
    expect(() => fizzBuzzChecker(0)).toThrowError('Number must be between 1 and 100');
  });

  it('should throw an error when 101 is passed as an argument', () => {
    expect(() => fizzBuzzChecker(101)).toThrowError('Number must be between 1 and 100');
  });

  it('should return Fizz when given 3', () => {
    expect(fizzBuzzChecker(3)).toBe('Fizz');
  });

  it('should return Fizz when given 9', () => {
    expect(fizzBuzzChecker(9)).toBe('Fizz');
  });

  it.each([
    5,
    10,
    20,
  ])('should return "Buzz" when given %d', (param) => {
    expect(fizzBuzzChecker(param)).toBe('Buzz');
  })

  it.each([
    15,
    45,
    60,
  ])('should return "FizzBuzz" when given %d', (param) => {
    expect(fizzBuzzChecker(param)).toBe('FizzBuzz');
  })

  it.each([
    [43, '43'],
    [26, '26'],
    [13, '13']
  ])('should return "%s" when given %s', (param, expected) => {
    expect(fizzBuzzChecker(param)).toBe(expected);
  })
});
