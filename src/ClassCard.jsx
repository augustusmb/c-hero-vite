import PropTypes from "prop-types";
import ClassCardItem from "./ClassCardItem.jsx";

const ClassCard = (props) => {
  const { product } = props;

  return (
    <div className="border-solid border-2 border-slate-500">
      <h4 className="underline">{product?.productName}</h4>
      <div className="flex flex-col items-start ml-10">
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
