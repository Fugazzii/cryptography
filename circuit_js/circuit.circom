pragma circom 2.0.0;

/*
    Signal definition:
    1. All the inputs are signals
    2. Everytime you multiply 2 signals, you need to define a new signal
    3. Only 2 signals can be multiplied at once to get a new signal
    4. All the outputs are signals
*/

// f(x, y) = (x^2 * y) + (x * y^2) + 17 

template F() {
    signal input x;
    signal input y;
    signal output o;

    signal m1 <== x * x;
    signal m2 <== m1 * y;

    signal m3 <== y * y;
    signal m4 <== m3 * x;

    o <== m2 + m4 + 17;
}

component main = F();