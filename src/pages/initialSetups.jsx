export const setUp = () => {
    localStorage.setItem("custom_names", JSON.stringify({
        "civil_1": "civil_1",
        "civil_2": "civil_2",
        "civil_3": "civil_3",
        "entrepreneur_1": "entrepreneur_1",
        "entrepreneur_2": "entrepreneur_2",
        "government": "government"
    }))
    for (let i = 1; i <= 3; i++) {
        localStorage.setItem("civil_" + i, JSON.stringify({
            name: "civil_" + i,
            identity: "CIVILIAN",
            img: "/Civilian.png",
            utility: 200,//幸福值200
            health: 70,//健康值
            money: 3000,
            ownedProducts: [],
        }))//公民
    }
    for (let i = 1; i <= 2; i++) {
        localStorage.setItem("entrepreneur_" + i, JSON.stringify({
            name: "entrepreneur_" + i,
            identity: "ENTREPRENEUR",
            img: "/entrepreneur.png",
            money: 10000,//10000
            projects_in_progress: 0,
            carbonEmitted: 0
        }))
    }//企业
    localStorage.setItem("government", JSON.stringify({
        name: "government",
        identity: "GOV",
        img: "/government.png",
        finished_projects: 0//0
    }))//政府
    localStorage.setItem("social_lvl", "1")//社会等级
    localStorage.setItem("big_round", "1")//大回合
    localStorage.setItem("small_round", "0")//小回合,从0开始因为要当索引
    localStorage.setItem("curr_round_stage", "public_spk")
    localStorage.setItem("round_broadcast_events", JSON.stringify({gov: [], entrepreneur: [], civil: []}))
    localStorage.setItem("role", "GOVERNMENT")
    localStorage.setItem("progress_list", "[]")
    localStorage.setItem("trans_page_data", JSON.stringify(
        {
            eventName: "发言阶段",
            description: "请每位玩家发言",
            time: 150
        }
    ))
    localStorage.setItem("current_policy", JSON.stringify({
        name: "None",
        id: "None"
    }))
    localStorage.setItem("current_products", "[]")//市面上正在售卖的产品
    localStorage.setItem("functions_activated", JSON.stringify(//对应project_functions中的那些功能
        {
            "Func1": false,
            "Func2": false,
            "Func3": false,
            "Func4": false,
            "Func5": false,
            "Func6": false,
            "Func7": false,
            "Func8": false,
            "Func9": false,
            "Func10": false,
            "Func11": false,
            "Func12": false,
            "Func13": false,
            "Func14": false,
            "Func15": false,
            "Func16": false,
            "Func17": false,
            "Func18": false,
            "Func19": false,
            "Func20": false,
            "Func21": false
        }
    ))
    localStorage.setItem("buffs_n_debuffs", "[]")
    localStorage.setItem("gov_biddings", "[]")
    localStorage.setItem("carbon_amount", "60")
    localStorage.setItem("product_list", "[]")
    localStorage.setItem("carbon_amount_no_longer_increases", "false")
    localStorage.setItem("carbon_after_func13", "0")
    localStorage.setItem("carbon_recovery", "true")//碳排＞75后就不能自动恢复了
    localStorage.setItem("can_buy_medicine", "false")
    localStorage.setItem("projects_started", JSON.stringify({//防止政府招标已经完成或正在进行的项目
        "X01": false,
        "X02": false,
        "X03": false,
        "X04": false,
        "X05": false,
        "X06": false,
        "X07": false,
        "X08": false,
        "X09": false,
        "X10": false,
        "X11": false,
        "X12": false,
        "X13": false,
        "F01": false,
        "F02": false,
        "F03": false,
        "F04": false,
        "F05": false,
        "F06": false,
        "F07": false,
        "F08": false
    }))
    localStorage.setItem("disaster_applied", "false")//防止灾难重复减数值
    localStorage.setItem("bought_products", JSON.stringify({
        "L01": [],
        "L02": [],
        "L03": [],
        "L04": [],
        "L05": [],
        "L06": [],
        "L07": [],
        "L08": [],
        "L09": [],
        "L10": [],
        "L11": [],
        "L12": [],
        "L13": [],
        "L14": [],
        "L15": [],
        "P01": [],
        "P02": [],
        "P03": [],
        "P04": [],
        "P05": [],
        "P06": [],
        "P07": [],
        "P08": [],
        "P09": [],
        "P10": [],
        "P11": [],
        "P12": [],
        "P13": []
    }))//普通人每回合同种产品只能买一个
    localStorage.setItem("civil_1_work_times","0")
    localStorage.setItem("civil_2_work_times","0")
    localStorage.setItem("civil_3_work_times","0")//这三个用于限制普通人每回合只能打3份工
}

export const newBigRound = () => {
    localStorage.setItem("civil_1_work_times","0")
    localStorage.setItem("civil_2_work_times","0")
    localStorage.setItem("civil_3_work_times","0")//这三个用于限制普通人每回合只能打3份工
    localStorage.setItem("bought_products", JSON.stringify({
        "L01": [],
        "L02": [],
        "L03": [],
        "L04": [],
        "L05": [],
        "L06": [],
        "L07": [],
        "L08": [],
        "L09": [],
        "L10": [],
        "L11": [],
        "L12": [],
        "L13": [],
        "L14": [],
        "L15": [],
        "P01": [],
        "P02": [],
        "P03": [],
        "P04": [],
        "P05": [],
        "P06": [],
        "P07": [],
        "P08": [],
        "P09": [],
        "P10": [],
        "P11": [],
        "P12": [],
        "P13": []
    }))//普通人每回合同种产品只能买一个
    let bigRound = JSON.parse(localStorage.getItem("big_round"))
    let carbon = JSON.parse(localStorage.getItem("carbon_amount_no_longer_increases")) ? JSON.parse(localStorage.getItem("carbon_after_func13")) : JSON.parse(localStorage.getItem("carbon_amount"))
    let socialLvl = JSON.parse(localStorage.getItem("social_lvl"))
    let carbonRecover = JSON.parse(localStorage.getItem("carbon_recovery"))
    let civil1 = JSON.parse(localStorage.getItem("civil_1"))
    let civil2 = JSON.parse(localStorage.getItem("civil_2"))
    let civil3 = JSON.parse(localStorage.getItem("civil_3"))
    let entrepreneur1 = JSON.parse(localStorage.getItem("entrepreneur_1"))
    let entrepreneur2 = JSON.parse(localStorage.getItem("entrepreneur_2"))
    let government = JSON.parse(localStorage.getItem("government"))
    let currPolicy = JSON.parse(localStorage.getItem("current_policy"))
    if (carbon >= 75) {
        localStorage.setItem("carbon_recovery", "false")
    } else if (carbonRecover) {
        carbon -= 5
        localStorage.setItem("carbon_amount", JSON.stringify(carbon))
    }
    localStorage.setItem("big_round", JSON.stringify(bigRound + 1))
    localStorage.setItem("small_round", "0")
    localStorage.setItem("disaster_applied", "false")//防止灾难重复减数值
    localStorage.setItem("curr_round_stage", "public_spk")
    localStorage.setItem("role", "GOVERNMENT")
    localStorage.setItem("trans_page_data", JSON.stringify(
        {
            eventName: "发言阶段",
            description: "请每位玩家发言",
            time: 150
        }
    ))
    let civils = [civil1, civil2, civil3]
    let businessMonies = [entrepreneur1.money, entrepreneur2.money]
    let productList = JSON.parse(localStorage.getItem("product_list"))
    productList = productList.map(prod => {
        prod.entrepreneurIds = prod.entrepreneurIds.filter(id => id.at(0) !== "1")
        prod.entrepreneurIds = prod.entrepreneurIds.map(id => {
            return "1" + id.substring(1)
        })
        return prod
    })
    productList=productList.filter(prod=>prod.entrepreneurIds.length!==0)
    localStorage.setItem("product_list",JSON.stringify(productList))
    switch (socialLvl) {
        case 1: {
            console.log(civils.reduce(function (acc, curr) {
                if (curr.health > 0) {
                    return acc + curr.utility
                }
                return acc
            }, 0))
            if (civils.reduce(function (acc, curr) {
                if (curr.health > 0) {
                    return acc + curr.utility
                }
                return acc
            }, 0) >= 1200 && businessMonies.every((money) => money >= 15000) && government.finished_projects >= 4) {
                localStorage.setItem("social_lvl", 2)
            }
            break
        }
        case 2: {
            if (civils.reduce(function (acc, curr) {
                if (curr.health > 0) {
                    return acc + curr.utility
                }
                return acc
            }, 0) >= 2400 && businessMonies.every((money) => money >= 27000) && government.finished_projects >= 7) {
                localStorage.setItem("social_lvl", 3)
            }
            break
        }
        case 3: {
            if (civils.reduce(function (acc, curr) {
                if (curr.health > 0) {
                    return acc + curr.utility
                }
                return acc
            }, 0) >= 6000 && businessMonies.every((money) => money >= 55000) && government.finished_projects >= 9) {
                localStorage.setItem("social_lvl", 4)
            }
        }
    }
    for (let product in civil1.ownedProducts) {
        civil1.utility += civil1.ownedProducts[product].utility
        civil1.ownedProducts[product].roundsLeft -= 1
    }
    for (let product in civil2.ownedProducts) {
        civil2.utility += civil2.ownedProducts[product].utility
        civil2.ownedProducts[product].roundsLeft -= 1
    }
    for (let product in civil3.ownedProducts) {
        civil3.utility += civil3.ownedProducts[product].utility
        civil3.ownedProducts[product].roundsLeft -= 1
    }
    civil1.ownedProducts = civil1.ownedProducts.filter((prod) => {
        return prod.roundsLeft >= 1;
    })
    civil2.ownedProducts = civil2.ownedProducts.filter((prod) => {
        return prod.roundsLeft >= 1;
    })
    civil3.ownedProducts = civil3.ownedProducts.filter((prod) => {
        return prod.roundsLeft >= 1;
    })
    if (currPolicy.id === "G04") {
        civil1.utility += 250
        civil2.utility += 250
        civil3.utility += 250
        civil1.health += 5
        civil2.health += 5
        civil3.health += 5
    }
    civil1.health += 5
    civil2.health += 5
    civil3.health += 5
    localStorage.setItem("civil_1", JSON.stringify(civil1))
    localStorage.setItem("civil_2", JSON.stringify(civil2))
    localStorage.setItem("civil_3", JSON.stringify(civil3))
    localStorage.setItem("current_policy", JSON.stringify({
        name: "None",
        id: "None"
    }))
}