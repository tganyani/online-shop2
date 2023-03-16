import { useRouter } from "next/router";
import { baseUrl } from "@/baseUrl";
import useSWR from "swr";

import styles from "../../../../styles/ViewCandidate.module.scss";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function ViewCandidate() {
  const router = useRouter();
  const { data, error } = useSWR(
    `${baseUrl}/candidates/${router.query.userId}`,
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  console.log(data);
  return (
    <div className={styles.container}>
      This is user profile
      <div className={styles.name}>
        <p>
          {data.firstName} {data.lastName}
        </p>
      </div>
      <div>
        <h4>about</h4>
        <p>{data.about}</p>
      </div>
      <div className={styles.education}>
        <h4>education</h4>

        {data.education?.map((item: any) => (
          <ul key={item.id}>
            <li>
              {item.schoolName},{item.startDate}-{item.endDate}
            </li>
          </ul>
        ))}
      </div>
      <div className={styles.prevPos}>
        <h4>previous positions</h4>

        {data.previousPosition?.map((item: any) => (
          <ul key={item.id}>
            <li>
              {item.position},{item.companyName},{item.startDate}-{item.endDate}
            </li>
          </ul>
        ))}
      </div>
      <div className={styles.projects}>
        <h4>projects</h4>
        {data.projects?.map((item: any) => (
          <ul key={item.id}>
            <li>
              <p>{item.title}</p> <a href={item.link}>visit</a>
            </li>
          </ul>
        ))}
      </div>
      <div className={styles.skills}>
        <h4>skills</h4>
        {data.skills?.map((item: any) => (
          <ul key={item.id}>
            <li>
              <p>{item.title}- {item.experience} years of experience</p> 
            </li>
          </ul>
        ))}
      </div>
      <div className={styles.contacts}>
        <h4>contacts</h4>
        <div className={styles.sub}>
        <p>{data.contacts?.email}</p>
        <p>{data.contacts?.phone}</p>
        </div>
      </div>
    </div>
  );
}
