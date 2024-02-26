use std::num::NonZeroUsize;
use std::time::{SystemTime, UNIX_EPOCH};
use std::{process, thread};
use std::process::Command;
use std::str;
use std::fs;

pub struct Rng;

pub trait RandomNumberGenerator {
    fn gen(&self) -> u64;
}

impl Rng {
    pub fn new() -> Self {
        Rng {}
    }
}

impl RandomNumberGenerator for Rng {
    fn gen(&self) -> u64 {
        let pid = process::id() as u64;
        let current_time: u64 = get_current_time();
        let threads_count = get_threads_count();
        let processes_count = get_processes_count();
        let system_uptime = get_system_uptime();
        let avg_load = get_system_load_average();
        let memory_info = get_memory_info();

        pid
        ^ current_time
        ^ threads_count
        ^ processes_count
        ^ system_uptime
        ^ avg_load
        ^ memory_info
    }
}


fn get_current_time() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_micros() as u64
}

fn get_threads_count() -> u64 {
    thread::available_parallelism()
        .unwrap_or(NonZeroUsize::new(1).unwrap())
        .get() as u64
}

fn get_processes_count() -> u64 {
    let processes_list = Command::new("ps")
        .arg("ax")
        .output()
        .ok()
        .unwrap()
        .stdout;

    str::from_utf8(&processes_list)
        .ok()
        .unwrap()
        .lines()
        .count() as u64
}

fn get_system_uptime() -> u64 {
    fs::read_to_string("/proc/uptime")
        .ok()
        .unwrap()
        .split_whitespace()
        .next()
        .unwrap()
        .parse::<f64>()
        .ok()
        .unwrap() as u64
}

fn get_system_load_average() -> u64 {
    fs::read_to_string("/proc/loadavg")
        .ok()
        .unwrap()
        .split_whitespace()
        .next()
        .unwrap()
        .parse::<f64>()
        .ok()
        .unwrap() as u64
}

fn get_memory_info() -> u64 {
    fs::read_to_string("/proc/meminfo")
        .ok()
        .unwrap()
        .lines()
        .find(|line| line.starts_with("MemTotal"))
        .and_then(|line| line.split_whitespace().nth(1))
        .and_then(|value| value.parse::<u64>().ok())
        .unwrap()
}
