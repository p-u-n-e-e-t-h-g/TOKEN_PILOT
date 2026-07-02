export class CostCalculator {
  estimateUsd(tokens: number, pricePerMillionTokens = 0.15) {
    return (tokens / 1_000_000) * pricePerMillionTokens;
  }
}

