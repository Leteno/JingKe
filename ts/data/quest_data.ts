
export enum QuestType {
  YourConfuzed = 0,
  JingkeConfuzed = 1,
}

export default class QuestData {
  getData(type: QuestType): {name: string, desc: string} {
    switch(type) {
      case QuestType.YourConfuzed:
        return {
          name: "荆棘的困惑",
          desc: "未来应该怎么走，现在你没法回答，你只能往下走，多看看，寻找灵感"
        }
      case QuestType.JingkeConfuzed:
        return {
          name: "荆轲的困惑",
          desc: "你的叔叔似乎有什么事情瞒着，你想调查清楚，帮他解决"
        }
    }
  }
}