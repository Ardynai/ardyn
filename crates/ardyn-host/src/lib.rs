//! ARDYN host scaffold.
//!
//! Phase 2 models the native host side of the schema handshake. It intentionally
//! does not implement autonomous execution, tool execution, network listeners,
//! API calls, or long-running services.

use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use std::error::Error;
use std::fs;
use std::io::{Error as IoError, ErrorKind};

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

fn validation_error(message: impl Into<String>) -> Box<dyn Error + Send + Sync> {
    Box::new(IoError::new(ErrorKind::InvalidData, message.into()))
}

fn is_ascii_lower_or_digit(value: u8) -> bool {
    value.is_ascii_lowercase() || value.is_ascii_digit()
}

fn is_valid_manifest_name(value: &str) -> bool {
    let bytes = value.as_bytes();
    (3..=64).contains(&bytes.len())
        && bytes[0].is_ascii_lowercase()
        && is_ascii_lower_or_digit(bytes[bytes.len() - 1])
        && bytes[1..bytes.len() - 1]
            .iter()
            .all(|byte| is_ascii_lower_or_digit(*byte) || *byte == b'-')
}

fn is_valid_semver(value: &str) -> bool {
    let (core, prerelease) = match value.split_once('-') {
        Some((core, prerelease)) if !prerelease.is_empty() => (core, Some(prerelease)),
        Some(_) => return false,
        None => (value, None),
    };
    let mut parts = core.split('.');

    let has_three_numeric_parts = matches!(
        (parts.next(), parts.next(), parts.next(), parts.next()),
        (Some(major), Some(minor), Some(patch), None)
            if [major, minor, patch]
                .iter()
                .all(|part| !part.is_empty() && part.bytes().all(|byte| byte.is_ascii_digit()))
    );

    has_three_numeric_parts
        && match prerelease {
            Some(prerelease) => prerelease
                .bytes()
                .all(|byte| byte.is_ascii_alphanumeric() || byte == b'.' || byte == b'-'),
            None => true,
        }
}

fn matches_capability_id_pattern(value: &str) -> bool {
    !value.is_empty()
        && value.split('.').all(|segment| {
            !segment.is_empty()
                && segment.as_bytes()[0].is_ascii_lowercase()
                && segment
                    .bytes()
                    .all(|byte| is_ascii_lower_or_digit(byte) || byte == b'-')
        })
}

fn is_valid_capability_id(value: &str) -> bool {
    (3..=96).contains(&value.len()) && matches_capability_id_pattern(value)
}

fn is_valid_task_id(value: &str) -> bool {
    (3..=128).contains(&value.len())
        && value.as_bytes()[0].is_ascii_alphanumeric()
        && value
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'_' | b'.' | b':' | b'-'))
}

fn validate_optional_string(
    field: &str,
    value: Option<&str>,
    min_len: Option<usize>,
    max_len: Option<usize>,
) -> HostResult<()> {
    let Some(value) = value else {
        return Ok(());
    };
    let length = value.chars().count();

    if min_len.is_some_and(|minimum| length < minimum) {
        return Err(validation_error(format!(
            "{field} is shorter than schema minimum"
        )));
    }

    if max_len.is_some_and(|maximum| length > maximum) {
        return Err(validation_error(format!(
            "{field} is longer than schema maximum"
        )));
    }

    Ok(())
}

pub fn validate_task(task: &ArdynTask) -> HostResult<()> {
    if !is_valid_task_id(&task.id) {
        return Err(validation_error("task.id does not match schema pattern"));
    }

    validate_optional_string("task.objective", Some(&task.objective), Some(1), Some(4000))?;

    if task.requested_capabilities.is_empty() {
        return Err(validation_error(
            "task.requestedCapabilities must contain at least one capability",
        ));
    }

    for capability_id in &task.requested_capabilities {
        if !matches_capability_id_pattern(capability_id) {
            return Err(validation_error(
                "task.requestedCapabilities contains an invalid capability id",
            ));
        }
    }

    if let Some(constraints) = &task.constraints {
        if let Some(max_steps) = constraints.max_steps {
            if !(1..=1000).contains(&max_steps) {
                return Err(validation_error(
                    "task.constraints.maxSteps is outside schema bounds",
                ));
            }
        }

        validate_optional_string(
            "task.constraints.workspaceRoot",
            constraints.workspace_root.as_deref(),
            Some(1),
            None,
        )?;
    }

    Ok(())
}

pub fn validate_manifest(manifest: &ArdynManifest) -> HostResult<()> {
    if manifest.schema_version != ARDYN_SCHEMA_VERSION {
        return Err(validation_error("manifest.schemaVersion must be 0.1.0"));
    }

    if !is_valid_manifest_name(&manifest.name) {
        return Err(validation_error(
            "manifest.name does not match schema pattern",
        ));
    }

    if !is_valid_semver(&manifest.version) {
        return Err(validation_error(
            "manifest.version does not match schema pattern",
        ));
    }

    validate_optional_string(
        "manifest.description",
        manifest.description.as_deref(),
        Some(1),
        Some(280),
    )?;

    validate_optional_string(
        "manifest.runtime.entrypoint",
        manifest.runtime.entrypoint.as_deref(),
        Some(1),
        Some(240),
    )?;

    if manifest.capabilities.is_empty() {
        return Err(validation_error(
            "manifest.capabilities must contain at least one capability",
        ));
    }

    for capability in &manifest.capabilities {
        if !is_valid_capability_id(&capability.id) {
            return Err(validation_error(
                "manifest.capabilities[].id does not match schema pattern",
            ));
        }

        validate_optional_string(
            "manifest.capabilities[].description",
            Some(&capability.description),
            Some(1),
            Some(280),
        )?;

        if capability.permissions.is_empty() {
            return Err(validation_error(
                "manifest.capabilities[].permissions must contain at least one permission",
            ));
        }

        for permission in &capability.permissions {
            validate_optional_string(
                "manifest.capabilities[].permissions[].reason",
                permission.reason.as_deref(),
                Some(1),
                Some(240),
            )?;
        }
    }

    if let Some(adapters) = &manifest.adapters {
        for adapter in adapters.values() {
            validate_optional_string(
                "manifest.adapters.*.endpoint",
                adapter.endpoint.as_deref(),
                Some(1),
                Some(240),
            )?;
            validate_optional_string(
                "manifest.adapters.*.notes",
                adapter.notes.as_deref(),
                None,
                Some(400),
            )?;
        }
    }

    Ok(())
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
    validate_manifest(&manifest)?;
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
    use std::time::{SystemTime, UNIX_EPOCH};

    fn write_temp_manifest(contents: &str) -> std::path::PathBuf {
        let unique = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("system time")
            .as_nanos();
        let path = std::env::temp_dir().join(format!("ardyn-host-invalid-manifest-{unique}.json"));

        std::fs::write(&path, contents).expect("write manifest");

        path
    }

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

    #[test]
    fn load_manifest_path_rejects_invalid_schema_version() {
        let manifest = r#"{
            "schemaVersion": "9.9.9",
            "name": "invalid-version",
            "version": "0.1.0",
            "runtime": { "host": "rust", "core": "typescript" },
            "capabilities": [
                {
                    "id": "runtime.describe",
                    "kind": "tool",
                    "description": "Describe runtime metadata.",
                    "permissions": [
                        { "scope": "registry", "access": "read" }
                    ]
                }
            ]
        }"#;

        let path = write_temp_manifest(manifest);
        let error =
            load_manifest_path(path.to_str().expect("manifest path")).expect_err("schema version");
        std::fs::remove_file(path).expect("remove manifest");

        assert!(error.to_string().contains("schemaVersion"));
    }

    #[test]
    fn load_manifest_path_rejects_empty_capabilities() {
        let manifest = r#"{
            "schemaVersion": "0.1.0",
            "name": "empty-capabilities",
            "version": "0.1.0",
            "runtime": { "host": "rust", "core": "typescript" },
            "capabilities": []
        }"#;

        let path = write_temp_manifest(manifest);
        let error = load_manifest_path(path.to_str().expect("manifest path"))
            .expect_err("empty capabilities");
        std::fs::remove_file(path).expect("remove manifest");

        assert!(error.to_string().contains("capabilities"));
    }

    fn valid_task_with_objective(objective: String) -> ArdynTask {
        ArdynTask {
            id: "task_01".to_string(),
            objective,
            mode: TaskMode::DryRun,
            requested_capabilities: vec!["runtime.describe".to_string()],
            constraints: None,
            inputs: None,
            metadata: None,
        }
    }

    fn valid_manifest_with_capability_description(description: String) -> ArdynManifest {
        ArdynManifest {
            schema_version: ARDYN_SCHEMA_VERSION.to_string(),
            name: "valid-manifest".to_string(),
            version: "0.1.0".to_string(),
            description: None,
            runtime: ArdynRuntime {
                host: RuntimeHost::Rust,
                core: RuntimeCore::Typescript,
                entrypoint: None,
            },
            capabilities: vec![ArdynCapability {
                id: "runtime.describe".to_string(),
                kind: CapabilityKind::Tool,
                description,
                permissions: vec![ArdynPermission {
                    scope: PermissionScope::Registry,
                    access: PermissionAccess::Read,
                    reason: None,
                }],
            }],
            adapters: None,
            policies: None,
        }
    }

    #[test]
    fn validate_task_accepts_multibyte_objective_at_schema_boundary() {
        let task = valid_task_with_objective("é".repeat(4000));

        validate_task(&task).expect("4000 character objective should pass");
    }

    #[test]
    fn validate_task_rejects_multibyte_objective_beyond_schema_boundary() {
        let task = valid_task_with_objective("é".repeat(4001));

        let error = validate_task(&task).expect_err("4001 character objective should fail");

        assert!(error.to_string().contains("objective"));
    }

    #[test]
    fn validate_manifest_accepts_multibyte_capability_description_at_schema_boundary() {
        let manifest = valid_manifest_with_capability_description("é".repeat(280));

        validate_manifest(&manifest).expect("280 character capability description should pass");
    }

    #[test]
    fn validate_manifest_rejects_multibyte_capability_description_beyond_schema_boundary() {
        let manifest = valid_manifest_with_capability_description("é".repeat(281));

        let error = validate_manifest(&manifest)
            .expect_err("281 character capability description should fail");

        assert!(error.to_string().contains("description"));
    }

    #[test]
    fn validate_task_rejects_invalid_constraint_bounds() {
        let task = ArdynTask {
            id: "task_01".to_string(),
            objective: "Describe runtime metadata without executing tools.".to_string(),
            mode: TaskMode::DryRun,
            requested_capabilities: vec!["runtime.describe".to_string()],
            constraints: Some(ArdynTaskConstraints {
                require_human_approval: Some(true),
                allow_network: Some(false),
                max_steps: Some(1001),
                workspace_root: None,
            }),
            inputs: None,
            metadata: None,
        };

        let error = validate_task(&task).expect_err("maxSteps should fail");

        assert!(error.to_string().contains("maxSteps"));
    }
}
