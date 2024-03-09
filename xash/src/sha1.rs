use std::io::Write;
use crate::Xash;
pub struct Sha1;

impl Xash for Sha1 {
    fn sign(input: &str) -> String {
        let payload = input.as_bytes();

        let mut h0 = 0x67452301u32;
        let mut h1 = 0xEFCDAB89u32;
        let mut h2 = 0x98BADCFEu32;
        let mut h3 = 0x10325476u32;
        let mut h4 = 0xC3D2E1F0u32;

        let ml = (payload.len() as u64) * 8;

        let mut message = payload.to_vec();
        message.push(0x80);

        while (message.len() * 8) % 512 != 448 {
            message.push(0);
        }

        message.write_all(&ml.to_be_bytes()).unwrap();

        for chunk in message.chunks(64) {
            let mut words = vec![];

            for i in (0..16).rev() {
                let start = i * 4;
                let end = start + 4;
                let word = u32::from_be_bytes(chunk[start..end].try_into().unwrap());
                words.push(word);
            }

            for i in 16..80 {
                let word = (words[i - 3] ^ words[i - 8] ^ words[i - 14] ^ words[i - 16])
                    .rotate_left(1);
                words.push(word);
            }

            let (mut a, mut b, mut c, mut d, mut e) = (h0, h1, h2, h3, h4);

            for i in 0..80 as u32 {
                let (f, k) = match i {
                    0..=19 => ((b & c) | ((!b) & d), 0x5A827999),
                    20..=39 => (b ^ c ^ d, 0x6ED9EBA1),
                    40..=59 => ((b & c) | (b & d) | (c & d), 0x8F1BBCDC),
                    60..=79 => (b ^ c ^ d, 0xCA62C1D6),
                    _ => unreachable!(),
                };

                let temp = Self::left_rotate(a, 5)
                    .wrapping_add(f)
                    .wrapping_add(e)
                    .wrapping_add(k)
                    .wrapping_add(words[i as usize]);
                e = d;
                d = c;
                c = Self::left_rotate(b, 30);
                b = a;
                a = temp;
            }

            h0 = h0.wrapping_add(a);
            h1 = h1.wrapping_add(b);
            h2 = h2.wrapping_add(c);
            h3 = h3.wrapping_add(d);
            h4 = h4.wrapping_add(e);
        }

        let mut result = Vec::new();
        
        result.write_all(&h0.to_be_bytes()).unwrap();
        result.write_all(&h1.to_be_bytes()).unwrap();
        result.write_all(&h2.to_be_bytes()).unwrap();
        result.write_all(&h3.to_be_bytes()).unwrap();
        result.write_all(&h4.to_be_bytes()).unwrap();

        result
            .iter()
            .map(|byte| format!("{:02x}", byte))
            .collect()
    }

    fn verify(data: &str, hash: String) -> bool {
        Self::sign(data) == hash
    }
}

impl Sha1 {
    fn left_rotate(n: u32, b: u32) -> u32 {
        (n << b) | (n >> (32 - b))
    }    
}