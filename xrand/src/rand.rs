use std::marker::PhantomData;

use crate::{
    prng::{
        Prng, 
        PseudoRandomNumberGenerator
    }, 
    rng::{
        RandomNumberGenerator,
        Rng
    }
};

pub struct Rand<T, U>
where 
    T: PseudoRandomNumberGenerator<U>,
    U: RandomNumberGenerator 
{
    prng: T,
    marker: PhantomData<U>
}

impl Rand<Prng<Rng>, Rng> {
    pub fn new() -> Self {
        let prng = Prng::init(Rng);

        Rand {
            marker: PhantomData,
            prng
        }
    }

    pub fn gen(&mut self) -> u64 {
        self.prng.next()
    }

    pub fn gen_range(&mut self, from: u64, to: u64) -> u64 {
        if from >= to {
            panic!("From value is more than to value");
        }

        let range_size = to - from;
        let random_value = self.prng.next();

        (random_value % range_size) + from
    }
}