import { createSlice } from '@reduxjs/toolkit';
import { USERS } from '../../utils/mockData';

const storedUser = localStorage.getItem('inventory_user');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedUser,
  },
  reducers: {
    login(state, action) {
      const { username, password } = action.payload;
      const user = USERS.find(u => u.username === username && u.password === password);
      if (!user) throw new Error('Invalid credentials');
      const { password: _, ...safeUser } = user;
      state.user = safeUser;
      state.isAuthenticated = true;
      localStorage.setItem('inventory_user', JSON.stringify(safeUser));
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('inventory_user');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
