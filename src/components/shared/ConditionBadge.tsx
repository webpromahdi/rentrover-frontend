const ConditionBadge = ({ condition }: { condition: string }) => {
  return (
    <span
      className="rounded-full bg-condition px-2.5 py-1 text-[10px] font-extrabold tracking-[0.05em] text-condition-foreground"
    >
      {condition}
    </span>
  );
};

export default ConditionBadge;
