import data, { Data, Group, Sender } from './data'

interface MemberLeaveEventQuitData extends Data {
  member: {
    id: number
    memberName: string
    permission: string
    group: Group
  }
  operator?: Sender
}

export default interface MemberLeaveEventQuit extends data {
  data: MemberLeaveEventQuitData
}
