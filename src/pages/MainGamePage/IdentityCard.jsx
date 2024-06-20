import {Gov} from "../../roles/Gov/Gov";
import {Entrepreneur} from "../../roles/Entrepreneur/Entrepreneur";
import {Civilian} from "../../roles/Civilian/Civilian";
import Button from "@mui/material/Button";
import * as React from "react";
import {useContext, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {Alert, Snackbar, TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {EndRoundFuncContext, UpdatePersonalInfoContext} from "./MainGamePage";
import InventoryIcon from '@mui/icons-material/Inventory';
import products from "../../data/products.json"

export const IdentityCard = ({currStage}) => {
    const [open, setOpen] = useState(false);
    const [buyer, setBuyer] = useState("")
    const [seller, setSeller] = useState("")
    const [tradeProduct, setTradeProduct] = useState(null)
    const [snackbar, setSnackBar] = useState(false)
    const [severity, setSeverity] = useState("success")
    const [alertMessage, setAlertMessage] = useState("")
    const updatePersonalInfo = useContext(UpdatePersonalInfoContext)
    const endRound = useContext(EndRoundFuncContext)
    const customNames = JSON.parse(localStorage.getItem("custom_names"))
    const closeSnackBar = () => {
        setSnackBar(false)
    }

    const handleBuyer = (event) => {
        setBuyer(event.target.value)
    }
    const handleSeller = (event) => {
        setSeller(event.target.value)
    }
    const handleClose = () => {
        setOpen(false);
        setAlertMessage("交易取消")
        setSeverity("warning")
        setSnackBar(true)
    };
    const handleTradeAmount = (event) => {
        setTradeProduct(event.target.value)
    }

    const handleDeal = () => {
        let buyerInfo = JSON.parse(localStorage.getItem(buyer))
        let sellerInfo = JSON.parse(localStorage.getItem(seller))
        const tranformTable = {
            "civil_1": "CIVIL1",
            "civil_2": "CIVIL2",
            "civil_3": "CIVIL3"
        }
        let product = sellerInfo.ownedProducts.find((prod) => {
            return(prod.productId === tradeProduct) && (prod.roundsLeft === 1)
        })
        console.log(seller)
        let price = products[tradeProduct].price
        if (buyer === seller) {
            setSeverity("error")
            setAlertMessage("不能和自己交易!!!")
        } else if (!product) {
            setSeverity("warning")
            setAlertMessage("卖家没有此产品或者此产品持续轮数>1轮")
        } else if (buyerInfo.money < Math.round(price * 0.5)) {
            setSeverity("warning")
            setAlertMessage("买家资金不足")
        } else if (!products[tradeProduct].re_sellable) {
            setSeverity("warning")
            setAlertMessage("此商品不可二次售卖")
        } else {
            const index = sellerInfo.ownedProducts.findIndex((prod) => (prod.productId === tradeProduct)&&(prod.roundsLeft===1));
            sellerInfo.ownedProducts.splice(index, 1);
            buyerInfo.ownedProducts.push({
                productName: product.productName,
                productId: tradeProduct,
                roundsLeft: product.roundsLeft,
                utility: Math.round(product.utility * 0.7)
            })
            sellerInfo.money += Math.round(price * 0.5)
            buyerInfo.money -= Math.round(price * 0.5)
            localStorage.setItem(buyer, JSON.stringify(buyerInfo))
            localStorage.setItem(seller, JSON.stringify(sellerInfo))
            updatePersonalInfo(tranformTable[buyer], buyerInfo)
            updatePersonalInfo(tranformTable[seller], sellerInfo)
            setSeverity("success")
            setAlertMessage("交易成功")
        }
        setOpen(false)
        setSnackBar(true)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    if (currStage === "gov_act") {
        return (
            <>
                <Gov></Gov>
            </>
        )
    } else if (currStage === "ent_act") {
        return (
            <>
                <Entrepreneur ent_id={1}/>
                <Button onClick={() => {
                    endRound()
                }} variant={"contained"}>结束回合</Button>
                <span style={{
                    maxWidth: "10%",
                    fontSize: "small"
                }}>注意:多个企业同时想竞一个标时，此时请轮流发言，然后由普通人投票选出此标给谁(这块就不敲投票系统的代码了XD)</span>
                <Entrepreneur ent_id={2}/>
            </>
        )
    } else if (currStage === "civil_act") {
        return (
            <>
                <Button variant="outlined" onClick={handleClickOpen} className={"civil-secondary-market"}>
                    二手交易市场
                </Button>
                <Button onClick={() => {
                    endRound()
                }} variant={"contained"}>结束回合</Button>
                <Civilian civilianId={1}/>
                <Civilian civilianId={2}/>
                <Civilian civilianId={3}/>
                <React.Fragment>
                    <Dialog
                        className={"popup"}
                        open={open}
                        onClose={handleClose}
                    >
                        <DialogTitle>Secondary Trading Market</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                左边的框里选择买家，右边的框里选择卖家，中间的输入框中输入二手产品的编号，<strong>确认好后</strong>点击确定按钮
                            </DialogContentText>
                            <Box
                                noValidate
                                component="form"
                                sx={{
                                    display: 'flex',
                                    m: 'auto',
                                    width: '100%',
                                    justifyContent: 'space-evenly',
                                    alignItems: "end",
                                    textAlign: "center"
                                }}
                            >
                                <FormControl sx={{mt: 2, minWidth: 120}}>
                                    <InputLabel htmlFor="buyer">Buyer</InputLabel>
                                    <Select
                                        autoFocus
                                        label="buyer"
                                        value={buyer}
                                        inputProps={{
                                            name: 'max-width',
                                            id: 'max-width',
                                        }}
                                        onChange={handleBuyer}
                                    >
                                        <MenuItem value="civil_1">{customNames["civil_1"]}</MenuItem>
                                        <MenuItem value="civil_2">{customNames["civil_2"]}</MenuItem>
                                        <MenuItem value="civil_3">{customNames["civil_3"]}</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InventoryIcon/>
                                        )
                                    }}
                                    autoFocus
                                    required
                                    id="name"
                                    name={"actionId"}
                                    type="text"
                                    color="success"
                                    value={tradeProduct}
                                    onChange={handleTradeAmount}
                                />
                                <FormControl sx={{mt: 2, minWidth: 120}}>
                                    <InputLabel htmlFor="seller">Seller</InputLabel>
                                    <Select
                                        onChange={handleSeller}
                                        autoFocus
                                        label="seller"
                                        inputProps={{
                                            name: 'max-width',
                                            id: 'max-width',
                                        }}
                                        value={seller}
                                    >
                                        <MenuItem value="civil_1">{customNames["civil_1"]}</MenuItem>
                                        <MenuItem value="civil_2">{customNames["civil_2"]}</MenuItem>
                                        <MenuItem value="civil_3">{customNames["civil_3"]}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDeal}>Deal</Button>
                            <Button onClick={handleClose}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
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
}