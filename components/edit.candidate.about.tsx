import { useSWRConfig } from "swr";
import styles from "../styles/Modal.module.scss";
import { useDispatch, useSelector } from "react-redux";

import {
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { RootState } from "@/store/store";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { baseUrl } from "@/baseUrl";
import { useEffect } from "react";
import { setCloseAbout } from "@/store/slice/modalSlice";

type Inputs = {
    about:string
};



export default function EditCandateAbout({ about}: Inputs) {
  const { mutate } = useSWRConfig();
  const open = useSelector((state: RootState) => state.modal.openAbout);
  const id = useSelector((state: RootState) => state.session.id);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors},
    reset,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
      await axios
        .patch(`${baseUrl}/candidates/about/${id}`, data)
        .then((res) => {
        });
      await mutate(`${baseUrl}/candidates/${id}`);
  };
  useEffect(()=>{
    reset({
        about
    })
  },[open])

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(setCloseAbout())}
      className={styles.container}
    >
      <DialogTitle>about</DialogTitle>
      <DialogContent className={styles.content}>
        <DialogContentText>
         Are you sure you want to edit?
        </DialogContentText>
        <TextField
          className={styles.input}
          autoFocus
          margin="dense"
          id="name"
          label="about"
          type="text"
          size="small"
          multiline
          defaultValue={about}
          {...register("about")}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            dispatch(setCloseAbout());
          }}
          className={styles.btn}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} className={styles.btn}>
          update
        </Button>
      </DialogActions>
    </Dialog>
  );
}