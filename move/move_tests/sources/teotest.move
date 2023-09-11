module move_tests::teotest {
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID};
    use sui::transfer;
    use std::string::{Self,String};
    use sui::balance::Balance;
    use sui::sui::SUI;
    use sui::balance;

    struct VecTest has key, store{
        id: UID,
        myvec: vector<u8>,
        age: u8,
        name: String
    }

    struct SimpleVec has key, store {
        id: UID,
        data: vector<u8>,
        profits: Balance<SUI>
    }

    struct Weapon has key, store {
        id: UID,
        name: String,
        damage: u8
    }


    public entry fun test_vec(v: vector<u8>, name_param: vector<u8>, age_param: u8, ctx: &mut TxContext) {
        transfer::transfer(
            VecTest {
                id: object::new(ctx),
                myvec: v,
                age: age_param,
                name: string::utf8(name_param)
            },
            tx_context::sender(ctx))
    }

    public entry fun create_weapon(name_param: String, damage: u8, ctx: &mut TxContext) {
        transfer::transfer(
            Weapon {
                id: object::new(ctx),
                name: name_param,
                damage
            },
            tx_context::sender(ctx))
    }

    public entry fun create_data(data: vector<u8>, ctx: &mut TxContext) {
        transfer::transfer(
            SimpleVec {
                id: object::new(ctx),
                data,
                profits: balance::zero()
            },
            tx_context::sender(ctx));
    }

}



