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
  gitTag: string | null;
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

  static getBuildDateShort(): string {
    return buildInfo.buildDateShort;
  }

  static getBuildTimeShort(): string {
    return buildInfo.buildTimeShort;
  }

  static getFullVersionString(): string {
    return `v${buildInfo.version} (${buildInfo.buildDateShort})`;
  }

  static getCommitString(): string {
    return buildInfo.commitShort;
  }

  static getFullCommitString(): string {
    return buildInfo.commit;
  }

  static getPlatformString(): string {
    return `${buildInfo.platform} (${buildInfo.arch})`;
  }

  static getEnvironmentString(): string {
    return buildInfo.environment;
  }

  static getBuildNumberString(): string {
    return buildInfo.buildNumber;
  }

  static getNodeVersionString(): string {
    return buildInfo.nodeVersion;
  }

  static getGitBranchString(): string {
    return buildInfo.gitBranch;
  }

  static getGitTagString(): string {
    return buildInfo.gitTag || "none";
  }

  static getComprehensiveBuildString(): string {
    return `${buildInfo.version}-${buildInfo.commitShort} (${buildInfo.buildDateShort})`;
  }
}
