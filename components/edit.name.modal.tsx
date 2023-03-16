import { useEffect } from "react";
import styles from "../styles/Modal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setCloseName } from "@/store/slice/modalSlice";
import {
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  TextField,
  Button
} from "@mui/material";
import { RootState } from "@/store/store";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { baseUrl } from "@/baseUrl";
import { useSWRConfig } from "swr";


type Inputs = {
  country:string,
  city:string,
  position:string,
};

type Profile ={
  profile:Inputs
}

export default function EditName({profile}:Profile) {
  const { mutate } = useSWRConfig();
  const open = useSelector((state:RootState)=>state.modal.openName)
  const id = useSelector((state:RootState)=>state.session.id)
  const dispatch = useDispatch() 
  
  const {
    register,
    handleSubmit,
    formState: { errors},
    reset,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
      await axios
        .patch(`${baseUrl}/candidates/profile/${id}`, data)
        .then((res) => {
        });
      await mutate(`${baseUrl}/candidates/${id}`);
  };
  useEffect(()=>{
    reset({
        country:profile.country,
        city:profile.city,
        position:profile.position,
    })
  },[open])

  return (
      <Dialog open={open} onClose={()=>dispatch(setCloseName())} className={styles.container}>
        <DialogTitle>edit name</DialogTitle>
        <DialogContent className={styles.content} >
          <DialogContentText >
            Are you sure you want to edit?
          </DialogContentText>
          <TextField
          className={styles.input}
            autoFocus
            margin="dense"
            id="name"
            label="position"
            type="text"
            size="small"
            defaultValue={profile.position}
          {...register("position")}
          />
          <TextField
          className={styles.input}
            autoFocus
            margin="dense"
            id="name"
            label="country"
            type="text"
            size="small"
            defaultValue={profile.country}
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
          defaultValue={profile.city}
          {...register("city")}
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>dispatch(setCloseName())} className={styles.btn}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)}className={styles.btn} >update</Button>
        </DialogActions>
      </Dialog>
  );
}
