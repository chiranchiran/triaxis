import { isArrayValid } from "../utils/error/commonUtil";

const CustomCard = ({ children, className = '', ...props }) => (
  <div
    className={`bg-card p-6 rounded-xl overflow-visible shadow-lg transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </div>
);
const NOborderCustomCard = ({ children, className = '', ...props }) => (
  <div
    className={`p-6 overflow-visible transition-all ${className}`}
    {...props}
  >
    {children}
  </div>
);

const DetailCard = ({ title, children, className = '', ...props }) => (
  <CustomCard className={`shadow-sm ${className}`}>
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

const Image = ({ images }) => {
  if (!isArrayValid(images)) return;
  return (
    <div className="flex space-x-3 mt-4">
      {images.map((img, index) => (
        <div
          key={index}
          className="preview w-20 h-20 bg-card rounded border border-main cursor-pointer hover:border-primary-dark transition-colors"
        >
          <img
            src={img.path}
            title={img?.name}
            alt={`图片${img?.name}暂时无法加载`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}

const CoverImage = ({ coverImage, title, images }) => {
  return (
    <div className="bg-main rounded-lg border border-main">
      <div className="relative h-80 rounded-lg overflow-hidden">
        <img
          src={coverImage}
          alt='封面预览图暂时无法加载'
          title={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
          预览图
        </div>
      </div>
      {/* 小图预览 */}
      <Image images={images} />
    </div>
  )
}
export { DetailCard, CustomCard, FileTime, Statis, NOborderCustomCard, CoverImage, Image }