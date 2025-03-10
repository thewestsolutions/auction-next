import useSocket from "./useSocket";

export const useBid = () => {
  const { emit, on } = useSocket();

  const placeBid = (itemId: string, price: number) => {
    emit("bid.place", { itemId, price, timestamp: Date.now() });
  };

  const onBidUpdate = (itemId: string, handler: (price: number) => void) => {
    on<{ itemId: string; price: number }>("bid.update", (data) => {
      if (data.itemId === itemId) {
        handler(data.price);
      }
    });
  };

  return { placeBid, onBidUpdate };
};
