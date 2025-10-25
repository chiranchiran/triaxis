// 自定义卡片组件
// 自定义卡片组件
const CustomCard = ({ children, className = '', ...props }) => (
  <div
    className={`bg-card p-6 rounded-xl border border-main overflow-visible shadow-md transition-all duration-300 hover:shadow-lg ${className}`}
    {...props}
  >
    {children}
  </div>
);

const DetailCard = ({ title, children, className = '', ...props }) => (
  <CustomCard className={`hover:shadow-sm shadow-sm ${className}`}>
    <div className={`px-6 pb-4 border-b border-main text-xl text-center font-semibold text-main`}>
      {title}
    </div>
    {children}
  </CustomCard>
)
const Statis = ({ count, children }) => {
  return (
    <div className="text-center p-2">
      <div className="text-xl font-bold text-main">
        {count}
      </div>
      <div className="text-xs text-main mt-1">{children}</div>
    </div>)
}
const FileTime = ({ count, children }) => {
  if (!count) return
  if (Array.isArray(count)) {
    {
      return (
        <div className="flex justify-between text-sm p-2 gap-6">
          <span className="text-main text-nowrap">{children}</span>
          <span className="font-medium text-main flex justify-end gap-2 flex-wrap">
            {count.map((tool, index) => (
              <span
                key={index}
                className="px-2 py-0.5 rounded text-xs bg-main text-main border border-main"
              >
                {tool.name}
              </span>
            ))}
          </span>
        </div>
      )
    }
  } else {

    return (
      <div className="flex justify-between text-sm p-2 gap-10">
        <span className="text-main text-nowrap">{children}</span>
        <span className="font-medium text-main">{count}</span>
      </div>
    )
  }

}
export { DetailCard, CustomCard, FileTime, Statis }