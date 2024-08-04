import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartType } from '../types/cart.type';


type CartActionType =
    | { type: 'ADD_CARTS'; carts: CartType[] }
    | { type: 'ADD_TO_CART'; carts: CartType }
    | { type: 'REMOVE_FROM_CART'; productId: number }
    | { type: 'CLEAR_CART' };

const CartContext = createContext<{
    state: CartType[];
    dispatch: React.Dispatch<CartActionType>;
} | undefined>(undefined);

const cartReducer = (state: CartType[], action: CartActionType): CartType[] => {
    switch (action.type) {
        case 'ADD_CARTS': {
            return action?.carts
        }
        case 'ADD_TO_CART': {
            const existingCartItem = state?.find(item => item.id === action.carts?.id);
            if (existingCartItem) {
                return state.map(item =>
                    item.id === action?.carts?.id
                        ? { ...item, quantity: action?.carts?.quantity }
                        : item
                )
            }
            return [...state, {...action?.carts}];
        }
        case 'REMOVE_FROM_CART': {
            const newData = state.filter(item => item?.id !== action?.productId)
            return newData;
        }
        case 'CLEAR_CART': {
            return [];
        }
        default:
            return state;
    }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(cartReducer, []);

    return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
