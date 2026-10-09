import useTranslation from "next-translate/useTranslation";

const Stock = ({ stock, card }) => {
  const { t } = useTranslation();

  return (
    <>
      {stock <= 0 ? (
        <span
          className={`${
            card
              ? "bg-rose-500/15 border border-rose-500/30 text-rose-400 absolute z-10 rounded-full text-[11px] px-2.5 py-0.5 font-bold"
              : "bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-full inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          {t("stockOut")}
        </span>
      ) : (
        <>
          <span
            className={`${
              card
                ? "bg-zinc-900/90 border border-zinc-800 text-yellow-400 absolute z-10 rounded-full text-[11px] px-2.5 py-0.5 font-bold backdrop-blur-sm"
                : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold backdrop-blur-sm"
            }`}
          >
            {!card && (
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    stock <= 10 ? "bg-amber-400" : "bg-emerald-400"
                  } opacity-75`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    stock <= 10 ? "bg-amber-400" : "bg-emerald-500"
                  }`}
                />
              </span>
            )}
            {stock <= 10 ? (
              <span className="text-amber-400 font-bold">
                Only {Math.max(0, stock)} left in stock!
              </span>
            ) : (
              <span>
                In Stock{" "}
                <span className="text-zinc-400 font-normal">
                  ({Math.max(0, stock)} units available)
                </span>
              </span>
            )}
          </span>
        </>
      )}
    </>
  );
};

export default Stock;
