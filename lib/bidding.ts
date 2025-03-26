export function getNextBidPrice(currentBid: number): number {
  // More comprehensive tiers that scale better
  if (currentBid < 10) return currentBid + 1;
  if (currentBid < 50) return currentBid + 2;
  if (currentBid < 100) return currentBid + 5;
  if (currentBid < 200) return currentBid + 10;
  if (currentBid < 500) return currentBid + 25;
  if (currentBid < 1000) return currentBid + 50;
  if (currentBid < 5000) return currentBid + 100;
  if (currentBid < 10000) return currentBid + 250;
  return currentBid + Math.ceil(currentBid * 0.025); // 2.5% for very high bids
}
