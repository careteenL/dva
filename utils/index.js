export function delay(timeout) {
  return new Promise(function (resolve) {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}
