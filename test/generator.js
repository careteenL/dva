function* task1() {
  yield 1;
  yield go();
  yield 2;
}
function* go() {
  yield 3;
  yield 4;
}

co(task1);
co(go);
