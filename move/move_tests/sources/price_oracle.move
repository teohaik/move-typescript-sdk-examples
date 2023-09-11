module move_tests::price_oracle {

    use std::vector;
    use std::string::{String};

    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID};
    use sui::vec_map::{Self, VecMap};
    use sui::transfer;
    use sui::dynamic_object_field as dof;

    //Error Codes
    const EKeysValuesShouldBeSameLength: u64 = 1;


    struct PriceAdminCap has key {
        id: UID
    }

    struct Price has key, store {
        id: UID,
        time: u64,
        label: String,
        publisher1: VecMap<String, String>,
        publisher2: VecMap<String, String>,
        publisher3: VecMap<String, String>,
        publisher4: VecMap<String, String>
    }

    struct PriceWithMap has key, store {
        id: UID,
        time: u64,
        label: String,
        publishers: VecMap<u8, VecMap<String, String>>,
    }

    struct TeoPriceOracle has key {
        id: UID
    }

    fun init(ctx: &mut TxContext) {
        let adminCap = PriceAdminCap {
            id: object::new(ctx)
        };
        transfer::transfer(adminCap, tx_context::sender(ctx));

        let teoPriceOracle = TeoPriceOracle {
            id: object::new(ctx)
        };
        transfer::share_object(teoPriceOracle);
    }

    fun new_price(
        time: u64,
        label: String,
        publisher1Keys: vector<String>,
        publisher1values: vector<String>,
        ctx: &mut TxContext
    ): Price {
        let publisher1Map = convert_keys_values_to_map(publisher1Keys, publisher1values);

        let price = Price {
            id: object::new(ctx),
            time,
            label,
            publisher1: publisher1Map,
            publisher2: vec_map::empty<String, String>(),
            publisher3: vec_map::empty<String, String>(),
            publisher4: vec_map::empty<String, String>()
        };
        price
    }


    public fun publish_price(_: &PriceAdminCap,
                             teoPriceOracle: &mut TeoPriceOracle,
                             time: u64,
                             label: String,
                             publisher1Keys: vector<String>,
                             publisher1values: vector<String>,
                             ctx: &mut TxContext
    ) {
        if (!dof::exists_<String>(&teoPriceOracle.id, label)) {
            let newPrice = new_price(time, label, publisher1Keys, publisher1values, ctx);
            dof::add<String, Price>(&mut teoPriceOracle.id, label, newPrice);
        };
        let old_price = dof::borrow_mut<String, Price>(&mut teoPriceOracle.id, label);

        old_price.time = time;
        old_price.publisher1 = convert_keys_values_to_map(publisher1Keys, publisher1values);
    }

    fun convert_keys_values_to_map(
        keys: vector<String>,
        values: vector<String>,
    ): VecMap<String, String> {
        assert!(vector::length(&keys) == vector::length(&values), EKeysValuesShouldBeSameLength);
        let theMap = vec_map::empty<String, String>();
        let total = vector::length(&keys);
        let i = 0;

        while (i < total) {
            let key = vector::borrow(&keys, i);
            let value = vector::borrow(&values, i);
            vec_map::insert(&mut theMap, *key, *value);
            i = i + 1;
        };
        theMap
    }


    public fun new_price_2(
        _: &mut PriceAdminCap,
        time: u64,
        label: String,
        /*
        [
         [r,s,v],
         [r,s,v],
         ....
        ]
        */
        publisherData: &mut vector<vector<String>>,
        ctx: &mut TxContext
    ): PriceWithMap {
        let publishersMap = vec_map::empty<u8, VecMap<String, String>>(); //1=>[r=r, s=s=,v=v]

        let total = vector::length(publisherData) ; //For Each published we have 2 vectors (keys, values)

        let index = 0;
        let publisherIndex: u8 = 1;

        while (index < total) {
            let publisherKeys = vector::borrow(publisherData, index);
            index = index + 1;
            let publisherValues = vector::borrow(publisherData, index);

            let i = 0;
            let totalKeys = vector::length(publisherKeys);

            let publisherMap = vec_map::empty<String, String>();

            while (i < totalKeys) {
                let key = vector::borrow(publisherKeys, i);
                let value = vector::borrow(publisherValues, i);
                vec_map::insert(&mut publisherMap, *key, *value);
            };
            vec_map::insert(&mut publishersMap, publisherIndex, publisherMap);
            index = index + 1;
            publisherIndex = publisherIndex + 1;
        };

        let price2 = PriceWithMap {
            id: object::new(ctx),
            time,
            label,
            publishers: publishersMap
        };
        price2
    }
}