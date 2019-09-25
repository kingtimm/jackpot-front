import {GameObject, GameMoneyTransaction, Person, PotBankAccount} from "~/types";
import {Money} from "~/node_modules/ts-money";

let test_person1:Person = {
    "id": 1,
    "first_name": "Sebastien",
    "last_name": "Thorsby",
    "contact": {"email": "sthorsby0@psu.edu", "phone": "1-(208)492-2543"},
    "gender": "Male",
    "ip_address": "250.213.72.156",
    "avatar": "https://robohash.org/quimodisint.png?size=200x200&set=set1",
    "address": {
        "city": "Idaho Falls",
        "country": "United States",
        "postalCode": "83405",
        "state": "ID",
        "street": "9465 Utah Crossing"
    }
}

let test_person2:Person = {
    "id": 2,
    "first_name": "Neville",
    "last_name": "Chastey",
    "contact": {"email": "nchastey1@fema.gov", "phone": "1-(205)900-8038"},
    "gender": "Male",
    "ip_address": "150.45.99.76",
    "avatar": "https://robohash.org/ducimusenimiste.bmp?size=200x200&set=set1",
    "address": {
        "city": "Birmingham",
        "country": "United States",
        "postalCode": "35279",
        "state": "AL",
        "street": "38347 Springview Avenue"
    }
}

let test_person3:Person = {
    "id": 3,
    "first_name": "Nanny",
    "last_name": "Humble",
    "contact": {"email": "nhumble2@ft.com", "phone": "1-(920)406-2490"},
    "gender": "Female",
    "ip_address": "17.255.88.28",
    "avatar": "https://robohash.org/asperioresnesciuntqui.png?size=200x200&set=set1",
    "address": {
        "city": "Green Bay",
        "country": "United States",
        "postalCode": "54305",
        "state": "WI",
        "street": "2126 Towne Center"
    }
}

let potBankAccount: PotBankAccount = {
    first_name: "Pot",
    id: 999
};

function build_test_transactions_for_player(player:Person, amounts:number[]): GameMoneyTransaction[] {
    let transactions : GameMoneyTransaction[] = []
    for (let amount of amounts) {
        let gmt:GameMoneyTransaction = {
            fromAccount: potBankAccount,
            toAccount: player,
            amount: Money.fromDecimal(amount, "USD")
        }

        if ( amount < 0) {
            gmt.fromAccount = player;
            gmt.toAccount = potBankAccount;
            gmt.amount = Money.fromDecimal(Math.abs(amount), "USD")
        }

        transactions.push(gmt)
    }

    let n = transactions.reduce((sum, currentTransaction) => sum + currentTransaction.amount.toDecimal(), 0);

    return transactions
}

function build_game_transactions(): GameMoneyTransaction[] {
    let transactions : GameMoneyTransaction[] = [];

    transactions.push(... build_test_transactions_for_player(test_person1,[-1,1,3,-4,5,-1,-2]));
    transactions.push(... build_test_transactions_for_player(test_person2,[-1,-2,-3,4,-5,-1,-2]));
    transactions.push(... build_test_transactions_for_player(test_person3,[-1,-1,3,-4,5,-1,-2]));

    return transactions
}

let test_transactions: GameMoneyTransaction[] = build_game_transactions();



let test_game: GameObject = {
    players: [test_person1, test_person2, test_person3],
    transactions: build_game_transactions(),
    pot:potBankAccount
};

export {
    test_person1,
    test_person2,
    test_person3,
    test_transactions,
    test_game
}
