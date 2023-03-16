import { useSWRConfig } from "swr";
import styles from "../styles/Modal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setCloseSkill } from "@/store/slice/modalSlice";
import ClearIcon from '@mui/icons-material/Clear';
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

interface Inputs {
    experience: number;
    title: string;
}

interface SKill extends Inputs {
    id:number
}

interface Props {
    skills:SKill[];
}

export default function EditSkill({skills}:Props) {
  const { mutate } = useSWRConfig();
  const open = useSelector((state:RootState)=>state.modal.openSkill)
  const id = useSelector((state:RootState)=>state.session.id)
  const dispatch = useDispatch()  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors},
    reset,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
      await axios
        .post(`${baseUrl}/candidates/skills`,{ ...data, candidateId: id })
        .then((res) => {
          console.log(res.data);
        });
      await mutate(`${baseUrl}/candidates/${id}`);
   
  };
  const handleCancel = async(idToDelete:number)=>{
     await axios
        .delete(`${baseUrl}/candidates/skills/${idToDelete}`)
        .then((res) => {
          console.log(res.data);
        });
      await mutate(`${baseUrl}/candidates/${id}`);
   
  }
  return (
      <Dialog open={open} onClose={()=>dispatch(setCloseSkill())} className={styles.container}>
        <DialogTitle>edit skill</DialogTitle>
        <DialogContent className={styles.content} >
          <DialogContentText >
            Are you sure you want to edit?
          </DialogContentText>
          <div className={styles.sub}>
            {
                skills.map((item:SKill)=>(
                    <div key={item.id} className={styles.inner}>
                        <p>{item.title}</p>
                        <ClearIcon  className={styles.cancel} onClick={()=>handleCancel(item.id)}/>
                    </div>
                ))
            }
          </div>
          <TextField
          className={styles.input}
            autoFocus
            margin="dense"
            id="name"
            label="title"
            type="text"
            size="small"
            {...register("title", { required: true })}
          />
           {errors.title && (
            <span style={{ color: "red", width: "100%" }}>
              This field is required
            </span>
          )}
          <TextField
          className={styles.input}
            autoFocus
            margin="dense"
            id="name"
            label="experience"
            type="number"
            size="small"
            {...register("experience", { required: true })}
          />
          {errors.experience && (
          <span style={{ color: "red", width: "100%" }}>
            This field is required
          </span>
        )}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>dispatch(setCloseSkill())} className={styles.btn}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)}className={styles.btn} >add</Button>
        </DialogActions>
      </Dialog>
  );
}
