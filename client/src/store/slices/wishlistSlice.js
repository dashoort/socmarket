import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async () => {
    const res = await fetch('/api/wishlist/my', { credentials: 'include' });
    return res.json();
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (listing_id) => {
    const res = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ listing_id })
    });
    return res.json();
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (listing_id) => {
    await fetch(`/api/wishlist/remove/${listing_id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    return listing_id;
});

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: { items: [], loading: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => { state.loading = true; })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.items = Array.isArray(action.payload) ? action.payload : [];
                state.loading = false;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    }
});

export default wishlistSlice.reducer;