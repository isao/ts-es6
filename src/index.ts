import {foo} from './foo';

interface Greetable {
  name: string;
}

function greet(thing: Greetable): void {
  const zzz = [1, 2, 3].reduce((prev, next , acc) => prev + next, 0);
  foo(`Hello, ${thing.name}! ${zzz}`);
}

greet({ name: "TypeScript" });
