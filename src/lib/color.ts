export class Color {
    constructor(public r: number, public g: number, public b: number) {
    }

    toHexString(): string {
        const hex = (v: number) => Math.round(v).toString(16).padStart(2, "0");
        return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}ff`
    }
}


export function lerp(a: number, b: number, progress: number): number;
export function lerp(a: Color, b: Color, progress: number): Color;
export function lerp(a: number|Color, b: number|Color, progress: number): number|Color {
    if (progress < 0) {
        return a;
    } else if (progress > 1) {
        return b;
    } else {
        if (a instanceof Color && b instanceof Color) {
            return new Color(
                lerp(a.r, b.r, progress),
                lerp(a.g, b.g, progress),
                lerp(a.b, b.b, progress),
            )
        } else if (typeof a === "number" && typeof b === "number") {
            return a * (1 - progress) + b * progress;
        } else {
            throw new TypeError("lerp: a and b must both be numbers or both be Colors")
        }
    }
}

export function styleFromDistance(distance: number, maxDistance: number): string {
    const progressPercentage = distance == 0 ? 1 : Math.abs(distance) >= maxDistance ? 0 : 1 - Math.log(Math.abs(distance)) / Math.log(maxDistance);

    const backgroundColor = (() => {
        const [red, yellow, green] = ["var(--color-error)", "var(--color-warning)", "var(--color-success)"]
        if (progressPercentage === 1) {
            return green
        } else if (progressPercentage === 0) {
            return red
        }
        const [color1, color2] = progressPercentage <= 0.5 ? [red, yellow] : [yellow, green]
        const colorProgress = (progressPercentage <= 0.5 ? progressPercentage : progressPercentage - 0.5) * 2
        return [`color-mix(in oklab, ${color2} ${colorProgress * 100}%, ${color1})`, progressPercentage]
    })();
    return `background-image: linear-gradient(${backgroundColor}, ${backgroundColor}); ` +
        `background-repeat: no-repeat; ` +
        `background-position: left; ` +
        `--bar: max(${progressPercentage * 100}%, 8px); background-size: var(--bar) 100%; ` +
        `animation: grow-bar 0.6s ease-out;`
}