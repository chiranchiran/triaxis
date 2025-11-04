export const SORT_OPTIONS = [
  { id: 1, name: '最新发布' },
  { id: 2, name: '收藏量' },
  { id: 3, name: '下载量' },
  { id: 4, name: '点赞量' },
  { id: 5, name: '综合排序' }
];

export const POST_ORDER = [
  { id: 1, name: '最新发布' },
  { id: 2, name: '最多点赞' },
  { id: 3, name: '最多回复' }
];
export const BOUNTY_ORDER = [
  { id: 1, name: '已解决' },
  { id: 2, name: '未解决' },
];

export const resourceFilterList = [
  {
    title: "资源权限",
    type: "right",
    field: "right",
    default: 1,
    list: [{
      id: 1,
      name: "免费"
    }, {
      id: 2,
      name: "积分兑换"
    }, {
      id: 3,
      name: "VIP专享"
    }],
    isMultiple: false,
    isTypes: true
  },
  {
    title: "专业领域",
    type: "subjectId",
    default: 0,
    isMultiple: false,
    isTypes: true,
    isNotAll: true
  },
  {
    title: "适用软件",
    type: "toolIds",
    field: "tools",
    default: 0,
    isMultiple: true,
    isTypes: true
  },
  {
    title: "资源类型",
    type: "categoriesFirst",
    field: 'categoriesFirst',
    default: 2,
    isMultiple: false,
    isFirst: true,
    isTypes: true,
    isNotAll: false
  },
  {
    title: "二级分类",
    type: "categoriesSecondary",
    default: 0,
    isMultiple: true,
    isTypes: false
  }
]

export const communityFilterList = [
  {
    title: "专业领域",
    type: "subjectId",
    default: 0,
    isMultiple: false,
    isTypes: true,
    isNotAll: true
  },
  {
    title: "主题分类",
    type: "topicIds",
    field: "topics",
    default: 0,
    isMultiple: true,
    isTypes: true
  }
]