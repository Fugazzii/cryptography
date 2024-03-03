use xec::ec::EllipticCurve;

fn main() {
    let curve = EllipticCurve::new(2, 3);

    println!("{}", curve);
}
