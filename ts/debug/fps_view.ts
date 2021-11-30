import { BindableData } from "../data/bindable_data";
import Colors from "../game/data/styles/colors";
import Panel from "../widgets/panel"
import TextView, { Text } from "../widgets/textview"


class FPSModel extends BindableData {
    fps: number;
    constructor() {
        super();
        this.fps = -1;
    }
}

export default class FPSView extends Panel {
    static instance = new FPSView();

    fpsText: TextView
    fpsModel: FPSModel
    constructor() {
        super()
        this.fpsText = new TextView()
        this.fpsText.textColor = Colors.white
        this.addView(this.fpsText)

        this.fpsModel = new FPSModel()
        this.bindData(this.fpsModel, FPSView.update)
    }

    static update(v: FPSView, m: FPSModel) {
        v.fpsText.setText(new Text(`fps: ${m.fps.toPrecision(4)}`))
    }

    updateFps(fps: number) {
        this.fpsModel.fps = fps
        this.fpsModel.dirty = true
    }
}