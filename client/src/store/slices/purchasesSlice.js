import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchMyPurchases = createAsyncThunk('purchases/fetchMy', async () => {
    const res = await fetch('/api/purchases/my', { credentials: 'include' });
    return res.json();
});

export const buyItem = createAsyncThunk('purchases/buy', async ({ listing_id, is_public }) => {
    const res = await fetch('/api/purchases/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ listing_id, is_public })
    });
    return res.json();
});

const purchasesSlice = createSlice({
    name: 'purchases',
    initialState: { items: [], loading: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyPurchases.pending, (state) => { state.loading = true; })
            .addCase(fetchMyPurchases.fulfilled, (state, action) => {
                state.items = Array.isArray(action.payload) ? action.payload : [];
                state.loading = false;
            });
    }
});

export default purchasesSlice.reducer;