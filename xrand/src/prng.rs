use crate::rng::RandomNumberGenerator;
use std::hash::{Hash, Hasher};

pub struct Prng<T>
where
    T: RandomNumberGenerator,
{
    rng: T,
    state: u64,
}

pub trait PseudoRandomNumberGenerator<T>
where
    T: RandomNumberGenerator,
{
    fn init(rng: T) -> Self;
    fn refresh(&mut self);
    fn next(&mut self) -> u64;
}

impl<T> PseudoRandomNumberGenerator<T> for Prng<T>
where
    T: RandomNumberGenerator,
{
    fn init(rng: T) -> Self {
        Prng {
            state: hash_state(&rng.gen()),
            rng,
        }
    }

    fn refresh(&mut self) {
        self.state = hash_state(&self.rng.gen());
    }

    fn next(&mut self) -> u64 {
        let result: u64 = self.state;
        self.refresh();
        result
    }
}

fn hash_state<T>(value: &T) -> u64
where
    T: Hash,
{
    let mut hasher = std::collections::hash_map::DefaultHasher::new();
    value.hash(&mut hasher);
    hasher.finish()
}
