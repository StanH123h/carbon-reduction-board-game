export const setUp = () => {
    for (let i = 1; i <= 3; i++) {
        localStorage.setItem("civil_" + i, JSON.stringify({
            name: "civil_" + i,
            identity: "CIVILIAN",
            img: "/Civilian.png",
            utility: 200,//幸福值
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
            money: 10000,
            projects_in_progress: 0,
            carbonEmitted: 0
        }))
    }//企业
    localStorage.setItem("government", JSON.stringify({
        name: "government",
        identity: "GOV",
        img: "/government.png",
        finished_projects: 0
    }))//政府
    localStorage.setItem("social_lvl", "1")//社会等级
    localStorage.setItem("big_round", "1")//大回合
    localStorage.setItem("small_round", "0")//小回合
    localStorage.setItem("curr_round_stage", "public_spk")
    localStorage.setItem("round_broadcast_events", JSON.stringify({gov: [], entrepreneur: [], civil: []}))
    localStorage.setItem("history_events", "[]")
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
}

export const newBigRound = () => {
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
    localStorage.setItem("curr_round_stage", "public_spk")
    localStorage.setItem("role", "GOVERNMENT")
    localStorage.setItem("trans_page_data", JSON.stringify(
        {
            eventName: "发言阶段",
            description: "请每位玩家发言",
            time: 150
        }
    ))
    let utilities = [civil1.utility, civil2.utility, civil3.utility]
    let businessMonies = [entrepreneur1.money, entrepreneur2.money]
    let healths = [civil1.health, civil2.health, civil3.health]
    switch (socialLvl) {
        case 1: {
            if (utilities.every((util) => util > 400) && businessMonies.every((money) => money > 15000) && government.finished_projects >= 4 && healths.every((health) => health > 60)) {
                localStorage.setItem("social_lvl", 2)
            }
            break
        }
        case 2: {
            if (utilities.every((util) => util > 800) && businessMonies.every((money) => money > 27000) && government.finished_projects >= 7 && healths.every((health) => health > 60)) {
                localStorage.setItem("social_lvl", 3)
            }
            break
        }
        case 3: {
            if (utilities.every((util) => util > 2000) && businessMonies.every((money) => money > 55000) && government.finished_projects >= 9 && healths.every((health) => health > 60)) {
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
    civil2.ownedProducts = civil1.ownedProducts.filter((prod) => {
        return prod.roundsLeft >= 1;
    })
    civil3.ownedProducts = civil1.ownedProducts.filter((prod) => {
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