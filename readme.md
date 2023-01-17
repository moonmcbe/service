- 0 未验证
- 1 待审核
- 2 通过
- 3 不通过

# 玩家状态
``` js
if (row.status == 0) {
  data.type = undefined
  data.text = '未验证'
}
if (row.status == 1) {
  data.type = 'success'
  data.text = '正常'
}
if (row.status == 2) {
  data.type = 'warning'
  data.text = '临时封禁'
}
if (row.status == 3) {
  data.type = 'error'
  data.text = '永久封禁'
}
if (row.status == 4) {
  data.type = 'info'
  data.text = '其他'
}
if (row.status == 5) {
  data.type = 'info'
  data.text = '退群'
}
```