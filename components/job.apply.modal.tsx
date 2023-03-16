import { useState } from "react";
import { useSWRConfig } from "swr";
import styles from "../styles/Modal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";


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
import { setCloseApply } from "@/store/slice/modalSlice";
import useSWR from "swr";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from '@mui/icons-material/Clear';

type Inputs = {
    message:string
};

interface JobApplyProp {
    jobId:number,
    recruiter:{
      id:number
      email: string
    }
}

interface Letter {
  id:number
  message:string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const socket = io(`${baseUrl}`)

export default function JobApply({jobId, recruiter}:JobApplyProp) {
  const accountType  = useSelector((state: RootState)=>state.account.accountType)
  const { mutate } = useSWRConfig();
  const [openPrevDiv,setOpenPrevDiv] = useState<boolean>(false)
  const open = useSelector((state: RootState) => state.modal.openApply);
  const id = useSelector((state: RootState) => state.session.id);
  const email = useSelector((state:RootState)=>state.session.email)
  const roomName =
  email< recruiter?.email
    ? "".concat(email, recruiter?.email)
    : "".concat(recruiter?.email, email);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors},
    reset,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
      await axios
        .patch(`${baseUrl}/vaccancy/connect/${jobId}`, {...data,id})
        .then((res) => {
            alert(res.data.message)
        });
      await socket.emit("createRoom",{candidateId:id,recruiterId:recruiter.id,name:roomName,message:data.message,accountType})
  };
  const { data, error } = useSWR(`${baseUrl}/vaccancy/letters/${id}`, fetcher);

  const handleDeleteLetter = async (letterId:number)=>{
    await axios.delete(`${baseUrl}/vaccancy/letters/${letterId}`)
          .catch(err=>{
            console.error(err)
          })
    await mutate(`${baseUrl}/vaccancy/letters/${id}`)
  }
 
  return (
    <Dialog
      open={open}
      onClose={() => dispatch(setCloseApply())}
      className={styles.container}
      maxWidth='sm'
      fullWidth={true}
    >
      <DialogTitle>apply for a job</DialogTitle>
      <DialogContent className={styles.content} style={{padding:"5px"}}>
        <DialogContentText>
         Are you sure you want to apply?
        </DialogContentText>
        <TextField
          className={styles.inputAppy}
          autoFocus
          margin="dense"
          id="name"
          label="letter"
          type="text"
          size="small"
          multiline
          rows={5}
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="write something to the recruiter"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span style={{ color: "red", width: "100%" }}>
            This field is required
          </span>
        )}
        <div className={styles.prevLetter}>
            <Button  className={styles.btn} onClick={()=>setOpenPrevDiv(!openPrevDiv)}>
                insert previous letter
             </Button>
            <div className={openPrevDiv?styles.letter:styles.closeLetter}>
              {
                (data?.length===0)&&<div>You don't have previous letters yet!</div>
              }
              {
                error&&<div>Error fetching data</div>
              }
              {
                !data&&(<div>Loadind.......!</div>)
              }
              {
                
                data&&(data.map((item:Letter)=>(
                  <div key={item.id} className={styles.card}>
                    <AddIcon className={styles.add} onClick={()=>{
                      reset({message:item.message})
                      setOpenPrevDiv(false)
                      }}/>
                    <ClearIcon className={styles.clear} onClick={()=>handleDeleteLetter(item.id)}/>
                    {item.message}
                  </div>
                )))
              }
            </div>
      </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            dispatch(setCloseApply());
          }}
          className={styles.btn}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} className={styles.btn}>
          apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}