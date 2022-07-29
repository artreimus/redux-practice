// Unit test
// The goal of testing should not be to test implementation, but should be to test the behavior of the system

// Solitary Test: testing of the actions, reducers, middleware
// Coupled to implementation, breaks often, slows us down, not reliable

// Social test:
//  Less fragile, cheaper, more reliable

import { isEven } from "./math";

describe("isEven", () => {
  test("should return true if given an ever number", () => {
    // Function under test or system under test
    const result = isEven(4);
    //   Assertion .toEqual is the matcher
    expect(result).toEqual(true);
  });

  test("should return false if given an odd number", () => {
    const result = isEven(5);
    expect(result).toEqual(false);
  });
});
