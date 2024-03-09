pub trait Xash {
    fn sign(payload: &str) -> String;
    fn verify(data: &str, hash: String) -> bool;
}

pub mod sha1;