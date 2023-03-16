import { useSWRConfig } from "swr";
import styles from "../../styles/Modal.module.scss";
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
import { setCloseContact } from "@/store/slice/modalSlice";

type Inputs = {
    phone:string,
    linkedIn:string,
    website:string,
    telegram:string,
};

type Contant ={
    contacts:Inputs
}



export default function EditRecruiterContact({ contacts}: Contant) {
  const { mutate } = useSWRConfig();
  const open = useSelector((state: RootState) => state.recruiterModal.openContact);
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
        .patch(`${baseUrl}/recruiters/contacts/${id}`, data)
        .then((res) => {
        });
      await mutate(`${baseUrl}/recruiters/${id}`);
  };
  useEffect(()=>{
    reset({
        phone:contacts.phone,
        telegram:contacts.telegram,
        linkedIn:contacts.linkedIn,
        website:contacts.website
    })
  },[open])

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(setCloseContact())}
      className={styles.container}
    >
      <DialogTitle>contacts</DialogTitle>
      <DialogContent className={styles.content}>
        <DialogContentText>
         Are you sure you want to edit?
        </DialogContentText>
        <TextField
          className={styles.input}
          autoFocus
          margin="dense"
          id="name"
          label="website"
          type="text"
          size="small"
          defaultValue={contacts.website}
          {...register("website")}
        />
         <TextField
          className={styles.input}
          autoFocus
          margin="dense"
          id="name"
          label="telegram"
          type="text"
          size="small"
          defaultValue={contacts.telegram}
          {...register("telegram")}
        />
         <TextField
          className={styles.input}
          autoFocus
          margin="dense"
          id="name"
          label="linkedIn"
          type="text"
          size="small"
          defaultValue={contacts.linkedIn}
          {...register("linkedIn")}
        />
         <TextField
          className={styles.input}
          autoFocus
          margin="dense"
          id="name"
          label="phone"
          type="text"
          size="small"
          defaultValue={contacts.phone}
          {...register("phone")}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            dispatch(setCloseContact());
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