import { ReactElement, useRef } from "react";
import NestedLayout from "@/components/recruiterRoom";
import { NextPageWithLayout } from "@/pages/_app";
import styles from "../../../styles/ChatFrame.module.scss";

import { useEffect, useState } from "react";
import { baseUrl } from "@/baseUrl";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const socket = io(`${baseUrl}`);

const Room: NextPageWithLayout = () => {
  const accountType = useSelector(
    (state: RootState) => state.account.accountType
  );
  const { mutate } = useSWRConfig();
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState();
  const scrollMessage = useRef<null | HTMLDivElement>(null);
  const router = useRouter();
  const { data, error } = useSWR(
    `${baseUrl}/rooms/${router.query.roomId}`,
    fetcher
  );

  useEffect(() => {
    socket.emit("joinRoom", { roomName: data?.name });
  }, [data]);
  useEffect(() => {
    socket.on("roomMsg", (data) => {
      setResponse(data);
    });
  }, [socket]);
  useEffect(() => {
    mutate(`${baseUrl}/rooms/${router.query.roomId}`);
  }, [response]);
  useEffect(()=>{
    scrollMessage.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  },[data])
  const handleSend = async () => {
    await socket.emit("newMsg", {
      message,
      roomId: router.query.roomId,
      roomName: data.name,
      accountType,
    });
    await setMessage("")
  };

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <div className={styles.main}>
      <div className={styles.chatBox}>
        {data?.chats.map((item: any) => (
          <div
            key={item.id}
            className={
              item.accountType === accountType ? styles.you : styles.friend
            }
          >
            {item.message}
          </div>
        ))}
        <div ref={scrollMessage}></div>
      </div>
      <div className={styles.inputBox}>
        <input
          type="text"
          placeholder="type something"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button onClick={handleSend}>send</button>
      </div>
    </div>
  );
};

Room.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>;
};

export default Room;
