
import TextView, { Text } from "../../widgets/textview";
import {PageList} from "../page_list"
import {defaultCtx} from "../../widgets/__test__/default_value.test"
import { ClickEvent } from "../../misc/event";
import { Specify } from "../../misc/layout";

test("common", () => {
  let pageList = new PageList();

  let tx1 = new TextView(new Text("A"));
  let tx2 = new TextView(new Text("B2"));
  pageList.addPage("tx1", tx1);
  pageList.addPage("tx2", tx2);

  pageList.measure(defaultCtx, 500, 500, Specify.NONE);
  pageList.layout(500, 500);
  pageList.drawToCanvas(defaultCtx);

  expect(pageList.titlePanel.children.length)
    .toBe(2)
  expect((pageList.titlePanel.children[0] as TextView)
    .text.content).toBe("tx1");
  expect((pageList.titlePanel.children[1] as TextView)
    .text.content).toBe("tx2");
  expect(pageList.listInfo.currentIndex)
    .toBe(0);
  expect(pageList.contentPanel.children.length)
    .toBe(1);
  expect(pageList.contentPanel.children[0])
    .toBe(tx1);
  expect((pageList.titlePanel.children[0] as TextView)
    .textColor).toBe(pageList.listInfo.textSelectedColor)
  expect((pageList.titlePanel.children[1] as TextView)
    .textColor).toBe(pageList.listInfo.textUnselectedColor)

  // Test data binding
  pageList.listInfo.pages[0].title = "tx0";
  pageList.listInfo.currentIndex = 1;
  pageList.listInfo.dirty = true;

  pageList.drawToCanvas(defaultCtx);

  // Changes on TitlePanel
  expect((pageList.titlePanel.children[0] as TextView)
    .text.content).toBe("tx0");
  expect((pageList.titlePanel.children[0] as TextView)
    .textColor).toBe(pageList.listInfo.textUnselectedColor)
  expect((pageList.titlePanel.children[1] as TextView)
    .textColor).toBe(pageList.listInfo.textSelectedColor)

  // Changes on ContentPanel
  expect(pageList.contentPanel.children.length)
  .toBe(1);
  expect(pageList.contentPanel.children[0])
    .toBe(tx2);
})

test("click on Title, page will switch", () => {
  let pageList = new PageList();

  let tx1 = new TextView(new Text("A"));
  let tx2 = new TextView(new Text("B2"));
  pageList.addPage("tx1", tx1);
  pageList.addPage("tx2", tx2);

  pageList.measure(defaultCtx, 500, 500, Specify.NONE);
  pageList.layout(500, 500);
  pageList.drawToCanvas(defaultCtx);

  expect(pageList.listInfo.currentIndex)
    .toBe(0);
  expect((pageList.titlePanel.children[0] as TextView)
    .textColor).toBe(pageList.listInfo.textSelectedColor)
  expect((pageList.titlePanel.children[1] as TextView)
    .textColor).toBe(pageList.listInfo.textUnselectedColor)
  expect(pageList.contentPanel.children[0])
    .toBe(tx1);

  // Perform clicking on tx2
  pageList.titlePanel.children[1]
    .onclickInternal(new ClickEvent(0, 0));
  pageList.drawToCanvas(defaultCtx);

  // The page should switch to page2
  expect(pageList.listInfo.currentIndex)
    .toBe(1);
  expect((pageList.titlePanel.children[0] as TextView)
    .textColor).toBe(pageList.listInfo.textUnselectedColor)
  expect((pageList.titlePanel.children[1] as TextView)
    .textColor).toBe(pageList.listInfo.textSelectedColor)
  expect(pageList.contentPanel.children[0])
    .toBe(tx2);

  // Perform clicking on tx1
  pageList.titlePanel.children[0]
    .onclickInternal(new ClickEvent(0, 0));
  pageList.drawToCanvas(defaultCtx);
  // The page should switch back to page1
  expect(pageList.listInfo.currentIndex)
    .toBe(0);
  expect((pageList.titlePanel.children[0] as TextView)
    .textColor).toBe(pageList.listInfo.textSelectedColor)
  expect((pageList.titlePanel.children[1] as TextView)
    .textColor).toBe(pageList.listInfo.textUnselectedColor)
  expect(pageList.contentPanel.children[0])
    .toBe(tx1);
})