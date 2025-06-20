import * as React from 'react';
import {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import {ProgressTab} from "./ProgressTab/ProgressTab";
import {ButtonGroup, List, ListItem,} from "@mui/material";
import CONST from "../../data/constants.json";
import {TopTitleBar} from "./TopTitleBar/TopTitleBar";
import "./MainGamePage.scss"
import Button from "@mui/material/Button";
import {Countdown} from "./Countdown/Countdown";
import {PopUp} from "./PopUp/PopUp";
import {endRound} from "../commonFuncs";
import {IdentityCard} from "./IdentityCard";
import {useNavigate} from "react-router-dom";
import {newBigRound} from "../initialSetups";

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: "rgb(224,202,202)", ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export const EndRoundFuncContext = React.createContext()
export const UpdateCurrentPolicyContext = React.createContext()
export const UpdateBidListContext = React.createContext()
export const UpdateProgressListContext = React.createContext()
export const UpdateProductListContext = React.createContext()
export const UpdatePersonalInfoContext = React.createContext()
export const UpdateBuffsContext = React.createContext()
export const UpdateCarbonEmissionContext = React.createContext()
export const TerminateProgressContext = React.createContext()
export const MainGamePage = () => {
    const customNames = JSON.parse(localStorage.getItem("custom_names"))
    const [refresh,setRefresh]=useState(false)
    const [civilInfo1, setCivilInfo1] = useState(JSON.parse(localStorage.getItem("civil_1")))
    const [civilInfo2, setCivilInfo2] = useState(JSON.parse(localStorage.getItem("civil_2")))
    const [civilInfo3, setCivilInfo3] = useState(JSON.parse(localStorage.getItem("civil_3")))
    const [entrepreneurInfo1, setEntrepreneurInfo1] = useState(JSON.parse(localStorage.getItem("entrepreneur_1")))
    const [entrepreneurInfo2, setEntrepreneurInfo2] = useState(JSON.parse(localStorage.getItem("entrepreneur_2")))
    const [governmentInfo, setGovernmentInfo] = useState(JSON.parse(localStorage.getItem("government")))
    //上面是每个玩家的个人信息
    const [productList, setProductList] = useState(JSON.parse(localStorage.getItem("product_list")))
    const [progressList, setProgressList] = useState(JSON.parse(localStorage.getItem("progress_list")));
    const [role, setRole] = useState(localStorage.getItem("role"))
    const [currentPolicy, setCurrentPolicy] = useState(JSON.parse(localStorage.getItem("current_policy")))
    const [roundStage, setRoundStage] = useState(localStorage.getItem("curr_round_stage"))
    const [govBids, setGovBids] = useState(JSON.parse(localStorage.getItem("gov_biddings")))
    const [buffsNDebuffs, setBuffsNDebuffs] = useState(JSON.parse(localStorage.getItem("buffs_n_debuffs")))
    const bigRound = JSON.parse(localStorage.getItem("big_round"))
    const [isOpen, setIsOpen] = useState(false)
    const [popUpCorpName, setPopUpCorpName] = useState(null)
    const [popUpEventId, setPopUpEventId] = useState(null)
    const [carbonAmount, setCarbonAmount] = useState(JSON.parse(localStorage.getItem("carbon_amount_no_longer_increases")) ? JSON.parse(localStorage.getItem("carbon_after_func13")) : JSON.parse(localStorage.getItem("carbon_amount")))
    const [socialLvl, setSocialLvl] = useState(JSON.parse(localStorage.getItem("social_lvl")))
    const navigate = useNavigate();
    const endSmallRound = () => {
        let [round, currRoundStage] = endRound()
        setRoundStage(currRoundStage)
        setRole(CONST.ROLES[round])
        if (round === 4) {
            localStorage.setItem("trans_page_data", JSON.stringify(
                {
                    eventName: "灾难结算",
                    description: "此处是本回合发生的灾难",
                    time: 30
                }
            ))
            navigate("/transition")
        } else if (round === 5) {
            newBigRound()
            navigate("/transition")
        }
        setRefresh(!refresh)
    }
    const encrypt = (num) => {
        // num += 1000;
        // num **= 2;
        // num -= 456;
        // num = num.toString();
        num*=3
        let result = "";
        const alphabet = "jihgfedcba";
        for (let digit of num.toString()) {
            const index = parseInt(digit, 10);
            result += alphabet[index];
        }
        return result;
    };
    const decrypt = (str) => {
        // let temp_str = str.substring(2)
        const alphabet = "jihgfedcba";
        let result = 0
        for (let letter of str) {
            result *= 10
            result += alphabet.indexOf(letter)
        }
        result/=3
        // result += 456
        // result = Math.sqrt(result)
        // result -= 1000
        return result
    }
    const encryptedCarbonAmount = useMemo(() => {
        return encrypt(carbonAmount)
    }, [carbonAmount])
    const terminateProgress = (corpName, eventId) => {
        setProgressList(progressList => {
            console.log(progressList)
                let temp = progressList.filter((proj) => {
                    return proj.eventId !== eventId
                })
                localStorage.setItem("progress_list", JSON.stringify(temp))
                setIsOpen(true)
                setPopUpCorpName(corpName)
                setPopUpEventId(eventId)
                return temp
            }
        )
    }
    const PersonalInfo = () => {
        return (
            <div style={{display: "flex", justifyContent: "space-around"}}>
                <div className={"government-info"}>
                    <h4>{customNames["government"]}</h4><br/>
                    已完成项目: <strong>{governmentInfo.finished_projects}</strong>
                </div>

                <div className={"ent1-info"}>
                    <h4>{customNames["entrepreneur_1"]}</h4><br/>
                    资金: <strong>{entrepreneurInfo1.money}</strong>
                </div>
                <div className={"ent2-info"}>
                    <h4>{customNames["entrepreneur_2"]}</h4><br/>
                    资金: <strong>{entrepreneurInfo2.money}</strong>
                </div>


                <div className={"civil1-info"}>
                    <h4>{customNames["civil_1"]}</h4><br/>
                    资金: <strong>{civilInfo1.money}</strong><br/>
                    健康值: <strong>{civilInfo1.health}</strong><br/>
                    幸福值: <strong>{civilInfo1.utility}</strong><br/>
                    拥有的物品:
                    <div className={"civil-owned-products"}>
                        {civilInfo1.ownedProducts.map((prod) => {
                            return (
                                <>
                                    <br/>
                                    {prod.productName}:可提供{prod.utility}幸福值,还剩{prod.roundsLeft}轮
                                </>
                            )
                        })}
                    </div>
                </div>
                <div className={"civil2-info"}>
                    <h4>{customNames["civil_2"]}</h4><br/>
                    资金: <strong>{civilInfo2.money}</strong><br/>
                    健康值: <strong>{civilInfo2.health}</strong><br/>
                    幸福值: <strong>{civilInfo2.utility}</strong><br/>

                    拥有的物品:
                    <div className={"civil-owned-products"}>
                        {civilInfo2.ownedProducts.map((prod) => {
                            return (
                                <>
                                    <br/>
                                    {prod.productName}:可提供{prod.utility}幸福值,还剩{prod.roundsLeft}轮
                                </>
                            )
                        })}
                    </div>
                </div>
                <div className={"civil3-info"}>
                    <h4>{customNames["civil_3"]}</h4><br/>
                    资金: <strong>{civilInfo3.money}</strong><br/>
                    健康值: <strong>{civilInfo3.health}</strong><br/>
                    幸福值: <strong>{civilInfo3.utility}</strong><br/>

                    拥有的物品:
                    <div className={"civil-owned-products"}>
                        {civilInfo3.ownedProducts.map((prod) => {
                            return (
                                <>
                                    <br/>
                                    {prod.productName}:可提供{prod.utility}幸福值,还剩{prod.roundsLeft}轮
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>

        )
    }

    const operatePersonalInfo = (identity, data) => {
        switch (identity) {
            case "CIVIL1": {
                setCivilInfo1(data);
                break;
            }
            case "CIVIL2": {
                setCivilInfo2(data);
                break;
            }
            case "CIVIL3": {
                setCivilInfo3(data);
                break;
            }
            case "ENTREPRENEUR1": {
                setEntrepreneurInfo1(data)
                break
            }
            case "ENTREPRENEUR2": {
                setEntrepreneurInfo2(data)
                break
            }
            case "GOVERNMENT": {
                setGovernmentInfo(data)
                break
            }
        }
    }
    return (<Grid container spacing={2} className={"main-game-page"}>
            <PopUp isOpen={isOpen} corpName={popUpCorpName} eventId={popUpEventId} handleClose={() => {
                setIsOpen(false)
            }}/>
            <Countdown time={90} refresh={refresh}/>
            <span className={"first-row"}>
            <Grid xs={6} md={8}>
                <Item>
                    <TopTitleBar title={"历史操作(至多保存10条)"}/>
                    <List className={"history-list"} sx={{width: '100%', bgcolor: 'background.paper'}}>
                        这个区域暂时留白
                    </List>
                </Item>
            </Grid>
            <Grid xs={6} md={4} className={"player-grid"}>
                <Item className={"player-role"}>
                    <strong>{role}</strong>&nbsp;is playing
                </Item>
            </Grid>
                </span>
            <span className={"second-row"}>
            <Grid spacing={2} container md={5} className={"status-table"}>
                <Grid xs={12} md={6}><Item>社会等级:<br/>
                    <ButtonGroup className={"button-group"} variant="contained">
                    <Button disabled={socialLvl !== 1}>1</Button>
                    <Button disabled={socialLvl !== 2}>2</Button>
                    <Button disabled={socialLvl !== 3}>3</Button>
                        <Button disabled={socialLvl !== 4}>4</Button>
                    </ButtonGroup>
                </Item></Grid>
                <Grid md={6}><Item>当前回合:{bigRound}</Item></Grid>
                <Grid
                    md={6}><Item>碳排放量:{encryptedCarbonAmount+"(已加密)"} </Item></Grid>
                <Grid md={6}><Item>当前政策:{currentPolicy.name}</Item></Grid>
            </Grid>
            <Grid xs={8} md={7}>
                <Item>
                    <TopTitleBar title={"状态栏"}/>
                    <List className={"progress-list"} sx={{width: '100%', bgcolor: 'background.paper'}}>
                        {progressList.map((value) => (<ListItem key={value.eventId}>
                            <ProgressTab eventId={value.eventId} corpName={value.displayName} aimNum={value.laborRequired}
                                         currentNum={value.currentNum}></ProgressTab>
                        </ListItem>))}
                    </List>
                </Item>
            </Grid>
            </span>
            <span className={"third-row"}>
        <Grid xs={8} md={6}>
            <Item>
                <TopTitleBar title={"当前所有Buff/Debuff"}/>
                <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                    {buffsNDebuffs.map((value) => (<ListItem key={value.eventId}>
                        {value}
                    </ListItem>))}
                </List>
            </Item>
        </Grid>
        <Grid xs={8} md={4}>
            <Item>
                <TopTitleBar title={"政府招标"}/>
                <List className={"progress-list"} sx={{width: '100%', bgcolor: 'background.paper'}}>
                    {govBids.map((bid) => (<ListItem key={null}>
                        <strong>{bid.projectId}:</strong>{bid.projectName}
                    </ListItem>))}
                </List>
            </Item>
        </Grid>
            <Grid xs={8} md={3}>
            <Item>
                <TopTitleBar title={"正在出售的商品"}/>
                <List className={"progress-list"} sx={{width: '100%', bgcolor: 'background.paper'}}>
                    {productList.map((prod) => (<ListItem key={null}>
                        <strong>{prod.productId}:</strong>{prod.productName}&nbsp;&nbsp;&nbsp;{prod.entrepreneurIds.length}个
                    </ListItem>))}
                </List>
            </Item>
        </Grid>
        </span>
            <Grid xs={12} md={12}>
                <Item>
                    <TopTitleBar title={"个人信息"}/>
                    <List className={"personal-info"} sx={{width: '100%', bgcolor: 'background.paper'}}>
                        <PersonalInfo/>
                    </List>
                </Item>
            </Grid>
            <Grid md={12}><Item className={"private-player-info"}>
                <EndRoundFuncContext.Provider value={endSmallRound}>
                    <UpdateBidListContext.Provider value={(val) => {
                        setGovBids(val)
                    }}>
                        <UpdateCurrentPolicyContext.Provider value={(policy) => setCurrentPolicy(policy)}>
                            <UpdateProgressListContext.Provider value={(progList) => setProgressList(progList)}>
                                <UpdateProductListContext.Provider value={(products) =>
                                    setProductList(products)}>
                                    <UpdatePersonalInfoContext.Provider value={operatePersonalInfo}>
                                        <UpdateCarbonEmissionContext.Provider
                                            value={(carbon) => setCarbonAmount(carbon)}>
                                            <TerminateProgressContext.Provider
                                                value={(corpName, eventId) => terminateProgress(corpName, eventId)}>
                                                <UpdateBuffsContext.Provider
                                                    value={(buffs) => setBuffsNDebuffs(buffs)}>
                                                    {
                                                        <IdentityCard currStage={roundStage}></IdentityCard>
                                                    }
                                                </UpdateBuffsContext.Provider>
                                            </TerminateProgressContext.Provider>
                                        </UpdateCarbonEmissionContext.Provider>
                                    </UpdatePersonalInfoContext.Provider>
                                </UpdateProductListContext.Provider>
                            </UpdateProgressListContext.Provider>
                        </UpdateCurrentPolicyContext.Provider>
                    </UpdateBidListContext.Provider>
                </EndRoundFuncContext.Provider>
            </Item></Grid>
        </Grid>
    )
}