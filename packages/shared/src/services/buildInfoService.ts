import buildInfo from "../buildInfo.json";

export interface BuildInfo {
  version: string;
  name: string;
  description: string;
  homepage: string;
  buildTime: string;
  buildTimestamp: number;
  buildDate: string;
  buildDateShort: string;
  buildTimeShort: string;
  commit: string;
  commitShort: string;
  gitBranch: string;
  gitTag: string;
  environment: string;
  buildNumber: string;
  nodeVersion: string;
  platform: string;
  arch: string;
  userAgent: string;
}

export class BuildInfoService {
  static getBuildInfo(): BuildInfo {
    return buildInfo;
  }

  static getVersionString(): string {
    return `v${buildInfo.version}`;
  }

  static getBuildDateString(): string {
    return buildInfo.buildDate;
  }

  static getFullVersionString(): string {
    return `v${buildInfo.version} (${buildInfo.buildDate})`;
  }

  static getCommitString(): string {
    const shortCommit =
      buildInfo.commit === "local" ? "local" : buildInfo.commit.substring(0, 7);
    return shortCommit;
  }
}
