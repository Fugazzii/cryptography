use std::fmt::Display;

#[derive(Debug)]
pub struct EllipticCurve {
    a: u128,
    b: u128
}

impl EllipticCurve {
    pub fn new(a: u128, b: u128) -> Self {
        EllipticCurve { a, b }
    }
}

impl Display for EllipticCurve {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match (self.a, self.b) {
            (0, 0) => write!(f, "y^2 = x^3"), 
            (0, _) => write!(f, "y^2 = x^3 + {}", self.b), 
            (_, 0) => write!(f, "y^2 = x^3 + {}x", self.a), 
            (_, _) => write!(f, "y^2 = x^3 + {}x + {}", self.a, self.b)
        }
    }
}