import PropTypes from "prop-types";
import ClassCardItem from "./ClassCardItem.jsx";

const ClassCard = (props) => {
  const { product } = props;

  return (
    <div className="overflow-hidden rounded-lg bg-slate-200 shadow-lg shadow-slate-300">
      <h4 className="w-100 mb-2 bg-slate-500 py-1 text-xs font-semibold text-slate-050 underline lg:text-lg">
        {product?.productName}
      </h4>
      <div className="mb-1 flex flex-col items-start px-2">
        {Object.values(product.classProgress).map((item) => (
          <ClassCardItem key={item.product_id} item={item} />
        ))}
      </div>
    </div>
  );
};

ClassCard.propTypes = {
  product: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    classProgress: PropTypes.object,
  }),
};

export default ClassCard;
