pub mod rand;

#[cfg(test)]
mod tests {
    use std::collections::HashSet;
    use crate::rand::Rand;

    #[test]
    fn it_works() {
        let mut generator = Rand::new();
        let mut set = HashSet::<u64>::new();
    
        const NUM: u64 = 10;
    
        for _ in 0..NUM as u64 {
            set.insert(generator.gen_range(1, 1000));
        }
    
        assert_eq!(set.len() as u64, NUM, "No duplications should occur");
    }
}
