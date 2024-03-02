use crate::Xash;

pub struct Sha1;

const H0: u32= 0x67452301;
const H1: u32= 0xEFCDAB89;
const H2: u32= 0x98BADCFE;
const H3: u32= 0x10325476;
const H4: u32= 0xC3D2E1F0;

impl Xash for Sha1 {
    fn sign(payload: &[u8]) -> String {
        let ml = (payload.len() as u64) * 8;

        let mut message = payload.to_vec();
        todo!()
    }

    fn verify(data: &[u8], hash: String) -> bool {
        todo!()
    }
}
