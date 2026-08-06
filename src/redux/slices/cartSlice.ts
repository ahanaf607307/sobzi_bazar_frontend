import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/types';

interface CartState {
  itemsCount: number;
  isCartDrawerOpen: boolean;
}

const initialState: CartState = {
  itemsCount: 0,
  isCartDrawerOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartCount: (state, action: PayloadAction<number>) => {
      state.itemsCount = action.payload;
    },
    toggleCartDrawer: (state, action: PayloadAction<boolean | undefined>) => {
      if (typeof action.payload === 'boolean') {
        state.isCartDrawerOpen = action.payload;
      } else {
        state.isCartDrawerOpen = !state.isCartDrawerOpen;
      }
    },
  },
});

export const { setCartCount, toggleCartDrawer } = cartSlice.actions;
export default cartSlice.reducer;
