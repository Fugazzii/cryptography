// use std::fmt::{LowerHex, Formatter, Result};

// pub struct EllipticCurvePoint {
//     x: u128,
//     y: u128
// }

// impl EllipticCurvePoint {
//     pub fn new(x: u128, y: u128) -> Self {
//         EllipticCurvePoint { x, y }
//     }

//     pub fn add(&self, p: &EllipticCurvePoint) -> EllipticCurvePoint {

//     }
// }

// impl LowerHex for EllipticCurvePoint {
//     fn fmt(&self, f: &mut Formatter<'_>) -> Result {
//         write!(f, "0x{:x}0x{:x}", self.x, self.y)
//     }
// }