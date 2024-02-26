use std::collections::HashSet;

use crate::rand::Rand;

pub mod rand;
pub mod prng;
pub mod rng;

fn main() {
    let mut generator = Rand::new();
    let mut set = HashSet::<u64>::new();

    const NUM: u64 = 10;

    for _ in 0..NUM as u64 {
        let rand_num = generator.gen_range(1, 100);
        print!("{} ", rand_num);
        set.insert(rand_num);
    }

    println!("\nDuplication occurred {} times", NUM - set.len() as u64);
}
