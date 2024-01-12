import { PropTypes } from "prop-types";

const TermsAndConditions = (props) => {
  const { acceptTermsMutation, userId } = props;

  return (
    <div className="bg-slate-200 px-8 py-8 border-4 border-slate-500">
      <form>
        <h1 className="text-2xl text-slate-950">
          C-Hero eTraining Terms and Condtions
        </h1>
        <p className="text-slate-700">
          You must view, read and accept the terms and conditions of C-Hero
          etraining in order to view your training classes.
        </p>
        <a
          href="https://www.c-hero.com/terms"
          target="_blank"
          rel="noreferrer"
          className="text-slate-950 underline font-semibold"
        >
          View C-Hero Terms and Conditions
        </a>
        <span> (opens in new tab)</span>
        <div>
          <button
            type="submit"
            disabled={!userId}
            onClick={() => acceptTermsMutation.mutate(userId)}
            className="bg-slate-700 hover:bg-slate-600 text-slate-050 font-semibold hover:text-slate-100 mt-4 py-1 px-3 border border-slate-500 hover:border-transparent rounded"
          >
            I have viewed, read and agree to the C-Hero Terms -{" "}
            <span className="underline text-orange-300">Start Training</span>
          </button>
        </div>
      </form>
    </div>
  );
};

TermsAndConditions.propTypes = {
  acceptTermsMutation: PropTypes.object,
  userId: PropTypes.number,
};

export default TermsAndConditions;
