import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import chatReducer from './slices/chatSlice';
import wishlistReducer from './slices/wishlistSlice';
import purchasesReducer from './slices/purchasesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        chat: chatReducer,
        wishlist: wishlistReducer,
        purchases: purchasesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});