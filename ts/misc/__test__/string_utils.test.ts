
import {StringUtils} from "../string_utils"

test("simple", ()=> {
  expect(StringUtils.isEmpty("")).toBe(true);
  expect(StringUtils.isEmpty(null as unknown as string)).toBe(true);
  expect(StringUtils.isEmpty(undefined as unknown as string)).toBe(true);
  expect(StringUtils.isEmpty("a")).toBe(false);
})