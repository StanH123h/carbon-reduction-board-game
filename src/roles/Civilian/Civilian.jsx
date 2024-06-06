import * as React from 'react';
import {useContext, useState} from 'react';
import "./Civilian.scss"
import {InfoCard} from "../InfoCard/InfoCard";
import {Alert, Snackbar} from "@mui/material";
import functions from "../../data/project_functions.json"
import {
    TerminateProgressContext, UpdateBuffsContext, UpdateCarbonEmissionContext,
    UpdatePersonalInfoContext, UpdateProductListContext,
    UpdateProgressListContext
} from "../../pages/MainGamePage/MainGamePage";

export const Civilian = ({civilianId}) => {
    const [snackbar, setSnackBar] = useState(false)
    const [severity, setSeverity] = useState("success")
    const [alertMessage, setAlertMessage] = useState("")
    const updateProgressList = useContext(UpdateProgressListContext)
    const updateCivilInfo = useContext(UpdatePersonalInfoContext)
    const terminateProgress = useContext(TerminateProgressContext)
    const updateBuffs = useContext(UpdateBuffsContext)
    const updateCarbon = useContext(UpdateCarbonEmissionContext)
    const [func16Message, setFunc16Message] = useState("当前碳排可能发生的灾难有")
    const [func16, setFunc16] = useState(false)
    const updateProductList = useContext(UpdateProductListContext)
    const closeFunc16 = () => {
        setFunc16(false)
    }
    const decreaseCarbon = (carbonAmount, decreaseAmount, corpId) => {
        let corp = JSON.parse(localStorage.getItem(corpId))
        if (decreaseAmount < 0) {
            corp.carbonEmitted -= decreaseAmount
            localStorage.setItem(corpId, JSON.stringify(corp))
        } else if (JSON.parse(localStorage.getItem("carbon_amount_no_longer_increases"))) {
            let carbonAfterFunc13 = JSON.parse(localStorage.getItem("carbon_after_func13"))
            carbonAfterFunc13 -= decreaseAmount
            localStorage.setItem("carbon_after_func13", JSON.stringify(carbonAfterFunc13))
            return carbonAfterFunc13
        }
        if (carbonAmount - decreaseAmount >= 0) {
            carbonAmount -= decreaseAmount
            localStorage.setItem("carbon_amount", JSON.stringify(carbonAmount))
            return carbonAmount
        } else {
            localStorage.setItem("carbon_amount", "0")
            return 0
        }
    }
    const increaseUtilityAndHealth = (utility, health = 0) => {
        let civil1 = JSON.parse(localStorage.getItem("civil_1"))
        let civil2 = JSON.parse(localStorage.getItem("civil_2"))
        let civil3 = JSON.parse(localStorage.getItem("civil_3"))
        civil1.utility += utility
        civil2.utility += utility
        civil3.utility += utility
        civil1.health += health
        civil2.health += health
        civil3.health += health
        updateCivilInfo("CIVIL1", civil1)
        updateCivilInfo("CIVIL2", civil2)
        updateCivilInfo("CIVIL3", civil3)
        localStorage.setItem("civil_1", JSON.stringify(civil1))
        localStorage.setItem("civil_2", JSON.stringify(civil2))
        localStorage.setItem("civil_3", JSON.stringify(civil3))
    }
    const addBuffs = (funcId, corpName) => {
        let carbon = JSON.parse(localStorage.getItem("carbon_amount"))
        let funcsActivated = JSON.parse(localStorage.getItem("functions_activated"))
        let corpId = corpName === "CORP1" ? "entrepreneur_1" : "entrepreneur_2"
        switch (funcId) {
            case "Func1": {
                carbon = decreaseCarbon(carbon, 5, corpId)
                updateCarbon(carbon)
                break
            }
            case "Func5": {
                carbon = decreaseCarbon(carbon, 5, corpId)
                updateCarbon(carbon)
                break
            }
            case "Func8": {
                increaseUtilityAndHealth(500)
                break
            }
            case "Func9": {
                carbon = decreaseCarbon(carbon, 10, corpId)
                updateCarbon(carbon)
                break
            }
            case "Func10": {
                carbon = decreaseCarbon(carbon, 5, corpId)
                updateCarbon(carbon)
                break
            }
            case "Func11": {
                carbon = decreaseCarbon(carbon, 10, corpId)
                updateCarbon(carbon)
                increaseUtilityAndHealth(100)
                break
            }
            case "Func12": {
                carbon = Math.round(carbon / 2)
                updateCarbon(carbon)
                break
            }
            case "Func13": {
                localStorage.setItem("carbon_amount_no_longer_increases", "true")
                localStorage.setItem("carbon_after_func13", JSON.stringify(carbon))
                break
            }
            case "Func15": {
                carbon = decreaseCarbon(carbon, -2, corpId)
                updateCarbon(carbon)
                increaseUtilityAndHealth(70)
                break
            }
            case "Func16": {
                let currCarbon = JSON.parse(localStorage.getItem("carbon_amount_no_longer_increases")) ? JSON.parse(localStorage.getItem("carbon_after_func13")) : JSON.parse(localStorage.getItem("carbon_amount"))
                setFunc16(true)
                if (currCarbon < 50) {
                    setFunc16Message("当前碳排无灾难发生")
                } else if (currCarbon < 75) {
                    setFunc16Message(func16Message + "磁暴，极寒，海藻过度生长")
                } else if (currCarbon < 85) {
                    setFunc16Message(func16Message + "森林火灾，洪灾，旱灾，塌方")
                } else if (currCarbon < 100) {
                    setFunc16Message(func16Message + "风暴，地震，全球疫情")
                } else {
                    setFunc16Message(func16Message + "生态崩溃")
                }
                break
            }
            case "Func17": {
                carbon = decreaseCarbon(carbon, -4, corpId)
                increaseUtilityAndHealth(300, 1)
                updateCarbon(carbon)
                break
            }
            case "Func18": {
                if (funcsActivated["Func1"]) {
                    carbon = decreaseCarbon(carbon, -Math.round(13 / 2), corpId)
                } else {
                    carbon = decreaseCarbon(carbon, -13, corpId)
                }
                increaseUtilityAndHealth(100)
                updateCarbon(carbon)
                break
            }
            case "Func19": {
                if (funcsActivated["Func1"]) {
                    carbon = decreaseCarbon(carbon, -Math.round(16 / 2), corpId)
                } else {
                    carbon = decreaseCarbon(carbon, -16, corpId)
                }
                increaseUtilityAndHealth(200)
                updateCarbon(carbon)
                break
            }
            case "Func20": {
                carbon = decreaseCarbon(carbon, -16, corpId)
                increaseUtilityAndHealth(500)
                updateCarbon(carbon)
                break
            }
        }
    }
    const purchase = (product_id, database) => {
        let carbon = JSON.parse(localStorage.getItem("carbon_amount"))
        let productList = JSON.parse(localStorage.getItem("product_list"))
        let product = database[product_id]
        let funcsActivated=JSON.parse(localStorage.getItem("functions_activated"))
        if (!product) {
            setSeverity("error")
            setAlertMessage("无此商品!!!请检查您输入的商品ID!!")
            setSnackBar(true)
            return
        }
        let civil = JSON.parse(localStorage.getItem("civil_" + civilianId))
        if (product.price > civil.money) {
            setSeverity("warning")
            setAlertMessage("金额不足!")
            setSnackBar(true)
        } else {
            let ent_id="entrepreneur_"+productList.find((prod)=>{
                return prod.productId===product_id;
            }).entrepreneurId
            let entrepreneur=JSON.parse(localStorage.getItem(ent_id))
            setSeverity("success")
            setAlertMessage("购买成功")
            entrepreneur.money+=product.price
            civil.ownedProducts.push({
                productId: product_id,
                roundsLeft: product.re_sellable + 1,
                utility: product.utility
            })
            civil.money -= product.price
            if (!product.isGreen&&!funcsActivated["Func13"]) {
                carbon += 1
                updateCarbon(carbon)
            }
            productList = productList.filter((prod) => {
                return prod.productId !== product_id
            })
            updateProductList(productList)
            updateCivilInfo("CIVIL" + civilianId, civil)
            localStorage.setItem("product_list",JSON.stringify(productList))
            localStorage.setItem("civil_" + civilianId, JSON.stringify(civil))
            localStorage.setItem(ent_id,JSON.stringify(entrepreneur))
            setSnackBar(true)
        }
    }

    const work = (projectId, database) => {
        let civil = JSON.parse(localStorage.getItem("civil_" + civilianId))
        let funcsActicated = JSON.parse(localStorage.getItem("civil_" + civilianId))
        let progressList = JSON.parse(localStorage.getItem("progress_list"))
        let currPolicy = JSON.parse(localStorage.getItem("current_policy"))
        let carbon=JSON.parse(localStorage.getItem("carbon_amount_no_longer_increases"))?JSON.parse(localStorage.getItem("carbon_after_func13")):JSON.parse(localStorage.getItem("carbon_amount"))
        if (!progressList.some((proj) => {
            return proj.eventId === projectId
        })) {
            setSeverity("error")
            setAlertMessage("无此项目!!!请检查您输入的项目ID!!")
            setSnackBar(true)
            return
        }
        if (funcsActicated["Func14"] && currPolicy.id === "G03") {
            civil.health -= 3
        } else if (funcsActicated["Func14"]) {
            civil.health -= 1.5
        } else if (currPolicy.id === "G03") {
            civil.health -= 4
        } else {
            civil.health -= 2
        }
        civil.money += 3400
        progressList = progressList.map((proj) => {
            if (proj.eventId === projectId) {
                if (currPolicy.id === "G03") {
                    if (proj.currentNum + 2 > proj.laborRequired) {
                        proj.currentNum += 1
                    } else {
                        proj.currentNum += 2
                    }
                } else {
                    proj.currentNum += 1
                }
                if (proj.currentNum === proj.laborRequired) {
                    setTimeout(() => {
                        let buffs = JSON.parse(localStorage.getItem("buffs_n_debuffs"))
                        let funcsActivated = JSON.parse(localStorage.getItem("functions_activated"))
                        let funcId = database[projectId].function
                        let func = functions[funcId]
                        funcsActivated[funcId] = true
                        localStorage.setItem("functions_activated", JSON.stringify(funcsActivated))
                        let entrepreneurId=proj.corpName.at(4)
                        console.log(entrepreneurId)
                        let entrepreneur=JSON.parse(localStorage.getItem("entrepreneur_"+entrepreneurId))
                        console.log(database[projectId].last_payment_to_business)
                        entrepreneur.money+=database[projectId].last_payment_to_business
                        localStorage.setItem("entrepreneur_"+entrepreneurId,JSON.stringify(entrepreneur))
                        terminateProgress(proj.corpName, proj.eventId)
                        addBuffs(funcId, proj.corpName)
                        if (func.displayable) {
                            buffs.push(func.description)
                            updateBuffs(buffs)
                        }
                    }, 450)
                }
            }
            return proj
        })
        localStorage.setItem("progress_list", JSON.stringify(progressList))
        localStorage.setItem("civil_" + civilianId, JSON.stringify(civil))
        if(!database[projectId].isGreen&&!funcsActicated["Func13"]){
            carbon+=1
            updateCarbon(carbon)
        }
        updateProgressList(progressList)
        updateCivilInfo("CIVIL" + civilianId, civil)
        setSeverity("success")
        setAlertMessage("打工成功")
        setSnackBar(true)
    }
    const closeSnackBar = () => {
        setSnackBar(false)
    }


    return (
        <>
            <InfoCard dataName={"civil_" + civilianId} actionA={"Purchase"} actionB={"Work"} databaseA={"products"}
                      databaseB={"projects"} funcA={purchase} funcB={work} disableSnackBar={true}></InfoCard>
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
            <Snackbar open={func16} autoHideDuration={3000} onClose={closeFunc16}
                      anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
                <Alert
                    onClose={closeFunc16}
                    severity={"warning"}
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    {func16Message}
                </Alert>
            </Snackbar>
        </>
    );
}