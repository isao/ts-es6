interface Greetable {
  name: string;
}

function greet(thing: Greetable): void {
  const foo = [1, 2, 3].reduce((prev, next , acc) => prev + next, 0);
  console.log(`Hello, ${thing.name}! ${foo}`);
}

greet({ name: "TypeScript" });
