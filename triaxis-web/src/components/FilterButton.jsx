// 筛选按钮组件
function FilterButton({ item, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isSelected
        ? 'bg-gray text-main !font-semibold border border-main'
        : 'bg-card text-main font-normal border border-main'
        }`}
    >
      {item.name}
    </button>
  );
};

export default FilterButton