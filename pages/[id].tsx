import { useRouter } from "next/router";
import styles from "@/styles/Job.module.scss";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import Button from "@mui/material/Button";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useSWR from "swr";
import { baseUrl } from "@/baseUrl";
import { useDispatch} from "react-redux";
import JobApply from "@/components/job.apply.modal";
import { setOpenApply } from "@/store/slice/modalSlice";

export default function Job() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const router = useRouter();
  const dispatch = useDispatch()
  const { data, error } = useSWR(`${baseUrl}/vaccancy/${router.query.id}`, fetcher);
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <div className={styles.container}>
      <div className={styles.job}>
        <div className={styles.header}>
          <h4>{data?.title}</h4>
          <div className={styles.company}>
            <div
              className={styles.image}
              style={{
                backgroundColor: "grey",
                width: "40px",
                height: "40px",
                borderRadius: "20px",
              }}
            ></div>
            <div className={styles.companyName}>
              <h5>{data?.companyName}</h5>
              <p>recruiter</p>
            </div>
          </div>
        </div>
        <div className={styles.description}>
          <p>{data?.description}</p>
        </div>
        <div className={styles.companyWebsite}>
          <h5>company website</h5>
          <a href={data?.companyWebsite}>
            {data?.companyWebsite}
          </a>
        </div>
        <div className={styles.info}>
          <p> job posted on Monday</p>
          <div className={styles.sub}>
            <div className={styles.views}>
              <VisibilityIcon />
              <p>2</p>
            </div>
            <div className={styles.applicants}>
              <PeopleOutlineIcon />
              <p>10</p>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <Button
            variant="contained"
            style={{ height: "25px", textTransform: "lowercase" }}
            onClick={()=>dispatch(setOpenApply())}
            sx={{
              fontWeight: "300",
                boxShadow: 0,
                textTransform:"lowercase"
            }}
          >
            Apply
          </Button>
          <FavoriteBorderIcon />
        </div>
      </div>
      <JobApply jobId={data.id} recruiter={data?.recruiter}/>
    </div>
  );
}
