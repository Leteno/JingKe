import { BindableData } from "../data/bindable_data";
import LinearLayout, { Orientation } from "../widgets/linear_layout";
import Panel from "../widgets/panel";
import Sprite from "../widgets/sprite";
import TextView, { Text } from "../widgets/textview";

export class PageInfo {
  title: string;
  page: Sprite;
}

export class PageListInfo extends BindableData {
  currentIndex: number;
  textSelectedColor: string;
  textUnselectedColor: string;

  pages: Array<PageInfo>;

  constructor() {
    super();
    this.currentIndex = -1;
    this.pages = new Array<PageInfo>();
  }
}

export class PageList extends LinearLayout {
  listInfo: PageListInfo;

  // views
  titlePanel: LinearLayout;
  contentPanel: Panel;

  constructor() {
    super();
    this.padding.left = this.padding.right
      = this.padding.top = this.padding.bottom
      = 20;
    this.titlePanel = new LinearLayout();
    this.titlePanel.orientation = Orientation.HORIZONTAL;
    this.titlePanel.margin.bottom = 20;
    this.contentPanel = new Panel();
    this.addView(this.titlePanel);
    this.addView(this.contentPanel);

    this.listInfo = new PageListInfo();
    this.listInfo.textSelectedColor = "#000000";
    this.listInfo.textUnselectedColor = "#5c5c5c";
    this.bindData(
      this.listInfo,
      PageList.onListInfoChange.bind(this)
    );

    this.bgColor = "#f0f0f0";
  }

  addPage(title: string, page: Sprite) {
    let info = new PageInfo();
    info.title = title;
    info.page = page;
    this.listInfo.pages.push(info);
    this.listInfo.dirty = true;
  }

  private static onListInfoChange(pageList: PageList, listInfo: PageListInfo) {
    if (listInfo.currentIndex < 0) {
      listInfo.currentIndex = 0;
    }
    if (listInfo.pages.length <= 0) {
      return;
    }
    if (listInfo.currentIndex > listInfo.pages.length) {
      listInfo.currentIndex = listInfo.pages.length - 1;
    }

    // title layer
    pageList.titlePanel.removeAllViews();
    for (let i = 0; i < listInfo.pages.length; i++) {
      let info = listInfo.pages[i];
      let title = new TextView(new Text(info.title));
      title.margin.right = 10;
      title.onclickInternal = (ignore) => {
        listInfo.currentIndex = i;
        listInfo.dirty = true;
        return true;
      }
      if (i == listInfo.currentIndex) {
        title.underline = true;
        title.textColor = listInfo.textSelectedColor;
      } else {
        title.textColor = listInfo.textUnselectedColor;
      }
      pageList.titlePanel.addView(title);
    }
    pageList.titlePanel.setIsDirty(true);

    // content layer
    let currentPage: Sprite =
      pageList.listInfo.pages[listInfo.currentIndex].page;
    pageList.contentPanel.removeAllViews();
    pageList.contentPanel.addView(currentPage);
    pageList.contentPanel.setIsDirty(true);

    pageList.setIsDirty(true);
  }
}
