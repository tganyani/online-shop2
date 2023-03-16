import { baseUrl } from "@/baseUrl";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useSelector } from "react-redux";
import useSWR from "swr";

import styles from "../../../styles/AllVaccancy.module.scss";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function AllVaccancy() {
  const id = useSelector((state:RootState)=>state.session.id)
  const { data, error } = useSWR(`${baseUrl}/vaccancy/posted/${id}`, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <div className={styles.container}>
        {data.jobsPosted.map((item:any)=>(
        <div className={styles.vaccancy}>
            <div className={styles.header}>
                <h4>{item.title}</h4>
            </div>
            <div className={styles.description}>
                {
                    item.description
                }
            </div>
            <div>
                <p>{item.candidatesApplied.length} candidates applied </p>
                <Link href={`/recruiter/vaccancy/${item.id}`}>view candidates</Link>
            </div>
        </div>
        ))}
    </div>
  )
}
