
import { ClickEvent } from "../../misc/event";
import { Specify } from "../../misc/layout";
import AddRemoveView from "../add_remove_view"
import { defaultCtx } from "./default_value.test";

test("Test simple", () => {
    let v = new AddRemoveView();
    v.measure(defaultCtx, 200, 100, Specify.NONE);
    v.layout(200, 100);

    expect(v.addButton.width).toBe(100)
    expect(v.addButton.height).toBe(100)
    expect(v.removeButton.width).toBe(100)
    expect(v.removeButton.height).toBe(100)

    let addFn = jest.fn();
    let removeFn = jest.fn();
    v.setOnClick(addFn, removeFn);

    // click on add
    v.onclick(new ClickEvent(10, 10));
    expect(addFn.mock.calls.length).toBe(1)
    expect(removeFn.mock.calls.length).toBe(0)

    // click on remove
    v.onclick(new ClickEvent(150, 10));
    expect(addFn.mock.calls.length).toBe(1)
    expect(removeFn.mock.calls.length).toBe(1)
})