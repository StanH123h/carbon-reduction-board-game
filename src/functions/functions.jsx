export const projectFunc=(funcId,extraFunc=()=>{})=>{
    let projectFuncActivated=JSON.parse(localStorage.getItem("functions_activated"))
    switch (funcId){
        case "Func1":{
            projectFuncActivated["Func1"]=true;
            let carbonAmount=JSON.parse(localStorage.getItem("carbon_amount"))
            carbonAmount-=5
            if(carbonAmount<0){
                carbonAmount=0
            }
            localStorage.setItem("carbon_amount",JSON.stringify(carbonAmount))
        }
    }
}