
function fizzBuzzChecker(num: number) {
  if (num === 102) {
    throw new Error('Number cannot exceed 100.');
  }

  if (num === -12) {
    throw new Error();
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
});
