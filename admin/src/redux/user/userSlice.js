

import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    currentUser:null,
    error:null,
    loading:false
}


const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{

        signInStart:(state,action) => {

            state.loading = true

            state.error = null 
        },

        signInSuccess:(state,action) => {

            state.loading = false

            state.error = error

            state.currentUser = action.payload

        },

        signInFailure:(state,action) => {

            state.loading = false

            state.error = action.payload
        },

        updateUserStart:(state) => {

            state.loading = true

            state.error = null
        },

        updateUserSuccess:(action,state) => {

            state.loading = false

            state.error = null

            state.currentUser = action.payload

        },

        updateUserFailure:(state,action) => {

            state.loading = false 

            state.error = action.payload
        },

        deleteUserSuccess:(state,action) => {

            state.currentUser = null 

            state.error = null
        },

        deleteUserFailure:(state,action) => {

            state.error = action.payload

            state.currentUser = null
        },

        signOutSuccess:(state) => {

            state.currentUser = null

        }

    }
})


export const {
    signInStart,signInSuccess,signInFailure,
    updateUserStart,updateUserSuccess,updateUserFailure,
    deleteUserSuccess,deleteUserFailure,
    signOutSuccess
} = 
userSlice.actions

export default userSlice.reducer