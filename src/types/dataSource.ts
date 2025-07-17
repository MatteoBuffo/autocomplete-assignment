export enum DataSource {
    LOCAL = "local",
    REMOTE = "remote"
}

export const SourceTypeLabels: Record<DataSource, string> = {
    [DataSource.LOCAL]: "Local file",
    [DataSource.REMOTE]: "GitHub"
};
