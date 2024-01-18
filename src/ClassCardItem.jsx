import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { classTypesMap } from "./messages";

const ClassCardItem = ({ item }) => {
  return (
    <Link
      to={`/class/${item.product_id}`}
      htmlFor={item.product_id}
      className={`${
        item.completed
          ? "mb-1 w-full rounded-sm bg-orange-200 text-sm text-slate-800 line-through lg:text-lg"
          : "text-slate-950 mb-1 w-full rounded-sm bg-slate-100 text-sm drop-shadow-2xl hover:bg-slate-500 hover:text-slate-050 lg:text-lg	"
      }`}
    >
      <p>{classTypesMap[item.product_id.slice(3, 4)]}</p>
    </Link>
  );
};

ClassCardItem.propTypes = {
  item: PropTypes.shape({
    product_id: PropTypes.string.isRequired,
    completed: PropTypes.bool,
  }),
};

export default ClassCardItem;
