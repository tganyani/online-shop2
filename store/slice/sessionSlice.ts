import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SessionType {
  email: string,
  access_token:string,
  id:number | null
}

const initialState:SessionType = {
    email:"",
    access_token:"",
    id:null
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state,action: PayloadAction<SessionType>) => {
      return{
        email:action.payload.email,
        access_token: action.payload.access_token,
        id:action.payload.id
      }
    },
    removeSession:(state)=>{
        return {
            email:"",
            access_token:"",
            id:null
        }
    }
   
  },
})

// Action creators are generated for each case reducer function
export const { setSession,removeSession } = sessionSlice.actions

export default sessionSlice.reducer