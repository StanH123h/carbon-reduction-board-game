import "./TransitionPage.scss"
import {Countdown} from "../MainGamePage/Countdown/Countdown";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import {endRound} from "../commonFuncs";
import {newBigRound} from "../initialSetups";
import disasters from "../../data/disasters.json"
import {Alert, Snackbar} from "@mui/material";
import * as React from "react";
import {useRef, useState} from "react";

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
    localStorage.setItem("civil_1", JSON.stringify(civil1))
    localStorage.setItem("civil_2", JSON.stringify(civil2))
    localStorage.setItem("civil_3", JSON.stringify(civil3))
    localStorage.setItem("entrepreneur_1", JSON.stringify(entrepreneur1))
    localStorage.setItem("entrepreneur_2", JSON.stringify(entrepreneur2))
}
export const TransitionPage = () => {
    const [snackbar, setSnackBar] = useState(false)
    const [severity, setSeverity] = useState("success")
    const [alertMessage, setAlertMessage] = useState("")
    const civil1_buyed_medicine = useRef(false)
    const civil2_buyed_medicine = useRef(false)
    const civil3_buyed_medicine = useRef(false)
    const closeSnackBar = () => {
        setSnackBar(false)
    }
    let hasDisaster = false
    const navigate = useNavigate();
    let disasterAlert = ""
    const endSmallRound = () => {
        let [round, currRoundStage] = endRound()
        if (round === 5) {
            newBigRound()
            navigate("/transition")
        } else {
            navigate("/main")
        }
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
        return (
            <>
                药的价格是5k,作用是恢复15点健康值
                <div className={"buy-medicine"}>
                    <Button onClick={() => {
                        civil_buy_medicine("civil_1")
                    }} variant={"contained"} disabled={civil1_buyed_medicine.current}>玩家1买药</Button>
                    <Button onClick={() => {
                        civil_buy_medicine("civil_2")
                    }} variant={"contained"} disabled={civil2_buyed_medicine.current}>玩家2买药</Button>
                    <Button onClick={() => {
                        civil_buy_medicine("civil_3")
                    }} variant={"contained"} disabled={civil3_buyed_medicine.current}>玩家3买药</Button>
                </div>
            </>
        )
    }
    const {
        eventName, description, time
    } = JSON.parse(localStorage.getItem("trans_page_data")
    )
    const disasterApplied = JSON.parse(localStorage.getItem("disaster_applied"))
    const currentDisaster = localStorage.getItem("disaster")
    if (eventName === "灾难结算") {
        const carbon = localStorage.getItem("carbon_amount")
        disasterAlert = "本回合的灾难是"
        if (carbon < 50) {
            disasterAlert = "很幸运，本回合并未发生灾难"
        } else if (carbon <= 75) {
            hasDisaster = true
            if (!disasterApplied) {
                localStorage.setItem("disaster_applied", "true")
                const random = Math.ceil(Math.random() * 3)
                let disaster = disasters["Z0" + random]
                localStorage.setItem("disaster", disaster.name)
                disasterAlert += disaster.name
                applyDisaster(disaster)
            }
        } else if (carbon <= 85) {
            hasDisaster = true
            if (!disasterApplied) {
                localStorage.setItem("disaster_applied", "true")
                const random = 3 + Math.ceil(Math.random() * 4)
                let disaster = disasters["Z0" + random]
                localStorage.setItem("disaster", disaster.name)
                disasterAlert += disaster.name
                applyDisaster(disaster)
            }
        } else if (carbon < 100) {
            hasDisaster = true
            if (!disasterApplied) {
                localStorage.setItem("disaster_applied", "true")
                const random = 7 + Math.ceil(Math.random() * 3)
                let disaster
                if (random === 10) {
                    disaster = disasters["Z10"]
                } else {
                    disaster = disasters["Z0" + random]
                }
                disasterAlert += disaster.name
                localStorage.setItem("disaster", disaster.name)
                applyDisaster(disaster)
            }
        } else {
            let disaster = disasters["ZZZ"]
            disasterAlert += disaster.name
            localStorage.setItem("disaster", disaster.name)
            setTimeout(() => {
                navigate('/gameover')
            }, 2000)
        }
    }
    return (
        <div className={"trans-page"}>
            <h1>{eventName}</h1>
            <div>{description}</div>
            <br/>
            <div>{disasterAlert + currentDisaster}</div>
            <br/>
            <Countdown time={time}/>
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
        </div>
    )
}