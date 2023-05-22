
function fizzBuzzChecker() {
  return '';
}

describe("fizzbuzz", () => {
  it('should know that fizzBuzzChecker exists', () => {
    expect(fizzBuzzChecker).toBeDefined();
  });

  it('should return a string', () => {
    const result = fizzBuzzChecker();

    expect(typeof result).toBe('string');
  });

  it.only('should throw an error when 101 is passed in as an argument', () => {
    expect(fizzBuzzChecker(101)).toThrow();
  })
});
