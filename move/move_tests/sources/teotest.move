module move_tests::teotest {
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID};
    use sui::transfer;
    use std::string::{Self,String};

    struct VecTest has key, store{
        id: UID,
        myvec: vector<u8>,
        age: u8,
        name: String
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
}
