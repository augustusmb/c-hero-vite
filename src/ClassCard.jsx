import PropTypes from "prop-types";
import ClassCardItem from "./ClassCardItem.jsx";

const ClassCard = (props) => {
  const { product } = props;

  return (
    <div className="border-solid border-2 border-slate-800 rounded-md bg-slate-200">
      <h4 className="underline w-100 bg-slate-500 text-slate-050 text-xs lg:text-lg font-semibold mb-2 py-1">
        {product?.productName}
      </h4>
      <div className="flex flex-col items-start px-2 lg:ml-10 mb-1">
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
