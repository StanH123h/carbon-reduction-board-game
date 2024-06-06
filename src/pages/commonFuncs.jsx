import CONST from "../data/constants.json"
export const endRound=()=>{
    let round=JSON.parse(localStorage.getItem("small_round"))
    round+=1
    let currRoundStage;
    currRoundStage=CONST.ROUND_STAGES[round]
    localStorage.setItem("role",CONST.ROLES[round])
    localStorage.setItem("small_round",round)
    localStorage.setItem("curr_round_stage",currRoundStage)
    return [round,currRoundStage]
}