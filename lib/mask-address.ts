export function maskAddress(address: string, lengthToShow: number):string {
    const maskedStart = address.slice(0, lengthToShow);
    const maskedEnd = address.slice(-lengthToShow);
    return `${maskedStart}...${maskedEnd}`;
}