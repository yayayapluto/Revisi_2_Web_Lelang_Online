export const DateFormatter = (value: string | number | Date, toUTC: boolean = true) => {
    return toUTC ? new Date(value).toUTCString() : new Date(value).toLocaleDateString()
}