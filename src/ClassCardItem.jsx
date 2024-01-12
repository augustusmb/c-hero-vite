import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ClassCardItem = (props) => {
  const { item } = props;

  const classTypeMap = {
    a: "Setup",
    b: "Operation",
    c: "MOB Drills",
    d: "Inspection & Storage",
  };

  return (
    <div
      className={`${
        item.completed
          ? "mb-1 w-full rounded-sm bg-slate-400 text-sm text-slate-800 line-through lg:text-lg"
          : "text-slate-950 mb-1 w-full rounded-sm bg-slate-100 text-sm drop-shadow-2xl hover:bg-slate-500 hover:text-slate-050 lg:text-lg	"
      }`}
    >
      <Link to={`/class/${item.product_id}`} htmlFor={item.product_id}>
        {classTypeMap[item.product_id.slice(3, 4)]}
      </Link>
    </div>
  );
};

ClassCardItem.propTypes = {
  item: PropTypes.shape({
    product_id: PropTypes.string.isRequired,
    completed: PropTypes.bool,
  }),
};

export default ClassCardItem;
