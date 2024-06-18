import * as React from 'react';
import {useContext, useState} from 'react';
import {InfoCard} from "../InfoCard/InfoCard";
import {
    UpdateBidListContext,
    UpdateCurrentPolicyContext,
} from "../../pages/MainGamePage/MainGamePage";
import projectFunction from "../../data/project_functions.json"
import {Alert, Snackbar} from "@mui/material";

export const Gov = () => {
    const [snackbar, setSnackBar] = useState(false)
    const [severity, setSeverity] = useState("success")
    const [alertMessage, setAlertMessage] = useState("")
    const updateProgressList = useContext(UpdateBidListContext)
    const updateCurrentPolicy = useContext(UpdateCurrentPolicyContext)
    const closeSnackBar = () => {
        setSnackBar(false)
    }
    const bidding = (project_id, database) => {
        let project = database[project_id]
        let socialLvl = JSON.parse(localStorage.getItem("social_lvl"))
        let bidList = JSON.parse(localStorage.getItem("gov_biddings"))
        let projectsStarted = JSON.parse(localStorage.getItem("projects_started"))
        if (!project) {
            setSeverity("error")
            setAlertMessage("无此项目!!!请检查您输入的项目ID!!")
            setSnackBar(true)
            return
        } else if (socialLvl < project.social_lvl) {
            setSeverity("warning")
            setAlertMessage("社会等级不足!" + " 该项目要求社会等级为" + project.social_lvl)
            setSnackBar(true)
            return
        } else if (projectsStarted[project_id] === true) {
            setSeverity("error")
            setAlertMessage("此项目已经存在或已经完成!!")
            setSnackBar(true)
            return
        }
        projectsStarted[project_id] = true
        bidList.push({
            projectId: project_id,
            projectName: project.name,
            projectPayment1: project.first_payment_to_business,
            projectPayment2: project.last_payment_to_business,
            laborRequired: project.labor_required,
            projectFunction: projectFunction[project.function].description,
        })
        localStorage.setItem("projects_started", JSON.stringify(projectsStarted))
        localStorage.setItem("gov_biddings", JSON.stringify(bidList))
        setSeverity("success")
        setAlertMessage(project_id + "项目开始招标!")
        updateProgressList(bidList)
        setSnackBar(true)
    }
    const legislate = (policy_id, database) => {
        let policy = database[policy_id]
        let curr_policy = localStorage.getItem("current_policy")
        if (!policy) {
            setSeverity("error")
            setAlertMessage("无此政策!!!请检查您输入的政策ID!!")
            setSnackBar(true)
            return
        } else if (policy.name === curr_policy) {
            setSeverity("error")
            setAlertMessage("已经在使用此政策!!")
            setSnackBar(true)
            return
        }
        localStorage.setItem("current_policy", JSON.stringify({
            name: policy.name,
            id: policy_id
        }))
        setSeverity("success")
        setAlertMessage(policy_id + "政策开始使用!")
        updateCurrentPolicy(policy)
        setSnackBar(true)
    }
    return (
        <>
            <InfoCard dataName={"government"} actionA={"招标"} actionB={"颁布政策"} funcA={bidding}
                      disableSnackBar={true} funcB={legislate} databaseA={"projects"} databaseB={"policies"}></InfoCard>
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