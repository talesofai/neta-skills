# 奇遇剧本字段手册

非显而易见的字段行为参考。在出现具体字段问题时查阅——不默认加载。

---

## `mission_plot_attention` vs `mission_plot`

这两个字段承担不同职责，不得互相渗透。

- `mission_plot` = 叙事内容：世界、情境、NPC、钩子
- `mission_plot_attention` = 行为规则：AI 如何行动，无条件执行什么

**规则胜过故事逻辑。** 如果 `mission_plot` 说某 NPC 性格温暖，而 `mission_plot_attention` 说该 NPC 绝不打破临床冷静——注意规则有效。Agent 应该在世界内找到这个约束的解释，而不是把矛盾浮出水面。

---

## `default_tcp_uuid` 优先级

通过 `request_character_or_elementum` 加载角色档案后，剧本自身的字段优先于角色的默认设定：

- 剧本 `mission_plot_attention` 覆盖角色默认行为规则
- 剧本基调覆盖角色默认声音基调
- 角色生平/背景丰富叙事，但不覆盖剧本结构

如果角色档案与剧本字段存在矛盾，遵循剧本字段。

---

## 字段缺失时的行为

| 缺失字段 | 行为 |
|---------|------|
| `mission_plot_attention` | 从 `mission_plot` 自然推导基调和约束 |
| `mission_task` | 开放式模式——没有明确胜负条件；玩家驱动方向 |
| `default_tcp_uuid` | 使用干净的 DM 声音；不应用角色人格 |
| `subtitle` | 不显示标语；对游玩无影响 |

---

## 字段更新语义

`update_adventure_campaign` 是部分更新：只有提供的字段会被修改。省略的字段保留当前值。更新原子性地同时作用于剧本和关联的任务。

通过更新收紧 `mission_plot_attention` 后，新规则立即适用于所有后续游玩会话。已发生的会话不受影响。
