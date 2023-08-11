export function uuidToUint256(uuidString: string | undefined): number | undefined {

    if(!uuidString) return undefined;

  const bytes = Buffer.from(uuidString.replace(/-/g, ''), 'hex');
  let numericalValue = BigInt(0);

  for (let i = 0; i < bytes.length; i++) {
    numericalValue = numericalValue * BigInt(256) + BigInt(bytes[i]);
  }

  const uint256Max = BigInt(
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  );
  const tokenId = numericalValue % uint256Max;

  return Number(tokenId);
}
