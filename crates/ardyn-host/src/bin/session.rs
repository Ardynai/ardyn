// M1-Rust: CLI binary that invokes the real session lifecycle
// Usage: ardyn-host-session --approved --max-frames 4
// Output: JSON to stdout

use ardyn_host::stdio_runtime::run_session_lifecycle;

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let approved = args.iter().any(|a| a == "--approved");
    let max_frames: usize = args
        .iter()
        .position(|a| a == "--max-frames")
        .and_then(|i| args.get(i + 1))
        .and_then(|v| v.parse().ok())
        .unwrap_or(8);

    let result = run_session_lifecycle(approved, max_frames);
    let json = serde_json::to_string_pretty(&result).unwrap_or_else(|e| {
        eprintln!("Error serializing result: {e}");
        std::process::exit(1);
    });
    println!("{json}");
}