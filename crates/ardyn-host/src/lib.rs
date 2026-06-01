//! ARDYN host scaffold.
//!
//! Phase 2 models the native host side of the schema handshake. It intentionally
//! does not implement autonomous execution, tool execution, network listeners,
//! API calls, or long-running services.

use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use std::error::Error;
use std::fs;

pub const HOST_CRATE_NAME: &str = "ardyn-host";
pub const ARDYN_SCHEMA_VERSION: &str = "0.1.0";
pub const ARDYN_PHASE: &str = "phase-2-schema-handshake";

pub type HostResult<T> = Result<T, Box<dyn Error + Send + Sync>>;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum CapabilityKind {
    Adapter,
    Browser,
    Desktop,
    McpClient,
    McpServer,
    Memory,
    ModelProvider,
    Tool,
    Workflow,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum PermissionScope {
    Browser,
    Credentials,
    Desktop,
    Filesystem,
    Memory,
    Network,
    Process,
    Provider,
    Registry,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum PermissionAccess {
    Read,
    Write,
    Connect,
    Admin,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum TaskMode {
    Plan,
    DryRun,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynPermission {
    pub scope: PermissionScope,
    pub access: PermissionAccess,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reason: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynCapability {
    pub id: String,
    pub kind: CapabilityKind,
    pub description: String,
    pub permissions: Vec<ArdynPermission>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynRuntime {
    pub host: RuntimeHost,
    pub core: RuntimeCore,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub entrypoint: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum RuntimeHost {
    Rust,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum RuntimeCore {
    Typescript,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynAdapterConfig {
    pub enabled: bool,
    pub external: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub endpoint: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub notes: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynPolicies {
    #[serde(rename = "defaultTaskMode")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub default_task_mode: Option<TaskMode>,
    #[serde(rename = "requiresApprovalFor")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub requires_approval_for: Option<Vec<ApprovalScope>>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum ApprovalScope {
    Browser,
    Credentials,
    Desktop,
    Filesystem,
    Network,
    Process,
    Provider,
    Registry,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum MetadataValue {
    String(String),
    Number(f64),
    Boolean(bool),
    Null,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynTaskConstraints {
    #[serde(rename = "requireHumanApproval")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub require_human_approval: Option<bool>,
    #[serde(rename = "allowNetwork")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub allow_network: Option<bool>,
    #[serde(rename = "maxSteps")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_steps: Option<u16>,
    #[serde(rename = "workspaceRoot")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub workspace_root: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynTask {
    pub id: String,
    pub objective: String,
    pub mode: TaskMode,
    #[serde(rename = "requestedCapabilities")]
    pub requested_capabilities: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub constraints: Option<ArdynTaskConstraints>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub inputs: Option<serde_json::Map<String, serde_json::Value>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<BTreeMap<String, MetadataValue>>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynManifest {
    #[serde(rename = "schemaVersion")]
    pub schema_version: String,
    pub name: String,
    pub version: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    pub runtime: ArdynRuntime,
    pub capabilities: Vec<ArdynCapability>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub adapters: Option<BTreeMap<String, ArdynAdapterConfig>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub policies: Option<ArdynPolicies>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct HostInfo {
    #[serde(rename = "crateName")]
    pub crate_name: String,
    pub responsibilities: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct PlatformInfo {
    pub os: String,
    pub arch: String,
    pub family: String,
    #[serde(rename = "isWindows")]
    pub is_windows: bool,
    #[serde(rename = "windowsFirst")]
    pub windows_first: bool,
    pub notes: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct HostHandshake {
    #[serde(rename = "schemaVersion")]
    pub schema_version: String,
    pub phase: String,
    pub host: HostInfo,
    pub platform: PlatformInfo,
    pub manifest: Option<ArdynManifest>,
    pub capabilities: Vec<ArdynCapability>,
    #[serde(rename = "executionEnabled")]
    pub execution_enabled: bool,
    #[serde(rename = "toolExecutionEnabled")]
    pub tool_execution_enabled: bool,
    #[serde(rename = "autonomousExecutionEnabled")]
    pub autonomous_execution_enabled: bool,
    #[serde(rename = "productionToolExecutionEnabled")]
    pub production_tool_execution_enabled: bool,
    #[serde(rename = "apiCallsEnabled")]
    pub api_calls_enabled: bool,
    #[serde(rename = "networkListening")]
    pub network_listening: bool,
    #[serde(rename = "longRunningServicesStarted")]
    pub long_running_services_started: bool,
    #[serde(rename = "processesSpawned")]
    pub processes_spawned: bool,
}

pub fn host_info() -> HostInfo {
    HostInfo {
        crate_name: HOST_CRATE_NAME.to_string(),
        responsibilities: vec![
            "windows-first-local-host-safety".to_string(),
            "process-supervision-boundary".to_string(),
            "os-integration-boundary".to_string(),
            "packaging-boundary".to_string(),
        ],
    }
}

pub fn platform_info() -> PlatformInfo {
    let is_windows = cfg!(windows);
    PlatformInfo {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        family: std::env::consts::FAMILY.to_string(),
        is_windows,
        windows_first: true,
        notes: if is_windows {
            vec!["Windows host safety boundary is active.".to_string()]
        } else {
            vec![
                "Cross-platform compile path; Windows remains the primary host target.".to_string(),
            ]
        },
    }
}

pub fn load_manifest_path(manifest_path: &str) -> HostResult<ArdynManifest> {
    let contents = fs::read_to_string(manifest_path)?;
    let manifest = serde_json::from_str::<ArdynManifest>(&contents)?;
    Ok(manifest)
}

pub fn host_handshake(manifest_path: Option<&str>) -> HostResult<HostHandshake> {
    let manifest = match manifest_path {
        Some(path) => Some(load_manifest_path(path)?),
        None => None,
    };
    let capabilities = manifest
        .as_ref()
        .map(|manifest| manifest.capabilities.clone())
        .unwrap_or_default();

    Ok(HostHandshake {
        schema_version: ARDYN_SCHEMA_VERSION.to_string(),
        phase: ARDYN_PHASE.to_string(),
        host: host_info(),
        platform: platform_info(),
        manifest,
        capabilities,
        execution_enabled: false,
        tool_execution_enabled: false,
        autonomous_execution_enabled: false,
        production_tool_execution_enabled: false,
        api_calls_enabled: false,
        network_listening: false,
        long_running_services_started: false,
        processes_spawned: false,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn host_handshake_reports_platform_and_disables_execution() {
        let handshake = host_handshake(None).expect("handshake");

        assert_eq!(handshake.phase, "phase-2-schema-handshake");
        assert_eq!(handshake.host.crate_name, HOST_CRATE_NAME);
        assert_eq!(handshake.platform.os, std::env::consts::OS);
        assert_eq!(handshake.platform.arch, std::env::consts::ARCH);
        assert!(!handshake.execution_enabled);
        assert!(!handshake.tool_execution_enabled);
        assert!(!handshake.network_listening);
    }

    #[test]
    fn host_handshake_loads_manifest_path_when_provided() {
        let manifest_path = concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../examples/minimal-manifest/ardyn.manifest.json"
        );

        let handshake = host_handshake(Some(manifest_path)).expect("handshake");

        assert_eq!(handshake.manifest.expect("manifest").name, "minimal-ardyn");
        assert_eq!(handshake.capabilities[0].id, "runtime.describe");
        assert!(!handshake.execution_enabled);
    }
}
