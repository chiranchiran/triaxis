// 自定义卡片组件
// 自定义卡片组件
const CustomCard = ({ children, className = '', ...props }) => (
  <div
    className={`bg-card p-6 rounded-xl border border-main overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg ${className}`}
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
export { DetailCard, CustomCard }