import { useSWRConfig } from "swr";
import styles from "../styles/Modal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setCloseContact} from "@/store/slice/modalSlice";
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

type Inputs = {
    email:string
    phone: string;
};

type Props = {
  contacts: Inputs;
};

export default function EditContacts({ contacts}: Props) {
  const { mutate } = useSWRConfig();
  const open = useSelector((state: RootState) => state.modal.openContact);
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
        .patch(`${baseUrl}/candidates/contacts/${id}`, data)
        .then((res) => {
        });
      await mutate(`${baseUrl}/candidates/${id}`);
  };

  useEffect(()=>{
    reset({
        phone:contacts.phone,
        email:contacts.email,
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
          label="email"
          type="text"
          size="small"
          defaultValue={contacts.email}
          {...register("email")}
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