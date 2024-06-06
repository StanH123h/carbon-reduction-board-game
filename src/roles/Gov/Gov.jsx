import * as React from 'react';
import {InfoCard} from "../InfoCard/InfoCard";
import {useContext, useState} from "react";
import {
    UpdateCurrentPolicyContext,
    UpdateBidListContext,
    UpdateHistoryEventsContext
} from "../../pages/MainGamePage/MainGamePage";
import projectFunction from "../../data/project_functions.json"
import {Alert, Snackbar} from "@mui/material";

export const Gov = () => {
    const [snackbar, setSnackBar] = useState(false)
    const [severity, setSeverity] = useState("success")
    const [alertMessage, setAlertMessage] = useState("")
    const updateProgressList = useContext(UpdateBidListContext)
    const updateCurrentPolicy=useContext(UpdateCurrentPolicyContext)
    const updateHistoryEvents=useContext(UpdateHistoryEventsContext)
    const closeSnackBar=()=>{
        setSnackBar(false)
    }
    const bidding = (project_id, database) => {
        let project = database[project_id]
        let socialLvl=JSON.parse(localStorage.getItem("social_lvl"))
        let bidList = JSON.parse(localStorage.getItem("gov_biddings"))
        if (!project) {
            setSeverity("error")
            setAlertMessage("无此项目!!!请检查您输入的项目ID!!")
            setSnackBar(true)
            return
        }
        else if(socialLvl<project.social_lvl){
            setSeverity("warning")
            setAlertMessage("社会等级不足!"+" 该项目要求社会等级为"+project.social_lvl)
            setSnackBar(true)
            return
        }
        else if(bidList.some((bid)=>{
           return bid.projectId===project_id
        })){
            setSeverity("error")
            setAlertMessage("此项目已经存在!!")
            setSnackBar(true)
            return
        }
        bidList.push({
            projectId:project_id,
            projectName:project.name,
            projectPayment1:project.first_payment_to_business,
            projectPayment2:project.last_payment_to_business,
            laborRequired:project.labor_required,
            projectFunction:projectFunction[project.function].description,
        })
        localStorage.setItem("gov_biddings",JSON.stringify(bidList))
        setSeverity("success")
        updateHistoryEvents("政府开始了"+project_id+"项目的招标")
        setAlertMessage(project_id+"项目开始招标!")
        updateProgressList(bidList)
        setSnackBar(true)
    }
    const legislate = (policy_id, database) => {
        let policy = database[policy_id]
        let curr_policy=localStorage.getItem("current_policy")
        if (!policy) {
            setSeverity("error")
            setAlertMessage("无此政策!!!请检查您输入的政策ID!!")
            setSnackBar(true)
            return
        }
        else if(policy.name===curr_policy){
            setSeverity("error")
            setAlertMessage("已经在使用此政策!!")
            setSnackBar(true)
            return
        }
        localStorage.setItem("current_policy", JSON.stringify({
            name:policy.name,
            id:policy_id
        }))
        setSeverity("success")
        setAlertMessage(policy_id+"政策开始使用!")
        updateHistoryEvents("政府制定了"+policy_id+"政策")
        updateCurrentPolicy(policy)
        setSnackBar(true)
    }
    return (
        <>
            <InfoCard dataName={"government"} actionA={"招标"} actionB={"颁布政策"} funcA={bidding} disableSnackBar={true} funcB={legislate} databaseA={"projects"} databaseB={"policies"}></InfoCard>
            <Snackbar open={snackbar} autoHideDuration={3000} onClose={closeSnackBar}>
                <Alert
                    onClose={closeSnackBar}
                    severity={severity}
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
}