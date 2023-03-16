import { createSlice } from "@reduxjs/toolkit";

export type OpenType = {
  openName: boolean;
  openEdu: boolean;
  openPrevPos: boolean;
  openSkill: boolean;
  openProject:boolean;
  openContact:boolean;
  openApply:boolean;
  openImage:boolean;
  openAbout:boolean
};

const initialState: OpenType = {
  openName: false,
  openEdu: false,
  openPrevPos: false,
  openSkill:false,
  openProject:false,
  openContact:false,
  openApply:false,
  openImage:false,
  openAbout:false
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setOpenName: (state) => {
      state.openName = true;
    },
    setCloseName: (state) => {
      state.openName = false;
    },
    setOpenEdu: (state) => {
      state.openEdu = true;
    },
    setCloseEdu: (state) => {
      state.openEdu = false;
    },
    setOpenPrevPos: (state) => {
      state.openPrevPos = true;
    },
    setClosePrevPos: (state) => {
      state.openPrevPos = false;
    },
    setOpenSkill: (state) => {
      state.openSkill = true;
    },
    setCloseSkill: (state) => {
      state.openSkill = false;
    },
    setOpenProject: (state) => {
      state.openProject = true;
    },
    setCloseProject: (state) => {
      state.openProject = false;
    },
    setOpenContact: (state) => {
      state.openContact = true;
    },
    setCloseContact: (state) => {
      state.openContact = false;
    },
    setOpenApply: (state) => {
      state.openApply = true;
    },
    setCloseApply: (state) => {
      state.openApply = false;
    },
    setOpenImage: (state) => {
      state.openImage = true;
    },
    setCloseImage: (state) => {
      state.openImage = false;
    },
    setOpenAbout: (state) => {
      state.openAbout = true;
    },
    setCloseAbout: (state) => {
      state.openAbout = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setOpenName,
  setCloseName,
  setCloseEdu,
  setOpenEdu,
  setClosePrevPos,
  setOpenPrevPos,
  setCloseSkill,
  setOpenSkill,
  setOpenProject,
  setCloseProject,
  setCloseContact,
  setOpenContact,
  setOpenApply,
  setCloseApply,
  setCloseImage,
  setOpenImage,
  setCloseAbout,
  setOpenAbout,
} = modalSlice.actions;

export default modalSlice.reducer;
