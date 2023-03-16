import { baseUrl } from "@/baseUrl";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useSelector } from "react-redux";
import useSWR from "swr";
import styles from '../styles/RoomLayout.module.scss'
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function NestedLayoutCandidateRoom({ children }: any) {
  const id = useSelector((state: RootState) => state.session.id);
  const { data, error } = useSWR(`${baseUrl}/rooms/candidate/${id}`, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <div className={styles.container} >
      <div className={styles.chatList} >
          {data.map((item: any) => (
            <Link href={`/candidate/chats/${item.id}`} key={item.id} className={styles.List}>
              <AccountCircleIcon/>
              <div className={styles.text}>{item.name}</div>
            </Link>
          ))}
      </div>
      <main className={styles.left}>{children}</main>
    </div>
  );
}