import { baseUrl } from "@/baseUrl";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useSelector } from "react-redux";
import useSWR from "swr";

import styles from "../../styles/AppliedJobs.module.scss";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function AppliedJobs() {
  const id = useSelector((state: RootState) => state.session.id);
  const { data, error } = useSWR(
    `${baseUrl}/vaccancy/connected/${id}`,
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <div className={styles.contained}>
      {data?.jobsApplied.map((item: any) => (
        <div key={item.id} className={styles.job}>
          <div className={styles.header}>
            {data?.refused?.jobsRefused.filter((it:any)=>it.id === item.id)[0]&&(<p style={{color:"red"}}>refused</p>)}
            {data?.accepted?.jobsAccepted.filter((it:any)=>it.id === item.id)[0]&&(<p style={{color:"lawngreen"}}>invited</p>)}
            <h4>
              <Link href={`/${item.id}`}>{item.title}</Link>
            </h4>
          </div>
          <div className={styles.card}>{item.description}</div>
          <div className={styles.footer}>
            <p>23 candidates viewed so far</p>
            <p>12 candidates have applied</p>
          </div>
        </div>
      ))}
    </div>
  );
}
