pub trait SymmetricAlgorithm {
    fn encrypt(plaintext: String, key: String) -> String;
    fn decrypt(ciphertext: String, key: String) -> String;
}

pub trait AssymetricAlgorithm {
    fn encrypt(plaintext: String) -> String;
    fn decrypt(ciphertext: String, secret_key: String) -> String;
}