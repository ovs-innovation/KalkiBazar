import { useEffect, useMemo, useState } from "react";

import {
  addToWishlist,
  getWishlistItems,
  removeFromWishlist,
  subscribeWishlist,
} from "@lib/wishlist";

export default function useWishlist() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getWishlistItems());
    return subscribeWishlist(() => setItems(getWishlistItems()));
  }, []);

  const count = items?.length || 0;

  return useMemo(
    () => ({
      items,
      count,
      add: addToWishlist,
      remove: removeFromWishlist,
    }),
    [items, count]
  );
}


