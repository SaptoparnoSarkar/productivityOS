import { getGreetings } from "./utils";
import { describe, expect, it } from "vitest";

describe('getGreetings', () => {
    it('should return "Good Morning, did you get your coffee?" when hour is 5', () => {
        expect(getGreetings(5)).toBe("Good Morning, did you get your coffee?");
    })

    it('should return "Good Afternoon, hope you had a good lunch" when hour is 13', () => {
        expect(getGreetings(13)).toBe("Good Afternoon, hope you had a good lunch");
    })

    it('should return "Good Evening, winding down?" when hour is 20', () => {
        expect(getGreetings(20)).toBe("Good Evening, winding down?");
    })

    it('should return "Night owl? Let\'s get some stuff done" when hour is 23', () => {
        expect(getGreetings(23)).toBe("Night owl? Let's get some stuff done");
    })

    it('should return "You have done enough, now go get some rest" when hour is 2', () => {
        expect(getGreetings(2)).toBe("You have done enough, now go get some rest");
    })
})

