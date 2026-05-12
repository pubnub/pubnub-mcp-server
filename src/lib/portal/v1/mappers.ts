import type { KeysetConfig } from "../types";
import type { KeysetProperties } from "./types";

function assignMessagePersistenceProps(config: KeysetConfig, properties: KeysetProperties): void {
  if (!config.messagePersistence) return;

  properties.history = config.messagePersistence.enabled;
  if (config.messagePersistence.retention !== undefined) {
    properties.message_storage_ttl = config.messagePersistence.retention;
  }
}

function assignAppContextProps(config: KeysetConfig, properties: KeysetProperties): void {
  if (!config.appContext) return;

  properties.objects = config.appContext.enabled;
  if (config.appContext.region !== undefined) {
    properties.objects_region = config.appContext.region;
  }
}

function assignFilesProps(config: KeysetConfig, properties: KeysetProperties): void {
  if (!config.files) return;

  properties.files_enabled = config.files.enabled;
  if (config.files.region !== undefined) {
    properties.files_s3_bucket_region = config.files.region;
  }
  if (config.files.retention !== undefined) {
    properties.files_ttl_in_days = config.files.retention;
  }
}

function assignPresenceProps(config: KeysetConfig, properties: KeysetProperties): void {
  if (!config.presence) return;

  properties.presence = config.presence.enabled;
}

export function toProperties(config: KeysetConfig): KeysetProperties {
  const properties: KeysetProperties = {};

  assignMessagePersistenceProps(config, properties);
  assignAppContextProps(config, properties);
  assignFilesProps(config, properties);
  assignPresenceProps(config, properties);

  return properties;
}
