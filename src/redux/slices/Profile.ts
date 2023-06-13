
import {createAsyncThunk, createSlice,  PayloadAction} from "@reduxjs/toolkit";

import storage from "redux-persist/lib/storage";
import {persistReducer} from "redux-persist";

export interface Profile {
	id: string | undefined,
	username: string | undefined,
	isPending: boolean,
	error: any,
	isAuthenticated: boolean,
	token: string
}

const initialState: Profile = {
	id: "",
	username: "",
	isPending: false,
	error: null,
	token: "",
	isAuthenticated: false
}

export const login = createAsyncThunk(
	"auth/login",
	async (req: Profile, thunkAPI:any) => {
		let profile: Profile = {
			id: req.id,
			username: req.username,
			isAuthenticated: true,
			token: req.token,
			isPending: false,
			error: ""
		}
		return profile;
	}
);

export const logout = createAsyncThunk(
	"auth/logout",
	async (req: null, thunkAPI: any) => {
		let profile: Profile = {
			id: "",
			username: "",
			isAuthenticated: false,
			token: "",
			isPending: false,
			error: ""
		}
		return profile;
	}
);


const persistConfig = {
	key: "auth",
	storage,
	version: 1
}
  

const ProfileSlice = createSlice({
	name: "Profile",
	initialState,
	reducers: {
		setProfile: (s, action:PayloadAction<Profile> ) => {
			s.token = action.payload.token
			s.isPending = action.payload.isPending
			s.error = action.payload.error
			s.isAuthenticated = action.payload.isAuthenticated
			s.username = action.payload.username
			return s;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.isPending = true;
				state.error = undefined;
			})
			.addCase(login.fulfilled,(state, action)=> {
				state.isPending = false;
				state.id = action.payload.id;
				state.username = action.payload.username;
				state.error = action.payload.error;
				state.isAuthenticated = true;
				state.token = action.payload.token;
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

ProfileSlice.reducer

export const profileReducer = ProfileSlice.reducer;

export const {setProfile} = ProfileSlice.actions

const persistedProfileReducer = persistReducer(persistConfig, ProfileSlice.reducer);

export default persistedProfileReducer;