import "./TransitionPage.scss"
import {Countdown} from "../MainGamePage/Countdown/Countdown";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import {endRound} from "../commonFuncs";
import {newBigRound} from "../initialSetups";
import disasters from "../../data/disasters.json"
import {
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    TextField
} from "@mui/material";
import * as React from "react";
import {useEffect, useRef, useState} from "react";

const applyDisaster = (disaster) => {
    const funcsActivated = JSON.parse(localStorage.getItem("functions_activated"))
    let civil1 = JSON.parse(localStorage.getItem("civil_1"))
    let civil2 = JSON.parse(localStorage.getItem("civil_2"))
    let civil3 = JSON.parse(localStorage.getItem("civil_3"))
    let entrepreneur1 = JSON.parse(localStorage.getItem("entrepreneur_1"))
    let entrepreneur2 = JSON.parse(localStorage.getItem("entrepreneur_2"))
    if (disaster.name === "旱灾" && funcsActivated["Func10"]) {
        civil1.money += Math.round(disaster.civil_money / 2)
        civil2.money += Math.round(disaster.civil_money / 2)
        civil3.money += Math.round(disaster.civil_money / 2)
        civil1.health += Math.round(disaster.health / 2)
        civil2.health += Math.round(disaster.health / 2)
        civil3.health += Math.round(disaster.health / 2)
        civil1.utility += Math.round(disaster.utility / 2)
        civil2.utility += Math.round(disaster.utility / 2)
        civil3.utility += Math.round(disaster.utility / 2)
        entrepreneur1.money += Math.round(disaster.business_money)
        entrepreneur2.money += Math.round(disaster.business_money)
    } else {
        civil1.money += disaster.civil_money
        civil2.money += disaster.civil_money
        civil3.money += disaster.civil_money
        civil1.health += disaster.health
        civil2.health += disaster.health
        civil3.health += disaster.health
        civil1.utility += disaster.utility
        civil2.utility += disaster.utility
        civil3.utility += disaster.utility
        entrepreneur1.money += disaster.business_money
        entrepreneur2.money += disaster.business_money
    }
    if(civil1.utility<0){
        civil1.utility=0
    }
    if(civil2.utility<0){
        civil2.utility=0
    }
    if(civil3.utility<0){
        civil3.utility=0
    }
    localStorage.setItem("civil_1", JSON.stringify(civil1))
    localStorage.setItem("civil_2", JSON.stringify(civil2))
    localStorage.setItem("civil_3", JSON.stringify(civil3))
    localStorage.setItem("entrepreneur_1", JSON.stringify(entrepreneur1))
    localStorage.setItem("entrepreneur_2", JSON.stringify(entrepreneur2))
}
export const TransitionPage = () => {
    const [disasterAlert,setDisasterAlert]=useState("")
    const [isDialogOpen,setIsDialogOpen]=useState(false)
    const [refresh,setRefresh]=useState(false)
    const [snackbar, setSnackBar] = useState(false)
    const [severity, setSeverity] = useState("success")
    const [alertMessage, setAlertMessage] = useState("")
    const civil1_buyed_medicine = useRef(false)
    const civil2_buyed_medicine = useRef(false)
    const civil3_buyed_medicine = useRef(false)
    let bigRound = JSON.parse(localStorage.getItem("big_round"))
    const closeSnackBar = () => {
        setSnackBar(false)
    }
    const handleClose=()=>{
        setIsDialogOpen(false)
    }
    const [hasDisaster,setHasDisaster] = useState(false);
    const navigate = useNavigate();
    const endSmallRound = () => {
        const socialLvl=JSON.parse(localStorage.getItem("social_lvl"))
        setHasDisaster(false)
        let [round, currRoundStage] = endRound()
        if (round === 5) {
            if (bigRound === 10||socialLvl===4 ) {
                navigate('/gamefinish')
            } else {
                newBigRound()
                navigate("/transition")
            }
        } else {
            navigate("/main")
        }
        setRefresh(!refresh)
    }
    const BuyMedicine = () => {
        const civil_buy_medicine = (civilId) => {
            let civil = JSON.parse(localStorage.getItem(civilId))
            if (civil.money < 5000) {
                setSeverity("warning")
                setAlertMessage("金额不足")
                setSnackBar(true)
                return
            }
            if (civilId === "civil_1") {
                civil1_buyed_medicine.current = true
            } else if (civilId === "civil_2") {
                civil2_buyed_medicine.current = true
            } else {
                civil3_buyed_medicine.current = true
            }
            civil.money -= 5000
            civil.health += 15
            setSeverity("success")
            setAlertMessage("购买成功")
            setSnackBar(true)
            localStorage.setItem(civilId, JSON.stringify(civil))
        }
        let civil1 = JSON.parse(localStorage.getItem("civil_1"))
        let civil2 = JSON.parse(localStorage.getItem("civil_2"))
        let civil3 = JSON.parse(localStorage.getItem("civil_3"))
        return (
            <>
                药的价格是5k,作用是恢复15点健康值
                <div className={"buy-medicine"}>
                    <Button onClick={() => {
                        civil_buy_medicine("civil_1")
                    }} variant={"contained"} disabled={civil1_buyed_medicine.current}>玩家1买药(玩家1目前健康值:{civil1.health},资金:{civil1.money})</Button>
                    <Button onClick={() => {
                        civil_buy_medicine("civil_2")
                    }} variant={"contained"} disabled={civil2_buyed_medicine.current}>玩家2买药(玩家2目前健康值:{civil2.health},资金:{civil2.money})</Button>
                    <Button onClick={() => {
                        civil_buy_medicine("civil_3")
                    }} variant={"contained"} disabled={civil3_buyed_medicine.current}>玩家3买药(玩家3目前健康值:{civil3.health},资金:{civil3.money})</Button>
                </div>
            </>
        )
    }
    const {
        eventName, description, time
    } = JSON.parse(localStorage.getItem("trans_page_data")
    )
    useEffect(() => {
        if (eventName === "灾难结算") {
            const carbon = localStorage.getItem("carbon_amount")
            setIsDialogOpen(true)
                if (carbon < 60) {
                    setDisasterAlert("很幸运，本回合并未发生灾难")
                } else if (carbon <= 75) {
                    setDisasterAlert("可能发生1级灾难")
                } else if (carbon <= 85) {
                    setDisasterAlert("可能发生2级灾难")
                } else if (carbon < 100) {
                    setDisasterAlert("可能发生3级灾难")
                } else {
                    setDisasterAlert("生态崩溃了")
                    setTimeout(() => {
                        navigate('/gameover')
                    }, 2000)

                }
        }
    }, []);
    return (
        <div className={"trans-page"}>
            <h1>{eventName}</h1>
            <Countdown time={time} refresh={refresh}/>
            <Button onClick={() => {
                endSmallRound()
            }} variant={"contained"}>提前结束</Button>
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
            {hasDisaster ? <BuyMedicine/> : <></>}
            <React.Fragment>
                <Dialog
                    open={isDialogOpen}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            const disasterId = formJson.disasterId;
                            if(disasterId==="0"){
                                handleClose()
                                setSnackBar(true)
                                setSeverity("success")
                                setAlertMessage("没有灾难发生🎉")
                                setHasDisaster(false)
                                return;
                            }
                            if(!disasters[disasterId]) {
                                setSnackBar(true)
                                setSeverity("error")
                                setAlertMessage("没有查询到此灾难!")
                                return
                            }
                            handleClose()
                            applyDisaster(disasters[disasterId])
                            setSnackBar(true)
                            setSeverity("success")
                            setHasDisaster(true)
                            setAlertMessage("灾难成功发生")
                        },
                    }}
                >
                    <DialogTitle>灾难:{disasterAlert}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            请输入抽取到的灾难编号,若没发生灾难请输入0
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name={"disasterId"}
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit">确定</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </div>
    )
}