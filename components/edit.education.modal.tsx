import { useSWRConfig } from "swr";
import styles from "../styles/Modal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setCloseEdu } from "@/store/slice/modalSlice";
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
import dayjs from "dayjs";
import axios from "axios";
import { baseUrl } from "@/baseUrl";
import { useEffect } from "react";

type Inputs = {
  schoolName: string;
  startDate: string;
  endDate: string;
};

export type Edu = Inputs & { id: number };
type Props = {
  edu: Edu;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
};

export default function EditEdu({ edu, editMode, setEditMode }: Props) {
  const { mutate } = useSWRConfig();
  const open = useSelector((state: RootState) => state.modal.openEdu);
  const id = useSelector((state: RootState) => state.session.id);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (editMode) {
      await axios
        .patch(`${baseUrl}/candidates/edu/${edu.id}`, data)
        .then((res) => {
          console.log(res.data);
        });
      await mutate(`${baseUrl}/candidates/${id}`);
    } else {
      await axios
        .post(`${baseUrl}/candidates/edu`, { ...data, candidateId: id })
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
          schoolName: "",
          startDate: "",
          endDate: "",
        });
      } else {
        reset({
          schoolName: edu.schoolName,
          startDate: edu.startDate,
          endDate: edu.endDate,
        });
      }
    };
    Reset()
  }, [open]);
  console.log(edu);
  return (
    <Dialog
      open={open}
      onClose={() => dispatch(setCloseEdu())}
      className={styles.container}
    >
      <DialogTitle>Education</DialogTitle>
      <DialogContent className={styles.content}>
        <DialogContentText>
          {" "}
          {editMode ? "Are you sure you want to edit?" : "Post new educa"}
        </DialogContentText>
        <TextField
          className={styles.input}
          autoFocus
          margin="dense"
          id="name"
          label="school name"
          type="text"
          size="small"
          {...register("schoolName", { required: true })}
          defaultValue={editMode ? edu.schoolName : ""}
        />
        {errors.schoolName && (
          <span style={{ color: "red", width: "100%" }}>
            This field is required
          </span>
        )}
        <TextField
          className={styles.input}
          autoFocus
          margin="dense"
          id="name"
          label="start date"
          type="date"
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          {...register("startDate", { required: true })}
          defaultValue={
            editMode ? dayjs(edu.startDate).format("YYYY-MM-DD") : ""
          }
        />
        {errors.startDate && (
          <span style={{ color: "red", width: "100%" }}>
            This field is required
          </span>
        )}
        <TextField
          className={styles.input}
          autoFocus
          margin="dense"
          id="name"
          label="end date"
          type="date"
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          {...register("endDate", { required: true })}
          defaultValue={editMode ? dayjs(edu.endDate).format("YYYY-MM-DD") : ""}
        />
        {errors.endDate && (
          <span style={{ color: "red", width: "100%" }}>
            This field is required
          </span>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            dispatch(setCloseEdu());
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
