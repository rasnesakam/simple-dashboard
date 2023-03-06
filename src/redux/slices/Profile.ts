import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import storage from "redux-persist/lib/storage";
import {persistReducer} from "redux-persist";

export interface Profile {
	username: string | undefined,
	isPending: boolean,
	error: any,
	isAuthenticated: boolean,
	token: string
}

const initialState: Profile = {
	username: "",
	isPending: false,
	error: null,
	token: "",
	isAuthenticated: false
}

export const login = createAsyncThunk(
	"auth/login",
	async (req: any, thunkAPI:any) => {
		try {
			console.log("login request");
		}
		catch (e){
			console.log(e);
		}
	}
);

export const logout = createAsyncThunk(
	"auth/logout",
	async (req, thunkAPIGet) => {
		try {
			console.log("logout request");
		}
		catch (e){
			console.log(e);
		}
	}
);


const persistConfig = {
	key: "auth",
	storage,
	whitelist: ['Profile']
}
  

const ProfileSlice = createSlice({
	name: "Profile",
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.isPending = true;
				state.error = undefined;
			})
			.addCase(login.fulfilled,(state)=> {
				state.isPending = false;
				state.isAuthenticated = true;
				state.token = "TokenDoldu";
			})
			.addCase(login.rejected, (state, action) => {
				state.isPending = false;
				state.isAuthenticated = false;
				state.error = action.payload;
			})
			.addCase(logout.fulfilled, (state) => {
				state.isAuthenticated = false;
				console.log("infulfilled logout");
				state.token = "";
			})
	}
})

const persistedProfileReducer = persistReducer(persistConfig, ProfileSlice.reducer);

export default persistedProfileReducer;