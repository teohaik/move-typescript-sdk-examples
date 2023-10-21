module move_tests::allow_list_test {
    use std::vector;


    const ALLOW_LIST: vector<address> =
        vector[
            @0x7bfe53744b0cef3ec21da0ad284b91f4cd64fa933ba8e0b75a5f263c8543427e,
            @0x7bfe53744b0cef3ec21da0ad284b91f4cd64fa933ba8e0b75a5f26385431123
        ];


    public fun is_whitelisted(add: address) {
        vector::contains(&ALLOW_LIST,&add);
    }

    public fun add_to_whitelist(add: address) {
        vector::push_back(&mut ALLOW_LIST,add);
    }
}



