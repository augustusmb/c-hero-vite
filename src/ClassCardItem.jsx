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
          ? "text-slate-800 bg-slate-400 w-4/5 line-through rounded-sm mb-1"
          : "text-slate-950 bg-slate-100 rounded-sm hover:text-slate-050 hover:bg-slate-500 w-4/5 mb-1"
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
