import NestedLayoutRecruiterChats from "@/components/recruiterChatsLayout";
import type { ReactElement } from 'react'
import type { NextPageWithLayout } from "@/pages/_app";

const RecruiterChats:NextPageWithLayout = ()=>{
    
    return(
            <div>
                click any candiade to start conversation
            </div>
    )
}


RecruiterChats.getLayout = function getLayout(page: ReactElement) {
    return (
        <NestedLayoutRecruiterChats>{page}</NestedLayoutRecruiterChats>
    )
  }
  
  export default RecruiterChats