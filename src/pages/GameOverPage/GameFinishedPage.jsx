import * as React from "react";
import {useState} from "react";

export const GameFinishedPage = () => {
    const civilInfo1 = JSON.parse(localStorage.getItem("civil_1"))
    const civilInfo2 = JSON.parse(localStorage.getItem("civil_2"))
    const civilInfo3 = JSON.parse(localStorage.getItem("civil_3"))
    const customNames = JSON.parse(localStorage.getItem("custom_names"))
    const entrepreneurInfo1 = JSON.parse(localStorage.getItem("entrepreneur_1"))
    const entrepreneurInfo2 = JSON.parse(localStorage.getItem("entrepreneur_2"))
    const governmentInfo = JSON.parse(localStorage.getItem("government"))
    const socialLvl = JSON.parse(localStorage.getItem("social_lvl"))
    return (
        <>
            <h1 style={{textAlign: "center", color: "lightgreen"}}>
                {socialLvl === 4 ? "社会等级成功升级至4🎉🎉🎉，游戏圆满结束!" : "10轮已到，游戏结束"}
            </h1>
            <h3 style={{display: "flex", alignItems: "baseline"}}>最终社会等级:<h2
                style={{color: "orange"}}>{socialLvl}</h2></h3>
            <div style={{display: "flex", justifyContent: "space-around"}}>
                <div className={"government-info"}>
                    <h4>{customNames["government"]}</h4><br/>
                    已完成项目: <strong
                    style={{color: governmentInfo.finished_projects >= 9 ? "lightgreen" : "red"}}>{governmentInfo.finished_projects}</strong>
                </div>
                <div className={"ent1-info"}>
                    <h4>{customNames["entrepreneur_1"]}</h4><br/>
                    资金: <strong
                    style={{color: entrepreneurInfo1.money >= 60000 ? "lightgreen" : "red"}}>{entrepreneurInfo1.money}</strong>
                </div>
                <div className={"ent2-info"}>
                    <h4>{customNames["entrepreneur_2"]}</h4><br/>
                    资金: <strong
                    style={{color: entrepreneurInfo2.money >= 60000 ? "lightgreen" : "red"}}>{entrepreneurInfo2.money}</strong>
                </div>
                <div className={"civil1-info"}>
                    <h4>{customNames["civil_1"]}</h4><br/>
                    健康值: <strong style={{color: civilInfo1.health >= 60 ? "lightgreen" : "red"}}>{civilInfo1.health}</strong><br/>
                    幸福值: <strong
                    style={{color: civilInfo1.utility >= 2000 ? "lightgreen" : "red"}}>{civilInfo1.utility}</strong><br/>
                </div>
                <div className={"civil2-info"}>
                    <h4>{customNames["civil_2"]}</h4><br/>
                    健康值: <strong  style={{color: civilInfo2.health >= 60 ? "lightgreen" : "red"}}>{civilInfo2.health}</strong><br/>
                    幸福值: <strong
                    style={{color: civilInfo2.utility >= 2000 ? "lightgreen" : "red"}}>{civilInfo2.utility}</strong><br/>
                </div>
                <div className={"civil3-info"}>
                    <h4>{customNames["civil_3"]}</h4><br/>
                    健康值: <strong  style={{color: civilInfo3.health >= 60 ? "lightgreen" : "red"}}>{civilInfo3.health}</strong><br/>
                    幸福值: <strong
                    style={{color: civilInfo3.utility >= 2000 ? "lightgreen" : "red"}}>{civilInfo3.utility}</strong><br/>
                </div>
            </div>
            <div>
                各角色胜利指标: <br/>
                公民:幸福值2000+,健康值60+ <br/>
                企业:资金60000+ <br/>
                政府:项目9+
            </div>
        </>
    )
}