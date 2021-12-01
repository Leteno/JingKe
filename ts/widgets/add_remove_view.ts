import { ClickEvent } from "../misc/event";
import { LayoutType } from "../misc/layout";
import ImageView from "./imageview";
import LinearLayout, { Orientation } from "./linear_layout";

export default class AddRemoveView extends LinearLayout {
    addButton: ImageView;
    removeButton: ImageView;
    constructor() {
        super(Orientation.HORIZONTAL);
        this.addButton = this.createButton("res/created/plus.png");
        this.removeButton = this.createButton("res/created/minus.png");
        this.addView(this.addButton);
        this.addView(this.removeButton);
    }

    private createButton(imageSrc: string) {
        let button = new ImageView(imageSrc);
        button.layoutParam.weight = 1;
        button.layoutParam.yLayout = LayoutType.MATCH_PARENT;
        return button;
    }

    setOnClick(onAddClicked: ()=>void, onRemoveClicked: ()=>void) {
        this.addButton.onclickInternal = (ev: ClickEvent) => {
            onAddClicked();
            return true;
        }
        this.removeButton.onclickInternal = (ev: ClickEvent) => {
            onRemoveClicked();
            return true;
        }
    }

    showAddButton(show: boolean) {
        this.addButton.visible = show;
    }
    showRemoveButton(show: boolean) {
        this.removeButton.visible = show;
    }
}