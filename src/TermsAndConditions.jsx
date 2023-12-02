import { PropTypes } from "prop-types";

const TermsAndConditions = (props) => {
  const { acceptTermsMutation, userId } = props;

  return (
    <div className="border p-8 border-4 border-slate-500">
      <form>
        <h1 className="font-bold text-xl underline">
          C-Hero eTraining Terms and Condtions
        </h1>
        <p>
          You must view, read and accept the terms and conditions of C-Hero
          etraining in order to view your training classes.
        </p>
        <a
          href="https://www.c-hero.com/terms"
          target="_blank"
          rel="noreferrer"
          className="text-blue-700 underline hover:bg-gray-100"
        >
          View C-Hero Terms and Conditions
        </a>
        <span>(opens in new tab)</span>
        {/* <div>
          <input type="checkbox" />
          <label>
            I have viewed and fully read the C-Hero terms and conditions, and I
            agree to the terms.
          </label>
        </div> */}
        <div>
          <button
            type="submit"
            onClick={() => acceptTermsMutation.mutate(userId)}
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded"
          >
            I have viewed, read and agree to the C-Hero Terms -{" "}
            <span className="underline">Start Training</span>
          </button>
        </div>
      </form>
    </div>
  );
};

TermsAndConditions.propTypes = {
  acceptTermsMutation: PropTypes.object,
  userId: PropTypes.string,
};

export default TermsAndConditions;
