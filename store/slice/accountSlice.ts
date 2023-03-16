import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AccountType {
  accountType: string
}

const initialState: AccountType = {
  accountType: "candidate",
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccountType: (state,action: PayloadAction<string>) => {
      return{
        accountType:action.payload
      }
    },
   
  },
})

// Action creators are generated for each case reducer function
export const { setAccountType } = accountSlice.actions

export default accountSlice.reducer