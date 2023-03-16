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
import { setCloseAddress } from "@/store/slice/recruiterModalSlice";

type Inputs = {
    country:string,
    city:string,
    street:string,
};

type Address ={
    address:Inputs
}



export default function EditRecruiterAddress({ address}: Address) {
  const { mutate } = useSWRConfig();
  const open = useSelector((state: RootState) => state.recruiterModal.openAddress);
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
        .patch(`${baseUrl}/recruiters/address/${id}`, data)
        .then((res) => {
        });
      await mutate(`${baseUrl}/recruiters/${id}`);
  };
  useEffect(()=>{
    reset({
        country:address.country,
        city:address.city,
        street:address.street,
    })
  },[open])

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(setCloseAddress())}
      className={styles.container}
    >
      <DialogTitle>address</DialogTitle>
      <DialogContent className={styles.content}>
        <DialogContentText>
         Are you sure you want to edit?
        </DialogContentText>
        <TextField
          className={styles.input}
          autoFocus
          margin="dense"
          id="name"
          label="country"
          type="text"
          size="small"
          defaultValue={address.country}
          {...register("country")}
        />
         <TextField
          className={styles.input}
          autoFocus
          margin="dense"
          id="name"
          label="city"
          type="text"
          size="small"
          defaultValue={address.city}
          {...register("city")}
        />
         <TextField
          className={styles.input}
          autoFocus
          margin="dense"
          id="name"
          label="street"
          type="text"
          size="small"
          defaultValue={address.street}
          {...register("street")}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            dispatch(setCloseAddress());
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