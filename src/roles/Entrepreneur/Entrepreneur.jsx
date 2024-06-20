import {InfoCard} from "../InfoCard/InfoCard";
import {Alert, Snackbar} from "@mui/material";
import * as React from "react";
import {useContext, useState} from "react";
import {
    UpdateBidListContext,
    UpdateCarbonEmissionContext,
    UpdatePersonalInfoContext,
    UpdateProductListContext,
    UpdateProgressListContext
} from "../../pages/MainGamePage/MainGamePage";

export const Entrepreneur = ({ent_id}) => {
    const [snackbar, setSnackBar] = useState(false)
    const [severity, setSeverity] = useState("success")
    const [alertMessage, setAlertMessage] = useState("")
    const updateProgressList = useContext(UpdateProgressListContext)
    const updateBidList = useContext(UpdateBidListContext)
    const updateProductList = useContext(UpdateProductListContext)
    const updateEntrepreneurInfo = useContext(UpdatePersonalInfoContext)
    const updateCarbon = useContext(UpdateCarbonEmissionContext)
    const closeSnackBar = () => {
        setSnackBar(false)
    }
    const fight_for_bid = (project_id, database) => {
        const customNames=JSON.parse(localStorage.getItem("custom_names"))
        let entrepreneur = JSON.parse(localStorage.getItem("entrepreneur_" + ent_id))
        let bid = database[project_id]
        let bidList = JSON.parse(localStorage.getItem("gov_biddings"))
        let funcsActivated = JSON.parse(localStorage.getItem("functions_activated"))
        let progressList = JSON.parse(localStorage.getItem("progress_list"))
        if (!bid || !bidList.some((proj) => {
            return proj.projectId === project_id
        })) {
            setSeverity("error")
            setAlertMessage("未找到该标或政府没有在招此标")
            setSnackBar(true)
            return
        } else if (progressList.length===2) {
            setSeverity("warning")
            setAlertMessage("已达到正在进行的项目的数量上限,请完成项目后继续竞标(2个)")
            setSnackBar(true)
            return
        }
        bidList = bidList.filter((proj) => {
            return !(proj.projectId === project_id)
        })

        if (project_id === "X06" && funcsActivated["Func2"]) {
            progressList.push({
                eventId: project_id,
                corpName: "CORP" + ent_id,
                laborRequired: 4,
                currentNum: 0,
                displayName:customNames["entrepreneur_"+ent_id]
            })
        } else if (project_id === "X10" && funcsActivated["Func3"]) {
            progressList.push({
                eventId: project_id,
                corpName: "CORP" + ent_id,
                laborRequired: 5,
                currentNum: 0,
                displayName:customNames["entrepreneur_"+ent_id]
            })
        } else if (project_id === "X13" && funcsActivated["Func21"]) {
            progressList.push({
                eventId: project_id,
                corpName: "CORP" + ent_id,
                laborRequired: 5,
                currentNum: 0,
                displayName:customNames["entrepreneur_"+ent_id]
            })
        } else {
            progressList.push({
                eventId: project_id,
                corpName: "CORP" + ent_id,
                laborRequired: bid.labor_required,
                currentNum: 0,
                displayName:customNames["entrepreneur_"+ent_id]
            })
        }
        updateProgressList(progressList)
        updateBidList(bidList)
        localStorage.setItem("gov_biddings", JSON.stringify(bidList))
        localStorage.setItem("progress_list", JSON.stringify(progressList))
        entrepreneur.money += bid.first_payment_to_business
        entrepreneur.projects_in_progress += 1
        localStorage.setItem("entrepreneur_" + ent_id, JSON.stringify(entrepreneur))
        updateEntrepreneurInfo("ENTREPRENEUR" + ent_id, entrepreneur)
        setSeverity("success")
        setAlertMessage("竞标成功")
        setSnackBar(true)
    }

    const sellProduct = (product_id, database) => {
        let funcsActivated = JSON.parse(localStorage.getItem("functions_activated"))
        let currentPolicyId = JSON.parse(localStorage.getItem("current_policy")).id
        let entrepreneur = JSON.parse(localStorage.getItem("entrepreneur_" + ent_id))
        let product = database[product_id]
        let productList = JSON.parse(localStorage.getItem("product_list"))
        let carbon = JSON.parse(localStorage.getItem("carbon_amount_no_longer_increases")) ? JSON.parse(localStorage.getItem("carbon_after_func13")) : JSON.parse(localStorage.getItem("carbon_amount"))
        const socialLvl = JSON.parse(localStorage.getItem("social_lvl"))
        if (!product) {
            setSeverity("error")
            setAlertMessage("无此商品，请检查您输入的商品ID")
            setSnackBar(true)
            return
        } else if (currentPolicyId === "G01" && (!product.isGreen)) {
            setSeverity("warning")
            setAlertMessage("当前政策不允许生产非绿色产品")
            setSnackBar(true)
            return
        } else if (currentPolicyId === "G02" && (product.isGreen)) {
            setSeverity("warning")
            setAlertMessage("当前政策只允许生产普通产品(非绿色产品)")
            setSnackBar(true)
            return
        } else if (entrepreneur.money < product.producing_cost) {
            setSeverity("warning")
            setAlertMessage("资金不足，无法生产")
            setSnackBar(true)
            return
        } else if (product.social_lvl > socialLvl) {
            setSeverity("warning")
            setAlertMessage("社会等级不足")
            setSnackBar(true)
            return
        }
        if (productList.some((prod) => prod.productId === product_id)) {
            productList = productList.map((prod) => {

                if (prod.productId === product_id) {
                    prod.entrepreneurIds = [...prod.entrepreneurIds, (product.re_sellable+1)+"entrepreneur_" + ent_id]
                }
                return prod
            })
        } else {
            productList.push({
                productId: product_id,
                productName: product.name,
                entrepreneurIds: [(product.re_sellable+1)+"entrepreneur_" + ent_id]
            })
        }
        if ((!product.isGreen) && (!funcsActivated["Func13"])) {
            carbon += 1
        }
        localStorage.setItem("carbon_amount", carbon)
        updateCarbon(carbon)
        entrepreneur.money -= product.producing_cost
        localStorage.setItem("product_list", JSON.stringify(productList))
        localStorage.setItem("entrepreneur_" + ent_id, JSON.stringify(entrepreneur))
        updateEntrepreneurInfo("ENTREPRENEUR" + ent_id, entrepreneur)
        updateProductList(productList)
        setSeverity("success")
        setAlertMessage("成功上架商品")
        setSnackBar(true)
    }
    return (
        <>
            <InfoCard dataName={"entrepreneur_" + ent_id} actionA={"竞标"} actionB={"卖商品"} databaseA={"projects"}
                      databaseB={"products"} funcA={fight_for_bid} funcB={sellProduct}
                      disableSnackBar={true}></InfoCard>
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
    )
}