export type UsageRecord = {
  provider: string;
  model: string;
  tokens: number;
  costUsd: number;
};

export class UsageTracker {
  private records: UsageRecord[] = [];

  track(record: UsageRecord) {
    this.records.push(record);
  }

  list() {
    return [...this.records];
  }
}

