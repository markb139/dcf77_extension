namespace dcf77 {
    const mult: number[] = [1, 2, 4, 8, 10, 20, 40, 80]

    function decodeNumber (bits: number[], offset: number, count: number) {
        let ret = 0
        for (let i = 0; i <= count; i++) {
            ret = ret + mult[i] * bits[i + offset]
        }
        return ret
    }

    /**
     * Decode the minute value
     * @param bits received
     */
    //% block
    export function decodeMinute (bits: number[]) {
        return decodeNumber(bits, 21, 6)
    }

    /**
     * Decode the hour value
     * @param bits received
     */
    //% block
    export function decodeHour (bits: number[]) {
       return decodeNumber(bits, 29, 5)
    }

    /**
     * Decode the day value
     * @param bits received
     */
    //% block
    export function decodeDay (bits: number[]) {
        return decodeNumber(bits, 36, 5)
    }

    /**
     * Decode the month value
     * @param bits received
     */
    //% block
    export function decodeMonth (bits: number[]) {
        return decodeNumber(bits, 45, 4)
    }

    /**
     * Decode the year value
     * @param bits received
     */
    //% block
    export function decodeYear (bits: number[]) {
        return decodeNumber(bits, 50, 7)
    }
    /**
     * Convert number to 0 padded string
     * @param n number to convert
     */
    //% block
    export function convert(n: number): string {
        if(n < 10) {
            return "0" + convertToText(n)
        }
        else {
            return convertToText(n)
        }
    }
}
