
// 考虑到未来选项的变化，建议 UNKNOWN = -1
// 接着 0, 1, 2, 3。这样有个好处：
// 有一天 OPTION2 变成 OPTION3
// 原先存下来的数据依旧可用，只是过去不可能
// 有值 OP3

export enum YES_NO {
  UNKNOWN = -1,
  YES = 0,
  NO = 1,
}

export enum OPTION2 {
  UNKNOWN = -1,
  OP1 = 0,
  OP2 = 1,
}

export enum OPTION3 {
  UNKNOWN = -1,
  OP1 = 0,
  OP2 = 1,
  OP3 = 2,
}

export enum OPTION4 {
  UNKNOWN = -1,
  OP1 = 0,
  OP2 = 1,
  OP3 = 2,
  OP4 = 3,
}