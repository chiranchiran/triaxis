import { Empty } from "antd"

export const MyEmpty = ({ description }) => {
  return <Empty description={description ? description : "暂无相关信息"} className="my-10" />
}