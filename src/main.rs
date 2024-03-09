use xash::{sha1::Sha1, Xash};

fn main() {
    let hash = Sha1::sign("ilia");

    println!("Hash: {}", hash);
    assert_eq!(Sha1::verify("afddb6d5d59e59ee33b218be0abeaa8a63d6a79a", hash), true)
}
