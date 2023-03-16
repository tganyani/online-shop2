import useSWR,{ useSWRConfig } from "swr";
import { useRouter } from "next/router";
import { baseUrl } from "@/baseUrl";
import styles from "../../../../styles/Applicants.module.scss";
import Button from "@mui/material/Button";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Link } from "@mui/material";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Applicants() {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { vaccancyId } = router.query;
  const id = useSelector((state:RootState)=>state.session.id)
  const { data, error } = useSWR(`${baseUrl}/vaccancy/${vaccancyId}`, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  const handleAccept = async (jobId:string|any)=>{
    await axios.post(`${baseUrl}/vaccancy/accept/${id}`,{id:jobId})
    .then(res=>{
      console.log(res.data)
    }).catch(err=>{
      console.error(err)
    })
    await mutate(`${baseUrl}/vaccancy/${vaccancyId}`)
  }
  const handleRefuse = async (jobId:string|any)=>{
    await axios.post(`${baseUrl}/vaccancy/refuse/${id}`,{id:jobId})
    .then(res=>{
      console.log(res.data)
    }).catch(err=>{
      console.error(err)
    })
    await mutate(`${baseUrl}/vaccancy/${vaccancyId}`)
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        candidates who have applied for a <span>{data.title}</span> position
      </div>
      <div className={styles.applicants}>
        {data?.candidatesApplied.map((item: any) => (
          <div key={item.id} className={styles.applicant}>
            <div className={styles.name}>
              <h5>{item.lastName} {item.firstName}</h5>
              <p>{item?.letter[0].message}</p>
              <Link href={`/recruiter/vaccancy/${vaccancyId}/${item.id}`}><p>view profile</p></Link>
            </div>
            <div className={styles.footer}>
              <Button
                color="success"
                sx={{
                  height: "25px",
                  textTransform: "lowercase",
                  fontWeight: "300",
                  boxShadow: 0
                }}
                variant="contained"
                onClick={()=>handleAccept(vaccancyId)}
                disabled={item?.accepted?.jobsAccepted.filter((it:any)=>Number(it.id) === Number( vaccancyId)).length}
              >
                {item?.accepted?.jobsAccepted.filter((it:any)=>Number(it.id) === Number( vaccancyId)).length?"invited":"invite"}
              </Button>
              <Button
                color="error"
                sx={{
                  height: "25px",
                  textTransform: "lowercase",
                  fontWeight: "300",
                  boxShadow: 0
                }}
                variant="contained"
                onClick={()=>handleRefuse(vaccancyId)}
              >
                not ready
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
