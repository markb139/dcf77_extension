namespace dcf77 {
    const mult: number[] = [1, 2, 4, 8, 10, 20, 40, 80]
    let inputPin = DigitalPin.P0
    let second = 0
    let minute = 0
    let hour = 0
    let day = 0
    let month = 0
    let year = 0
    let sync: boolean = false
    let bits: number[] = []
    let iTickHandler: (t: TickInfo)=> void = null

    function decodeNumber (bits: number[], offset: number, count: number): number {
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
    export function decodeMinute (bits: number[]): number {
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
    /**
     * Start the decoder
     */
    //% block
    export function start(){
        pins.digitalWritePin(DigitalPin.P2, 0)
    }
    /**
     * Stop the decoder
     */
    //% block
    export function stop(){
        pins.digitalWritePin(DigitalPin.P2, 1)
    }
    /**
     * intitialise the decoder
     * @param pin Digitial pin connected to real time clock
     */
    //% block
    export function intitialise(pin: DigitalPin){
        inputPin = pin
    }
    
    export class TickInfo {
        constructor() {
            this.year = 0
            this.month = 0
            this.day = 0
            this.hour = 0
            this.minute = 0
            this.second = 0
            this.sync = false
            this.new_minute = false
        }
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
        sync: boolean;
        new_minute: boolean
    }
    /**
     * on tick
     * @param pin Digitial pin connected to real time clock
     */
    //% block
    export function addTickHanlder(tickHandler: (t: TickInfo)=> void) {
        iTickHandler = tickHandler
    }
    
    pins.onPulsed(inputPin, PulseValue.High, function () {
        let t: TickInfo
        t = new TickInfo
        second += 1
        if (second == 60) {
            second = 0
        }
        t.second = second
        
        if (pins.pulseDuration() > 1750000 && pins.pulseDuration() < 2250000) {
            second = 0
            if (bits.length == 59) {
                year = 2000 + dcf77.decodeYear(bits)
                month = dcf77.decodeMonth(bits)
                day = dcf77.decodeDay(bits)
                minute = dcf77.decodeMinute(bits)
                hour = dcf77.decodeHour(bits)
                t.year = year
                t.month = month
                t.day = day
                t.hour = hour
                t.minute = minute
                t.second = second
                bits = []
                t.sync = true
                t.new_minute = true
            } else {
                serial.writeNumber(bits.length)
                t.new_minute = true
                bits = []
            }
        }
        if (iTickHandler) {
            iTickHandler(t)
        }
    })
    pins.onPulsed(inputPin, PulseValue.Low, function () {
    if (pins.pulseDuration() > 75000 && pins.pulseDuration() < 125000) {
        bits.push(0)
    }
    if (pins.pulseDuration() > 125000 && pins.pulseDuration() < 225000) {
        bits.push(1)
    }
})

}
