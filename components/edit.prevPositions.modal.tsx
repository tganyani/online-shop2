import { useSWRConfig } from "swr";
import styles from "../styles/Modal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setClosePrevPos } from "@/store/slice/modalSlice";
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
    position:string
    companyName: string;
  startDate: string;
  endDate: string;
};

export type Pos = Inputs & { id: number };
type Props = {
  pos: Pos;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
};

export default function EditPrevPositions({ pos, editMode, setEditMode }: Props) {
  const { mutate } = useSWRConfig();
  const open = useSelector((state: RootState) => state.modal.openPrevPos);
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
        .patch(`${baseUrl}/candidates/pos/${pos.id}`, data)
        .then((res) => {
          console.log(res.data);
        });
      await mutate(`${baseUrl}/candidates/${id}`);
    } else {
      await axios
        .post(`${baseUrl}/candidates/pos`, { ...data, candidateId: id })
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
          companyName: "",
          position:"",
          startDate: "",
          endDate: "",
        });
      } else {
        reset({
            position:pos.position,
          companyName: pos.companyName,
          startDate: pos.startDate,
          endDate: pos.endDate,
        });
      }
    };
    Reset()
  }, [open]);
  console.log(pos);
  return (
    <Dialog
      open={open}
      onClose={() => dispatch(setClosePrevPos())}
      className={styles.container}
    >
      <DialogTitle>Previous Positions</DialogTitle>
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
          label="company name"
          type="text"
          size="small"
          {...register("companyName", { required: true })}
          defaultValue={editMode ? pos.companyName : ""}
        />
        {errors.companyName && (
          <span style={{ color: "red", width: "100%" }}>
            This field is required
          </span>
        )}
        <TextField
          className={styles.input}
          autoFocus
          margin="dense"
          id="name"
          label="postion"
          type="text"
          size="small"
          {...register("position", { required: true })}
          defaultValue={editMode ? pos.companyName : ""}
        />
        {errors.position&& (
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
            editMode ? dayjs(pos.startDate).format("YYYY-MM-DD") : ""
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
          defaultValue={editMode ? dayjs(pos.endDate).format("YYYY-MM-DD") : ""}
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
            dispatch(setClosePrevPos());
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
