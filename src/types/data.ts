export default interface data {
  syncId: string
  data?: Data
}

export interface Data {
  type?: string
  messageChain: MessageChain[]
  sender: Sender
}

export interface Sender {
  id: number
  memberName: string
  specialTitle: string
  permission: string
  joinTimestamp: number
  lastSpeakTimestamp: number
  muteTimeRemaining: number
  group: Group
  nickname: string
  remark: string
}

export interface Group {
  id: number
  name: string
  permission: string
}

export interface MessageChain {
  type: string
  id?: number
  time?: number
  text?: string
}
