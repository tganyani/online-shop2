import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";

import { setAccountType } from "@/store/slice/accountSlice";
import { RootState } from "@/store/store";

import styles from "@/styles/Home.module.scss";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import Button from "@mui/material/Button";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useSWR from "swr";
import SearchIcon from "@mui/icons-material/Search";

import { baseUrl } from "@/baseUrl";
import JobApply from "@/components/job.apply.modal";
import { setOpenApply } from "@/store/slice/modalSlice";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [jobId, setJobId] = useState<number | any>();
  const [recruiter,setRecruiter] = useState<{id:number; email:string}| any>()
  const dispatch = useDispatch();
  const router = useRouter();
  const session = useSelector((state: RootState) => state.session.access_token);
  const id = useSelector((state: RootState) => state.session.id);
  const { data, error } = useSWR(`${baseUrl}/vaccancy`, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  return session ? (
    <div className={styles.container}>
      <JobApply jobId={jobId} recruiter={recruiter}/>
      <div className={styles.searchBar}>
        <SearchIcon />
        <div className={styles.inputs}>
          <TextField
            id="standard-basic"
            label="job title"
            size="small"
            className={styles.inputText}
          />
          <TextField
            id="standard-basic"
            label="country"
            size="small"
            className={styles.inputText}
          />
          <TextField
            id="standard-basic"
            label="city"
            size="small"
            className={styles.inputText}
          />
          <TextField
            select
            type="text"
            label="job condition"
            size="small"
            className={styles.inputText}
          >
            <MenuItem value="office">in office </MenuItem>
            <MenuItem value="remote">remote </MenuItem>
          </TextField>
        </div>
      </div>
      <div className={styles.jobs}>
        <div className={styles.header}>Jobs</div>
        <div className={styles.jobContainer}>
          {data.map((job: any) => (
            <div className={styles.jobCard} key={job.id}>
              <div className={styles.cardHeader}>
                <div className={styles.headerIcons}>
                  <h4>
                    <Link href={`/${job.id}`}>{job.title}</Link>{" "}
                  </h4>
                  <div className={styles.date}>today</div>
                  <div className={styles.views}>
                    <VisibilityIcon />
                    <p>2</p>
                  </div>
                  <div className={styles.applicants}>
                    <PeopleOutlineIcon />
                    <p>{job?.candidatesApplied.length}</p>
                  </div>
                </div>
              </div>
              <div className={styles.descriptrion}>
                <p>{job.description}</p>
              </div>
              <div className={styles.footer}>
                <div className={styles.sub1}>
                  <div className={styles.image}></div>
                  <div className={styles.address}>{job.country}</div>
                </div>
                <div className={styles.sub2}>
                  <div className={styles.english}>
                    <p>Level of english </p>
                    <p>At least of experience</p>
                  </div>
                  <div className={styles.jobcondition}>{job.conditions}</div>
                </div>
                <div
                  className={styles.sub3}
                  style={{
                    display: "flex",
                    flexFlow: "row nowrap",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    style={{ height: "25px", textTransform: "lowercase" }}
                    onClick={() => {
                      setJobId(job.id);
                      dispatch(setOpenApply());
                      setRecruiter(job.recruiter)
                    }}
                    sx={{
                      fontWeight: "300",
                      boxShadow: 0,
                      textTransform: "lowercase",
                    }}
                    disabled={
                      job?.candidatesApplied
                        .filter((it: any) => Number(it.id) === Number(id))[0]
                        ?.jobsApplied.filter(
                          (it: any) => Number(it.id) === Number(job.id)
                        ).length
                    }
                  >
                    {job?.candidatesApplied
                      .filter((it: any) => Number(it.id) === Number(id))[0]
                      ?.jobsApplied.filter(
                        (it: any) => Number(it.id) === Number(job.id)
                      ).length
                      ? "Applied"
                      : "Apply"}
                  </Button>
                  <FavoriteBorderIcon />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexFlow: "column nowrap",
          alignItems: "center",
          justifyContent: "center",
          rowGap: "30px",
        }}
      >
        <p>You are not logged in</p>
        <div
          style={{
            display: "flex",
            flexFlow: "column nowrap",
            alignItems: "center",
            justifyContent: "center",
            rowGap: "30px",
          }}
        >
          <Button
            variant="contained"
            style={{ height: "40px", textTransform: "lowercase" }}
            onClick={() => {
              dispatch(setAccountType("candidate"));
              router.push("/auth/signin");
            }}
          >
            continue as a candidate
          </Button>
          <Button
            variant="contained"
            style={{ height: "40px", textTransform: "lowercase" }}
            onClick={() => {
              dispatch(setAccountType("recruiter"));
              router.push("/auth/signin");
            }}
          >
            continue as a recruiter
          </Button>
        </div>
      </div>
    </div>
  );
}
