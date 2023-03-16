import NestedLayoutCandidateChats from "@/components/candidateChatsLayout";
import type { ReactElement } from 'react'
import type { NextPageWithLayout } from "@/pages/_app";

const CandidateChats:NextPageWithLayout = ()=>{
    
    return(
            <div>
                click any recryiter to start conversation
            </div>
    )
}


CandidateChats.getLayout = function getLayout(page: ReactElement) {
    return (
        <NestedLayoutCandidateChats>{page}</NestedLayoutCandidateChats>
    )
  }
  
  export default CandidateChats




