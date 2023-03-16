import {useState} from 'react'
import styles from "../../styles/Modal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setCloseImage} from "@/store/slice/recruiterModalSlice";
import axios from 'axios';
import { useSWRConfig } from "swr";
import {
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Button
} from "@mui/material";
import { RootState } from "@/store/store";
import { FileUploader } from "react-drag-drop-files";
import { baseUrl } from '@/baseUrl';
type Props ={prevPath:string}

const fileTypes = ["JPG", "PNG"];
export default function EditRecruiterProfileImage({prevPath}:Props) {
  const { mutate } = useSWRConfig();
  const open = useSelector((state:RootState)=>state.recruiterModal.openImage)
  const id = useSelector((state:RootState)=>state.session.id)
  const dispatch = useDispatch()  
  const [file, setFile] = useState<any>(null);
  const [filePreview, setFilePreview] = useState<string| any>("")
  const handleChange = (file:any) => {
    setFile(file);
    setFilePreview(URL.createObjectURL(file))
  };
const handleSubmit = async ()=>{
    let formData = new FormData()
    await formData.append('prevPath', prevPath)
    await formData.append('image',file)
    await axios.patch(`${baseUrl}/recruiters/image/${id}`,formData)
    await mutate(`${baseUrl}/recruiters/${id}`)
    await dispatch(setCloseImage())
}

  return (
      <Dialog open={open} onClose={()=>dispatch(setCloseImage())} className={styles.container}>
        <DialogTitle>edit profile</DialogTitle>
        <DialogContent className={styles.content} >
          <DialogContentText >
            Are you sure you want to edit?
          </DialogContentText>
          <FileUploader  handleChange={handleChange} name="file" types={fileTypes} />
          {file&&<img src={filePreview} alt="" style={{width:"120px",height:"120px", borderRadius:"60px"}}/>}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>dispatch(setCloseImage())} className={styles.btn}>Cancel</Button>
          <Button onClick={handleSubmit} className={styles.btn} >update</Button>
        </DialogActions>
      </Dialog>
  );
}