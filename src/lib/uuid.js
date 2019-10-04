function uuid() {
  let hex = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(i => ("0"+i.toString(16)).substr(-2));
  let dashes = [4,2,2,2];
  return hex.reduce((acc, curr) => {
    dashes[0]--;
    if (dashes[0] == 0) {
        dashes.shift();
        return acc + '-' + curr;
    }
    return acc + curr;
  })
}
