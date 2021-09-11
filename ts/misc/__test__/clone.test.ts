
import {Clone} from "../clone"

class TestStudent {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  getName() {
    return this.name;
  }
}

test("simple", () => {new Object
  let student = new TestStudent("leteno", 12);
  let cloned = Clone.clone(student) as TestStudent;
  expect(cloned).toHaveProperty("age");
  expect(cloned).toEqual(student);
  cloned.age += 1;
  expect(cloned.age).toBe(13);
  expect(student.age).toBe(12);
  expect(cloned).not.toEqual(student);
  expect(cloned.getName()).toEqual("leteno")
})