import {useState} from "react"
import { baseUrl } from "@/baseUrl";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import useSWR from "swr";
import styles from "../../styles/Recruiter.module.scss";
import EditIcon from "@mui/icons-material/Edit";
import { setOpenAbout, setOpenAddress, setOpenCantact, setOpenImage } from "@/store/slice/recruiterModalSlice";
import EditRecruiterAbout from "@/components/recruiter/edit.about.modal";
import EditRecruiterContact from "@/components/recruiter/edit.contact.modal";
import EditRecruiterAddress from "@/components/recruiter/edit.address.modal";
import EditRecruiterProfileImage from "@/components/recruiter/edit.rectruiterProfile";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RecruiterProfile() {
  const [enlargeImg, setEnlargeImg] = useState<boolean>(true);
  const id = useSelector((state: RootState) => state.session.id);
  const session = useSelector((state: RootState) => state.session);
  const { data, error } = useSWR(`${baseUrl}/recruiters/${id}`, fetcher);
  const dispatch = useDispatch()


  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.name}>
        <div className={styles.sub}>
         <div className={styles.inner}>
         <p>{data?.companyName}</p>
          <p>recruiter - {data?.firstName}</p>
         </div>
          <div className={styles.image}>
          {!data.image&&<AddPhotoAlternateIcon style={{fontSize:"50px"}} onClick={() => dispatch(setOpenImage())}/>}
          {data.image&&<img
            onClick={() => setEnlargeImg(!enlargeImg)}
            className={enlargeImg ? styles.img : styles.enlarge}
            src={`${baseUrl}${data.image}`}
            alt="profile"
          />}
          <EditRecruiterProfileImage prevPath={data.image} />
          {data.image&&<EditIcon onClick={() => dispatch(setOpenImage())} />}
        </div>
        </div>
      </div>
      <div className={styles.about}>
        <div className={styles.header}>
          <h5> about</h5>
          <EditIcon onClick={()=>dispatch(setOpenAbout())}/>
        </div>
        <div className={styles.sub}>
          <p>{data?.about}</p>
        </div>
        <EditRecruiterAbout about={data?.about}/>
      </div>
      <div className={styles.contacts}>
        <div className={styles.header}>
          <h5> contacts</h5>
          <EditIcon onClick={()=>dispatch(setOpenCantact())}/>
        </div>
        <div className={styles.sub}>
          <p>phone: {data?.phone}</p>
          <p>email: {data?.email}</p>
          <p>website: {data?.website}</p>
          <p>linked: {data?.linkedIn}</p>
          <p>telegram: {data?.telegram}</p>
        </div>
        <EditRecruiterContact contacts={{phone:data?.phone,telegram:data?.telegram,website:data?.website,linkedIn:data?.linkedIn}}/>
      </div>
      <div className={styles.address}>
        <div className={styles.header}>
          <h5> address</h5>
          <EditIcon  onClick={()=>dispatch(setOpenAddress())}/>
        </div>
        <div className={styles.sub}>
          <p>{data?.street}</p>
          <p>{data?.city}</p>
          <p>{data?.country}</p>
        </div>
        <EditRecruiterAddress address={{city:data?.city,country:data?.country,street:data?.street}}/>
      </div>
    </div>
  );
}
