
function fizzBuzzChecker() {}

describe("fizzbuzz", () => {
  it('should know that fizzBuzzChecker exists', () => {
    expect(fizzBuzzChecker).toBeDefined();
  });

  it('should return a string', () => {
    const result = fizzBuzzChecker();

    expect(typeof result).toBe('string');
  });
});
