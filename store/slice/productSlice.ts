import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { ProductInitialState, ProductInCart } from "@/types/product";

const initialState: ProductInitialState = {
  productInCart: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addProductToOrder: (state, action: PayloadAction<ProductInCart>) => {
      const foundProduct = state.productInCart.filter(
        (product) => product.id === action.payload.id
      );
      if (foundProduct[0]) {
        return state;
      } else {
        // const tempState = [...state.productInCart,action.payload]
        // state.productInCart = tempState
        // return state
        return {
          productInCart: [...state.productInCart, action.payload],
        };
      }
    },

    removeProductFromOrder: (state, action: PayloadAction<number>) => {
      return {
        productInCart: state.productInCart.filter(
          (product) => product.id !== action.payload
        ),
      };
    },
    updateProductQuanty: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      return {
        productInCart:state.productInCart.map((product:ProductInCart) => {
            if (product.id === action.payload.id) {
              return {
                ...product,
                quantity: action.payload.quantity,
              };
            } else {
              return product;
            }
          })
      }
    },
  },
});

export const { addProductToOrder, removeProductFromOrder,updateProductQuanty } =
  productSlice.actions;

export default productSlice.reducer;
