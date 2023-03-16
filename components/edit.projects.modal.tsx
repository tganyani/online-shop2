import { useSWRConfig } from "swr";
import styles from "../styles/Modal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {  setCloseProject } from "@/store/slice/modalSlice";
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
    title:string
    link: string;
};

export type Proj = Inputs & { id: number };
type Props = {
  project: Proj;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
};

export default function EditProjects({ project, editMode, setEditMode }: Props) {
  const { mutate } = useSWRConfig();
  const open = useSelector((state: RootState) => state.modal.openProject);
  const id = useSelector((state: RootState) => state.session.id);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors},
    reset,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (editMode) {
      await axios
        .patch(`${baseUrl}/candidates/projects/${project.id}`, data)
        .then((res) => {
          console.log(res.data);
        });
      await mutate(`${baseUrl}/candidates/${id}`);
    } else {
      await axios
        .post(`${baseUrl}/candidates/projects`, { ...data, candidateId: id })
        .then((res) => {
          console.log(res.data);
        });
      await mutate(`${baseUrl}/candidates/${id}`);
    }
  };
  useEffect(() => {
    const Reset = () => {
      if (!editMode) {
        reset({
          title: "",
          link:"",
        });
      } else {
        reset({
            title:project.title,
          link: project.link,
        });
      }
    };
    Reset()
  }, [open]);
  return (
    <Dialog
      open={open}
      onClose={() => dispatch(setCloseProject())}
      className={styles.container}
    >
      <DialogTitle>Project</DialogTitle>
      <DialogContent className={styles.content}>
        <DialogContentText>
          {" "}
          {editMode ? "Are you sure you want to edit?" : "Post new project"}
        </DialogContentText>
        <TextField
          className={styles.input}
          autoFocus
          margin="dense"
          id="name"
          label="title"
          type="text"
          size="small"
          {...register("title", { required: true })}
          defaultValue={editMode ? project.title : ""}
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
          label="link"
          type="text"
          size="small"
          {...register("link", { required: true })}
          defaultValue={editMode ? project.link : ""}
        />
        {errors.link&& (
          <span style={{ color: "red", width: "100%" }}>
            This field is required
          </span>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            dispatch(setCloseProject());
            setEditMode(false);
          }}
          className={styles.btn}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} className={styles.btn}>
          {editMode ? "update" : "add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
