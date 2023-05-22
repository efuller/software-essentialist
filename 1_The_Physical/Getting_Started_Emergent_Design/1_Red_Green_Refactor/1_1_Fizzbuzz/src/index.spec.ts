
function fizzBuzzChecker(num: number) {
  if (num > 100) {
    throw new Error('Number cannot exceed 100.');
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

  it('should throw an error when 101 is passed in as an argument', () => {
    expect(() => fizzBuzzChecker(101)).toThrowError();
  })
});
