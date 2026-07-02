export class TokenEstimator {
  estimate(text: string) {
    return Math.ceil(text.length / 4);
  }
}

