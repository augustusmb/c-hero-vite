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
        item.completed ? "text-slate-800 line-through" : "text-blue-600"
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
