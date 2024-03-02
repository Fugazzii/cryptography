pub trait Xash {
    fn sign(payload: &[u8]) -> String;
    fn verify(data: &[u8], hash: String) -> bool;
}

pub mod sha1;