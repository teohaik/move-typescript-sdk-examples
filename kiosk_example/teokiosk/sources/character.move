
module teokiosk::character{
    use std::string::{utf8, String};
    use sui::tx_context::{sender, TxContext};
    use sui::object::{Self,  UID};
    use sui::transfer;

    use sui::kiosk::{Self,Kiosk};


    struct Character has key, store {
        id: UID,
        name: String,
        url: String
    }

    /// Capability granting mint permission.
    struct MintCap has key, store {id: UID }

    fun init(ctx: &mut TxContext){
        let mintCap = MintCap{
            id: object::new(ctx)
        };
        transfer::public_transfer(mintCap, sender(ctx));
    }

    /// Create new `Avatar` struct.
    public fun mint(
    _: &mut MintCap,
    name: String,
    ctx: &mut TxContext
    ): Kiosk {

        let character = Character {
            id : object::new(ctx),
            name,
            url: utf8(b"https://testnet.suifrens.com/images/capy-about.svg")
        };

        let (kiosk, kioskOwnerCap) = kiosk::new(ctx);

        kiosk::place<Character>(&mut kiosk, &kioskOwnerCap, character);

        transfer::public_transfer(kioskOwnerCap, sender(ctx));
        kiosk
    }

    #[test_only]
    public fun createMintCapForTesting( ctx: &mut TxContext) : MintCap{
        MintCap{ id: object::new(ctx)
        }
    }

    #[test_only]
    public fun destroy_mint_cap(cap: MintCap) {
        let MintCap { id } = cap;
        object::delete(id)
    }

}

#[test_only]
module teokiosk::unit_tests {
    use std::string::utf8;
    use sui::transfer;

    use sui::test_scenario as ts;
    use sui::kiosk;
    use teokiosk::character::{destroy_mint_cap};

    #[test]
    fun create_kiosk() {

        let user = @0x1;
        let test = ts::begin(user);
        ts::next_tx(&mut test, user);

        let mintCap = teokiosk::character::createMintCapForTesting(ts::ctx(&mut test));
        let kiosk = teokiosk::character::mint(&mut mintCap, utf8(b"test"), ts::ctx(&mut test));

        assert!(user == kiosk::owner(&kiosk), 66);

        transfer::public_share_object(kiosk);
        destroy_mint_cap(mintCap);
        ts::end(test);
    }
}