import { useState } from "react";
import styles from "../../styles/CandidateProfile.module.scss";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import useSWR from "swr";

import EditIcon from "@mui/icons-material/Edit";

import { baseUrl } from "@/baseUrl";
import EditName from "@/components/edit.name.modal";
import {
  setOpenAbout,
  setOpenContact,
  setOpenEdu,
  setOpenImage,
  setOpenName,
  setOpenPrevPos,
  setOpenProject,
  setOpenSkill,
} from "@/store/slice/modalSlice";
import EditEdu from "@/components/edit.education.modal";
import AddIcon from "@mui/icons-material/Add";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import type { Edu } from "@/components/edit.education.modal";
import EditPrevPositions, { Pos } from "@/components/edit.prevPositions.modal";
import EditSkill from "@/components/edit.skills.modal";
import EditProjects, { Proj } from "@/components/edit.projects.modal";
import EditContacts from "@/components/edit.contacts.modal";
import EditCandidateProfileImage from "@/components/edit.candidateProfileImage";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditCandateAbout from "@/components/edit.candidate.about";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CandidateProfile() {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editPrev, setEditPrev] = useState<boolean>(false);
  const [editProject, setEditProject] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [enlargeImg, setEnlargeImg] = useState<boolean>(true);
  const id = useSelector((state: RootState) => state.session.id);
  const dispatch = useDispatch();
  const { data, error } = useSWR(`${baseUrl}/candidates/${id}`, fetcher);
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <div className={styles.container}>
      <div className={styles.topNav}>
        <div className={styles.name}>
          <div className={styles.sub}>
            <h4>{data?.firstName}</h4>
            <p>{data.position}</p>
            <div>
              <p><LocationOnIcon/>{data.city},{data.country}</p>
            </div>
          </div>
          <EditIcon onClick={() => dispatch(setOpenName())} />
          <EditName profile={{position:data.position,city:data.city,country:data.country}}/>
        </div>
        <div className={styles.image}>
          {!data.image&&<AddPhotoAlternateIcon style={{fontSize:"50px"}} onClick={() => dispatch(setOpenImage())}/>}
          {data.image&&<img
            onClick={() => setEnlargeImg(!enlargeImg)}
            className={enlargeImg ? styles.img : styles.enlarge}
            src={`${baseUrl}${data.image}`}
            alt="profile"
          />}
          <EditCandidateProfileImage prevPath={data.image} />
          {data.image&&<EditIcon onClick={() => dispatch(setOpenImage())} />}
        </div>
      </div>
      <div className={styles.about}>
        <div className={styles.header}>
        <h5>about</h5>
        <EditIcon onClick={() => dispatch(setOpenAbout())} />
        </div>
        <p>
          {data.about}
        </p>
        <EditCandateAbout about={data.about}/>
      </div>
      <div className={styles.edu}>
        <div className={styles.header}>
          <h5>education</h5>
          <AddIcon onClick={() => dispatch(setOpenEdu())} />
        </div>
        <div className={styles.sub}>
          {data?.education.map((edu: Edu, i: number) => (
            <div
              key={edu.id}
              style={{
                display: "flex",
                flexFlow: "row nowrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className={styles.education}>
                <p>{edu.schoolName}</p>
                <p>
                  <span style={{ fontWeight: "700", marginRight: "10px" }}>
                    from{" "}
                  </span>{" "}
                  {edu.startDate}{" "}
                  <span
                    style={{
                      fontWeight: "700",
                      marginRight: "10px",
                      marginLeft: "10px",
                    }}
                  >
                    to
                  </span>{" "}
                  {edu.endDate}
                </p>
              </div>
              <EditIcon
                onClick={() => {
                  dispatch(setOpenEdu());
                  setEditMode(true);
                  setIndex(edu.id);
                }}
              />
            </div>
          ))}
          <EditEdu
            edu={data?.education.filter((item: Edu) => item.id === index)[0]}
            editMode={editMode}
            setEditMode={setEditMode}
          />
        </div>
      </div>
      <div className={styles.prevPos}>
        <div className={styles.header}>
          <h5>previous positions</h5>
          <AddIcon onClick={() => dispatch(setOpenPrevPos())} />
        </div>
        <div className={styles.sub}>
          {data?.previousPosition.map((item: Pos, i: number) => (
            <div key={item.id} className={styles.inner}>
              <div className={styles.prev}>
                <div>
                  <p>company name :{item.companyName}</p>
                  <p>position : {item.position}</p>
                  <p>
                    {item.startDate}
                    {"    "}-{"   "} {item.endDate}
                  </p>
                </div>
              </div>
              <EditIcon
                onClick={() => {
                  dispatch(setOpenPrevPos());
                  setEditPrev(true);
                  setIndex(item.id);
                }}
              />
            </div>
          ))}
          <EditPrevPositions
            pos={
              data?.previousPosition.filter((item: Pos) => item.id === index)[0]
            }
            editMode={editPrev}
            setEditMode={setEditPrev}
          />
        </div>
      </div>
      <div className={styles.skills}>
        <div className={styles.header}>
          <h5>skills</h5>
          <AddIcon onClick={() => dispatch(setOpenSkill())} />
        </div>
        <div className={styles.sub}>
          {data?.skills.map((item: any) => (
            <div key={item.id} className={styles.skill}>
              <p>{item.title}</p>
              <span>{item.experience}</span>
            </div>
          ))}
        </div>
        <EditSkill skills={data?.skills} />
      </div>
      <div className={styles.projects}>
        <div className={styles.header}>
          <h5>projects</h5>
          <AddIcon onClick={() => dispatch(setOpenProject())} />
        </div>
        <div className={styles.sub}>
          {data?.projects.map((item: any) => (
            <div key={item.id} className={styles.inner}>
              <div className={styles.project}>
                <p>{item.title}</p>
                <div>
                  <a href={item.link}>visit</a>
                </div>
              </div>
              <EditIcon
                onClick={() => {
                  dispatch(setOpenProject());
                  setEditProject(true);
                  setIndex(item.id);
                }}
              />
            </div>
          ))}
        </div>
        <EditProjects
          project={data?.projects.filter((item: Proj) => item.id === index)[0]}
          editMode={editProject}
          setEditMode={setEditProject}
        />
      </div>
      <div className={styles.contacts}>
        <h5>contacts</h5>
        <div className={styles.sub}>
          <div className={styles.contact}>
            <p>{data?.contacts?.email}</p>,
            <p>{data?.contacts?.phone}</p>
          </div>
          <EditIcon
            onClick={() => {
              dispatch(setOpenContact());
            }}
          />
        </div>
        <EditContacts
          contacts={{
            phone: data?.contacts?.phone,
            email: data?.contacts?.email,
          }}
        />
      </div>
    </div>
  );
}
